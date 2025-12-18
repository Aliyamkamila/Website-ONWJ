<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TestimonialController extends Controller
{
    // ===== PUBLIC ROUTES (untuk website visitor) =====

    /**
     * Get testimonials for AllProgramsPage.jsx
     * Returns paginated testimonials with filters
     */
    public function index(Request $request)
    {
        try {
            $query = Testimonial::published();

            // Filter by program
            if ($request->filled('program')) {
                $query->byProgram($request->program);
            }

            // Search
            if ($request->filled('search')) {
                $query->search($request->search);
            }

            // Sorting
            $query->ordered();

            // Pagination
            $perPage = $request->input('per_page', 6);
            $testimonials = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Testimonials retrieved successfully',
                'data' => $testimonials->items(),
                'meta' => [
                    'current_page' => $testimonials->currentPage(),
                    'last_page' => $testimonials->lastPage(),
                    'per_page' => $testimonials->perPage(),
                    'total' => $testimonials->total(),
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve testimonials',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get featured testimonials (for homepage/highlights)
     */
    public function getFeatured(Request $request)
    {
        try {
            $limit = $request->input('limit', 3);
            
            $testimonials = Testimonial::published()
                                      ->featured()
                                      ->ordered()
                                      ->limit($limit)
                                      ->get();

            return response()->json([
                'success' => true,
                'message' => 'Featured testimonials retrieved successfully',
                'data' => $testimonials,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve featured testimonials',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get testimonials by program
     */
    public function getByProgram(Request $request, $program)
    {
        try {
            $perPage = $request->input('per_page', 6);
            
            $testimonials = Testimonial::published()
                                      ->byProgram($program)
                                      ->ordered()
                                      ->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Testimonials retrieved successfully',
                'data' => $testimonials->items(),
                'meta' => [
                    'current_page' => $testimonials->currentPage(),
                    'last_page' => $testimonials->lastPage(),
                    'per_page' => $testimonials->perPage(),
                    'total' => $testimonials->total(),
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve testimonials',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get available programs list
     */
    public function getPrograms()
    {
        try {
            $programs = Testimonial::getPrograms();

            return response()->json([
                'success' => true,
                'message' => 'Programs retrieved successfully',
                'data' => $programs,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve programs',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get single testimonial by ID
     */
    public function show($id)
    {
        try {
            $testimonial = Testimonial::published()->findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Testimonial retrieved successfully',
                'data' => $testimonial,
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Testimonial not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve testimonial',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // ===== ADMIN ROUTES (untuk ManageTestimonial.jsx) =====

    /**
     * Get all testimonials for admin (with filters, search, pagination)
     */
    public function adminIndex(Request $request)
    {
        try {
            $query = Testimonial::query();

            // Filter by status
            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            // Filter by program
            if ($request->filled('program')) {
                $query->byProgram($request->program);
            }

            // Search
            if ($request->filled('search')) {
                $query->search($request->search);
            }

            // Sorting
            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = strtolower($request->input('sort_order', 'desc')) === 'asc' ? 'asc' : 'desc';
            $allowedSort = ['created_at', 'published_at', 'display_order', 'name', 'program'];
            $query->orderBy(in_array($sortBy, $allowedSort, true) ? $sortBy : 'created_at', $sortOrder);

            // Pagination
            $perPage = $request->input('per_page', 15);
            $testimonials = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Testimonials retrieved successfully',
                'data' => $testimonials->items(),
                'meta' => [
                    'current_page' => $testimonials->currentPage(),
                    'last_page' => $testimonials->lastPage(),
                    'per_page' => $testimonials->perPage(),
                    'total' => $testimonials->total(),
                ],
                'statistics' => Testimonial::getStatistics(),
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve testimonials',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ADMIN: Get single testimonial by ID
     */
    public function adminShow($id)
    {
        try {
            $testimonial = Testimonial::findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Testimonial retrieved successfully',
                'data' => $testimonial,
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Testimonial not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve testimonial',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store new testimonial
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'location' => 'required|string|max:255',
                'program' => 'required|string|max:100',
                'testimonial' => 'required|string|min:20',
                'avatar' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // 2MB max
                'status' => 'required|in:published,draft',
                'featured' => 'boolean',
                'display_order' => 'integer|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $data = $request->except('avatar');

            // Normalize booleans
            $data['featured'] = filter_var($request->input('featured', false), FILTER_VALIDATE_BOOLEAN);
            
            // Set created_by if admin info available (Sanctum user)
            $data['created_by'] = $request->user()->name ?? 'Admin';

            // Handle avatar upload
            if ($request->hasFile('avatar')) {
                $avatar = $request->file('avatar');
                $filename = time() .'_' .Str::slug($request->name) .'.' .$avatar->getClientOriginalExtension();
                $path = $avatar->storeAs('testimonials/avatars', $filename, 'public');
                $data['avatar_path'] = $path;
            }

            $testimonial = Testimonial::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Testimonial created successfully',
                'data' => $testimonial->fresh(),
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create testimonial',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update testimonial
     */
    public function update(Request $request, $id)
    {
        try {
            $testimonial = Testimonial::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'location' => 'sometimes|required|string|max:255',
                'program' => 'sometimes|required|string|max:100',
                'testimonial' => 'sometimes|required|string|min:20',
                'avatar' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
                'status' => 'sometimes|required|in:published,draft',
                'featured' => 'boolean',
                'display_order' => 'integer|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $data = $request->except('avatar', '_method');

            // Normalize booleans
            if ($request->has('featured')) {
                $data['featured'] = filter_var($request->input('featured'), FILTER_VALIDATE_BOOLEAN);
            }

            // Handle avatar upload
            if ($request->hasFile('avatar')) {
                // Delete old avatar
                if ($testimonial->avatar_path && Storage::disk('public')->exists($testimonial->avatar_path)) {
                    Storage::disk('public')->delete($testimonial->avatar_path);
                }

                $avatar = $request->file('avatar');
                $filename = time() .'_' .Str::slug($request->input('name', $testimonial->name)) .'.' .$avatar->getClientOriginalExtension();
                $path = $avatar->storeAs('testimonials/avatars', $filename, 'public');
                $data['avatar_path'] = $path;
            }

            $testimonial->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Testimonial updated successfully',
                'data' => $testimonial->fresh(),
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Testimonial not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update testimonial',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete testimonial
     */
    public function destroy($id)
    {
        try {
            $testimonial = Testimonial::findOrFail($id);
            $testimonial->delete(); // Soft delete

            return response()->json([
                'success' => true,
                'message' => 'Testimonial deleted successfully',
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Testimonial not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete testimonial',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Toggle featured status
     */
    public function toggleFeatured($id)
    {
        try {
            $testimonial = Testimonial::findOrFail($id);
            $newStatus = $testimonial->toggleFeatured();

            return response()->json([
                'success' => true,
                'message' => 'Featured status updated successfully',
                'data' => [
                    'id' => $testimonial->id,
                    'featured' => $newStatus,
                ],
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Testimonial not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to toggle featured status',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Bulk delete testimonials
     */
    public function bulkDelete(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'ids' => 'required|array',
                'ids.*' => 'integer|exists:testimonials,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $deleted = Testimonial::whereIn('id', $request->ids)->delete();

            return response()->json([
                'success' => true,
                'message' => "{$deleted} testimonials deleted successfully",
                'data' => [
                    'deleted_count' => $deleted,
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete testimonials',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ADMIN: Basic statistics
     */
    public function statistics()
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Testimonial statistics retrieved',
                'data' => Testimonial::getStatistics(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve testimonial statistics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}