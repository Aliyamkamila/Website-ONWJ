<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Umkm;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class UmkmController extends Controller
{
    /**
     * Display a listing of UMKM (for public frontend).
     */
    public function index(Request $request): JsonResponse
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

            // Get featured UMKM separately
            $featured = Umkm::featured()->first();

            // Get other UMKM
            $umkm = $query->where('is_featured', false)
                ->orderBy('created_at', 'desc')
                ->get();

            // Get category counts
            $categoryCounts = Umkm::where('is_featured', false)
                ->selectRaw('category, COUNT(*) as count')
                ->groupBy('category')
                ->pluck('count', 'category')
                ->toArray();

            $categoryCounts['all'] = array_sum($categoryCounts);

            return response()->json([
                'success' => true,
                'message' => 'Data UMKM berhasil diambil',
                'data' => [
                    'featured' => $featured,
                    'umkm' => $umkm,
                    'categories' => $categoryCounts,
                    'available_categories' => Umkm::getCategories(),
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data UMKM',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a listing of UMKM (for admin).
     */
    public function adminIndex(): JsonResponse
    {
        try {
            $umkm = Umkm::orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'message' => 'Data UMKM berhasil diambil',
                'data' => $umkm
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data UMKM',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created UMKM.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'category' => 'required|string|in:' . implode(',', Umkm::getCategories()),
                'owner' => 'required|string|max:255',
                'location' => 'required|string|max:255',
                'description' => 'required|string',
                'testimonial' => 'nullable|string',
                'shop_link' => 'nullable|url',
                'contact_number' => 'nullable|string|max:20',
                'status' => 'required|string|in:' . implode(',', Umkm::getStatusOptions()),
                'year_started' => 'required|integer|min:2020|max:2030',
                'achievement' => 'nullable|string|max:255',
                'is_featured' => 'boolean',
                'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Validate featured UMKM must have testimonial
            if ($request->is_featured && empty($request->testimonial)) {
                return response()->json([
                    'success' => false,
                    'message' => 'UMKM Featured harus memiliki testimonial',
                ], 422);
            }

            // Check if there's already a featured UMKM
            if ($request->is_featured) {
                Umkm::where('is_featured', true)->update(['is_featured' => false]);
            }

            $data = $request->except('image');

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '_' . Str::slug($request->name) . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('umkm', $imageName, 'public');
                $data['image_url'] = $imagePath;
            }

            $umkm = Umkm::create($data);

            return response()->json([
                'success' => true,
                'message' => 'UMKM berhasil ditambahkan',
                'data' => $umkm
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan UMKM',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified UMKM.
     */
    public function show($id): JsonResponse
    {
        try {
            $umkm = Umkm::findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Data UMKM berhasil diambil',
                'data' => $umkm
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'UMKM tidak ditemukan',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified UMKM.
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $umkm = Umkm::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'category' => 'required|string|in:' . implode(',', Umkm::getCategories()),
                'owner' => 'required|string|max:255',
                'location' => 'required|string|max:255',
                'description' => 'required|string',
                'testimonial' => 'nullable|string',
                'shop_link' => 'nullable|url',
                'contact_number' => 'nullable|string|max:20',
                'status' => 'required|string|in:' . implode(',', Umkm::getStatusOptions()),
                'year_started' => 'required|integer|min:2020|max:2030',
                'achievement' => 'nullable|string|max:255',
                'is_featured' => 'boolean',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Validate featured UMKM must have testimonial
            if ($request->is_featured && empty($request->testimonial)) {
                return response()->json([
                    'success' => false,
                    'message' => 'UMKM Featured harus memiliki testimonial',
                ], 422);
            }

            // Check if there's already a featured UMKM
            if ($request->is_featured && !$umkm->is_featured) {
                Umkm::where('is_featured', true)->update(['is_featured' => false]);
            }

            $data = $request->except('image');

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image
                if ($umkm->image_url && Storage::disk('public')->exists($umkm->image_url)) {
                    Storage::disk('public')->delete($umkm->image_url);
                }

                $image = $request->file('image');
                $imageName = time() . '_' . Str::slug($request->name) . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('umkm', $imageName, 'public');
                $data['image_url'] = $imagePath;
            }

            $umkm->update($data);

            return response()->json([
                'success' => true,
                'message' => 'UMKM berhasil diupdate',
                'data' => $umkm
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate UMKM',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified UMKM.
     */
    public function destroy($id): JsonResponse
    {
        try {
            $umkm = Umkm::findOrFail($id);

            // Delete image
            if ($umkm->image_url && Storage::disk('public')->exists($umkm->image_url)) {
                Storage::disk('public')->delete($umkm->image_url);
            }

            $umkm->delete();

            return response()->json([
                'success' => true,
                'message' => 'UMKM berhasil dihapus'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus UMKM',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get categories list.
     */
    public function categories(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Umkm::getCategories()
        ], 200);
    }

    /**
     * Get status options list.
     */
    public function statusOptions(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Umkm::getStatusOptions()
        ], 200);
    }
}