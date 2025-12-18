<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Models\GalleryCategory;
use App\Services\ImageCompressionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;

class GalleryController extends Controller
{
    protected ImageCompressionService $imageCompressionService;

    public function __construct(ImageCompressionService $imageCompressionService)
    {
        $this->imageCompressionService = $imageCompressionService;
    }
    
    /**
     * Get all gallery images (Public)
     * GET /api/v1/gallery
     */
    public function index(Request $request)
    {
        try {
            $query = Gallery::with('category')->published();

            // Filter by category
            if ($request->has('category')) {
                $query->whereHas('category', function($q) use ($request) {
                    $q->where('slug', $request->category);
                });
            }

            // Search
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('caption', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            // Featured only
            if ($request->has('featured')) {
                $query->featured();
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            
            if ($sortBy === 'order') {
                $query->ordered();
            } else {
                $query->orderBy($sortBy, $sortOrder);
            }

            // Pagination
            $perPage = $request->get('per_page', 12);
            $galleries = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Gallery retrieved successfully',
                'data' => $galleries->items(),
                'meta' => [
                    'current_page' => $galleries->currentPage(),
                    'last_page' => $galleries->lastPage(),
                    'per_page' => $galleries->perPage(),
                    'total' => $galleries->total(),
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve gallery',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single gallery image
     * GET /api/v1/gallery/{slug}
     */
    public function show($slug)
    {
        try {
            $gallery = Gallery::with('category')
                ->where('slug', $slug)
                ->published()
                ->firstOrFail();

            // Increment views
            $gallery->incrementViews();

            return response()->json([
                'success' => true,
                'message' => 'Gallery item retrieved successfully',
                'data' => $gallery
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gallery item not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Get featured gallery images
     * GET /api/v1/gallery/featured
     */
    public function featured(Request $request)
    {
        try {
            $limit = $request->get('limit', 6);
            
            $galleries = Gallery::with('category')
                ->published()
                ->featured()
                ->ordered()
                ->limit($limit)
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Featured gallery retrieved successfully',
                'data' => $galleries
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve featured gallery',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ==================== ADMIN ROUTES ====================
     */

    /**
     * Get all gallery images (Admin)
     * GET /api/v1/admin/gallery
     */
    public function adminIndex(Request $request)
    {
        try {
            $query = Gallery::with('category');

            // Filter by category
            if ($request->has('category_id')) {
                $query->where('category_id', $request->category_id);
            }

            // Filter by published status
            if ($request->has('is_published')) {
                $query->where('is_published', $request->is_published);
            }

            // Search
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('caption', 'like', "%{$search}%");
                });
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $galleries = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Gallery retrieved successfully',
                'data' => $galleries->items(),
                'meta' => [
                    'current_page' => $galleries->currentPage(),
                    'last_page' => $galleries->lastPage(),
                    'per_page' => $galleries->perPage(),
                    'total' => $galleries->total(),
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve gallery',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload gallery image (Admin)
     * POST /api/v1/admin/gallery
     */
    public function store(Request $request)
    {
        $validator = Validator:: make($request->all(), [
            'category_id' => 'required|exists:gallery_categories,id',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:gallery,slug',
            'caption' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max
            'alt_text' => 'nullable|string|max:255',
            'taken_date' => 'nullable|date',
            'photographer' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'order' => 'nullable|integer',
            'is_featured' => 'nullable|boolean',
            'is_published' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->except('image');

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                
                // Compress image before storing
                $image = $this->imageCompressionService->compress($image, maxWidth: 2000, quality: 80);
                
                // Generate unique filename
                $filename = time() .'_' .Str::random(10) .'.' .$image->getClientOriginalExtension();
                
                // Store original image
                $imagePath = $image->storeAs('gallery', $filename, 'public');
                
                // Create thumbnail
                $thumbnailPath = $this->createThumbnail($image, $filename);
                
                // Get image dimensions
                $imageSize = getimagesize($image->getRealPath());
                
                $data['image_path'] = $imagePath;
                $data['thumbnail_path'] = $thumbnailPath;
                $data['file_size'] = $image->getSize();
                $data['mime_type'] = $image->getMimeType();
                $data['width'] = $imageSize[0] ?? null;
                $data['height'] = $imageSize[1] ??  null;
            }

            $gallery = Gallery:: create($data);

            return response()->json([
                'success' => true,
                'message' => 'Gallery image uploaded successfully',
                'data' => $gallery->load('category')
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload image',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Batch upload gallery images (Admin)
     * POST /api/v1/admin/gallery/batch-upload
     */
    public function batchUpload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category_id' => 'required|exists:gallery_categories,id',
            'images' => 'required|array|min:1|max:20',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            'is_published' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $uploadedImages = [];
            $errors = [];

            foreach ($request->file('images') as $index => $image) {
                try {
                    // Compress image before storing
                    $image = $this->imageCompressionService->compress($image, maxWidth: 2000, quality: 80);
                    
                    // Generate unique filename
                    $filename = time() .'_' .Str::random(10) .'.' .$image->getClientOriginalExtension();
                    
                    // Store original image
                    $imagePath = $image->storeAs('gallery', $filename, 'public');
                    
                    // Create thumbnail
                    $thumbnailPath = $this->createThumbnail($image, $filename);
                    
                    // Get image dimensions
                    $imageSize = getimagesize($image->getRealPath());
                    
                    // Create gallery record
                    $gallery = Gallery:: create([
                        'category_id' => $request->category_id,
                        'title' => 'Image ' .($index + 1),
                        'image_path' => $imagePath,
                        'thumbnail_path' => $thumbnailPath,
                        'file_size' => $image->getSize(),
                        'mime_type' => $image->getMimeType(),
                        'width' => $imageSize[0] ?? null,
                        'height' => $imageSize[1] ?? null,
                        'is_published' => $request->get('is_published', true),
                    ]);

                    $uploadedImages[] = $gallery;

                } catch (\Exception $e) {
                    $errors[] = "Image {$index}:  " .$e->getMessage();
                }
            }

            return response()->json([
                'success' => true,
                'message' => count($uploadedImages) .' images uploaded successfully',
                'data' => $uploadedImages,
                'errors' => $errors
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload images',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update gallery image (Admin)
     * PUT /api/v1/admin/gallery/{id}
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'category_id' => 'required|exists:gallery_categories,id',
            'title' => 'required|string|max: 255',
            'slug' => 'nullable|string|max: 255|unique:gallery,slug,' .$id,
            'caption' => 'nullable|string',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'alt_text' => 'nullable|string|max: 255',
            'taken_date' => 'nullable|date',
            'photographer' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'order' => 'nullable|integer',
            'is_featured' => 'nullable|boolean',
            'is_published' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $gallery = Gallery::findOrFail($id);
            $data = $request->except('image');

            // Handle new image upload
            if ($request->hasFile('image')) {
                // Delete old images
                if ($gallery->image_path && Storage::disk('public')->exists($gallery->image_path)) {
                    Storage::disk('public')->delete($gallery->image_path);
                }
                if ($gallery->thumbnail_path && Storage::disk('public')->exists($gallery->thumbnail_path)) {
                    Storage::disk('public')->delete($gallery->thumbnail_path);
                }

                $image = $request->file('image');
                $filename = time() .'_' .Str::random(10) .'.' .$image->getClientOriginalExtension();
                
                $imagePath = $image->storeAs('gallery', $filename, 'public');
                $thumbnailPath = $this->createThumbnail($image, $filename);
                $imageSize = getimagesize($image->getRealPath());
                
                $data['image_path'] = $imagePath;
                $data['thumbnail_path'] = $thumbnailPath;
                $data['file_size'] = $image->getSize();
                $data['mime_type'] = $image->getMimeType();
                $data['width'] = $imageSize[0] ?? null;
                $data['height'] = $imageSize[1] ?? null;
            }

            $gallery->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Gallery image updated successfully',
                'data' => $gallery->load('category')
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update image',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete gallery image (Admin)
     * DELETE /api/v1/admin/gallery/{id}
     */
    public function destroy($id)
    {
        try {
            $gallery = Gallery::findOrFail($id);
            $gallery->delete();

            return response()->json([
                'success' => true,
                'message' => 'Gallery image deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete image',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk delete gallery images (Admin)
     * POST /api/v1/admin/gallery/bulk-delete
     */
    public function bulkDelete(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array|min:1',
            'ids.*' => 'required|integer|exists:gallery,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $deleted = Gallery::whereIn('id', $request->ids)->delete();

            return response()->json([
                'success' => true,
                'message' => "{$deleted} images deleted successfully"
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete images',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get gallery statistics (Admin)
     * GET /api/v1/admin/gallery/statistics
     */
    public function statistics()
    {
        try {
            $stats = [
                'total' => Gallery::count(),
                'published' => Gallery::published()->count(),
                'unpublished' => Gallery::where('is_published', false)->count(),
                'featured' => Gallery::featured()->count(),
                'total_views' => Gallery::sum('views'),
                'total_size' => Gallery::sum('file_size'),
                'by_category' => Gallery::selectRaw('category_id, COUNT(*) as count')
                    ->with('category: id,name')
                    ->groupBy('category_id')
                    ->get()
                    ->map(function($item) {
                        return [
                            'category' => $item->category?->name ?? 'Uncategorized',
                            'count' => $item->count
                        ];
                    }),
            ];

            return response()->json([
                'success' => true,
                'message' => 'Statistics retrieved successfully',
                'data' => $stats
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create thumbnail using Intervention Image v3
     * @param $image
     * @param $filename
     * @return string|null
     */
    private function createThumbnail($image, $filename)
    {
        try {
            $manager = new ImageManager('gd');
            
            $thumbnailFilename = 'thumb_' .$filename;
            $thumbnailPath = 'gallery/' .$thumbnailFilename;
            
            // Create thumbnail (400x400) using v3 API
            $img = $manager->read($image->getRealPath());
            $img = $img->cover(400, 400);
            
            // Save thumbnail
            Storage::disk('public')->put($thumbnailPath, (string) $img->encode());
            
            return $thumbnailPath;

        } catch (\Exception $e) {
            // If thumbnail creation fails, return original path
            Log::warning('Thumbnail creation failed', ['error' => $e->getMessage()]);
            return null;
        }
    }
}