<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WkTekkom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class WkTekkomController extends Controller
{
    /**
     * Get all TEKKOM areas for public display
     */
    public function index(Request $request)
    {
        try {
            $query = WkTekkom::active()->ordered();

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            $areas = $query->get()->map(function ($area) {
                return array_merge($area->toArray(), ['category' => 'TEKKOM']);
            });

            return response()->json([
                'success' => true,
                'message' => 'TEKKOM areas retrieved successfully',
                'data' => $areas,
                'meta' => [
                    'total' => $areas->count(),
                    'operasional_count' => WkTekkom::active()->where('status', 'Operasional')->count(),
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve TEKKOM areas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single TEKKOM area detail
     */
    public function show($id)
    {
        try {
            $area = WkTekkom::findOrFail($id);
            $data = array_merge($area->toArray(), ['category' => 'TEKKOM']);

            return response()->json([
                'success' => true,
                'message' => 'TEKKOM area retrieved successfully',
                'data' => $data
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'TEKKOM area not found',
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
                ['value' => 'Operasional', 'label' => 'Operasional'],
                ['value' => 'Non-Operasional', 'label' => 'Non-Operasional'],
            ]
        ], 200);
    }

    /**
     * Convert pixel coordinates to percentage
     */
    public function convertCoordinates(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'x' => 'required|numeric',
            'y' => 'required|numeric',
            'image_width' => 'required|numeric',
            'image_height' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $percentX = ($request->x / $request->image_width) * 100;
        $percentY = ($request->y / $request->image_height) * 100;

        return response()->json([
            'success' => true,
            'data' => [
                'position_x' => round($percentX, 2),
                'position_y' => round($percentY, 2),
            ]
        ], 200);
    }

    /**
     * ==================== ADMIN ROUTES ====================
     */

    /**
     * Get all TEKKOM areas for admin (with filters, search, pagination)
     */
    public function adminIndex(Request $request)
    {
        try {
            $query = WkTekkom::query();

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
                'message' => 'TEKKOM areas retrieved successfully',
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
                'message' => 'Failed to retrieve TEKKOM areas',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store new TEKKOM area
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'area_id' => 'required|string|max:255|unique:wk_tekkom,area_id',
            'name' => 'required|string|max:255',
            'position_x' => 'required|numeric|between:0,100',
            'position_y' => 'required|numeric|between:0,100',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'description' => 'required|string',
            'facilities' => 'nullable|array',
            'production' => 'nullable|string',
            'status' => 'required|in:Operasional,Non-Operasional',
            'wells' => 'nullable|integer|min:0',
            'depth' => 'nullable|string',
            'pressure' => 'nullable|string',
            'temperature' => 'nullable|string',
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

            $area = WkTekkom::create($request->all());

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'TEKKOM area created successfully',
                'data' => $area
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create TEKKOM area',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update TEKKOM area
     */
    public function update(Request $request, $id)
    {
        $area = WkTekkom::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'area_id' => 'required|string|max:255|unique:wk_tekkom,area_id,' .$id,
            'name' => 'required|string|max:255',
            'position_x' => 'required|numeric|between:0,100',
            'position_y' => 'required|numeric|between:0,100',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'description' => 'required|string',
            'facilities' => 'nullable|array',
            'production' => 'nullable|string',
            'status' => 'required|in:Operasional,Non-Operasional',
            'wells' => 'nullable|integer|min:0',
            'depth' => 'nullable|string',
            'pressure' => 'nullable|string',
            'temperature' => 'nullable|string',
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
                'message' => 'TEKKOM area updated successfully',
                'data' => $area->fresh()
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update TEKKOM area',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete TEKKOM area (soft delete)
     */
    public function destroy($id)
    {
        try {
            $area = WkTekkom::findOrFail($id);
            $area->delete();

            return response()->json([
                'success' => true,
                'message' => 'TEKKOM area deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete TEKKOM area',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Restore deleted TEKKOM area
     */
    public function restore($id)
    {
        try {
            $area = WkTekkom::withTrashed()->findOrFail($id);
            $area->restore();

            return response()->json([
                'success' => true,
                'message' => 'TEKKOM area restored successfully',
                'data' => $area
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to restore TEKKOM area',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}