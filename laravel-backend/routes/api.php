<?php

use App\Http\Controllers\Api\VocaplayController;
use Illuminate\Support\Facades\Route;

// Public endpoints (dibatasi laju permintaan per IP)
Route::post('/register', [VocaplayController::class, 'register'])->middleware('throttle:5,1');
Route::post('/login', [VocaplayController::class, 'login'])->middleware('throttle:20,1');
Route::get('/leaderboard', [VocaplayController::class, 'leaderboard'])->middleware('throttle:60,1');
Route::get('/vocabs', [VocaplayController::class, 'vocabs'])->middleware('throttle:60,1');

// Protected endpoints (Laravel Sanctum Bearer Token)
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::post('/progress', [VocaplayController::class, 'saveProgress']);
});
