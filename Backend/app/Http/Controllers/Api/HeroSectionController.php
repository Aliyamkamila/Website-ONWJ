<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeroSection;
use App\Services\ResponseService;
use App\Http\Requests\StoreHeroSectionRequest;
use App\Http\Requests\UpdateHeroSectionRequest;
use App\Http\Requests\ReorderHeroSectionRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class HeroSectionController extends Controller
{
    protected ResponseService $responseService;

    public function __construct(ResponseService $responseService)
    {
        $this->responseService = $responseService;
    }

    /**
     * Get all active hero sections ordered by order
     */
    public function index(): JsonResponse
    {
        try {
            if (! Schema::hasTable('hero_sections')) {
                return $this->responseService->error(
                    message: 'Tabel hero_sections belum tersedia. Jalankan migrasi terlebih dahulu.',
                    code: 500
                );
            }

            $heroSections = HeroSection::active()
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
            if (! Schema::hasTable('hero_sections')) {
                return $this->responseService->error(
                    message: 'Tabel hero_sections belum tersedia. Jalankan migrasi terlebih dahulu.',
                    code: 500
                );
            }

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
     * Reorder hero sections
     */
    public function reorder(ReorderHeroSectionRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            foreach ($validated['items'] as $item) {
                HeroSection::find($item['id'])->update(['order' => $item['order']]);
            }

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
