<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE users MODIFY avatar MEDIUMTEXT NULL');
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE users MODIFY avatar VARCHAR(30) NOT NULL DEFAULT 'av-sky'");
    }
};
