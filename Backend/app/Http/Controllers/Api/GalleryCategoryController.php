<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GalleryCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GalleryCategoryController extends Controller
{
    /**
     * ==================== PUBLIC ====================
     */

    /**
     * Get all categories
     * GET /api/v1/gallery-categories
     */
    public function index(Request $request)
    {
        try {
            $query = GalleryCategory::query();

            // Default: hanya active
            if (! $request->has('include_inactive')) {
                $query->where('is_active', true);
            }

            $categories = $query
                ->withCount('galleries')
                ->orderBy('order')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Categories retrieved successfully',
                'data' => $categories
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single category by slug
     * GET /api/v1/gallery-categories/{slug}
     */
    public function show($slug)
    {
        try {
            $category = GalleryCategory::where('slug', $slug)
                ->withCount('galleries')
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'message' => 'Category retrieved successfully',
                'data' => $category
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * ==================== ADMIN ====================
     */

    /**
     * Create category
     * POST /api/v1/admin/gallery-categories
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'        => 'required|string|max:255',
            'slug'        => 'nullable|string|max:255|unique:gallery_categories,slug',
            'description' => 'nullable|string',
            'icon'        => 'nullable|string|max:100',
            'order'       => 'nullable|integer',
            'is_active'   => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            $category = GalleryCategory::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Category created successfully',
                'data'    => $category
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create category',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update category
     * PUT /api/v1/admin/gallery-categories/{id}
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name'        => 'required|string|max:255',
            'slug'        => 'nullable|string|max:255|unique:gallery_categories,slug,' . $id,
            'description' => 'nullable|string',
            'icon'        => 'nullable|string|max:100',
            'order'       => 'nullable|integer',
            'is_active'   => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            $category = GalleryCategory::findOrFail($id);
            $category->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Category updated successfully',
                'data'    => $category
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update category',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete category
     * DELETE /api/v1/admin/gallery-categories/{id}
     */
    public function destroy($id)
    {
        try {
            $category = GalleryCategory::findOrFail($id);
            $galleryCount = $category->galleries()->count();

            if ($galleryCount > 0) {
                return response()->json([
                    'success'        => false,
                    'message'        => 'Cannot delete category with existing galleries',
                    'gallery_count' => $galleryCount
                ], 422);
            }

            $category->delete();

            return response()->json([
                'success' => true,
                'message' => 'Category deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete category',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
