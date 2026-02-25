<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

// --- Admin Controllers ---
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminController;

// --- API/Public Controllers ---
use App\Http\Controllers\Api\HeroSectionController;
use App\Http\Controllers\Api\UmkmController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\WilayahKerjaController;
use App\Http\Controllers\Api\PenghargaanController;
use App\Http\Controllers\Api\BeritaController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\TjslStatisticController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\HargaMinyakController;
use App\Http\Controllers\Api\ProduksiBulananController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\GalleryCategoryController;
use App\Http\Controllers\Api\ManagementController;
use App\Http\Controllers\Api\InstagramPostController; 
use App\Http\Controllers\LaporanController;


// --------------------------------------------------------------------------   
// ========================================================================
// GUEST / PUBLIC GENERAL ROUTES
// ========================================================================

Route::middleware(['guest_only'])->group(function () {
    Route::get('/', function () {
        return response()->json([
            'success' => true,
            'message' => 'Welcome to MHJ ONWJ API',
            'data' => [
                'version' => '1.0.0',
                'environment' => app()->environment(),
                'server_time' => now()->toDateTimeString(),
            ]
        ]);
    });
});

// ========================================================================
// AUTHENTICATION ROUTES
// ========================================================================

Route::prefix('tukang-minyak-dan-gas')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login'])
        ->middleware('throttle:5,1')
        ->name('admin.login');
});

// ========================================================================
// PROTECTED ADMIN MAIN ROUTES (Core Admin Features)
// ========================================================================

Route::middleware(['auth:sanctum', 'admin_auth'])->group(function () {
    // Auth Management
    Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');
    Route::get('/admin/me', [AdminAuthController::class, 'me'])->name('admin.me');
    Route::post('/admin/refresh', [AdminAuthController::class, 'refresh'])->name('admin.refresh');

    // Admin Users Management
    Route::prefix('admin/admins')->name('admin.admins.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('index');
        Route::post('/', [AdminController::class, 'store'])->name('store');
        Route::get('/{id}', [AdminController::class, 'show'])->name('show');
        Route::put('/{id}', [AdminController::class, 'update'])->name('update');
        Route::patch('/{id}', [AdminController::class, 'update'])->name('patch');
        Route::delete('/{id}', [AdminController::class, 'destroy'])->name('destroy');
    });
});

// ========================================================================
// PUBLIC API V1 ROUTES (WITH RESPONSE CACHE)
// ========================================================================

