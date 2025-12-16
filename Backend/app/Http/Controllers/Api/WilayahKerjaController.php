<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WkTekkom;
use App\Models\WkTjsl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class WilayahKerjaController extends Controller
{
    /**
     * Get all Wilayah Kerja (Combined TEKKOM & TJSL)
     * URL: GET /api/v1/wilayah-kerja
     * Query params: ? category=TEKKOM|TJSL, ?status=... 
     */
    public function index(Request $request)
    {
        try {
            $allAreas = collect();

            // Get TEKKOM if no category filter or category=TEKKOM
            if (! $request->has('category') || strtoupper($request->category) === 'TEKKOM') {
                $tekkomQuery = WkTekkom::active()->ordered();
                if ($request->has('status')) {
                    $tekkomQuery->where('status', $request->status);
                }
                $tekkom = $tekkomQuery->get()->map(function ($area) {
                    return array_merge($area->toArray(), ['category' => 'TEKKOM']);
                });
                $allAreas = $allAreas->merge($tekkom);
            }

            // Get TJSL if no category filter or category=TJSL
            if (!$request->has('category') || strtoupper($request->category) === 'TJSL') {
                // ✅ Added with('relatedNews')
                $tjslQuery = WkTjsl::with('relatedNews')->active()->ordered();
                if ($request->has('status')) {
                    $tjslQuery->where('status', $request->status);
                }
                $tjsl = $tjslQuery->get()->map(function ($area) {
                    return array_merge($area->toArray(), ['category' => 'TJSL']);
                });
                $allAreas = $allAreas->merge($tjsl);
            }

            return response()->json([
                'success' => true,
                'message' => 'Wilayah Kerja retrieved successfully',
                'data' => $allAreas->values(),
                'meta' => [
                    'total' => $allAreas->count(),
                    'tekkom_count' => WkTekkom::active()->count(),
                    'tjsl_count' => WkTjsl::active()->count(),
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve Wilayah Kerja',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single Wilayah Kerja by ID and category
     * URL: GET /api/v1/wilayah-kerja/{id}?category=TEKKOM|TJSL
     */
    public function show(Request $request, $id)
    {
        try {
            $category = strtoupper($request->query('category', 'TEKKOM'));

            if ($category === 'TEKKOM') {
                $area = WkTekkom::findOrFail($id);
            } elseif ($category === 'TJSL') {
                // ✅ Added with('relatedNews')
                $area = WkTjsl::with('relatedNews')->findOrFail($id);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid category.  Use TEKKOM or TJSL'
                ], 400);
            }

            $data = array_merge($area->toArray(), ['category' => $category]);

            return response()->json([
                'success' => true,
                'message' => 'Wilayah Kerja retrieved successfully',
                'data' => $data
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Wilayah Kerja not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Get status options based on category
     * URL: GET /api/v1/wilayah-kerja/status-options? category=TEKKOM|TJSL
     */
    public function statusOptions(Request $request)
    {
        $category = strtoupper($request->query('category', 'TEKKOM'));

        if ($category === 'TEKKOM') {
            $options = [
                ['value' => 'Operasional', 'label' => 'Operasional'],
                ['value' => 'Non-Operasional', 'label' => 'Non-Operasional'],
            ];
        } else {
            $options = [
                ['value' => 'Aktif', 'label' => 'Aktif'],
                ['value' => 'Non-Aktif', 'label' => 'Non-Aktif'],
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $options
        ], 200);
    }

    /**
     * Get statistics
     * URL: GET /api/v1/wilayah-kerja/statistics
     */
    public function statistics()
    {
        try {
            $tekkomStats = [
                'total' => WkTekkom::count(),
                'active' => WkTekkom:: active()->count(),
                'operasional' => WkTekkom::where('status', 'Operasional')->count(),
                'non_operasional' => WkTekkom::where('status', 'Non-Operasional')->count(),
            ];

            $tjslStats = [
                'total' => WkTjsl::count(),
                'active' => WkTjsl::active()->count(),
                'aktif' => WkTjsl::where('status', 'Aktif')->count(),
                'non_aktif' => WkTjsl::where('status', 'Non-Aktif')->count(),
            ];

            return response()->json([
                'success' => true,
                'message' => 'Statistics retrieved successfully',
                'data' => [
                    'tekkom' => $tekkomStats,
                    'tjsl' => $tjslStats,
                    'total_areas' => $tekkomStats['total'] + $tjslStats['total'],
                ]
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
     * Convert pixel coordinates to percentage
     * URL: POST /api/v1/wilayah-kerja/convert-coordinates
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
     * Get all areas for admin (with filters, search, pagination)
     * URL: GET /api/v1/admin/wilayah-kerja? category=TEKKOM|TJSL
     */
    public function adminIndex(Request $request)
    {
        try {
            $category = strtoupper($request->query('category', 'TEKKOM'));

            if ($category === 'TEKKOM') {
                $query = WkTekkom::query();
            } elseif ($category === 'TJSL') {
                // ✅ Added with('relatedNews')
                $query = WkTjsl::with('relatedNews');
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid category. Use TEKKOM or TJSL'
                ], 400);
            }

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

            // Add category to each item
            $data = collect($areas->items())->map(function ($area) use ($category) {
                return array_merge($area->toArray(), ['category' => $category]);
            });

            return response()->json([
                'success' => true,
                'message' => 'Wilayah Kerja retrieved successfully',
                'data' => $data,
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
                'message' => 'Failed to retrieve Wilayah Kerja',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store new area
     * URL: POST /api/v1/admin/wilayah-kerja
     * Body: category=TEKKOM|TJSL + data fields
     */
    public function store(Request $request)
    {
        $category = strtoupper($request->input('category', 'TEKKOM'));

        // Validation rules based on category
        if ($category === 'TEKKOM') {
            $rules = [
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
            ];
        } else {
            $rules = [
                // ✅ FIX: Removed extra space in table name 'wk_tjsl'
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
                // ✅ ADDED: Validation for related_news_id
                'related_news_id' => 'nullable|integer|exists:berita,id', 
            ];
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            if ($category === 'TEKKOM') {
                $area = WkTekkom::create($request->except('category'));
            } else {
                $area = WkTjsl::create($request->except('category'));
            }

            DB::commit();

            $data = array_merge($area->toArray(), ['category' => $category]);

            return response()->json([
                'success' => true,
                'message' => 'Wilayah Kerja created successfully',
                'data' => $data
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create Wilayah Kerja',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update area
     * URL:  PUT /api/v1/admin/wilayah-kerja/{id}? category=TEKKOM|TJSL
     */
    public function update(Request $request, $id)
    {
        $category = strtoupper($request->input('category', $request->query('category', 'TEKKOM')));

        try {
            if ($category === 'TEKKOM') {
                $area = WkTekkom::findOrFail($id);
                $rules = [
                    'area_id' => 'required|string|max:255|unique:wk_tekkom,area_id,' . $id,
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
                ];
            } else {
                $area = WkTjsl::findOrFail($id);
                $rules = [
                    // ✅ FIX: Removed extra space in table name 'wk_tjsl'
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
                    // ✅ ADDED: Validation for related_news_id
                    'related_news_id' => 'nullable|integer|exists:berita,id',
                ];
            }

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            $area->update($request->except('category'));

            DB::commit();

            $data = array_merge($area->fresh()->toArray(), ['category' => $category]);

            return response()->json([
                'success' => true,
                'message' => 'Wilayah Kerja updated successfully',
                'data' => $data
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update Wilayah Kerja',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete area (soft delete)
     * URL: DELETE /api/v1/admin/wilayah-kerja/{id}?category=TEKKOM|TJSL
     */
    public function destroy(Request $request, $id)
    {
        try {
            $category = strtoupper($request->query('category', 'TEKKOM'));

            if ($category === 'TEKKOM') {
                $area = WkTekkom::findOrFail($id);
            } else {
                $area = WkTjsl:: findOrFail($id);
            }

            $area->delete();

            return response()->json([
                'success' => true,
                'message' => 'Wilayah Kerja deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete Wilayah Kerja',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Restore deleted area
     * URL: POST /api/v1/admin/wilayah-kerja/{id}/restore? category=TEKKOM|TJSL
     */
    public function restore(Request $request, $id)
    {
        try {
            $category = strtoupper($request->query('category', 'TEKKOM'));

            if ($category === 'TEKKOM') {
                $area = WkTekkom::withTrashed()->findOrFail($id);
            } else {
                $area = WkTjsl::withTrashed()->findOrFail($id);
            }

            $area->restore();

            $data = array_merge($area->toArray(), ['category' => $category]);

            return response()->json([
                'success' => true,
                'message' => 'Wilayah Kerja restored successfully',
                'data' => $data
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to restore Wilayah Kerja',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}