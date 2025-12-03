<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Penghargaan;
use App\Services\ResponseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PenghargaanController extends Controller
{
    /**
     * Display a listing of the resource for public (Media Informasi Page).
     */
    public function index(Request $request)
    {
        try {
            $query = Penghargaan::where('show_in_media_informasi', true);

            // Filter by year
            if ($request->has('year') && $request->year !== 'all') {
                $query->where('year', $request->year);
            }

            // Filter by category
            if ($request->has('category') && $request->category) {
                $query->where('category', $request->category);
            }

            // Search
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('given_by', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            // Sorting
            $query->orderBy('year', 'desc')
                  ->orderBy('date', 'desc');

            $penghargaan = $query->get();

            return ResponseService::success(
                $penghargaan,
                'Data penghargaan berhasil diambil'
            );

        } catch (\Exception $e) {
            return ResponseService::serverError('Gagal mengambil data penghargaan: ' .$e->getMessage());
        }
    }

    /**
     * Get penghargaan for landing page.
     */
    public function forLanding(Request $request)
    {
        try {
            $limit = $request->get('limit', 6);
            
            $penghargaan = Penghargaan::where('show_in_landing', true)
                ->orderBy('year', 'desc')
                ->orderBy('date', 'desc')
                ->limit($limit)
                ->get();

            return ResponseService::success(
                $penghargaan,
                'Data penghargaan untuk landing page berhasil diambil'
            );

        } catch (\Exception $e) {
            return ResponseService::serverError('Gagal mengambil data penghargaan: ' .$e->getMessage());
        }
    }

    /**
     * Get all penghargaan for admin panel (with filters).
     */
    public function adminIndex(Request $request)
    {
        try {
            $query = Penghargaan::query();

            // Search
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('category', 'like', "%{$search}%")
                      ->orWhere('given_by', 'like', "%{$search}%");
                });
            }

            // Filter by year
            if ($request->has('year') && $request->year !== '' && $request->year !== 'all') {
                $query->where('year', $request->year);
            }

            // Filter by category
            if ($request->has('category') && $request->category) {
                $query->where('category', $request->category);
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'year');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Get all data (no pagination for now, sesuai dengan pattern existing)
            $penghargaan = $query->get();

            return ResponseService::success(
                $penghargaan,
                'Data penghargaan berhasil diambil'
            );

        } catch (\Exception $e) {
            return ResponseService::serverError('Gagal mengambil data penghargaan: ' .$e->getMessage());
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'given_by' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:2100',
            'month' => 'required|string|max:50',
            'date' => 'required|date',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpeg,jpg,png,webp|max:2048',
            'show_in_landing' => 'boolean',
            'show_in_media_informasi' => 'boolean',
        ], [
            'title.required' => 'Nama penghargaan wajib diisi',
            'category.required' => 'Kategori wajib dipilih',
            'given_by.required' => 'Pemberi penghargaan wajib diisi',
            'year.required' => 'Tahun wajib diisi',
            'month.required' => 'Bulan wajib diisi',
            'date.required' => 'Tanggal penerimaan wajib diisi',
            'description.required' => 'Deskripsi wajib diisi',
            'image.required' => 'Gambar penghargaan wajib diupload',
            'image.image' => 'File harus berupa gambar',
            'image.mimes' => 'Format gambar harus: jpeg, jpg, png, atau webp',
            'image.max' => 'Ukuran gambar maksimal 2MB',
        ]);

        if ($validator->fails()) {
            return ResponseService::validationError(
                $validator->errors(),
                'Validasi gagal'
            );
        }

        try {
            // Handle image upload
            $imagePath = null;
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() .'_' .Str::slug($request->title) .'.' .$image->getClientOriginalExtension();
                $imagePath = $image->storeAs('penghargaan', $imageName, 'public');
            }

            $penghargaan = Penghargaan::create([
                'title' => $request->title,
                'category' => $request->category,
                'given_by' => $request->given_by,
                'year' => $request->year,
                'month' => $request->month,
                'date' => $request->date,
                'description' => $request->description,
                'image' => $imagePath,
                'show_in_landing' => $request->boolean('show_in_landing', false),
                'show_in_media_informasi' => $request->boolean('show_in_media_informasi', true),
            ]);

            return ResponseService::success(
                $penghargaan,
                'Penghargaan berhasil ditambahkan',
                201
            );

        } catch (\Exception $e) {
            // Hapus gambar jika ada error
            if (isset($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }

            return ResponseService::serverError('Gagal menambahkan penghargaan: ' .$e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $penghargaan = Penghargaan::findOrFail($id);

            return ResponseService::success(
                $penghargaan,
                'Detail penghargaan berhasil diambil'
            );

        } catch (\Exception $e) {
            return ResponseService::notFound('Penghargaan tidak ditemukan');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'given_by' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:2100',
            'month' => 'required|string|max:50',
            'date' => 'required|date',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'show_in_landing' => 'boolean',
            'show_in_media_informasi' => 'boolean',
        ], [
            'title.required' => 'Nama penghargaan wajib diisi',
            'category.required' => 'Kategori wajib dipilih',
            'given_by.required' => 'Pemberi penghargaan wajib diisi',
            'year.required' => 'Tahun wajib diisi',
            'month.required' => 'Bulan wajib diisi',
            'date.required' => 'Tanggal penerimaan wajib diisi',
            'description.required' => 'Deskripsi wajib diisi',
            'image.image' => 'File harus berupa gambar',
            'image.mimes' => 'Format gambar harus: jpeg, jpg, png, atau webp',
            'image.max' => 'Ukuran gambar maksimal 2MB',
        ]);

        if ($validator->fails()) {
            return ResponseService::validationError(
                $validator->errors(),
                'Validasi gagal'
            );
        }

        try {
            $penghargaan = Penghargaan::findOrFail($id);
            $oldImage = $penghargaan->image;

            // Handle image upload if new image provided
            $imagePath = $oldImage;
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() .'_' .Str::slug($request->title) .'.' .$image->getClientOriginalExtension();
                $imagePath = $image->storeAs('penghargaan', $imageName, 'public');

                // Delete old image
                if ($oldImage) {
                    Storage::disk('public')->delete($oldImage);
                }
            }

            $penghargaan->update([
                'title' => $request->title,
                'category' => $request->category,
                'given_by' => $request->given_by,
                'year' => $request->year,
                'month' => $request->month,
                'date' => $request->date,
                'description' => $request->description,
                'image' => $imagePath,
                'show_in_landing' => $request->boolean('show_in_landing', false),
                'show_in_media_informasi' => $request->boolean('show_in_media_informasi', true),
            ]);

            return ResponseService::success(
                $penghargaan->fresh(),
                'Penghargaan berhasil diupdate'
            );

        } catch (\Exception $e) {
            // Hapus gambar baru jika ada error
            if (isset($imagePath) && $imagePath !== $oldImage) {
                Storage::disk('public')->delete($imagePath);
            }

            return ResponseService::serverError('Gagal mengupdate penghargaan: ' .$e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $penghargaan = Penghargaan::findOrFail($id);
            
            // Delete image
            if ($penghargaan->image) {
                Storage::disk('public')->delete($penghargaan->image);
            }

            $penghargaan->delete();

            return ResponseService::success(
                null,
                'Penghargaan berhasil dihapus'
            );

        } catch (\Exception $e) {
            return ResponseService::serverError('Gagal menghapus penghargaan: ' .$e->getMessage());
        }
    }

    /**
     * Get unique years for filter.
     */
    public function getYears()
    {
        try {
            $years = Penghargaan::select('year')
                ->distinct()
                ->orderBy('year', 'desc')
                ->pluck('year');

            return ResponseService::success(
                $years,
                'Daftar tahun berhasil diambil'
            );

        } catch (\Exception $e) {
            return ResponseService::serverError('Gagal mengambil daftar tahun: ' .$e->getMessage());
        }
    }

    /**
     * Get unique categories for filter.
     */
    public function getCategories()
    {
        try {
            $categories = Penghargaan::select('category')
                ->distinct()
                ->orderBy('category')
                ->pluck('category');

            return ResponseService::success(
                $categories,
                'Daftar kategori berhasil diambil'
            );

        } catch (\Exception $e) {
            return ResponseService::serverError('Gagal mengambil daftar kategori: ' .$e->getMessage());
        }
    }

    /**
     * Get statistics for admin dashboard.
     */
    public function getStatistics()
    {
        try {
            $currentYear = date('Y');

            $stats = [
                'total' => Penghargaan::count(),
                'landing' => Penghargaan::where('show_in_landing', true)->count(),
                'media' => Penghargaan::where('show_in_media_informasi', true)->count(),
                'this_year' => Penghargaan::where('year', $currentYear)->count(),
                'by_category' => Penghargaan::select('category')
                    ->selectRaw('COUNT(*) as count')
                    ->groupBy('category')
                    ->orderBy('count', 'desc')
                    ->get(),
                'by_year' => Penghargaan::select('year')
                    ->selectRaw('COUNT(*) as count')
                    ->groupBy('year')
                    ->orderBy('year', 'desc')
                    ->limit(5)
                    ->get(),
            ];

            return ResponseService::success(
                $stats,
                'Statistik penghargaan berhasil diambil'
            );

        } catch (\Exception $e) {
            return ResponseService::serverError('Gagal mengambil statistik: ' .$e->getMessage());
        }
    }

    /**
     * Bulk delete penghargaan.
     */
    public function bulkDestroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:penghargaan,id',
        ]);

        if ($validator->fails()) {
            return ResponseService::validationError(
                $validator->errors(),
                'Validasi gagal'
            );
        }

        try {
            $penghargaan = Penghargaan::whereIn('id', $request->ids)->get();

            // Delete images
            foreach ($penghargaan as $item) {
                if ($item->image) {
                    Storage::disk('public')->delete($item->image);
                }
            }

            Penghargaan::whereIn('id', $request->ids)->delete();

            return ResponseService::success(
                null,
                count($request->ids) .' penghargaan berhasil dihapus'
            );

        } catch (\Exception $e) {
            return ResponseService::serverError('Gagal menghapus penghargaan: ' .$e->getMessage());
        }
    }
}