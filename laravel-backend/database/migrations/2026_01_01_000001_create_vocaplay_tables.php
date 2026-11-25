<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'username')) {
                $table->string('username', 40)->unique()->after('id');
            }
            $table->enum('role', ['user', 'admin'])->default('user')->after('password');
            $table->string('avatar', 30)->default('av-sky');
            $table->string('bio', 160)->nullable();
            $table->enum('cefr', ['A1', 'A2', 'B1', 'B2', 'C1', 'ALL'])->default('A1');
            $table->string('deck_id', 50)->default('ox_a1');
            $table->unsignedInteger('xp')->default(0)->index();
            $table->unsignedInteger('weekly_xp')->default(0)->index();
            $table->unsignedInteger('monthly_xp')->default(0)->index();
            $table->unsignedInteger('coins')->default(0);
            $table->unsignedInteger('streak')->default(0);
            $table->unsignedSmallInteger('streak_freezes')->default(0);
            $table->unsignedSmallInteger('extra_shields')->default(0);
            $table->timestamp('xp_boost_until')->nullable();
            $table->date('last_active_date')->nullable();
            $table->unsignedInteger('games_played')->default(0);
            $table->unsignedInteger('perfect_games')->default(0);
            $table->unsignedInteger('total_answered')->default(0);
            $table->unsignedInteger('total_correct')->default(0);
            $table->json('profile_meta')->nullable();
        });

        Schema::create('vocabs', function (Blueprint $table) {
            $table->id();
            $table->string('code', 60)->unique();
            $table->string('word', 100)->index();
            $table->enum('cefr', ['A1', 'A2', 'B1', 'B2', 'C1'])->default('A1')->index();
            $table->string('category', 60)->default('General')->index();
            $table->string('phonetic', 100)->nullable();
            $table->string('meaning', 255);
            $table->text('definition')->nullable();
            $table->string('image_url', 500)->nullable();
            $table->json('sentence_tokens')->nullable();
            $table->string('sentence_indo', 255)->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('user_word_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('vocab_code', 60);
            $table->enum('status', ['mastered', 'weak'])->default('mastered');
            $table->unsignedTinyInteger('srs_stage')->default(0);
            $table->date('last_reviewed')->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'vocab_code']);
        });

        Schema::create('user_game_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('game_mode', 50);
            $table->unsignedInteger('high_score')->default(0);
            $table->unsignedInteger('sessions_count')->default(0);
            $table->timestamps();
            $table->unique(['user_id', 'game_mode']);
        });

        Schema::create('user_path_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('node_id', 30);
            $table->timestamp('completed_at')->useCurrent();
            $table->unique(['user_id', 'node_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_path_progress');
        Schema::dropIfExists('user_game_records');
        Schema::dropIfExists('user_word_progress');
        Schema::dropIfExists('vocabs');
    }
};
