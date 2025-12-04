<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Umkm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UmkmController extends Controller
{
    /**
     * PUBLIC: Get UMKM for website (with filters, pagination, featured)
     */
    public function index(Request $request)
    {
        try {
            $query = Umkm::query();

            // Filter by category
            if ($request->has('category') && $request->category !== 'Semua') {
                $query->where('category', $request->category);
            }

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Search
            if ($request->has('search') && $request->search) {
                $query->search($request->search);
            }

            // Get featured UMKM (only one)
            $featured = Umkm::featured()->first();

            // Get regular UMKM (exclude featured)
            $umkm = $query->when($featured, function ($q) use ($featured) {
                            return $q->where('id', '!=', $featured->id);
                        })
                        ->ordered()
                        ->paginate($request->per_page ??  12);

            // Get category counts
            $categories = Umkm::getCategoryCounts();

            return response()->json([
                'success' => true,
                'message' => 'UMKM retrieved successfully',
                'data' => [
                    'featured' => $featured,
                    'umkm' => $umkm->items(),
                    'categories' => $categories,
                ],
                'meta' => [
                    'current_page' => $umkm->currentPage(),
                    'last_page' => $umkm->lastPage(),
                    'per_page' => $umkm->perPage(),
                    'total' => $umkm->total(),
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve UMKM',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * PUBLIC: Get single UMKM detail
     */
    public function show($id)
    {
        try {
            $umkm = Umkm::findOrFail($id);
            
            // Increment view count
            $umkm->incrementViews();

            return response()->json([
                'success' => true,
                'message' => 'UMKM detail retrieved successfully',
                'data' => $umkm,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'UMKM not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * ADMIN: Get all UMKM with filters (for management page)
     */
    public function adminIndex(Request $request)
    {
        try {
            $query = Umkm::query();

            // Search
            if ($request->has('search') && $request->search) {
                $query->search($request->search);
            }

            // Filter by category
            if ($request->has('category') && $request->category) {
                $query->where('category', $request->category);
            }

            // Filter by status
            if ($request->has('status') && $request->status) {
                $query->where('status', $request->status);
            }

            // Filter by featured
            if ($request->has('is_featured')) {
                $query->where('is_featured', $request->is_featured);
            }

            // Sorting
            $sortBy = $request->sort_by ?? 'created_at';
            $sortOrder = $request->sort_order ??  'desc';
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->per_page ??  999;
            $umkm = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'UMKM retrieved successfully',
                'data' => $umkm->items(),
                'meta' => [
                    'current_page' => $umkm->currentPage(),
                    'last_page' => $umkm->lastPage(),
                    'per_page' => $umkm->perPage(),
                    'total' => $umkm->total(),
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve UMKM',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ADMIN: Create new UMKM
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'owner' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'description' => 'required|string',
            'testimonial' => 'nullable|string',
            'shop_link' => 'nullable|url',
            'contact_number' => 'nullable|string|max:20',
            'status' => 'required|in:Aktif,Lulus Binaan,Dalam Proses',
            'year_started' => 'required|integer|min:2020|max:' . (date('Y') + 1),
            'achievement' => 'nullable|string',
            'is_featured' => 'nullable|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $data = $request->except('image');

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('umkm', $filename, 'public');
                $data['image_path'] = $path;
            }

            // If this is featured, unset other featured
            if ($request->is_featured) {
                Umkm::where('is_featured', true)->update(['is_featured' => false]);
            }

            $umkm = Umkm::create($data);

            return response()->json([
                'success' => true,
                'message' => 'UMKM created successfully',
                'data' => $umkm,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create UMKM',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ADMIN: Update UMKM
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string',
            'owner' => 'sometimes|required|string|max:255',
            'location' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'testimonial' => 'nullable|string',
            'shop_link' => 'nullable|url',
            'contact_number' => 'nullable|string|max:20',
            'status' => 'sometimes|required|in:Aktif,Lulus Binaan,Dalam Proses',
            'year_started' => 'sometimes|required|integer|min:2020|max:' . (date('Y') + 1),
            'achievement' => 'nullable|string',
            'is_featured' => 'nullable|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $umkm = Umkm::findOrFail($id);
            $data = $request->except('image');

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image
                if ($umkm->image_path && Storage::disk('public')->exists($umkm->image_path)) {
                    Storage::disk('public')->delete($umkm->image_path);
                }

                // Upload new image
                $image = $request->file('image');
                $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('umkm', $filename, 'public');
                $data['image_path'] = $path;
            }

            // If this is featured, unset other featured
            if ($request->has('is_featured') && $request->is_featured) {
                Umkm::where('is_featured', true)
                    ->where('id', '!=', $id)
                    ->update(['is_featured' => false]);
            }

            $umkm->update($data);

            return response()->json([
                'success' => true,
                'message' => 'UMKM updated successfully',
                'data' => $umkm->fresh(),
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update UMKM',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ADMIN: Delete UMKM
     */
    public function destroy($id)
    {
        try {
            $umkm = Umkm::findOrFail($id);
            $umkm->delete(); // Soft delete

            return response()->json([
                'success' => true,
                'message' => 'UMKM deleted successfully',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete UMKM',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get categories for filter
     */
    public function categories()
    {
        try {
            $categories = Umkm::getCategories();

            return response()->json([
                'success' => true,
                'message' => 'Categories retrieved successfully',
                'data' => $categories,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve categories',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get status options
     */
    public function statusOptions()
    {
        return response()->json([
            'success' => true,
            'data' => ['Aktif', 'Lulus Binaan', 'Dalam Proses'],
        ], 200);
    }
}