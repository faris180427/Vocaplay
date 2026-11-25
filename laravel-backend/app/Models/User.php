<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'bio',
        'cefr',
        'deck_id',
        'xp',
        'weekly_xp',
        'monthly_xp',
        'coins',
        'streak',
        'streak_freezes',
        'extra_shields',
        'xp_boost_until',
        'last_active_date',
        'games_played',
        'perfect_games',
        'total_answered',
        'total_correct',
        'profile_meta',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'xp_boost_until'    => 'datetime',
            'password'          => 'hashed',
            'profile_meta'      => 'array',
        ];
    }
}
