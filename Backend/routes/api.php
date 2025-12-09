<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminController;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\UmkmController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\WilayahKerjaController; // ✅ CHANGED
use App\Http\Controllers\Api\PenghargaanController;
use App\Http\Controllers\Api\BeritaController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\TjslStatisticController;

// Guest routes (public access)
Route::middleware(['guest_only'])->group(function () { // ✅ FIXED: removed space
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
        ->name('admin. login'); // ✅ FIXED:  removed space
});

// Protected admin routes
Route::middleware(['auth: sanctum', 'admin_auth'])->group(function () { // ✅ FIXED:  removed space
    // Auth routes
    Route::post('/admin/logout', [AdminAuthController:: class, 'logout'])->name('admin.logout');
    Route::get('/admin/me', [AdminAuthController::class, 'me'])->name('admin.me');
    Route::post('/admin/refresh', [AdminAuthController::class, 'refresh'])->name('admin.refresh');

    // Admin CRUD routes
    Route::prefix('admin/admins')->name('admin.admins.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('index');
        Route::post('/', [AdminController::class, 'store'])->name('store');
        Route::get('/{id}', [AdminController:: class, 'show'])->name('show');
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
    Route::get('/umkm', [UmkmController::class, 'index']);
    Route::get('/umkm/{id}', [UmkmController:: class, 'show']);
    Route::get('/umkm-categories', [UmkmController:: class, 'categories']);
    Route::get('/umkm-status-options', [UmkmController::class, 'statusOptions']);
});

// Admin routes
Route::prefix('v1/admin')->group(function () {
// Route::prefix('v1/admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/umkm', [UmkmController::class, 'adminIndex']);
    Route::post('/umkm', [UmkmController::class, 'store']);
    Route::get('/umkm/{id}', [UmkmController::class, 'show']);
    Route::post('/umkm/{id}', [UmkmController::class, 'update']);
    Route::delete('/umkm/{id}', [UmkmController::class, 'destroy']);
});

/*
|--------------------------------------------------------------------------
| Program TJSL Routes
|--------------------------------------------------------------------------
*/

// Public routes (untuk frontend website)
Route::prefix('v1')->group(function () {
    Route::get('/programs', [ProgramController::class, 'index']);
    Route::get('/programs/{slug}', [ProgramController::class, 'show']);
    Route::get('/programs-recent', [ProgramController::class, 'recent']);
    Route::get('/program-categories', [ProgramController:: class, 'categories']);
    Route::get('/program-status-options', [ProgramController::class, 'statusOptions']);
    Route::get('/program-statistics', [ProgramController::class, 'statistics']);
});

// Admin routes
Route::prefix('v1/admin')->group(function () {
// Route::prefix('v1/admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/programs', [ProgramController::class, 'adminIndex']);
    Route::post('/programs', [ProgramController::class, 'store']);
    Route::get('/programs/{id}', [ProgramController::class, 'show']);
    Route::post('/programs/{id}', [ProgramController::class, 'update']);
    Route::delete('/programs/{id}', [ProgramController::class, 'destroy']);
});

/*
|--------------------------------------------------------------------------
| ✅ Wilayah Kerja Routes (TEKKOM & TJSL Combined)
|--------------------------------------------------------------------------
*/

// Public routes (untuk frontend)
Route::prefix('v1')->group(function () {
    Route::get('/wilayah-kerja', [WilayahKerjaController::class, 'index']);
    Route::get('/wilayah-kerja/{id}', [WilayahKerjaController::class, 'show']);
    Route::get('/wilayah-kerja-statistics', [WilayahKerjaController::class, 'statistics']);
    Route::get('/wilayah-kerja-status-options', [WilayahKerjaController::class, 'statusOptions']);
    Route::post('/wilayah-kerja-convert-coordinates', [WilayahKerjaController::class, 'convertCoordinates']);
});

// Admin routes
Route::prefix('v1/admin')->group(function () {
// Route::prefix('v1/admin')->middleware(['auth:sanctum', 'admin_auth'])->group(function () {
    Route::get('/wilayah-kerja', [WilayahKerjaController::class, 'adminIndex']);
    Route::post('/wilayah-kerja', [WilayahKerjaController::class, 'store']);
    Route::put('/wilayah-kerja/{id}', [WilayahKerjaController::class, 'update']);
    Route::patch('/wilayah-kerja/{id}', [WilayahKerjaController::class, 'update']);
    Route::delete('/wilayah-kerja/{id}', [WilayahKerjaController::class, 'destroy']);
    Route::post('/wilayah-kerja/{id}/restore', [WilayahKerjaController::class, 'restore']);
});

/*
|--------------------------------------------------------------------------
| API Routes - Penghargaan
|--------------------------------------------------------------------------
*/

// Public routes
Route::prefix('v1')->group(function () {
    Route::get('/penghargaan', [PenghargaanController::class, 'index']);
    Route::get('/penghargaan/landing', [PenghargaanController::class, 'forLanding']);
    Route::get('/penghargaan/{id}', [PenghargaanController::class, 'show']);
    Route::get('/penghargaan-years', [PenghargaanController::class, 'getYears']);
    Route::get('/penghargaan-categories', [PenghargaanController:: class, 'getCategories']);
});

// Admin routes
Route::prefix('v1/admin')->group(function () {
// Route::prefix('v1/admin')->middleware(['auth:sanctum', 'admin_auth'])->group(function () {
    Route::get('/penghargaan', [PenghargaanController::class, 'adminIndex']);
    Route::post('/penghargaan', [PenghargaanController::class, 'store']);
    Route::get('/penghargaan/{id}', [PenghargaanController::class, 'show']);
    Route::post('/penghargaan/{id}', [PenghargaanController::class, 'update']);
    Route::delete('/penghargaan/{id}', [PenghargaanController::class, 'destroy']);
    Route::post('/penghargaan/bulk-delete', [PenghargaanController::class, 'bulkDestroy']);
    Route::get('/penghargaan-statistics', [PenghargaanController::class, 'getStatistics']);
});

/*
|--------------------------------------------------------------------------
| API Routes - Berita TJSL
|--------------------------------------------------------------------------
*/

// Public routes
Route::prefix('v1')->group(function () {
    Route::get('/berita', [BeritaController::class, 'index']);
    Route::get('/berita/media-informasi', [BeritaController::class, 'forMediaInformasi']);
    Route::get('/berita/homepage', [BeritaController::class, 'forHomepage']);
    Route::get('/berita/{slug}', [BeritaController::class, 'show'])
         ->where('slug', '[a-z0-9\-]+');
    Route::get('/berita-recent', [BeritaController::class, 'recent']);
    Route::get('/berita-categories', [BeritaController::class, 'categories']);
});

// Admin routes
Route::prefix('v1/admin')->group(function () {
// Route::prefix('v1/admin')->middleware(['auth:sanctum', 'admin_auth'])->group(function () {
    Route::get('/berita', [BeritaController::class, 'adminIndex']);
    Route::post('/berita', [BeritaController::class, 'store']);
    Route::get('/berita/{id}', [BeritaController::class, 'show'])
         ->where('id', '[0-9]+');
    Route::post('/berita/{id}', [BeritaController::class, 'update'])
         ->where('id', '[0-9]+');
    Route::delete('/berita/{id}', [BeritaController::class, 'destroy'])
         ->where('id', '[0-9]+');
    Route::get('/berita-statistics', [BeritaController::class, 'getStatistics']);
});

/*
|--------------------------------------------------------------------------
| API Routes - TESTIMONIALS
|--------------------------------------------------------------------------
*/

// Public routes
Route::prefix('v1')->group(function () {
    Route::get('/testimonials', [TestimonialController::class, 'index']);
    Route::get('/testimonials/featured', [TestimonialController::class, 'getFeatured']);
    Route::get('/testimonials/program/{program}', [TestimonialController::class, 'getByProgram']);
    Route::get('/testimonials/{id}', [TestimonialController::class, 'show'])
         ->where('id', '[0-9]+');
    Route::get('/testimonial-programs', [TestimonialController::class, 'getPrograms']);
});

// Admin routes
Route:: prefix('v1/admin')->group(function () {
// Route::prefix('v1/admin')->middleware(['auth:sanctum', 'admin_auth'])->group(function () {
    Route::get('/testimonials', [TestimonialController::class, 'adminIndex']);
    Route::post('/testimonials', [TestimonialController::class, 'store']);
    Route::get('/testimonials/{id}', [TestimonialController::class, 'show'])
         ->where('id', '[0-9]+');
    Route::post('/testimonials/{id}', [TestimonialController::class, 'update'])
         ->where('id', '[0-9]+');
    Route::delete('/testimonials/{id}', [TestimonialController::class, 'destroy'])
         ->where('id', '[0-9]+');
    Route::post('/testimonials/bulk-delete', [TestimonialController::class, 'bulkDelete']);
    Route::post('/testimonials/{id}/toggle-featured', [TestimonialController::class, 'toggleFeatured'])
         ->where('id', '[0-9]+');
    Route::get('/testimonial-statistics', [TestimonialController::class, 'getStatistics']);
});

/*
|--------------------------------------------------------------------------
| API Routes - TJSL Statistics
|--------------------------------------------------------------------------
*/

// Public routes
Route::prefix('v1')->group(function () {
    Route::get('/tjsl/statistik', [TjslStatisticController::class, 'index']);
});

// Admin routes
Route::prefix('v1/admin')->group(function () {
// Route::prefix('v1/admin')->middleware(['auth:sanctum', 'admin_auth'])->group(function () {
    Route::get('/tjsl/statistik', [TjslStatisticController:: class, 'adminIndex']);
    Route::put('/tjsl/statistik/{id}', [TjslStatisticController::class, 'update']);
    Route::post('/tjsl/statistik/bulk-update', [TjslStatisticController::class, 'bulkUpdate']);
    Route::post('/tjsl/statistik/reset', [TjslStatisticController::class, 'reset']);
});