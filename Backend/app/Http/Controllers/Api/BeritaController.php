<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Services\ImageCompressionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Jobs\ProcessImageOptimization;

class BeritaController extends Controller
{
    protected ImageCompressionService $imageCompressionService;

    public function __construct(ImageCompressionService $imageCompressionService)
    {
        $this->imageCompressionService = $imageCompressionService;
    }

    /**
     * Cache TTL untuk berita (15 minutes)
     */
    protected int $cacheTTL = 900;

    /**
     * Cache tags untuk invalidation
     */
    protected array $cacheTags = ['berita', 'public'];

    /**
     * Display a listing of published berita
     */
public function index(Request $request): JsonResponse
{
    try {
        $perPage = (int) $request->input('per_page', 12);
        $search = $request->input('search');
        $category = $request->input('category');

        $query = Berita::published()->ordered();

        if ($search) {
            $query->search($search);
        }

        if ($category) {
            $query->byCategory($category);
        }

        $paginator = $query->paginate($perPage);

        $items = collect($paginator->items())->map(function (Berita $b) {
            return [
                'id' => $b->id,
                'title' => $b->title,
                'slug' => $b->slug,
                'category' => $b->category,
                'date' => $b->date,
                'formatted_date' => $b->formatted_date,
                'short_description' => $b->short_description,
                'full_image_url' => $b->full_image_url,
                'views' => $b->views,
                'status' => $b->status, // ✅ TAMBAHKAN INI
                'show_in_tjsl' => $b->show_in_tjsl, // ✅ TAMBAHKAN INI
                'show_in_media_informasi' => $b->show_in_media_informasi, // ✅ TAMBAHKAN INI
                'show_in_dashboard' => $b->show_in_dashboard, // ✅ TAMBAHKAN INI
                'pin_to_homepage' => $b->pin_to_homepage, // ✅ TAMBAHKAN INI
            ];
        })->toArray();

        return response()->json([
            'success' => true,
            'message' => 'Berita retrieved successfully',
            'data' => $items,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'search' => $search,
                'category' => $category,
            ]
        ]);

    } catch (\Exception $e) {
        Log::error('Error fetching berita', [
            'error' => $e->getMessage(),
            'params' => $request->all()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Failed to retrieve berita',
            'error' => app()->environment('local') ? $e->getMessage() : null
        ], 500);
    }
}

    /**
     * Display the specified berita by slug
     */
    public function show(string $slug): JsonResponse
    {
        try {
            $berita = Berita::where('slug', $slug)
                ->published()
                ->first();

            if (!$berita) {
                return response()->json([
                    'success' => false,
                    'message' => 'Berita not found'
                ], 404);
            }

            $berita->incrementViews();

            $data = [
                'id' => $berita->id,
                'title' => $berita->title,
                'slug' => $berita->slug,
                'category' => $berita->category,
                'date' => $berita->date,
                'formatted_date' => $berita->formatted_date,
                'author' => $berita->author,
                'content' => $berita->content,
                'short_description' => $berita->short_description,
                'full_image_url' => $berita->full_image_url,
                'views' => $berita->views,
            ];

            return response()->json([
                'success' => true,
                'message' => 'Berita retrieved successfully',
                'data' => $data
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching berita detail', [
                'slug' => $slug,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve berita',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get latest berita (public)
     */
    public function latest(Request $request): JsonResponse
    {
        try {
            $limit = (int) $request->input('limit', 5);

            $berita = Berita::published()
                ->ordered()
                ->limit($limit)
                ->get()
                ->map(function (Berita $b) {
                    return [
                        'id' => $b->id,
                        'title' => $b->title,
                        'slug' => $b->slug,
                        'category' => $b->category,
                        'date' => $b->date,
                        'formatted_date' => $b->formatted_date,
                        'short_description' => $b->short_description,
                        'full_image_url' => $b->full_image_url,
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'Latest berita retrieved successfully',
                'data' => $berita
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching latest berita', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve latest berita',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get berita categories
     */
    public function categories(): JsonResponse
    {
        try {
            $categories = Berita::published()
                ->select('category')
                ->distinct()
                ->pluck('category');

            return response()->json([
                'success' => true,
                'message' => 'Categories retrieved successfully',
                'data' => $categories
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching categories', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve categories',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }
public function forHomepage(): JsonResponse
{
    try {
        $berita = Berita::published()
            ->where('pin_to_homepage', true)
            ->ordered()
            ->limit(5)
            ->get()
            ->map(function (Berita $b) {
                return [
                    'id' => $b->id,
                    'title' => $b->title,
                    'slug' => $b->slug,
                    'category' => $b->category,
                    'date' => $b->date,
                    'formatted_date' => $b->formatted_date,
                    'short_description' => $b->short_description,
                    'content' => $b->content,
                    'full_image_url' => $b->full_image_url,
                    'views' => $b->views,
                    'status' => $b->status,
                    'show_in_tjsl' => $b->show_in_tjsl,
                    'show_in_media_informasi' => $b->show_in_media_informasi,
                    'show_in_dashboard' => $b->show_in_dashboard,
                    'pin_to_homepage' => $b->pin_to_homepage,
                ];
            });

        return response()->json([
            'success' => true,
            'message' => 'Homepage berita retrieved successfully',
            'data' => $berita
        ]);

    } catch (\Exception $e) {
        Log::error('Error fetching homepage berita', [
            'error' => $e->getMessage()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Failed to retrieve homepage berita',
            'error' => app()->environment('local') ? $e->getMessage() : null
        ], 500);
    }
}

    /**
     * ==================== ADMIN ROUTES ====================
     */

    /**
     * Get all berita for admin (including draft)
     */
    public function adminIndex(Request $request): JsonResponse
    {
        try {
            $perPage = (int) $request->input('per_page', 15);
            $search = $request->input('search');
            $category = $request->input('category');
            $status = $request->input('status');

            $query = Berita::query();

            if ($search) {
                $query->search($search);
            }

            if ($category) {
                $query->byCategory($category);
            }

            if ($status) {
                $query->where('status', $status);
            }

            $paginator = $query->ordered()->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Berita retrieved successfully',
                'data' => $paginator->items(),
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching admin berita', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve berita',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get berita statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total' => Berita::count(),
                'published' => Berita::where('status', 'published')->count(),
                'draft' => Berita::where('status', 'draft')->count(),
                'total_views' => Berita::sum('views'),
            ];

            return response()->json([
                'success' => true,
                'message' => 'Statistics retrieved successfully',
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching berita statistics', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Store new berita (Admin)
        */
    public function store(Request $request): JsonResponse
    {
        try {
            // ✅ FIXED VALIDATION
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'slug' => 'nullable|string|unique:berita,slug',
                'category' => 'required|string|max:100',
                'date' => 'required|date',
                'author' => 'nullable|string|max:100',
                'short_description' => 'nullable|string|max:500',
                'content' => 'required|string',
                'image' => 'required|image|mimes:jpeg,jpg,png,webp|max:5120',
                'status' => 'nullable|in:published,draft',
                'display_option' => 'nullable|string',
                'auto_link' => 'nullable|string',
                // ✅ GANTI 'boolean' jadi 'in:0,1,true,false'
                'show_in_tjsl' => 'nullable|in:0,1,true,false',
                'show_in_media_informasi' => 'nullable|in:0,1,true,false',
                'show_in_dashboard' => 'nullable|in:0,1,true,false',
                'pin_to_homepage' => 'nullable|in:0,1,true,false',
        // ... rest tetap sama
            ], [
                'title.required' => 'Judul berita wajib diisi',
                'category.required' => 'Kategori wajib diisi',
                'date.required' => 'Tanggal berita wajib diisi',
                'content.required' => 'Konten berita wajib diisi',
            ]);

            // Auto-generate slug if not provided
            if (empty($validated['slug'])) {
                $validated['slug'] = Str::slug($validated['title']);
                
                // Ensure unique slug
                $originalSlug = $validated['slug'];
                $counter = 1;
                while (Berita::where('slug', $validated['slug'])->exists()) {
                    $validated['slug'] = $originalSlug . '-' . $counter;
                    $counter++;
                }
            }

            // ✅ Handle IMAGE UPLOAD (file atau base64)
            if ($request->has('image') && !empty($request->image)) {
                $imagePath = $this->handleImageUpload($request->image);
                if ($imagePath) {
                    $validated['image_path'] = $imagePath;
                }
            }

            // Set defaults
            $validated['status'] = $validated['status'] ?? 'draft';
            $validated['author'] = $validated['author'] ?? ($request->user()->name ?? 'Admin');
            
            // Convert to boolean
            $validated['show_in_tjsl'] = filter_var($request->input('show_in_tjsl', false), FILTER_VALIDATE_BOOLEAN);
            $validated['show_in_media_informasi'] = filter_var($request->input('show_in_media_informasi', true), FILTER_VALIDATE_BOOLEAN);
            $validated['show_in_dashboard'] = filter_var($request->input('show_in_dashboard', false), FILTER_VALIDATE_BOOLEAN);
            $validated['pin_to_homepage'] = filter_var($request->input('pin_to_homepage', false), FILTER_VALIDATE_BOOLEAN);

            // Create berita
            $berita = Berita::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Berita created successfully',
                'data' => $berita
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            Log::error('Error creating berita', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create berita',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update berita (Admin)
     */
public function update(Request $request, int $id): JsonResponse
{
    try {
        $berita = Berita::findOrFail($id);

        // ✅ FIXED VALIDATION
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|unique:berita,slug,' .$id,
            'category' => 'sometimes|string|max:100',
            'date' => 'sometimes|date',
            'author' => 'nullable|string|max:100',
            'short_description' => 'nullable|string|max:500',
            'content' => 'sometimes|string',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120',
            'status' => 'sometimes|in:published,draft',
            'display_option' => 'nullable|string',
            'auto_link' => 'nullable|string',
            // ✅ GANTI validation
            'show_in_tjsl' => 'nullable|in:0,1,true,false',
            'show_in_media_informasi' => 'nullable|in:0,1,true,false',
            'show_in_dashboard' => 'nullable|in:0,1,true,false',
            'pin_to_homepage' => 'nullable|in:0,1,true,false',
        ]);

            // Auto-generate slug if changed
            if (isset($validated['slug']) && empty($validated['slug'])) {
                $validated['slug'] = Str::slug($validated['title']);
                
                $originalSlug = $validated['slug'];
                $counter = 1;
                while (Berita::where('slug', $validated['slug'])->where('id', '!=', $id)->exists()) {
                    $validated['slug'] = $originalSlug . '-' . $counter;
                    $counter++;
                }
            }

            // Handle image upload
            if ($request->has('image') && !empty($request->image)) {
                // Delete old image
                if ($berita->image_path && Storage::disk('public')->exists($berita->image_path)) {
                    Storage::disk('public')->delete($berita->image_path);
                }

                $imagePath = $this->handleImageUpload($request->image);
                if ($imagePath) {
                    $validated['image_path'] = $imagePath;
                }
            }

            // Convert to boolean
            if ($request->has('show_in_tjsl')) {
                $validated['show_in_tjsl'] = filter_var($request->input('show_in_tjsl'), FILTER_VALIDATE_BOOLEAN);
            }
            if ($request->has('show_in_media_informasi')) {
                $validated['show_in_media_informasi'] = filter_var($request->input('show_in_media_informasi'), FILTER_VALIDATE_BOOLEAN);
            }
            if ($request->has('show_in_dashboard')) {
                $validated['show_in_dashboard'] = filter_var($request->input('show_in_dashboard'), FILTER_VALIDATE_BOOLEAN);
            }
            if ($request->has('pin_to_homepage')) {
                $validated['pin_to_homepage'] = filter_var($request->input('pin_to_homepage'), FILTER_VALIDATE_BOOLEAN);
            }

            $berita->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Berita updated successfully',
                'data' => $berita->fresh()
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error updating berita', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update berita',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete berita (Admin)
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $berita = Berita::find($id);

            if (!$berita) {
                return response()->json([
                    'success' => false,
                    'message' => 'Berita not found'
                ], 404);
            }

            // Delete image file
            if ($berita->image_path && Storage::disk('public')->exists($berita->image_path)) {
                Storage::disk('public')->delete($berita->image_path);
            }

            $berita->delete();

            return response()->json([
                'success' => true,
                'message' => 'Berita deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting berita', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete berita',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Toggle publish status (Admin)
     */
    public function togglePublish(int $id): JsonResponse
    {
        try {
            $berita = Berita::find($id);

            if (!$berita) {
                return response()->json([
                    'success' => false,
                    'message' => 'Berita not found'
                ], 404);
            }

            $newStatus = $berita->status === 'published' ? 'draft' : 'published';
            $berita->update(['status' => $newStatus]);

            return response()->json([
                'success' => true,
                'message' => 'Berita status updated successfully',
                'data' => $berita->fresh()
            ]);

        } catch (\Exception $e) {
            Log::error('Error toggling berita status', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update status',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * ==================== HELPER FUNCTIONS ====================
     */

    /**
     * Handle image upload (support File dan Base64)
     */
    private function handleImageUpload($image)
    {
        try {
            // Check if it's a file upload
            if ($image instanceof \Illuminate\Http\UploadedFile) {
                // Regular file upload
                if ($image->isValid()) {
                    $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                    $path = $image->storeAs('berita', $filename, 'public');
                    return $path;
                }
            }
            
            // Check if it's base64
            if (is_string($image) && str_starts_with($image, 'data:image')) {
                // Base64 image
                preg_match('/data:image\/(\w+);base64,/', $image, $matches);
                $extension = $matches[1] ?? 'png';
                
                // Decode base64
                $imageData = substr($image, strpos($image, ',') + 1);
                $imageData = base64_decode($imageData);
                
                // Generate filename
                $filename = time() . '_' . Str::random(10) . '.' . $extension;
                $path = 'berita/' . $filename;
                
                // Save to storage
                Storage::disk('public')->put($path, $imageData);
                
                return $path;
            }

            // If it's already a path string (update scenario)
            if (is_string($image) && !str_contains($image, 'data:image')) {
                return $image;
            }

            return null;

        } catch (\Exception $e) {
            Log::error('Error handling image upload: ' . $e->getMessage());
            return null;
        }
    }
}