Route::prefix('v1')->group(function () {

    // --- HERO SECTIONS ---
    Route::get('/hero-sections', [HeroSectionController::class, 'index']);

    // --- PROGRAMS (TJSL) ---
    Route::get('/programs', [ProgramController::class, 'index']);
    Route::get('/programs/{slug}', [ProgramController::class, 'show']);
    Route::get('/programs/category/{categoryId}', [ProgramController::class, 'byCategory']);
    Route::get('/programs-statistics', [ProgramController::class, 'statistics']);

    // --- UMKM ---
    Route::get('/umkm', [UmkmController::class, 'index']);
    Route::get('/umkm/{id}', [UmkmController::class, 'show']);
    Route::get('/umkm-categories', [UmkmController::class, 'categories']);
    Route::get('/umkm-status-options', [UmkmController::class, 'statusOptions']);

    // --- WILAYAH KERJA ---
    Route::get('/wilayah-kerja', [WilayahKerjaController::class, 'index']);
    Route::get('/wilayah-kerja/{id}', [WilayahKerjaController::class, 'show']);
    Route::get('/wilayah-kerja-statistics', [WilayahKerjaController::class, 'statistics']);

    // --- PENGHARGAAN (AWARDS) ---
    Route::get('/penghargaan', [PenghargaanController::class, 'index']);
    // Landing-specific endpoint expected by frontend
    Route::get('/penghargaan/landing', [PenghargaanController::class, 'forLanding']);
    Route::get('/penghargaan-years', [PenghargaanController::class, 'getYears']);
    Route::get('/penghargaan-categories', [PenghargaanController::class, 'getCategories']);

    // --- TESTIMONIALS ---
    Route::get('/testimonials', [TestimonialController::class, 'index']);
    Route::get('/testimonials/featured', [TestimonialController::class, 'getFeatured']);
    Route::get('/testimonials/program/{program}', [TestimonialController::class, 'getByProgram']);
    Route::get('/testimonial-programs', [TestimonialController::class, 'getPrograms']);
    Route::get('/testimonials/{id}', [TestimonialController::class, 'show']);

    // --- TJSL STATISTICS ---
    Route::get('/tjsl-statistics', [TjslStatisticController::class, 'index']);
    // Alias to match frontend expectation
    Route::get('/tjsl/statistik', [TjslStatisticController::class, 'index']);
    // Optional english alias for consistency
    Route::get('/tjsl/statistics', [TjslStatisticController::class, 'index']);

    // --- SETTINGS ---
    Route::get('/settings', [SettingController::class, 'index']);

    // --- HARGA MINYAK ---
    Route::get('/harga-minyak', [HargaMinyakController::class, 'index']);
    Route::get('/harga-minyak-latest', [HargaMinyakController::class, 'latest']);

    // --- PRODUKSI BULANAN ---
    Route::get('/produksi-bulanan', [ProduksiBulananController::class, 'index']);
    Route::get('/produksi-statistics', [ProduksiBulananController::class, 'statistics']);

    // --- GALLERY ---
    Route::get('/gallery', [GalleryController::class, 'index']);
    Route::get('/gallery/{id}', [GalleryController::class, 'show']);
    Route::get('/gallery-categories', [GalleryCategoryController::class, 'index']);

    // --- MANAGEMENT ---
    Route::get('/management', [ManagementController::class, 'index']);

    // --- CONTACT (NO CACHE for form submission) ---
    Route::post('/contact', [ContactController::class, 'store']);
    Route::get('/contact-info', [ContactController::class, 'info']);

    // --- INSTAGRAM POSTS (PUBLIC) ⭐ BARU ---
    Route::get('/instagram-posts', function () {
        $posts = App\Models\InstagramPost::where('show_in_media', true)
                                         ->where('status', 'published')
                                         ->orderBy('order', 'asc')
                                         ->orderBy('posted_at', 'desc')
                                         ->get();
        return response()->json(['success' => true, 'data' => $posts]);
    });

    // ✅ LAPORAN PUBLIC ROUTES (MOVED HERE)
    Route::prefix('laporan')->group(function () {
        Route::get('/published', [\App\Http\Controllers\Api\LaporanController::class, 'getPublishedLaporan']);
        Route::post('/{id}/view', [\App\Http\Controllers\Api\LaporanController::class, 'viewLaporan']);
    });

});

// ========================================================================
// ADMIN PROTECTED ROUTES (NO CACHE)
// ========================================================================

