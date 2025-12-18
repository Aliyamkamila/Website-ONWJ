<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\ProgramRepository;
use App\Services\ImageCompressionService;
use App\Jobs\ClearCacheJob;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Program Controller dengan Repository Pattern & Cache Strategy
 * 
 * Features:
 * - Multi-layer caching (Query cache + Response cache)
 * - Repository pattern untuk reusable queries
 * - Async cache invalidation via queues
 * - Proper error handling
 * - Image upload dengan optimization
 */
class ProgramController extends Controller
{
    protected ProgramRepository $programRepository;
    protected ImageCompressionService $imageCompressionService;

    /**
     * Inject ProgramRepository via constructor
     */
    public function __construct(ProgramRepository $programRepository, ImageCompressionService $imageCompressionService)
    {
        $this->programRepository = $programRepository;
        $this->imageCompressionService = $imageCompressionService;
    }

    /**
     * Display a listing of published programs
     * 
     * @return JsonResponse
     * 
     * Cache Strategy:
     * - Response cache: 30 minutes (via middleware)
     * - Query cache:  30 minutes (via repository)
     */
    public function index(): JsonResponse
    {
        try {
            $programs = $this->programRepository->getPublished();

            return response()->json([
                'success' => true,
                'message' => 'Programs retrieved successfully',
                'data' => $programs,
                'meta' => [
                    'total' => $programs->count(),
                    'cached_at' => now()->toIso8601String(),
                    'cache_ttl' => 1800, // 30 minutes
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching programs', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve programs',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Display the specified program by slug
     * 
     * @param string $slug
     * @return JsonResponse
     */
    public function show(string $slug): JsonResponse
    {
        try {
            $program = $this->programRepository->findBySlug($slug);

            if (! $program) {
                return response()->json([
                    'success' => false,
                    'message' => 'Program not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Program retrieved successfully',
                'data' => $program
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching program', [
                'slug' => $slug,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve program',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get programs by category
     * 
     * @param int $categoryId
     * @return JsonResponse
     */
    public function byCategory(int $categoryId): JsonResponse
    {
        try {
            $programs = $this->programRepository->getByCategory($categoryId);

            return response()->json([
                'success' => true,
                'message' => 'Programs retrieved successfully',
                'data' => $programs,
                'meta' => [
                    'category_id' => $categoryId,
                    'total' => $programs->count(),
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching programs by category', [
                'category_id' => $categoryId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve programs',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Get program statistics
     * 
     * @return JsonResponse
     * 
     * Cache:  2 hours (statistics change infrequently)
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = $this->programRepository->getStatistics();

            return response()->json([
                'success' => true,
                'message' => 'Statistics retrieved successfully',
                'data' => $stats,
                'meta' => [
                    'generated_at' => now()->toIso8601String(),
                    'cache_ttl' => 7200, // 2 hours
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching program statistics', [
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
     * Store a newly created program (Admin only)
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
                'slug' => 'nullable|string|unique:programs,slug',
                'description' => 'required|string',
                'content' => 'nullable|string',
                'category_id' => 'required|integer|exists:categories,id',
                'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120', // 5MB max
                'is_published' => 'boolean',
                'featured' => 'boolean',
                'meta_title' => 'nullable|string|max:255',
                'meta_description' => 'nullable|string|max:500',
            ]);

            // Auto-generate slug if not provided
            if (empty($validated['slug'])) {
                $validated['slug'] = Str::slug($validated['title']);
                
                // Ensure unique slug
                $originalSlug = $validated['slug'];
                $counter = 1;
                while (\App\Models\Program::where('slug', $validated['slug'])->exists()) {
                    $validated['slug'] = $originalSlug .'-' .$counter;
                    $counter++;
                }
            }

            // Handle image upload
            if ($request->hasFile('image')) {
                $imageFile = $request->file('image');
                $imageFile = $this->imageCompressionService->compress($imageFile, maxWidth: 2000, quality: 80);
                
                $imagePath = $imageFile->store('programs', 'public');
                $validated['image'] = $imagePath;

                // Dispatch async image optimization job
                \App\Jobs\ProcessImageOptimization::dispatch($imagePath);
            }

            // Set defaults
            $validated['is_published'] = $validated['is_published'] ?? false;
            $validated['featured'] = $validated['featured'] ?? false;

            // Create via repository (auto cache invalidation)
            $program = $this->programRepository->create($validated);

            // Dispatch async cache clearing for public endpoints
            ClearCacheJob::dispatch(['programs', 'public']);

            return response()->json([
                'success' => true,
                'message' => 'Program created successfully',
                'data' => $program
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            Log:: error('Error creating program', [
                'error' => $e->getMessage(),
                'data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create program',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Update the specified program (Admin only)
     * 
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        try {
            // Validation
            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'slug' => 'sometimes|string|unique:programs,slug,' .$id,
                'description' => 'sometimes|string',
                'content' => 'nullable|string',
                'category_id' => 'sometimes|integer|exists:categories,id',
                'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120',
                'is_published' => 'sometimes|boolean',
                'featured' => 'sometimes|boolean',
                'meta_title' => 'nullable|string|max:255',
                'meta_description' => 'nullable|string|max:500',
            ]);

            // Check if program exists
            $program = \App\Models\Program::find($id);
            if (!$program) {
                return response()->json([
                    'success' => false,
                    'message' => 'Program not found'
                ], 404);
            }

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image
                if ($program->image) {
                    Storage::disk('public')->delete($program->image);
                    
                    // Also delete optimized versions
                    $pathInfo = pathinfo($program->image);
                    $directory = $pathInfo['dirname'];
                    $filename = $pathInfo['filename'];
                    
                    foreach (['thumbnail', 'medium', 'large'] as $size) {
                        $optimizedPath = $directory .'/' .$filename .'_' .$size .'.' .$pathInfo['extension'];
                        Storage::disk('public')->delete($optimizedPath);
                    }
                }

                // Upload new image
                $imageFile = $request->file('image');
                $imageFile = $this->imageCompressionService->compress($imageFile, maxWidth: 2000, quality: 80);
                
                $imagePath = $imageFile->store('programs', 'public');
                $validated['image'] = $imagePath;

                // Dispatch async image optimization
                \App\Jobs\ProcessImageOptimization::dispatch($imagePath);
            }

            // Update via repository (auto cache invalidation)
            $updatedProgram = $this->programRepository->update($id, $validated);

            // Dispatch async cache clearing
            ClearCacheJob::dispatch(['programs', 'public']);

            return response()->json([
                'success' => true,
                'message' => 'Program updated successfully',
                'data' => $updatedProgram
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            Log::error('Error updating program', [
                'id' => $id,
                'error' => $e->getMessage(),
                'data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update program',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Remove the specified program (Admin only)
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            // Check if program exists
            $program = \App\Models\Program:: find($id);
            if (!$program) {
                return response()->json([
                    'success' => false,
                    'message' => 'Program not found'
                ], 404);
            }

            // Delete image if exists
            if ($program->image) {
                Storage::disk('public')->delete($program->image);
                
                // Delete optimized versions
                $pathInfo = pathinfo($program->image);
                $directory = $pathInfo['dirname'];
                $filename = $pathInfo['filename'];
                
                foreach (['thumbnail', 'medium', 'large'] as $size) {
                    $optimizedPath = $directory .'/' .$filename .'_' .$size .'.' .$pathInfo['extension'];
                    Storage::disk('public')->delete($optimizedPath);
                }
            }

            // Delete via repository (auto cache invalidation)
            $deleted = $this->programRepository->delete($id);

            if (! $deleted) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to delete program'
                ], 500);
            }

            // Dispatch async cache clearing
            ClearCacheJob::dispatch(['programs', 'public']);

            return response()->json([
                'success' => true,
                'message' => 'Program deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting program', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete program',
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
            $program = \App\Models\Program::find($id);
            
            if (!$program) {
                return response()->json([
                    'success' => false,
                    'message' => 'Program not found'
                ], 404);
            }

            // Toggle status
            $newStatus = ! $program->is_published;
            $this->programRepository->update($id, ['is_published' => $newStatus]);

            // Dispatch async cache clearing
            ClearCacheJob::dispatch(['programs', 'public']);

            return response()->json([
                'success' => true,
                'message' => 'Program status updated successfully',
                'data' => [
                    'id' => $id,
                    'is_published' => $newStatus
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error toggling program status', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update program status',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }
}