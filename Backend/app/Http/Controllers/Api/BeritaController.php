<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BeritaController extends Controller
{
    // ===== PUBLIC ROUTES (untuk website visitor) =====

    /**
     * Get berita for TJSL Page (BeritaTJSLPage. jsx)
     */
    public function index(Request $request)
    {
        try {
            $query = Berita::published()->showInTJSL();

            // Filter by category
            if ($request->filled('category') && $request->category !== 'All') {
                $query->byCategory($request->category);
            }

            // Search
            if ($request->filled('search')) {
                $query->search($request->search);
            }

            // Sorting
            $sortBy = $request->input('sort_by', 'date');
            $sortOrder = $request->input('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->input('per_page', 9);
            $berita = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Berita retrieved successfully',
                'data' => $berita->items(),
                'meta' => [
                    'current_page' => $berita->currentPage(),
                    'last_page' => $berita->lastPage(),
                    'per_page' => $berita->perPage(),
                    'total' => $berita->total(),
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve berita',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get berita for Media Informasi Page
     */
    public function forMediaInformasi(Request $request)
    {
        try {
            $query = Berita::published()->showInMediaInformasi();

            if ($request->filled('category') && $request->category !== 'All') {
                $query->byCategory($request->category);
            }

            if ($request->filled('search')) {
                $query->search($request->search);
            }

            $query->orderBy('date', 'desc');

            $perPage = $request->input('per_page', 12);
            $berita = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Berita for media informasi retrieved successfully',
                'data' => $berita->items(),
                'meta' => [
                    'current_page' => $berita->currentPage(),
                    'last_page' => $berita->lastPage(),
                    'per_page' => $berita->perPage(),
                    'total' => $berita->total(),
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve berita',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get pinned berita for Homepage
     */
    public function forHomepage()
    {
        try {
            $berita = Berita::published()
                           ->pinned()
                           ->orderBy('date', 'desc')
                           ->limit(3)
                           ->get();

            return response()->json([
                'success' => true,
                'message' => 'Pinned berita retrieved successfully',
                'data' => $berita,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve pinned berita',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get single berita detail by slug (for ArtikelPage.jsx)
     */
    public function show($slug)
    {
        try {
            $berita = Berita::where('slug', $slug)
                           ->published()
                           ->firstOrFail();

            // Increment views
            $berita->incrementViews();

            // Get related articles (same category, exclude current)
            $relatedArticles = Berita::published()
                                    ->byCategory($berita->category)
                                    ->where('id', '!=', $berita->id)
                                    ->orderBy('date', 'desc')
                                    ->limit(3)
                                    ->get();

            return response()->json([
                'success' => true,
                'message' => 'Berita retrieved successfully',
                'data' => $berita,
                'related_articles' => $relatedArticles,
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Berita not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve berita',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get recent berita (for sidebar / related articles)
     */
    public function recent(Request $request)
    {
        try {
            $limit = $request->input('limit', 5);
            
            $berita = Berita::published()
                           ->orderBy('date', 'desc')
                           ->limit($limit)
                           ->get();

            return response()->json([
                'success' => true,
                'message' => 'Recent berita retrieved successfully',
                'data' => $berita,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve recent berita',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get available categories
     */
    public function categories()
    {
        try {
            $categories = Berita::getCategories();

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

    // ===== ADMIN ROUTES (untuk ManageBerita.jsx) =====

    /**
     * Get all berita for admin (with filters, search, pagination)
     */
    public function adminIndex(Request $request)
    {
        try {
            $query = Berita::query();

            // Filter by status
            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            // Filter by category
            if ($request->filled('category')) {
                $query->byCategory($request->category);
            }

            // Search
            if ($request->filled('search')) {
                $query->search($request->search);
            }

            // Sorting
            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->input('per_page', 15);
            $berita = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Berita retrieved successfully',
                'data' => $berita->items(),
                'meta' => [
                    'current_page' => $berita->currentPage(),
                    'last_page' => $berita->lastPage(),
                    'per_page' => $berita->perPage(),
                    'total' => $berita->total(),
                ],
                'statistics' => Berita::getStatistics(),
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve berita',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store new berita
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'category' => 'required|string|max:100',
                'date' => 'required|date',
                'author' => 'nullable|string|max:255',
                'short_description' => 'nullable|string|max:500',
                'content' => 'required|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
                'status' => 'required|in:draft,published',
                'display_option' => 'nullable|string',
                'auto_link' => 'nullable|string',
                'show_in_tjsl' => 'boolean',
                'show_in_media_informasi' => 'boolean',
                'show_in_dashboard' => 'boolean',
                'pin_to_homepage' => 'boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $data = $request->except('image');
            
            // Generate slug
            $data['slug'] = Berita::generateUniqueSlug($request->title);

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $filename = time() . '_' .  Str::slug($request->title) . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('berita', $filename, 'public');
                $data['image_path'] = $path;
            }

            $berita = Berita::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Berita created successfully',
                'data' => $berita->fresh(),
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create berita',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update berita
     */
    public function update(Request $request, $id)
    {
        try {
            $berita = Berita::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|required|string|max:255',
                'category' => 'sometimes|required|string|max:100',
                'date' => 'sometimes|required|date',
                'author' => 'nullable|string|max:255',
                'short_description' => 'nullable|string|max:500',
                'content' => 'sometimes|required|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
                'status' => 'sometimes|required|in:draft,published',
                'display_option' => 'nullable|string',
                'auto_link' => 'nullable|string',
                'show_in_tjsl' => 'boolean',
                'show_in_media_informasi' => 'boolean',
                'show_in_dashboard' => 'boolean',
                'pin_to_homepage' => 'boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $data = $request->except('image');

            // Update slug if title changed
            if ($request->filled('title') && $request->title !== $berita->title) {
                $data['slug'] = Berita::generateUniqueSlug($request->title, $berita->id);
            }

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image
                if ($berita->image_path && Storage::disk('public')->exists($berita->image_path)) {
                    Storage::disk('public')->delete($berita->image_path);
                }

                $image = $request->file('image');
                $filename = time() .  '_' . Str::slug($request->input('title', $berita->title)) . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('berita', $filename, 'public');
                $data['image_path'] = $path;
            }

            $berita->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Berita updated successfully',
                'data' => $berita->fresh(),
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Berita not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update berita',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete berita
     */
    public function destroy($id)
    {
        try {
            $berita = Berita::findOrFail($id);
            $berita->delete();

            return response()->json([
                'success' => true,
                'message' => 'Berita deleted successfully',
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Berita not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete berita',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get statistics
     */
    public function getStatistics()
    {
        try {
            $stats = Berita::getStatistics();

            return response()->json([
                'success' => true,
                'message' => 'Statistics retrieved successfully',
                'data' => $stats,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}