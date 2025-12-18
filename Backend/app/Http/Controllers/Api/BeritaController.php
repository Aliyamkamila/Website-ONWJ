<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Jobs\ProcessImageOptimization;
use App\Jobs\ClearCacheJob;
use App\Services\ImageCompressionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Berita (News) Controller dengan Cache & Async Processing
 * 
 * Features:
 * - Query caching untuk list dan detail
 * - Async image optimization via queue
 * - Async cache invalidation
 * - Pagination support
 * - Search functionality
 */
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
    protected int $cacheTTL = 900; // unused in public endpoints after simplification

    /**
     * Cache tags untuk invalidation
     */
    protected array $cacheTags = ['berita', 'public'];

    /**
     * Display a listing of published berita
     * 
     * @param Request $request
     * @return JsonResponse
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
     * 
     * @param string $slug
     * @return JsonResponse
     */
    public function show(string $slug): JsonResponse
    {
        try {
            $berita = Berita::where('slug', $slug)
                ->published()
                ->first();

            if (! $berita) {
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
                'short_description' => $berita->short_description,
                'content' => $berita->content,
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
     * Get latest berita (for homepage, widgets, etc.)
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function latest(Request $request): JsonResponse
    {
        try {
            $limit = (int) $request->input('limit', 5);

            $latest = Berita::published()
                ->ordered()
                ->limit($limit)
                ->get()
                ->map(function (Berita $b) {
                    return [
                        'id' => $b->id,
                        'title' => $b->title,
                        'slug' => $b->slug,
                        'formatted_date' => $b->formatted_date,
                        'short_description' => $b->short_description,
                        'full_image_url' => $b->full_image_url,
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'Latest berita retrieved successfully',
                'data' => $latest
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
     * Public: list distinct categories
     */
    public function categories(): JsonResponse
    {
        try {
            $cats = Berita::getCategories();
            return response()->json([
                'success' => true,
                'message' => 'Categories retrieved successfully',
                'data' => array_values(array_filter($cats))
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching berita categories', [
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve categories',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Admin: list all berita (any publish status) without cache.
     */
    public function adminIndex(Request $request): JsonResponse
    {
        try {
            $perPage = (int) $request->input('per_page', 15);
            $search = $request->input('search');
            $status = $request->input('status'); // expect values like published/draft
            $category = $request->input('category');
            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = strtolower($request->input('sort_order', 'desc')) === 'asc' ? 'asc' : 'desc';

            // Whitelist sortable columns to avoid SQL errors
            $allowedSort = ['created_at', 'date', 'title', 'display_order', 'views'];
            if (! in_array($sortBy, $allowedSort, true)) {
                $sortBy = 'created_at';
            }

            $query = Berita::query()->orderBy($sortBy, $sortOrder);

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'LIKE', "%{$search}%")
                        ->orWhere('author', 'LIKE', "%{$search}%")
                        ->orWhere('content', 'LIKE', "%{$search}%")
                        ->orWhere('short_description', 'LIKE', "%{$search}%");
                });
            }

            if ($status !== null && $status !== '') {
                // status column stores strings like published/draft
                $query->where('status', $status);
            }

            if ($category) {
                $query->where('category', $category);
            }

            $berita = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Berita (admin) retrieved successfully',
                'data' => $berita->items(),
                'meta' => [
                    'current_page' => $berita->currentPage(),
                    'last_page' => $berita->lastPage(),
                    'per_page' => $berita->perPage(),
                    'total' => $berita->total(),
                    'search' => $search,
                    'status' => $status,
                    'category' => $category,
                    'sort_by' => $sortBy,
                    'sort_order' => $sortOrder,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching admin berita', [
                'error' => $e->getMessage(),
                'params' => $request->all(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve berita (admin)',
                'error' => app()->environment('local') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Admin: basic statistics for berita.
     */
    public function statistics(): JsonResponse
    {
        try {
            $total = Berita::count();
            $published = Berita::where('status', 'published')->count();
            $draft = Berita::where('status', 'draft')->count();
            $pinned = Berita::where('pin_to_homepage', true)->count();
            $tjsl = Berita::where('show_in_tjsl', true)->count();

            return response()->json([
                'success' => true,
                'message' => 'Berita statistics retrieved',
                'data' => [
                    'total' => $total,
                    'published' => $published,
                    'draft' => $draft,
                    'pinned' => $pinned,
                    'tjsl' => $tjsl,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching berita statistics', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve berita statistics',
                'error' => app()->environment('local') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Store a newly created berita (Admin only)
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Validation
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
                'show_in_tjsl' => 'nullable|boolean',
                'show_in_media_informasi' => 'nullable|boolean',
                'show_in_dashboard' => 'nullable|boolean',
                'pin_to_homepage' => 'nullable|boolean',
            ]);

            // Auto-generate slug if not provided
            if (empty($validated['slug'])) {
                $validated['slug'] = Str::slug($validated['title']);
                
                // Ensure unique slug
                $originalSlug = $validated['slug'];
                $counter = 1;
                while (Berita:: where('slug', $validated['slug'])->exists()) {
                    $validated['slug'] = $originalSlug .'-' .$counter;
                    $counter++;
                }
            }

            // Handle image upload
            if ($request->hasFile('image')) {
                $imageFile = $request->file('image');
                
                // Compress image before storing
                $imageFile = $this->imageCompressionService->compress($imageFile, maxWidth: 2000, quality: 80);
                
                $imagePath = $imageFile->store('berita', 'public');
                $validated['image_path'] = $imagePath;

                // ✅ Dispatch async image optimization (tidak blocking response)
                ProcessImageOptimization::dispatch($imagePath, [
                    'thumbnail' => [300, 200],
                    'medium' => [800, 533],
                    'large' => [1200, 800],
                ]);
            }

            // Set defaults
            $validated['status'] = $validated['status'] ?? 'draft';
            $validated['author'] = $validated['author'] ?? $request->user()->name ?? 'Admin';
            
            // Convert string '1'/'0' to boolean for display flags
            $validated['show_in_tjsl'] = filter_var($validated['show_in_tjsl'] ?? false, FILTER_VALIDATE_BOOLEAN);
            $validated['show_in_media_informasi'] = filter_var($validated['show_in_media_informasi'] ?? true, FILTER_VALIDATE_BOOLEAN);
            $validated['show_in_dashboard'] = filter_var($validated['show_in_dashboard'] ?? false, FILTER_VALIDATE_BOOLEAN);
            $validated['pin_to_homepage'] = filter_var($validated['pin_to_homepage'] ?? false, FILTER_VALIDATE_BOOLEAN);

            // Create berita
            $berita = Berita::create($validated);

            // Tags are not used by the current model; skip to avoid relation errors

            return response()->json([
                'success' => true,
                'message' => 'Berita created successfully. Image optimization in progress.',
                'data' => $berita
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            Log:: error('Error creating berita', [
                'error' => $e->getMessage(),
                'data' => $request->except(['image'])
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create berita',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Update the specified berita (Admin only)
     * 
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $berita = Berita::findOrFail($id);

            // Validation
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
                'show_in_tjsl' => 'nullable|boolean',
                'show_in_media_informasi' => 'nullable|boolean',
                'show_in_dashboard' => 'nullable|boolean',
                'pin_to_homepage' => 'nullable|boolean',
            ]);

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image and optimized versions
                if ($berita->image_path) {
                    Storage::disk('public')->delete($berita->image_path);
                    
                    $pathInfo = pathinfo($berita->image_path);
                    $directory = $pathInfo['dirname'];
                    $filename = $pathInfo['filename'];
                    
                    foreach (['thumbnail', 'medium', 'large'] as $size) {
                        $optimizedPath = $directory .'/' .$filename .'_' .$size .'.' .$pathInfo['extension'];
                        Storage::disk('public')->delete($optimizedPath);
                    }
                }

                // Compress image before storing
                $imageFile = $request->file('image');
                $imageFile = $this->imageCompressionService->compress($imageFile, maxWidth: 2000, quality: 80);
                
                // Upload new image
                $imagePath = $imageFile->store('berita', 'public');
                $validated['image_path'] = $imagePath;

                // ✅ Dispatch async image optimization
                ProcessImageOptimization::dispatch($imagePath, [
                    'thumbnail' => [300, 200],
                    'medium' => [800, 533],
                    'large' => [1200, 800],
                ]);
            }
            
            // Convert string '1'/'0' to boolean for display flags if present
            if (isset($validated['show_in_tjsl'])) {
                $validated['show_in_tjsl'] = filter_var($validated['show_in_tjsl'], FILTER_VALIDATE_BOOLEAN);
            }
            if (isset($validated['show_in_media_informasi'])) {
                $validated['show_in_media_informasi'] = filter_var($validated['show_in_media_informasi'], FILTER_VALIDATE_BOOLEAN);
            }
            if (isset($validated['show_in_dashboard'])) {
                $validated['show_in_dashboard'] = filter_var($validated['show_in_dashboard'], FILTER_VALIDATE_BOOLEAN);
            }
            if (isset($validated['pin_to_homepage'])) {
                $validated['pin_to_homepage'] = filter_var($validated['pin_to_homepage'], FILTER_VALIDATE_BOOLEAN);
            }

            // Update berita
            $berita->update($validated);

            // Tags are not used by the current model; skip to avoid relation errors

            return response()->json([
                'success' => true,
                'message' => 'Berita updated successfully',
                'data' => $berita->fresh()
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Berita not found'
            ], 404);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            Log:: error('Error updating berita', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update berita',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Remove the specified berita (Admin only)
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $berita = Berita::findOrFail($id);

            // Delete image and optimized versions
            if ($berita->image_path) {
                Storage::disk('public')->delete($berita->image_path);
                
                $pathInfo = pathinfo($berita->image_path);
                $directory = $pathInfo['dirname'];
                $filename = $pathInfo['filename'];
                
                foreach (['thumbnail', 'medium', 'large'] as $size) {
                    $optimizedPath = $directory .'/' .$filename .'_' .$size .'.' .$pathInfo['extension'];
                    Storage::disk('public')->delete($optimizedPath);
                }
            }

            // Delete berita
            $berita->delete();

            return response()->json([
                'success' => true,
                'message' => 'Berita deleted successfully'
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Berita not found'
            ], 404);

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
     * Toggle publish status (Admin only)
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function togglePublish(int $id): JsonResponse
    {
        try {
            $berita = Berita::findOrFail($id);

            $newStatus = ! $berita->is_published;
            $berita->update(['is_published' => $newStatus]);

            return response()->json([
                'success' => true,
                'message' => 'Berita status updated successfully',
                'data' => [
                    'id' => $id,
                    'is_published' => $newStatus
                ]
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Berita not found'
            ], 404);

        } catch (\Exception $e) {
            Log::error('Error toggling berita status', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update berita status',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }
}