Route::middleware(['auth:sanctum', 'admin_auth'])->prefix('admin')->group(function () {

    // --- PROGRAMS MANAGEMENT ---
    Route::prefix('programs')->group(function () {
        Route::post('/', [ProgramController::class, 'store']);
        Route::put('/{id}', [ProgramController::class, 'update']);
        Route::delete('/{id}', [ProgramController::class, 'destroy']);
        Route::patch('/{id}/toggle-publish', [ProgramController::class, 'togglePublish']);
    });

    // --- BERITA MANAGEMENT ---
    Route::prefix('berita')->group(function () {
        Route::get('/', [BeritaController::class, 'adminIndex']);
        Route::get('/statistics', [BeritaController::class, 'statistics']);
        Route::post('/', [BeritaController::class, 'store']);
        Route::put('/{id}', [BeritaController::class, 'update']);
        Route::delete('/{id}', [BeritaController::class, 'destroy']);
        Route::patch('/{id}/toggle-publish', [BeritaController::class, 'togglePublish']);
    });

    // Backward compatibility path expected by frontend
    Route::get('/berita-statistics', [BeritaController::class, 'statistics']);

    // --- UMKM MANAGEMENT ---
    Route::prefix('umkm')->group(function () {
        Route::get('/', [UmkmController::class, 'adminIndex']);
        Route::get('/{id}', [UmkmController::class, 'show']);
        Route::post('/', [UmkmController::class, 'store']);
        Route::post('/{id}', [UmkmController::class, 'update']); // allow form-data without _method
        Route::put('/{id}', [UmkmController::class, 'update']);
        Route::delete('/{id}', [UmkmController::class, 'destroy']);
    });

    // --- HERO SECTIONS MANAGEMENT ---
    Route::prefix('hero-sections')->group(function () {
        Route::get('/', [HeroSectionController::class, 'adminIndex']);
        Route::get('/{id}', [HeroSectionController::class, 'show']);
        Route::post('/', [HeroSectionController::class, 'store']);
        Route::post('/{id}', [HeroSectionController::class, 'update']); // allow form-data without _method
        Route::put('/{id}', [HeroSectionController::class, 'update']);
        Route::delete('/{id}', [HeroSectionController::class, 'destroy']);
        Route::patch('/{id}/toggle-active', [HeroSectionController::class, 'toggleActive']);
    });

    // --- WILAYAH KERJA MANAGEMENT ---
    Route::prefix('wilayah-kerja')->group(function () {
        Route::get('/', [WilayahKerjaController::class, 'adminIndex']);
        Route::get('/{id}', [WilayahKerjaController::class, 'show']);
        Route::post('/', [WilayahKerjaController::class, 'store']);
        Route::put('/{id}', [WilayahKerjaController::class, 'update']);
        Route::delete('/{id}', [WilayahKerjaController::class, 'destroy']);
        Route::post('/{id}/restore', [WilayahKerjaController::class, 'restore']);
    });

    // --- PENGHARGAAN MANAGEMENT ---
    Route::prefix('penghargaan')->group(function () {
        Route::get('/', [PenghargaanController::class, 'adminIndex']);
        Route::get('/statistics', [PenghargaanController::class, 'statistics']);
        Route::get('/{id}', [PenghargaanController::class, 'show']);
        Route::post('/', [PenghargaanController::class, 'store']);
        Route::post('/{id}', [PenghargaanController::class, 'update']); // allow form-data without _method
        Route::put('/{id}', [PenghargaanController::class, 'update']);
        Route::delete('/{id}', [PenghargaanController::class, 'destroy']);
        Route::post('/bulk-delete', [PenghargaanController::class, 'bulkDelete']);
    });

    // Backward compatibility path expected by frontend
    Route::get('/penghargaan-statistics', [PenghargaanController::class, 'statistics']);

    // --- TESTIMONIALS MANAGEMENT ---
    Route::prefix('testimonials')->group(function () {
        Route::get('/', [TestimonialController::class, 'adminIndex']);
        Route::get('/statistics', [TestimonialController::class, 'statistics']);
        Route::get('/{id}', [TestimonialController::class, 'adminShow']);
        Route::post('/', [TestimonialController::class, 'store']);
        Route::post('/{id}', [TestimonialController::class, 'update']); // allow form-data without _method
        Route::put('/{id}', [TestimonialController::class, 'update']);
        Route::post('/{id}/toggle-featured', [TestimonialController::class, 'toggleFeatured']);
        Route::post('/bulk-delete', [TestimonialController::class, 'bulkDelete']);
        Route::delete('/{id}', [TestimonialController::class, 'destroy']);
    });

    // Backward compatibility path expected by frontend
    Route::get('/testimonial-statistics', [TestimonialController::class, 'statistics']);

    // --- TJSL STATISTICS MANAGEMENT ---
    Route::prefix('tjsl')->group(function () {
        Route::get('/statistik', [TjslStatisticController::class, 'adminIndex']);
        Route::put('/statistik/{id}', [TjslStatisticController::class, 'update']);
        Route::post('/statistik/bulk-update', [TjslStatisticController::class, 'bulkUpdate']);
        Route::post('/statistik/reset', [TjslStatisticController::class, 'reset']);
    });

    // --- SETTINGS MANAGEMENT ---
    Route::prefix('settings')->group(function () {
        Route::get('/', [SettingController::class, 'adminIndex']);
        Route::put('/', [SettingController::class, 'update']);
    });

    // --- HARGA MINYAK MANAGEMENT ---
    Route::prefix('harga-minyak')->group(function () {
        Route::get('/', [HargaMinyakController::class, 'adminIndex']);
        Route::get('/{id}', [HargaMinyakController::class, 'show']);
        Route::post('/', [HargaMinyakController::class, 'store']);
        Route::post('/bulk', [HargaMinyakController::class, 'bulkStore']);
        Route::post('/bulk-delete', [HargaMinyakController::class, 'bulkDelete']);
        Route::put('/{id}', [HargaMinyakController::class, 'update']);
        Route::delete('/{id}', [HargaMinyakController::class, 'destroy']);
        
        // Realisasi bulanan endpoints
        Route::get('/realisasi-bulanan', [HargaMinyakController::class, 'getRealisasiBulanan']);
        Route::post('/realisasi-bulanan', [HargaMinyakController::class, 'storeRealisasiBulanan']);
    });

    // --- PRODUKSI MANAGEMENT ---
    Route::prefix('produksi-bulanan')->group(function () {
        Route::get('/', [ProduksiBulananController::class, 'adminIndex']);
        Route::get('/areas', [ProduksiBulananController::class, 'getAreas']);
        Route::get('/{id}', [ProduksiBulananController::class, 'show']);
        Route::post('/', [ProduksiBulananController::class, 'store']);
        Route::put('/{id}', [ProduksiBulananController::class, 'update']);
        Route::delete('/{id}', [ProduksiBulananController::class, 'destroy']);
    });

    // --- GALLERY MANAGEMENT ---
    Route::prefix('gallery')->group(function () {
        Route::post('/', [GalleryController::class, 'store']);
        Route::put('/{id}', [GalleryController::class, 'update']);
        Route::delete('/{id}', [GalleryController::class, 'destroy']);
    });

    // --- MANAGEMENT TEAM ---
    Route::prefix('management')->group(function () {
        Route::get('/', [ManagementController::class, 'adminIndex']);
        Route::get('/{id}', [ManagementController::class, 'show']);
        Route::post('/', [ManagementController::class, 'store']);
        Route::post('/{id}', [ManagementController::class, 'update']); // allow form-data without _method
        Route::put('/{id}', [ManagementController::class, 'update']);
        Route::delete('/{id}', [ManagementController::class, 'destroy']);
    });

    // --- CONTACTS MANAGEMENT ---
    Route::prefix('contacts')->group(function () {
        Route::get('/', [ContactController::class, 'index']);
        Route::get('/statistics', [ContactController::class, 'statistics']);
        Route::get('/{id}', [ContactController::class, 'show']);
        Route::delete('/{id}', [ContactController::class, 'destroy']);
        Route::patch('/{id}/mark-read', [ContactController::class, 'markAsRead']);
        Route::post('/bulk-delete', [ContactController::class, 'bulkDelete']);
    });

    // --- INSTAGRAM POSTS MANAGEMENT (FIXED ROUTES) ---
    Route::prefix('instagram-posts')->group(function () {
        Route::get('/', [InstagramPostController::class, 'index']);          // GET all posts
        Route::post('/', [InstagramPostController::class, 'store']);         // POST create new (with file)
        Route::post('/{id}', [InstagramPostController::class, 'update']);    // POST update with file (using _method=PUT)
        Route::delete('/{id}', [InstagramPostController::class, 'destroy']); // DELETE post
        
        // ✅ Route khusus untuk fetch data dari Instagram (tidak perlu auth? tapi kita taruh di sini)
        Route::post('/fetch-data', [InstagramPostController::class, 'fetchInstagramData']);
    });

    // --- LAPORAN MANAGEMENT (ADMIN) ---
    Route::prefix('laporan')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\LaporanController::class, 'adminIndex']);
        Route::post('/', [\App\Http\Controllers\Api\LaporanController::class, 'store']);
        Route::put('/{id}', [\App\Http\Controllers\Api\LaporanController::class, 'update']);
        Route::delete('/{id}', [\App\Http\Controllers\Api\LaporanController::class, 'destroy']);
        Route::patch('/{id}/toggle-publish', [\App\Http\Controllers\Api\LaporanController::class, 'togglePublish']);
    });
});

// ========================================================================
// PUBLIC ROUTES (CACHED)
// ========================================================================

Route::prefix('v1')->group(function () {
    Route::prefix('berita')->group(function () {
        Route::get('/', [BeritaController::class, 'index']);
        Route::get('/latest', [BeritaController::class, 'latest']);
        Route::get('/categories', [BeritaController::class, 'categories']);
        Route::get('/featured', [BeritaController::class, 'featured']);
        Route::get('/homepage', [BeritaController::class, 'forHomepage']);
        Route::get('/{slug}', [BeritaController::class, 'show']);
    }); 
});