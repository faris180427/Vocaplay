<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Foto base64 lama dibuang (diganti file di storage); kolom kembali ringan.
        DB::table('users')->where('avatar', 'like', 'data:%')->update(['avatar' => 'av-sky']);
        DB::table('users')->whereNull('avatar')->update(['avatar' => 'av-sky']);
        DB::statement("ALTER TABLE users MODIFY avatar VARCHAR(120) NOT NULL DEFAULT 'av-sky'");
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE users MODIFY avatar MEDIUMTEXT NULL');
    }
};
