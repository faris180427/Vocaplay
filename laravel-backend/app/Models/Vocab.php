<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vocab extends Model
{
    protected $fillable = [
        'code', 'word', 'cefr', 'category', 'phonetic',
        'meaning', 'definition', 'image_url',
        'sentence_tokens', 'sentence_indo', 'created_by'
    ];

    protected $casts = [
        'sentence_tokens' => 'array',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
