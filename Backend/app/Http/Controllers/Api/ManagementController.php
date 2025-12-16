<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Management;
use App\Services\ResponseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ManagementController extends Controller
{
    protected $responseService;

    public function __construct(ResponseService $responseService)
    {
        $this->responseService = $responseService;
    }

    /**
     * Get all active management data (Public)
     */
    public function index()
    {
        try {
            $managements = Management::active()
                ->ordered()
                ->get()
                ->map(function ($item) {
                    return $this->transformManagement($item);
                });

            return $this->responseService->success(
                $managements,
                'Data manajemen retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->responseService->error(
                'Error retrieving management data: ' . $e->getMessage(),
                null,
                500
            );
        }
    }

    /**
     * Get management by type (Public)
     */
    public function getByType($type)
    {
        try {
            $validTypes = ['director', 'commissioner', 'organizational_structure'];
            
            if (!in_array($type, $validTypes)) {
                return $this->responseService->error(
                    'Invalid management type',
                    null,
                    422
                );
            }

            $managements = Management::active()
                ->byType($type)
                ->ordered()
                ->get()
                ->map(function ($item) {
                    return $this->transformManagement($item);
                });

            return $this->responseService->success(
                $managements,
                "Data {$type} retrieved successfully"
            );
        } catch (\Exception $e) {
            return $this->responseService->error(
                'Error retrieving management data: ' . $e->getMessage(),
                null,
                500
            );
        }
    }

    /**
     * Admin: Get all management data (including inactive)
     */
    public function adminIndex()
    {
        try {
            $managements = Management::ordered()
                ->get()
                ->map(function ($item) {
                    return $this->transformManagement($item);
                });

            return $this->responseService->success(
                $managements,
                'All management data retrieved'
            );
        } catch (\Exception $e) {
            return $this->responseService->error(
                'Error retrieving management data: ' . $e->getMessage(),
                null,
                500
            );
        }
    }

    /**
     * Admin: Create management
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'type' => 'required|in:director,commissioner,organizational_structure',
                'name' => 'required|string|max:100',
                'position' => 'required|string|max:150',
                'level' => 'nullable|in:board,director,department,division',
                'description' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
                'order' => 'nullable|integer|min:0',
                'is_active' => 'nullable|boolean',
            ]);

            // Handle image upload
            $imagePath = null;
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $imagePath = $file->store('management', 'public');
            }

            $management = Management::create([
                'type' => $validated['type'],
                'name' => $validated['name'],
                'position' => $validated['position'],
                'level' => $validated['level'] ?? null,
                'description' => $validated['description'] ?? null,
                'image_path' => $imagePath,
                'order' => $validated['order'] ?? 0,
                'is_active' => $validated['is_active'] ?? true,
            ]);

            return $this->responseService->success(
                $this->transformManagement($management),
                'Management data created successfully',
                201
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->responseService->error(
                'Validation failed',
                $e->errors(),
                422
            );
        } catch (\Exception $e) {
            return $this->responseService->error(
                'Error creating management: ' . $e->getMessage(),
                null,
                500
            );
        }
    }

    /**
     * Admin: Get single management
     */
    public function show($id)
    {
        try {
            $management = Management::findOrFail($id);

            return $this->responseService->success(
                $this->transformManagement($management),
                'Management data retrieved successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->responseService->error(
                'Management not found',
                null,
                404
            );
        } catch (\Exception $e) {
            return $this->responseService->error(
                'Error retrieving management: ' . $e->getMessage(),
                null,
                500
            );
        }
    }

    /**
     * Admin: Update management
     */
    public function update(Request $request, $id)
    {
        try {
            $management = Management::findOrFail($id);

            $validated = $request->validate([
                'type' => 'sometimes|required|in:director,commissioner,organizational_structure',
                'name' => 'sometimes|required|string|max:100',
                'position' => 'sometimes|required|string|max:150',
                'level' => 'nullable|in:board,director,department,division',
                'description' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
                'order' => 'nullable|integer|min:0',
                'is_active' => 'nullable|boolean',
            ]);

            // Handle image replacement
            if ($request->hasFile('image')) {
                // Delete old image
                if ($management->image_path) {
                    Storage::disk('public')->delete($management->image_path);
                }
                // Upload new image
                $file = $request->file('image');
                $validated['image_path'] = $file->store('management', 'public');
            }

            $management->update($validated);

            return $this->responseService->success(
                $this->transformManagement($management),
                'Management data updated successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->responseService->error(
                'Management not found',
                null,
                404
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->responseService->error(
                'Validation failed',
                $e->errors(),
                422
            );
        } catch (\Exception $e) {
            return $this->responseService->error(
                'Error updating management: ' . $e->getMessage(),
                null,
                500
            );
        }
    }

    /**
     * Admin: Delete management
     */
    public function destroy($id)
    {
        try {
            $management = Management::findOrFail($id);

            // Delete image if exists
            if ($management->image_path) {
                Storage::disk('public')->delete($management->image_path);
            }

            $management->delete();

            return $this->responseService->success(
                null,
                'Management data deleted successfully',
                200
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->responseService->error(
                'Management not found',
                null,
                404
            );
        } catch (\Exception $e) {
            return $this->responseService->error(
                'Error deleting management: ' . $e->getMessage(),
                null,
                500
            );
        }
    }

    /**
     * Transform Management data for API response
     */
    private function transformManagement(Management $management): array
    {
        return [
            'id' => $management->id,
            'type' => $management->type,
            'name' => $management->name,
            'position' => $management->position,
            'level' => $management->level,
            'description' => $management->description,
            'image_path' => $management->image_path,
            'image_url' => $management->image_url,
            'order' => $management->order,
            'is_active' => $management->is_active,
            'created_at' => $management->created_at->toIso8601String(),
            'updated_at' => $management->updated_at->toIso8601String(),
        ];
    }
}
