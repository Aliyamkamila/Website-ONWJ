<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeroSection;
use App\Services\ResponseService;
use App\Services\ImageCompressionService;
use App\Http\Requests\StoreHeroSectionRequest;
use App\Http\Requests\UpdateHeroSectionRequest;
use App\Http\Requests\ReorderHeroSectionRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class HeroSectionController extends Controller
{
    protected ResponseService $responseService;
    protected ImageCompressionService $imageCompressionService;

    public function __construct(ResponseService $responseService, ImageCompressionService $imageCompressionService)
    {
        $this->responseService = $responseService;
        $this->imageCompressionService = $imageCompressionService;
    }

    /**
     * Admin: list all hero sections (including inactive)
     */
    public function adminIndex(): JsonResponse
    {
        // Reuse admin listing shape from getAll()
        return $this->getAll();
    }

    /**
     * Admin: get single hero section detail
     */
    public function show($id): JsonResponse
    {
        try {
            $item = HeroSection::findOrFail($id);

            $data = [
                'id' => $item->id,
                'type' => $item->type,
                'src' => $item->src,
                'full_src' => $item->getFullSrcAttribute(),
                'duration' => $item->duration,
                'label' => $item->label,
                'title' => $item->title,
                'description' => $item->description,
                'order' => $item->order,
                'is_active' => $item->is_active,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ];

            return $this->responseService->success(
                data: $data,
                message: 'Hero section retrieved successfully',
                code: 200
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->responseService->error(
                message: 'Hero section not found',
                code: 404
            );
        } catch (\Exception $e) {
            Log::error('Failed to retrieve hero section', [
                'hero_section_id' => $id,
                'error' => $e->getMessage(),
            ]);

            return $this->responseService->error(
                message: 'Failed to retrieve hero section',
                code: 500
            );
        }
    }

    /**
     * Get all active hero sections ordered by order
     */
    public function index(): JsonResponse
    {
        try {
            // Assumes table exists in normal operation; avoids costly schema checks per request

            // Cache forever with explicit invalidation on mutations
            $heroSections = Cache::rememberForever('hero_sections:index', function () {
                return HeroSection::active()
                    ->ordered()
                    ->get()
                    ->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'type' => $item->type,
                            'src' => $item->getFullSrcAttribute(),
                            'duration' => $item->duration,
                            'label' => $item->label,
                            'title' => $item->title,
                            'description' => $item->description,
                            'order' => $item->order,
                        ];
                    });
            });

            return $this->responseService->success(
                data: $heroSections,
                message: 'Hero sections retrieved successfully',
                code: 200
            );
        } catch (\Exception $e) {
            Log::error('Failed to retrieve hero sections', [
                'error' => $e->getMessage(),
            ]);

            return $this->responseService->error(
                message: 'Failed to retrieve hero sections',
                code: 500
            );
        }
    }

    /**
     * Get all hero sections (including inactive) - Admin only
     */
    public function getAll(): JsonResponse
    {
        try {
            // Assumes table exists in normal operation; avoids costly schema checks per request

            $heroSections = HeroSection::ordered()
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'type' => $item->type,
                        'src' => $item->src,
                        'duration' => $item->duration,
                        'label' => $item->label,
                        'title' => $item->title,
                        'description' => $item->description,
                        'order' => $item->order,
                        'is_active' => $item->is_active,
                        'created_at' => $item->created_at,
                        'updated_at' => $item->updated_at,
                    ];
                });

            return $this->responseService->success(
                data: $heroSections,
                message: 'All hero sections retrieved successfully',
                code: 200
            );
        } catch (\Exception $e) {
            Log::error('Failed to retrieve admin hero sections', [
                'error' => $e->getMessage(),
            ]);

            return $this->responseService->error(
                message: 'Failed to retrieve hero sections',
                code: 500
            );
        }
    }

    /**
     * Create a new hero section
     */
    public function store(StoreHeroSectionRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            if (! isset($validated['order'])) {
                $currentMax = HeroSection::max('order');
                $validated['order'] = ($currentMax === null ? -1 : $currentMax) + 1;
            }

            $heroSection = HeroSection::create($validated);

            // Clear cache so new hero section appears immediately
            Cache::forget('hero_sections:index');

            return $this->responseService->success(
                data: $heroSection,
                message: 'Hero section created successfully',
                code: 201
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->responseService->error(
                message: 'Validation failed',
                errors: $e->errors(),
                code: 422
            );
        } catch (\Exception $e) {
            Log::error('Failed to create hero section', [
                'error' => $e->getMessage(),
            ]);

            return $this->responseService->error(
                message: 'Failed to create hero section',
                code: 500
            );
        }
    }

    /**
     * Update a hero section
     */
    public function update(UpdateHeroSectionRequest $request, HeroSection $heroSection): JsonResponse
    {
        try {
            $validated = $request->validated();

            $heroSection->update($validated);

            // Clear cache so updated hero section appears immediately
            Cache::forget('hero_sections:index');

            return $this->responseService->success(
                data: $heroSection,
                message: 'Hero section updated successfully',
                code: 200
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->responseService->error(
                message: 'Validation failed',
                errors: $e->errors(),
                code: 422
            );
        } catch (\Exception $e) {
            Log::error('Failed to update hero section', [
                'hero_section_id' => $heroSection->id,
                'error' => $e->getMessage(),
            ]);

            return $this->responseService->error(
                message: 'Failed to update hero section',
                code: 500
            );
        }
    }

    /**
     * Delete a hero section
     */
    public function destroy(HeroSection $heroSection): JsonResponse
    {
        try {
            $heroSection->delete();

            // Clear cache so deleted hero section disappears immediately
            Cache::forget('hero_sections:index');

            return $this->responseService->success(
                message: 'Hero section deleted successfully',
                code: 200
            );
        } catch (\Exception $e) {
            Log::error('Failed to delete hero section', [
                'hero_section_id' => $heroSection->id,
                'error' => $e->getMessage(),
            ]);

            return $this->responseService->error(
                message: 'Failed to delete hero section',
                code: 500
            );
        }
    }

    /**
     * Toggle active status (admin)
     */
    public function toggleActive($id): JsonResponse
    {
        try {
            $item = HeroSection::findOrFail($id);
            $item->is_active = ! $item->is_active;
            $item->save();

            // Clear cache so changes are reflected in public index
            Cache::forget('hero_sections:index');

            return $this->responseService->success(
                data: [
                    'id' => $item->id,
                    'is_active' => $item->is_active,
                ],
                message: 'Hero section status updated',
                code: 200
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->responseService->error(
                message: 'Hero section not found',
                code: 404
            );
        } catch (\Exception $e) {
            Log::error('Failed to toggle hero section status', [
                'hero_section_id' => $id,
                'error' => $e->getMessage(),
            ]);

            return $this->responseService->error(
                message: 'Failed to toggle status',
                code: 500
            );
        }
    }

    /**
     * Reorder hero sections
     */
    public function reorder(ReorderHeroSectionRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            foreach ($validated['items'] as $item) {
                HeroSection::find($item['id'])->update(['order' => $item['order']]);
            }

            // Clear cache so reordered hero sections appear immediately
            Cache::forget('hero_sections:index');

            return $this->responseService->success(
                message: 'Hero sections reordered successfully',
                code: 200
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->responseService->error(
                message: 'Validation failed',
                errors: $e->errors(),
                code: 422
            );
        } catch (\Exception $e) {
            Log::error('Failed to reorder hero sections', [
                'error' => $e->getMessage(),
            ]);

            return $this->responseService->error(
                message: 'Failed to reorder hero sections',
                code: 500
            );
        }
    }

    /**
     * Upload hero media file (image or video)
     */
    public function uploadMedia(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:jpeg,png,jpg,webp,svg,mp4,webm,ogg|max:51200', // max 50MB
            'type' => 'required|in:image,video',
        ]);

        if ($validator->fails()) {
            return $this->responseService->error(
                message: 'Validation error',
                errors: $validator->errors(),
                code: 422
            );
        }

        try {
            $file = $request->file('file');
            $type = $request->type;
            
            // Compress images before storing
            if ($type === 'image') {
                $file = $this->imageCompressionService->compress($file, maxWidth: 2000, quality: 80);
            }
            
            // Generate filename
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            
            // Store file
            $path = $file->storeAs('hero-sections/' . $type . 's', $filename, 'public');

            return $this->responseService->success(
                data: [
                    'path' => $path,
                    'url' => Storage::url($path),
                    'type' => $type,
                ],
                message: 'Media uploaded successfully',
                code: 200
            );
        } catch (\Exception $e) {
            Log::error('Failed to upload hero media', [
                'error' => $e->getMessage(),
            ]);

            return $this->responseService->error(
                message: 'Failed to upload media',
                code: 500
            );
        }
    }

    /**
     * Delete hero media file
     */
    public function deleteMedia(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'path' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->responseService->error(
                message: 'Validation error',
                errors: $validator->errors(),
                code: 422
            );
        }

        try {
            $path = $request->path;
            
            // Only delete if it's a storage path (not external URL)
            if (!str_starts_with($path, 'http') && Storage::exists($path)) {
                Storage::delete($path);
            }

            return $this->responseService->success(
                message: 'Media deleted successfully',
                code: 200
            );
        } catch (\Exception $e) {
            Log::error('Failed to delete hero media', [
                'error' => $e->getMessage(),
                'path' => $request->path,
            ]);

            return $this->responseService->error(
                message: 'Failed to delete media',
                code: 500
            );
        }
    }
}
