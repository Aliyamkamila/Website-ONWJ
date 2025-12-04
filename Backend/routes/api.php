<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminController;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\UmkmController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\WkTekkomController;
use App\Http\Controllers\Api\WkTjslController;
use App\Http\Controllers\Api\PenghargaanController;

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

/*
|--------------------------------------------------------------------------
| Wilayah Kerja TEKKOM Routes
|--------------------------------------------------------------------------
*/

// Public routes (untuk frontend)
Route::prefix('v1')->group(function () {
    // Get all TEKKOM areas for public display
    Route::get('/wk-tekkom', [WkTekkomController::class, 'index']);

    // Get single TEKKOM area detail
    Route::get('/wk-tekkom/{id}', [WkTekkomController::class, 'show']);

    // Get status options
    Route::get('/wk-tekkom-status-options', [WkTekkomController::class, 'statusOptions']);
});

// Admin routes
Route::prefix('v1/admin')->group(function () {
// Route::prefix('v1/admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    // TEKKOM Management
    Route::get('/wk-tekkom', [WkTekkomController::class, 'adminIndex']);
    Route::post('/wk-tekkom', [WkTekkomController::class, 'store']);
    Route::get('/wk-tekkom/{id}', [WkTekkomController::class, 'show']);
    Route::put('/wk-tekkom/{id}', [WkTekkomController::class, 'update']);
    Route::patch('/wk-tekkom/{id}', [WkTekkomController::class, 'update']);
    Route::delete('/wk-tekkom/{id}', [WkTekkomController::class, 'destroy']);
    Route::post('/wk-tekkom/{id}/restore', [WkTekkomController::class, 'restore']);
});

/*
|--------------------------------------------------------------------------
| Wilayah Kerja TJSL Routes
|--------------------------------------------------------------------------
*/

// Public routes (untuk frontend)
Route::prefix('v1')->group(function () {
    // Get all TJSL areas for public display
    Route::get('/wk-tjsl', [WkTjslController::class, 'index']);

    // Get single TJSL area detail
    Route::get('/wk-tjsl/{id}', [WkTjslController::class, 'show']);

    // Get status options
    Route::get('/wk-tjsl-status-options', [WkTjslController::class, 'statusOptions']);
});

// Admin routes
Route::prefix('v1/admin')->group(function () {
// Route::prefix('v1/admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    // TJSL Management
    Route::get('/wk-tjsl', [WkTjslController::class, 'adminIndex']);
    Route::post('/wk-tjsl', [WkTjslController::class, 'store']);
    Route::get('/wk-tjsl/{id}', [WkTjslController::class, 'show']);
    Route::put('/wk-tjsl/{id}', [WkTjslController::class, 'update']);
    Route::patch('/wk-tjsl/{id}', [WkTjslController::class, 'update']);
    Route::delete('/wk-tjsl/{id}', [WkTjslController::class, 'destroy']);
    Route::post('/wk-tjsl/{id}/restore', [WkTjslController::class, 'restore']);
});

// Combined endpoint for wilayahkerja page (both TEKKOM and TJSL)
Route::prefix('v1')->group(function () {
    Route::get('/wilayah-kerja', function () {
        $tekkom = \App\Models\WkTekkom::active()->ordered()->get()->map(function ($area) {
            return array_merge($area->toArray(), ['category' => 'TEKKOM']);
        });
        
        $tjsl = \App\Models\WkTjsl::active()->ordered()->get()->map(function ($area) {
            return array_merge($area->toArray(), ['category' => 'TJSL']);
        });
        
        $allData = $tekkom->merge($tjsl);
        
        return response()->json([
            'success' => true,
            'message' => 'All areas retrieved successfully',
            'data' => $allData,
            'meta' => [
                'total' => $allData->count(),
                'tekkom_count' => $tekkom->count(),
                'tjsl_count' => $tjsl->count(),
            ]
        ], 200);
    });
});

/*
|--------------------------------------------------------------------------
| API Routes - Penghargaan
|--------------------------------------------------------------------------
*/

// ===== PUBLIC ROUTES (untuk website visitor) =====
Route::prefix('v1')->group(function () {
    // Get penghargaan for Media Informasi Page
    Route::get('/penghargaan', [PenghargaanController::class, 'index']);
    
    // Get penghargaan for Landing Page
    Route::get('/penghargaan/landing', [PenghargaanController::class, 'forLanding']);
    
    // Get detail penghargaan
    Route::get('/penghargaan/{id}', [PenghargaanController::class, 'show']);
    
    // Get filter options
    Route::get('/penghargaan-years', [PenghargaanController::class, 'getYears']);
    Route::get('/penghargaan-categories', [PenghargaanController::class, 'getCategories']);
});

// ===== ADMIN ROUTES (TEMPORARY WITHOUT AUTH) =====
Route::prefix('v1/admin')->group(function () {
// Route::prefix('v1/admin')->middleware(['auth:sanctum', 'admin.auth'])->group(function () {
    // CRUD Operations
    Route::get('/penghargaan', [PenghargaanController::class, 'adminIndex']);
    Route::post('/penghargaan', [PenghargaanController::class, 'store']);
    Route::get('/penghargaan/{id}', [PenghargaanController::class, 'show']);
    Route::post('/penghargaan/{id}', [PenghargaanController::class, 'update']); // POST untuk support form-data dengan image
    Route::delete('/penghargaan/{id}', [PenghargaanController::class, 'destroy']);
    
    // Bulk operations
    Route::post('/penghargaan/bulk-delete', [PenghargaanController::class, 'bulkDestroy']);
    
    // Statistics
    Route::get('/penghargaan-statistics', [PenghargaanController::class, 'getStatistics']);
});

/*
|--------------------------------------------------------------------------
| API Routes - Berita TJSL
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\Api\BeritaController;

// ===== PUBLIC ROUTES (untuk website visitor) =====
Route::prefix('v1')->group(function () {
    // Get berita for TJSL Page
    Route::get('/berita', [BeritaController::class, 'index']);
    
    // Get berita for Media Informasi Page
    Route::get('/berita/media-informasi', [BeritaController::class, 'forMediaInformasi']);
    
    // Get pinned berita for Homepage
    Route::get('/berita/homepage', [BeritaController::class, 'forHomepage']);
    
    // Get single berita detail by slug
    Route::get('/berita/{slug}', [BeritaController::class, 'show']);
    
    // Get recent berita (for sidebar)
    Route::get('/berita-recent', [BeritaController::class, 'recent']);
    
    // Get categories
    Route::get('/berita-categories', [BeritaController::class, 'categories']);
});

// ===== ADMIN ROUTES (TEMPORARY WITHOUT AUTH) =====
Route::prefix('v1/admin')->group(function () {
// Route::prefix('v1/admin')->middleware(['auth:sanctum', 'admin. auth'])->group(function () {
    // CRUD Operations
    Route::get('/berita', [BeritaController::class, 'adminIndex']);
    Route::post('/berita', [BeritaController::class, 'store']);
    Route::get('/berita/{id}', [BeritaController::class, 'show']);
    Route::post('/berita/{id}', [BeritaController::class, 'update']); // POST untuk support form-data dengan image
    Route::delete('/berita/{id}', [BeritaController::class, 'destroy']);
    
    // Statistics
    Route::get('/berita-statistics', [BeritaController::class, 'getStatistics']);
});