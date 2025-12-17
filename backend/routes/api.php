<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AIController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlogController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/preferences', [AuthController::class, 'updatePreferences']);

    // Blogs
    Route::get('/blogs', [BlogController::class, 'index']);
    Route::post('/blogs', [BlogController::class, 'store']);
    Route::get('/blogs/{id}', [BlogController::class, 'show']);
    Route::put('/blogs/{id}', [BlogController::class, 'update']);
    Route::delete('/blogs/{id}', [BlogController::class, 'destroy']);
    Route::post('/blogs/{id}/export', [BlogController::class, 'export']);

    // AI endpoints
    Route::prefix('ai')->group(function () {
        Route::post('/generate-outline', [AIController::class, 'generateOutline']);
        Route::post('/generate-content', [AIController::class, 'generateContent']);
        Route::post('/seo-analyze', [AIController::class, 'analyzeSeo']);
        Route::post('/rewrite', [AIController::class, 'rewrite']);
        Route::post('/expand', [AIController::class, 'expand']);
    });

    // Admin routes
    Route::prefix('admin')->middleware(AdminMiddleware::class)->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::get('/users/{id}', [AdminController::class, 'userDetails']);
        Route::put('/users/{id}/role', [AdminController::class, 'updateUserRole']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        Route::get('/ai-usage', [AdminController::class, 'aiUsage']);
    });
});
