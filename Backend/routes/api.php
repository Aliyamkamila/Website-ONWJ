<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminController;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\UmkmController;
use App\Http\Controllers\Api\ProgramController;

// Guest routes (public access)
Route::middleware(['guest.only'])->group(function () {
    Route::get('/', function () {
        return response()->json([
            'success' => true,
            'message' => 'Welcome to MHJ ONWJ API',
            'data' => [
                'version' => '1.0.0',
                'environment' => app()->environment(),
            ]
        ]);
    });
});

// Hidden admin login route
Route::prefix('tukang-minyak-dan-gas')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login'])
        ->middleware('throttle:5,1')
        ->name('admin.login');
});

// Protected admin routes
Route::middleware(['auth:sanctum', 'admin.auth'])->group(function () {
    // Auth routes
    Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');
    Route::get('/admin/me', [AdminAuthController::class, 'me'])->name('admin.me');
    Route::post('/admin/refresh', [AdminAuthController::class, 'refresh'])->name('admin.refresh');

    // Admin CRUD routes
    Route::prefix('admin/admins')->name('admin.admins.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('index');
        Route::post('/', [AdminController::class, 'store'])->name('store');
        Route::get('/{id}', [AdminController::class, 'show'])->name('show');
        Route::put('/{id}', [AdminController::class, 'update'])->name('update');
        Route::patch('/{id}', [AdminController::class, 'update'])->name('patch');
        Route::delete('/{id}', [AdminController::class, 'destroy'])->name('destroy');
    });
});

/*
|--------------------------------------------------------------------------
| UMKM Routes
|--------------------------------------------------------------------------
*/

// Public routes (untuk frontend)
Route::prefix('v1')->group(function () {
    // Get all UMKM for public display
    Route::get('/umkm', [UmkmController::class, 'index']);

    // Get single UMKM detail
    Route::get('/umkm/{id}', [UmkmController::class, 'show']);

    // Get categories and status options
    Route::get('/umkm-categories', [UmkmController::class, 'categories']);
    Route::get('/umkm-status-options', [UmkmController::class, 'statusOptions']);
});

// TEMPORARY: Admin routes WITHOUT authentication for testing CORS
// TODO: Uncomment middleware after testing
Route::prefix('v1/admin')->group(function () {
// Route::prefix('v1/admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    // UMKM Management
    Route::get('/umkm', [UmkmController::class, 'adminIndex']);
    Route::post('/umkm', [UmkmController::class, 'store']);
    Route::get('/umkm/{id}', [UmkmController::class, 'show']);
    Route::post('/umkm/{id}', [UmkmController::class, 'update']); // POST for FormData with image
    Route::delete('/umkm/{id}', [UmkmController::class, 'destroy']);
});

/*
|--------------------------------------------------------------------------
| Program TJSL Routes
|--------------------------------------------------------------------------
*/

// Public routes (untuk frontend website)
Route::prefix('v1')->group(function () {
    // Get all programs for public display (with filters, search, pagination)
    Route::get('/programs', [ProgramController::class, 'index']);

    // Get single program detail by slug
    Route::get('/programs/{slug}', [ProgramController::class, 'show']);

    // Get recent programs (for sidebar)
    Route::get('/programs-recent', [ProgramController::class, 'recent']);

    // Get categories
    Route::get('/program-categories', [ProgramController::class, 'categories']);

    // Get status options
    Route::get('/program-status-options', [ProgramController::class, 'statusOptions']);

    // Get program statistics
    Route::get('/program-statistics', [ProgramController::class, 'statistics']);
});

// TEMPORARY: Admin routes WITHOUT authentication for testing CORS
// TODO: Uncomment middleware after testing
Route::prefix('v1/admin')->group(function () {
// Route::prefix('v1/admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    // Program Management
    Route::get('/programs', [ProgramController::class, 'adminIndex']);
    Route::post('/programs', [ProgramController::class, 'store']);
    Route::get('/programs/{id}', [ProgramController::class, 'show']);
    Route::post('/programs/{id}', [ProgramController::class, 'update']); // POST for FormData with image
    Route::delete('/programs/{id}', [ProgramController::class, 'destroy']);
});