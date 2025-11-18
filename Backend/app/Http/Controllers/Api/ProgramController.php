<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ProgramController extends Controller
{
    /**
     * Display a listing of programs for public.
     */
    public function index(Request $request)
    {
        try {
            $query = Program::query();

            // Filter by category
            if ($request->has('category') && $request->category != '') {
                $query->byCategory($request->category);
            }

            // Filter by status
            if ($request->has('status') && $request->status != '') {
                $query->byStatus($request->status);
            }

            // Filter by year
            if ($request->has('year') && $request->year != '') {
                $query->byYear($request->year);
            }

            // Search by name or location
            if ($request->has('search') && $request->search != '') {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                      ->orWhere('location', 'LIKE', "%{$search}%")
                      ->orWhere('description', 'LIKE', "%{$search}%");
                });
            }

            // Sort
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 6);
            $programs = $query->paginate($perPage);

            // Transform data for frontend
            $programs->getCollection()->transform(function ($program) {
                return [
                    'id' => $program->id,
                    'slug' => $program->slug,
                    'category' => $program->category,
                    'title' => $program->name,
                    'date' => $program->formatted_date,
                    'image' => $program->image_url_full ?? asset('assets/rectangle.png'),
                    'description' => Str::limit($program->description, 100, '...'),
                    'location' => $program->location,
                    'status' => $program->status,
                    'year' => $program->year,
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Programs retrieved successfully',
                'data' => $programs,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve programs',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified program by slug.
     */
    public function show($slug)
    {
        try {
            $program = Program::where('slug', $slug)->firstOrFail();

            $data = [
                'id' => $program->id,
                'slug' => $program->slug,
                'name' => $program->name,
                'category' => $program->category,
                'location' => $program->location,
                'latitude' => $program->latitude,
                'longitude' => $program->longitude,
                'description' => $program->description,
                'facilities' => $program->facilities,
                'status' => $program->status,
                'year' => $program->year,
                'target' => $program->target,
                'image' => $program->image_url_full,
                'date' => $program->formatted_date,
                'created_at' => $program->created_at,
            ];

            return response()->json([
                'success' => true,
                'message' => 'Program retrieved successfully',
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Program not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Get recent programs (for sidebar)
     */
    public function recent(Request $request)
    {
        try {
            $limit = $request->get('limit', 3);
            $programs = Program::recent($limit)->get();

            $data = $programs->map(function ($program) {
                return [
                    'id' => $program->id,
                    'slug' => $program->slug,
                    'title' => $program->name,
                    'date' => $program->formatted_date,
                    'image' => $program->image_url_full ?? asset('assets/rectangle.png'),
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Recent programs retrieved successfully',
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve recent programs',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get categories list
     */
    public function categories()
    {
        $categories = [
            'Kesehatan',
            'Pendidikan',
            'Lingkungan',
            'Ekonomi',
            'Sosial',
            'Infrastruktur'
        ];

        return response()->json([
            'success' => true,
            'message' => 'Categories retrieved successfully',
            'data' => $categories,
        ]);
    }

    /**
     * Get status options
     */
    public function statusOptions()
    {
        $statuses = ['Aktif', 'Selesai', 'Dalam Proses'];

        return response()->json([
            'success' => true,
            'message' => 'Status options retrieved successfully',
            'data' => $statuses,
        ]);
    }

    /**
     * Get statistics (for dashboard/sidebar)
     */
    public function statistics()
    {
        try {
            $stats = [
                'total_programs' => Program::count(),
                'active_programs' => Program::active()->count(),
                'programs_by_category' => Program::selectRaw('category, COUNT(*) as count')
                    ->groupBy('category')
                    ->pluck('count', 'category'),
                'programs_by_year' => Program::selectRaw('year, COUNT(*) as count')
                    ->groupBy('year')
                    ->orderBy('year', 'desc')
                    ->pluck('count', 'year'),
            ];

            return response()->json([
                'success' => true,
                'message' => 'Statistics retrieved successfully',
                'data' => $stats,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ADMIN: Display a listing of programs
     */
    public function adminIndex(Request $request)
    {
        try {
            $query = Program::query();

            // Filter by category
            if ($request->has('category') && $request->category != '') {
                $query->byCategory($request->category);
            }

            // Filter by status
            if ($request->has('status') && $request->status != '') {
                $query->byStatus($request->status);
            }

            // Filter by year
            if ($request->has('year') && $request->year != '') {
                $query->byYear($request->year);
            }

            // Search
            if ($request->has('search') && $request->search != '') {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                      ->orWhere('location', 'LIKE', "%{$search}%");
                });
            }

            // Sort
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Get all or paginated
            if ($request->has('all') && $request->all == 'true') {
                $programs = $query->get();
            } else {
                $perPage = $request->get('per_page', 10);
                $programs = $query->paginate($perPage);
            }

            // Transform data
            $transformedData = $programs instanceof \Illuminate\Pagination\LengthAwarePaginator
                ? $programs->getCollection()
                : $programs;

            $transformedData->transform(function ($program) {
                return [
                    'id' => $program->id,
                    'name' => $program->name,
                    'slug' => $program->slug,
                    'category' => $program->category,
                    'location' => $program->location,
                    'latitude' => $program->latitude,
                    'longitude' => $program->longitude,
                    'description' => $program->description,
                    'facilities' => $program->facilities,
                    'status' => $program->status,
                    'year' => $program->year,
                    'target' => $program->target,
                    'imageUrl' => $program->image_url_full,
                    'created_at' => $program->created_at,
                    'updated_at' => $program->updated_at,
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Programs retrieved successfully',
                'data' => $programs instanceof \Illuminate\Pagination\LengthAwarePaginator
                    ? $programs
                    : ['data' => $programs],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve programs',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ADMIN: Store a newly created program
     */
    public function store(Request $request)
    {
        try {
            // Validation
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'category' => 'required|string|in:Kesehatan,Pendidikan,Lingkungan,Ekonomi,Sosial,Infrastruktur',
                'location' => 'required|string|max:255',
                'latitude' => 'required|numeric|between:-90,90',
                'longitude' => 'required|numeric|between:-180,180',
                'description' => 'required|string',
                'facilities' => 'required|array|min:1',
                'facilities.*' => 'required|string',
                'status' => 'required|in:Aktif,Selesai,Dalam Proses',
                'year' => 'required|integer|min:2020|max:2030',
                'target' => 'nullable|string|max:255',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Filter empty facilities
            $facilities = array_filter($request->facilities, function ($facility) {
                return !empty(trim($facility));
            });

            if (empty($facilities)) {
                return response()->json([
                    'success' => false,
                    'message' => 'At least one facility is required',
                ], 422);
            }

            // Handle image upload
            $imagePath = null;
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '_' . Str::slug($request->name) . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('programs', $imageName, 'public');
            }

            // Create program
            $program = Program::create([
                'name' => $request->name,
                'category' => $request->category,
                'location' => $request->location,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'description' => $request->description,
                'facilities' => array_values($facilities),
                'status' => $request->status,
                'year' => $request->year,
                'target' => $request->target,
                'image_url' => $imagePath,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Program created successfully',
                'data' => [
                    'id' => $program->id,
                    'name' => $program->name,
                    'slug' => $program->slug,
                    'category' => $program->category,
                    'location' => $program->location,
                    'latitude' => $program->latitude,
                    'longitude' => $program->longitude,
                    'description' => $program->description,
                    'facilities' => $program->facilities,
                    'status' => $program->status,
                    'year' => $program->year,
                    'target' => $program->target,
                    'imageUrl' => $program->image_url_full,
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create program',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ADMIN: Update the specified program
     */
    public function update(Request $request, $id)
    {
        try {
            $program = Program::findOrFail($id);

            // Validation
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'category' => 'required|string|in:Kesehatan,Pendidikan,Lingkungan,Ekonomi,Sosial,Infrastruktur',
                'location' => 'required|string|max:255',
                'latitude' => 'required|numeric|between:-90,90',
                'longitude' => 'required|numeric|between:-180,180',
                'description' => 'required|string',
                'facilities' => 'required|array|min:1',
                'facilities.*' => 'required|string',
                'status' => 'required|in:Aktif,Selesai,Dalam Proses',
                'year' => 'required|integer|min:2020|max:2030',
                'target' => 'nullable|string|max:255',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
                'remove_image' => 'nullable|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Filter empty facilities
            $facilities = array_filter($request->facilities, function ($facility) {
                return !empty(trim($facility));
            });

            if (empty($facilities)) {
                return response()->json([
                    'success' => false,
                    'message' => 'At least one facility is required',
                ], 422);
            }

            // Handle image upload
            $imagePath = $program->image_url;

            // Remove old image if requested
            if ($request->has('remove_image') && $request->remove_image) {
                if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
                $imagePath = null;
            }

            // Upload new image
            if ($request->hasFile('image')) {
                // Delete old image
                if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
                
                $image = $request->file('image');
                $imageName = time() . '_' . Str::slug($request->name) . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('programs', $imageName, 'public');
            }

            // Update program
            $program->update([
                'name' => $request->name,
                'category' => $request->category,
                'location' => $request->location,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'description' => $request->description,
                'facilities' => array_values($facilities),
                'status' => $request->status,
                'year' => $request->year,
                'target' => $request->target,
                'image_url' => $imagePath,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Program updated successfully',
                'data' => [
                    'id' => $program->id,
                    'name' => $program->name,
                    'slug' => $program->slug,
                    'category' => $program->category,
                    'location' => $program->location,
                    'latitude' => $program->latitude,
                    'longitude' => $program->longitude,
                    'description' => $program->description,
                    'facilities' => $program->facilities,
                    'status' => $program->status,
                    'year' => $program->year,
                    'target' => $program->target,
                    'imageUrl' => $program->image_url_full,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update program',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ADMIN: Remove the specified program
     */
    public function destroy($id)
    {
        try {
            $program = Program::findOrFail($id);

            // Delete image if exists
            if ($program->image_url && Storage::disk('public')->exists($program->image_url)) {
                Storage::disk('public')->delete($program->image_url);
            }

            $program->delete();

            return response()->json([
                'success' => true,
                'message' => 'Program deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete program',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}