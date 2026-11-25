<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Vocab;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;

class VocaplayController extends Controller
{
    /** Avatar yang valid: palet warna inisial atau emoticon. */
    private const AVATAR_PATTERN = '/^(av-[a-z]{2,12}|emoji:.{1,8})$/u';

    /** Batas wajar pertambahan progres (anti-cheat sisi server). */
    private const XP_PER_MINUTE = 200;       // laju maksimal XP per menit sejak sinkronisasi terakhir
    private const XP_BURST = 400;            // toleransi satu sesi game
    private const XP_HARD_CAP = 3000;        // batas mutlak per sinkronisasi
    private const COINS_BURST = 150;         // batas Diamonds per sinkronisasi
    private const PROFILE_META_MAX_BYTES = 400000;

    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'username' => 'required|string|min:3|max:40|alpha_dash|unique:users,username',
            'name'     => 'required|string|min:2|max:100',
            'password' => 'required|string|min:6|max:100',
            'avatar'   => ['nullable', 'string', 'max:40', 'regex:' . self::AVATAR_PATTERN],
        ]);

        $user = User::create([
            'username' => strtolower($data['username']),
            'name'     => strip_tags($data['name']),
            'email'    => strtolower($data['username']) . '@vocaplay.local',
            'password' => Hash::make($data['password']),
            'avatar'   => $data['avatar'] ?? 'av-sky',
        ]);

        $token = $user->createToken('vocaplay-web')->plainTextToken;

        return response()->json([
            'ok'    => true,
            'token' => $token,
            'user'  => $user,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'username'        => 'required|string|max:40',
            'password'        => 'required|string|max:200',
            // Hash lama dari klien versi sebelumnya (migrasi satu kali)
            'legacy_password' => 'nullable|string|max:200',
        ]);

        $username = strtolower($data['username']);
        $limiterKey = 'login:' . $username . '|' . $request->ip();

        if (RateLimiter::tooManyAttempts($limiterKey, 5)) {
            $seconds = RateLimiter::availableIn($limiterKey);
            return response()->json([
                'ok'    => false,
                'error' => "Terlalu banyak percobaan login. Coba lagi dalam {$seconds} detik.",
            ], 429);
        }

        $user = User::where('username', $username)->first();
        $valid = false;

        if ($user) {
            if (Hash::check($data['password'], $user->password)) {
                $valid = true;
            } elseif (!empty($data['legacy_password']) && Hash::check($data['legacy_password'], $user->password)) {
                // Akun lama: password tersimpan berupa hash dari browser. Upgrade ke password asli.
                $user->password = Hash::make($data['password']);
                $user->save();
                $valid = true;
            }
        }

        if (!$valid) {
            RateLimiter::hit($limiterKey, 60);
            return response()->json([
                'ok'    => false,
                'error' => 'Username atau password tidak cocok.',
            ], 401);
        }

        RateLimiter::clear($limiterKey);
        $user->tokens()->where('name', 'vocaplay-web')->delete();
        $token = $user->createToken('vocaplay-web')->plainTextToken;

        return response()->json([
            'ok'    => true,
            'token' => $token,
            'user'  => $user,
        ]);
    }

    public function saveProgress(Request $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validate([
            'name'           => 'sometimes|string|max:100',
            'avatar'         => ['sometimes', 'string', 'max:40', 'regex:' . self::AVATAR_PATTERN],
            'bio'            => 'nullable|string|max:160',
            'cefr'           => 'sometimes|in:A1,A2,B1,B2,C1,ALL',
            'deck_id'        => 'sometimes|string|max:50',
            'xp'             => 'sometimes|integer|min:0',
            'weekly_xp'      => 'sometimes|integer|min:0',
            'monthly_xp'     => 'sometimes|integer|min:0',
            'coins'          => 'sometimes|integer|min:0',
            'streak'         => 'sometimes|integer|min:0',
            'streak_freezes' => 'sometimes|integer|min:0|max:99',
            'extra_shields'  => 'sometimes|integer|min:0|max:99',
            'games_played'   => 'sometimes|integer|min:0',
            'perfect_games'  => 'sometimes|integer|min:0',
            'total_answered' => 'sometimes|integer|min:0',
            'total_correct'  => 'sometimes|integer|min:0',
            'profile_meta'   => 'sometimes|array',
        ]);

        if (isset($data['name'])) {
            $data['name'] = trim(strip_tags($data['name'])) ?: $user->name;
        }
        if (isset($data['bio'])) {
            $data['bio'] = strip_tags($data['bio']);
        }
        if (isset($data['profile_meta']) && strlen(json_encode($data['profile_meta'])) > self::PROFILE_META_MAX_BYTES) {
            return response()->json(['ok' => false, 'error' => 'Data profil terlalu besar.'], 422);
        }

        $clamped = false;

        // Rentang waktu sejak sinkronisasi terakhir menentukan batas pertambahan yang wajar.
        $minutes = max(0, $user->updated_at ? $user->updated_at->diffInSeconds(now()) / 60 : 0);
        $maxXpGain = (int) min(self::XP_HARD_CAP, self::XP_BURST + $minutes * self::XP_PER_MINUTE);

        // XP: tidak boleh turun, dan kenaikan dibatasi.
        if (array_key_exists('xp', $data)) {
            $newXp = max($user->xp, min($data['xp'], $user->xp + $maxXpGain));
            if ($newXp !== $data['xp']) $clamped = true;
            $gain = $newXp - $user->xp;
            $data['xp'] = $newXp;

            // XP mingguan/bulanan mengikuti kenaikan XP total yang sudah tervalidasi.
            foreach (['weekly_xp', 'monthly_xp'] as $col) {
                if (array_key_exists($col, $data)) {
                    $allowed = min($data[$col], $user->{$col} + $gain);
                    $allowed = max(0, min($allowed, $newXp));
                    // Reset periode (nilai turun) diizinkan, kenaikan liar tidak.
                    if ($allowed !== $data[$col]) $clamped = true;
                    $data[$col] = $allowed;
                }
            }
        } else {
            unset($data['weekly_xp'], $data['monthly_xp']);
        }

        // Diamonds: kenaikan dibatasi; pengurangan (belanja power-up) diizinkan.
        if (array_key_exists('coins', $data)) {
            $maxCoins = $user->coins + self::COINS_BURST + (int) ($minutes * 20);
            if ($data['coins'] > $maxCoins) {
                $data['coins'] = $maxCoins;
                $clamped = true;
            }
        }

        // Streak: maksimal naik +1 per sinkronisasi.
        if (array_key_exists('streak', $data) && $data['streak'] > $user->streak + 1) {
            $data['streak'] = $user->streak + 1;
            $clamped = true;
        }

        // Penghitung kumulatif tidak boleh turun atau melonjak tak wajar.
        foreach (['games_played' => 10, 'perfect_games' => 10, 'total_answered' => 400, 'total_correct' => 400] as $col => $maxGain) {
            if (array_key_exists($col, $data)) {
                $bounded = max($user->{$col}, min($data[$col], $user->{$col} + $maxGain + (int) ($minutes * $maxGain / 5)));
                if ($bounded !== $data[$col]) $clamped = true;
                $data[$col] = $bounded;
            }
        }
        if (isset($data['total_correct'], $data['total_answered']) && $data['total_correct'] > $data['total_answered']) {
            $data['total_correct'] = $data['total_answered'];
            $clamped = true;
        }

        $user->fill($data);
        $user->last_active_date = now()->toDateString();
        $user->save();

        return response()->json(['ok' => true, 'clamped' => $clamped, 'user' => $user]);
    }

    public function leaderboard(Request $request): JsonResponse
    {
        $period = $request->query('period', 'weekly');
        $col = match ($period) {
            'monthly' => 'monthly_xp',
            'alltime' => 'xp',
            default   => 'weekly_xp',
        };

        $rows = User::query()
            ->select(['username', 'name', 'avatar', 'cefr', 'xp', 'weekly_xp', 'monthly_xp'])
            ->orderByDesc($col)
            ->limit(50)
            ->get();

        return response()->json($rows);
    }

    public function vocabs(Request $request): JsonResponse
    {
        if ($request->boolean('all')) {
            // Payload ±4.000 kata terlalu besar untuk tabel `cache` MySQL (melebihi max_allowed_packet
            // bawaan XAMPP, memicu "MySQL server has gone away"). Simpan di cache berbasis file.
            $rows = Cache::store('file')->remember('vocaplay_all_vocabs_v1', 600, function () {
                return Vocab::select([
                    'code', 'word', 'cefr', 'category', 'phonetic',
                    'meaning', 'definition', 'image_url', 'sentence_tokens', 'sentence_indo'
                ])->get();
            });
            return response()->json($rows);
        }

        $query = Vocab::query();
        if ($request->filled('cefr') && $request->cefr !== 'ALL') {
            $query->where('cefr', $request->cefr);
        }
        if ($request->filled('q')) {
            $q = str_replace(['%', '_'], ['\\%', '\\_'], (string) $request->q);
            $query->where(fn ($sub) => $sub->where('word', 'like', "%{$q}%")->orWhere('meaning', 'like', "%{$q}%"));
        }
        return response()->json($query->paginate(100));
    }
}
