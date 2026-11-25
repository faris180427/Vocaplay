<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class VocaplayApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * PENGAMAN: RefreshDatabase menghapus seluruh tabel. Tolak berjalan jika bukan database tes.
     */
    protected function setUpTraits()
    {
        $conn = config('database.default');
        $db = config("database.connections.{$conn}.database");
        if ($db !== 'vocaplay_test') {
            throw new \RuntimeException(
                "Tes dibatalkan: database aktif '{$db}', bukan 'vocaplay_test'. Data asli tidak akan disentuh."
            );
        }
        return parent::setUpTraits();
    }

    private function makeUser(array $attrs = []): User
    {
        static $n = 0;
        $n++;
        $username = $attrs['username'] ?? "user{$n}";
        return User::create(array_merge([
            'username' => $username,
            'name'     => "User {$n}",
            'email'    => "{$username}@vocaplay.local",
            'password' => 'secret123', // cast 'hashed' otomatis di-bcrypt
        ], $attrs));
    }

    /* ---------------- REGISTER & LOGIN ---------------- */

    public function test_register_hashes_password_and_returns_token(): void
    {
        $res = $this->postJson('/api/register', [
            'username' => 'tester1', 'name' => 'Tester', 'password' => 'secret123', 'avatar' => 'av-sky',
        ]);

        $res->assertStatus(201)->assertJsonPath('ok', true)->assertJsonStructure(['token', 'user']);
        $user = User::where('username', 'tester1')->first();
        $this->assertNotSame('secret123', $user->password);
        $this->assertTrue(Hash::check('secret123', $user->password));
        $res->assertJsonMissingPath('user.password');
    }

    public function test_register_rejects_data_url_avatar(): void
    {
        $this->postJson('/api/register', [
            'username' => 'tester2', 'name' => 'Tester', 'password' => 'secret123',
            'avatar' => 'data:image/png;base64,AAAA',
        ])->assertStatus(422);
    }

    public function test_register_strips_html_from_name(): void
    {
        $this->postJson('/api/register', [
            'username' => 'tester3', 'name' => '<b>Budi</b>', 'password' => 'secret123',
        ])->assertStatus(201);
        $this->assertSame('Budi', User::where('username', 'tester3')->value('name'));
    }

    public function test_login_success_and_wrong_password(): void
    {
        $this->makeUser(['username' => 'budi']);

        $this->postJson('/api/login', ['username' => 'budi', 'password' => 'secret123'])
            ->assertOk()->assertJsonPath('ok', true)->assertJsonStructure(['token']);

        $this->postJson('/api/login', ['username' => 'budi', 'password' => 'salah'])
            ->assertStatus(401)->assertJsonPath('ok', false);
    }

    public function test_login_is_rate_limited_after_five_failures(): void
    {
        $this->makeUser(['username' => 'rina']);
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/login', ['username' => 'rina', 'password' => 'salah'])->assertStatus(401);
        }
        // Percobaan ke-6 diblokir meskipun password-nya benar.
        $this->postJson('/api/login', ['username' => 'rina', 'password' => 'secret123'])->assertStatus(429);
    }

    public function test_legacy_client_hash_is_upgraded_to_real_password(): void
    {
        // Akun lama: "password" yang tersimpan adalah hash dari browser.
        $this->makeUser(['username' => 'lama', 'password' => 'legacyhashvalue']);

        $this->postJson('/api/login', [
            'username' => 'lama', 'password' => 'PasswordAsli1', 'legacy_password' => 'legacyhashvalue',
        ])->assertOk()->assertJsonPath('ok', true);

        // Setelah migrasi, cukup password asli.
        $this->postJson('/api/login', ['username' => 'lama', 'password' => 'PasswordAsli1'])->assertOk();
        // Hash lama tidak lagi berlaku sebagai password.
        $this->postJson('/api/login', ['username' => 'lama', 'password' => 'legacyhashvalue'])->assertStatus(401);
    }

    public function test_legacy_password_does_not_work_without_correct_hash(): void
    {
        $this->makeUser(['username' => 'aman', 'password' => 'legacyhashvalue']);
        $this->postJson('/api/login', [
            'username' => 'aman', 'password' => 'PasswordBaru', 'legacy_password' => 'hash-salah',
        ])->assertStatus(401);
    }

    /* ---------------- PROGRESS (ANTI-CHEAT) ---------------- */

    public function test_progress_requires_authentication(): void
    {
        $this->postJson('/api/progress', ['xp' => 10])->assertStatus(401);
    }

    public function test_progress_clamps_unrealistic_xp_jump(): void
    {
        $user = $this->makeUser(['xp' => 100]);
        Sanctum::actingAs($user);

        $res = $this->postJson('/api/progress', ['xp' => 999999, 'weekly_xp' => 999999, 'monthly_xp' => 999999]);

        $res->assertOk()->assertJsonPath('clamped', true);
        $user->refresh();
        $this->assertLessThanOrEqual(100 + 410, $user->xp);
        $this->assertLessThanOrEqual($user->xp, $user->weekly_xp);
        $this->assertLessThanOrEqual($user->xp, $user->monthly_xp);
    }

    public function test_progress_accepts_realistic_xp_gain(): void
    {
        $user = $this->makeUser(['xp' => 100]);
        Sanctum::actingAs($user);

        $this->postJson('/api/progress', ['xp' => 160, 'weekly_xp' => 60, 'monthly_xp' => 60])
            ->assertOk()->assertJsonPath('clamped', false);
        $this->assertSame(160, $user->fresh()->xp);
    }

    public function test_progress_never_decreases_xp(): void
    {
        $user = $this->makeUser(['xp' => 500]);
        Sanctum::actingAs($user);

        $this->postJson('/api/progress', ['xp' => 10])->assertOk();
        $this->assertSame(500, $user->fresh()->xp);
    }

    public function test_progress_limits_streak_to_plus_one(): void
    {
        $user = $this->makeUser(['streak' => 2]);
        Sanctum::actingAs($user);

        $this->postJson('/api/progress', ['streak' => 50])->assertOk();
        $this->assertSame(3, $user->fresh()->streak);
    }

    public function test_progress_limits_coin_spike(): void
    {
        $user = $this->makeUser(['coins' => 10]);
        Sanctum::actingAs($user);

        $this->postJson('/api/progress', ['coins' => 100000])->assertOk();
        $this->assertLessThanOrEqual(10 + 160, $user->fresh()->coins);
    }

    public function test_progress_correct_cannot_exceed_answered(): void
    {
        $user = $this->makeUser();
        Sanctum::actingAs($user);

        $this->postJson('/api/progress', ['total_answered' => 5, 'total_correct' => 9])->assertOk();
        $fresh = $user->fresh();
        $this->assertLessThanOrEqual($fresh->total_answered, $fresh->total_correct);
    }

    public function test_progress_rejects_data_url_avatar(): void
    {
        Sanctum::actingAs($this->makeUser());
        $this->postJson('/api/progress', ['avatar' => 'data:image/png;base64,AAAA'])->assertStatus(422);
    }

    public function test_progress_rejects_url_or_path_avatar(): void
    {
        $me = $this->makeUser(['avatar' => 'av-sky']);
        Sanctum::actingAs($me);

        $this->postJson('/api/progress', ['avatar' => '/api/avatars/2?v=1'])->assertStatus(422);
        $this->assertSame('av-sky', $me->fresh()->avatar);
    }

    public function test_progress_accepts_emoji_and_palette_avatar(): void
    {
        $me = $this->makeUser();
        Sanctum::actingAs($me);

        $this->postJson('/api/progress', ['avatar' => 'emoji:🦊'])->assertOk();
        $this->assertSame('emoji:🦊', $me->fresh()->avatar);

        $this->postJson('/api/progress', ['avatar' => 'av-indigo'])->assertOk();
        $this->assertSame('av-indigo', $me->fresh()->avatar);
    }

    /* ---------------- VOCAB & LEADERBOARD ---------------- */

    public function test_vocabs_all_returns_json_from_file_cache(): void
    {
        $now = now();
        DB::table('vocabs')->insert([
            ['code' => 'a1_apple', 'word' => 'apple', 'cefr' => 'A1', 'category' => 'Food', 'meaning' => 'apel', 'created_at' => $now, 'updated_at' => $now],
            ['code' => 'a1_book', 'word' => 'book', 'cefr' => 'A1', 'category' => 'Objects', 'meaning' => 'buku', 'created_at' => $now, 'updated_at' => $now],
        ]);
        Cache::store('file')->forget('vocaplay_all_vocabs_v1');

        try {
            $this->getJson('/api/vocabs?all=1')->assertOk()->assertJsonCount(2)->assertJsonPath('0.code', 'a1_apple');
        } finally {
            Cache::store('file')->forget('vocaplay_all_vocabs_v1');
        }
    }

    public function test_leaderboard_is_sorted_and_hides_private_fields(): void
    {
        $this->makeUser(['username' => 'low', 'xp' => 10]);
        $this->makeUser(['username' => 'high', 'xp' => 900]);
        $this->makeUser(['username' => 'mid', 'xp' => 300]);

        $rows = $this->getJson('/api/leaderboard?period=alltime')->assertOk()->json();

        $this->assertSame(['high', 'mid', 'low'], array_column($rows, 'username'));
        foreach ($rows as $row) {
            $this->assertArrayNotHasKey('password', $row);
            $this->assertArrayNotHasKey('email', $row);
        }
    }
}
