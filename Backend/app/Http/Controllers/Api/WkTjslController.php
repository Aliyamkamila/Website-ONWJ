<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WkTjsl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class WkTjslController extends Controller
{
    /**
     * Get all TJSL areas for public display
     */
    public function index(Request $request)
    {
        try {
            $query = WkTjsl::active()->ordered();

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            $areas = $query->get()->map(function ($area) {
                return array_merge($area->toArray(), ['category' => 'TJSL']);
            });

            return response()->json([
                'success' => true,
                'message' => 'TJSL areas retrieved successfully',
                'data' => $areas,
                'meta' => [
                    'total' => $areas->count(),
                    'aktif_count' => WkTjsl::active()->where('status', 'Aktif')->count(),
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve TJSL areas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single TJSL area detail
     */
    public function show($id)
    {
        try {
            $area = WkTjsl::findOrFail($id);
            $data = array_merge($area->toArray(), ['category' => 'TJSL']);

            return response()->json([
                'success' => true,
                'message' => 'TJSL area retrieved successfully',
                'data' => $data
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'TJSL area not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Get status options
     */
    public function statusOptions()
    {
        return response()->json([
            'success' => true,
            'data' => [
                ['value' => 'Aktif', 'label' => 'Aktif'],
                ['value' => 'Non-Aktif', 'label' => 'Non-Aktif'],
            ]
        ], 200);
    }

    /**
     * ==================== ADMIN ROUTES ====================
     */

    /**
     * Get all TJSL areas for admin (with filters, search, pagination)
     */
    public function adminIndex(Request $request)
    {
        try {
            $query = WkTjsl::query();

            // Search
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('area_id', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            // Filter by status
            if ($request->has('status') && $request->status) {
                $query->where('status', $request->status);
            }

            // Filter by active status
            if ($request->has('is_active')) {
                $query->where('is_active', $request->is_active);
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'order');
            $sortOrder = $request->get('sort_order', 'asc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $areas = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'TJSL areas retrieved successfully',
                'data' => $areas->items(),
                'meta' => [
                    'current_page' => $areas->currentPage(),
                    'last_page' => $areas->lastPage(),
                    'per_page' => $areas->perPage(),
                    'total' => $areas->total(),
                    'from' => $areas->firstItem(),
                    'to' => $areas->lastItem(),
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve TJSL areas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store new TJSL area
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'area_id' => 'required|string|max:255|unique:wk_tjsl,area_id',
            'name' => 'required|string|max:255',
            'position_x' => 'required|numeric|between:0,100',
            'position_y' => 'required|numeric|between:0,100',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'description' => 'required|string',
            'programs' => 'nullable|array',
            'status' => 'required|in:Aktif,Non-Aktif',
            'beneficiaries' => 'nullable|string',
            'budget' => 'nullable|string',
            'duration' => 'nullable|string',
            'impact' => 'nullable|string',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $area = WkTjsl::create($request->all());

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'TJSL area created successfully',
                'data' => $area
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create TJSL area',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update TJSL area
     */
    public function update(Request $request, $id)
    {
        $area = WkTjsl::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'area_id' => 'required|string|max:255|unique:wk_tjsl,area_id,' . $id,
            'name' => 'required|string|max:255',
            'position_x' => 'required|numeric|between:0,100',
            'position_y' => 'required|numeric|between:0,100',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'description' => 'required|string',
            'programs' => 'nullable|array',
            'status' => 'required|in:Aktif,Non-Aktif',
            'beneficiaries' => 'nullable|string',
            'budget' => 'nullable|string',
            'duration' => 'nullable|string',
            'impact' => 'nullable|string',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $area->update($request->all());

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'TJSL area updated successfully',
                'data' => $area->fresh()
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update TJSL area',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete TJSL area (soft delete)
     */
    public function destroy($id)
    {
        try {
            $area = WkTjsl::findOrFail($id);
            $area->delete();

            return response()->json([
                'success' => true,
                'message' => 'TJSL area deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete TJSL area',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Restore deleted TJSL area
     */
    public function restore($id)
    {
        try {
            $area = WkTjsl::withTrashed()->findOrFail($id);
            $area->restore();

            return response()->json([
                'success' => true,
                'message' => 'TJSL area restored successfully',
                'data' => $area
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to restore TJSL area',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}