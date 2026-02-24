<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Laporan;
use App\Services\ResponseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class LaporanController extends Controller
{
    /**
     * Get published laporan (public)
     */
    public function getPublishedLaporan(): JsonResponse
    {
        try {
            $laporan = Laporan::published()
                ->orderBy('year', 'desc')
                ->orderBy('order', 'asc')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'title' => $item->title,
                        'year' => $item->year,
                        'description' => $item->description,
                        'file_size' => $item->file_size,
                        'cover_image' => $item->cover_image,
                        'full_cover_url' => $item->full_cover_url,
                        'full_file_url' => $item->full_file_url,
                        'views' => $item->views,
                    ];
                });

            return ResponseService::success($laporan);
        } catch (\Exception $e) {
            return ResponseService::error('Gagal mengambil data laporan', $e->getMessage());
        }
    }

    /**
     * View laporan (increment view count)
     */
    public function viewLaporan($id): JsonResponse
    {
        try {
            $laporan = Laporan::published()->findOrFail($id);
            
            // Increment view count
            $laporan->increment('views');

            return ResponseService::success([
                'id' => $laporan->id,
                'title' => $laporan->title,
                'year' => $laporan->year,
                'full_file_url' => $laporan->full_file_url,
                'views' => $laporan->views,
            ]);
        } catch (\Exception $e) {
            return ResponseService::error('Laporan tidak ditemukan', $e->getMessage(), 404);
        }
    }

    /**
     * ==================== ADMIN ROUTES ====================
     */

    /**
     * Get all laporan (Admin - including draft)
     */
    public function adminIndex(): JsonResponse
    {
        try {
            $laporan = Laporan::orderBy('year', 'desc')
                ->orderBy('order', 'asc')
                ->get();

            return ResponseService::success($laporan);
        } catch (\Exception $e) {
            return ResponseService::error('Gagal mengambil data laporan', $e->getMessage());
        }
    }

    /**
     * Upload laporan PDF (Admin)
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'year' => 'required|integer|min:2000|max:' . (date('Y') + 1),
            'description' => 'nullable|string',
            'file' => 'required|file|mimes:pdf|max:51200', // 50MB max
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB
            'status' => 'nullable|in:draft,published',
            'order' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return ResponseService::error('Validasi gagal', $validator->errors(), 422);
        }

        try {
            // Upload PDF file
            $pdfFile = $request->file('file');
            $pdfFilename = time() . '_' . Str::slug($request->title) . '.pdf';
            $pdfPath = $pdfFile->storeAs('laporan/pdf', $pdfFilename, 'public');

            // Get file size in MB
            $fileSizeInMB = round($pdfFile->getSize() / 1048576, 2); // bytes to MB

            $data = [
                'title' => $request->title,
                'year' => $request->year,
                'description' => $request->description,
                'file_path' => $pdfPath,
                'file_size' => $fileSizeInMB . ' MB',
                'status' => $request->status ?? 'draft',
                'order' => $request->order ?? 0,
            ];

            // Upload cover image if provided
            if ($request->hasFile('cover_image')) {
                $coverImage = $request->file('cover_image');
                $coverFilename = time() . '_cover_' . Str::slug($request->title) . '.' . $coverImage->getClientOriginalExtension();
                $coverPath = $coverImage->storeAs('laporan/covers', $coverFilename, 'public');
                $data['cover_image'] = $coverPath;
            }

            $laporan = Laporan::create($data);

            return ResponseService::success($laporan, 'Laporan berhasil diupload', 201);

        } catch (\Exception $e) {
            return ResponseService::error('Gagal mengupload laporan', $e->getMessage(), 500);
        }
    }

    /**
     * Update laporan (Admin)
     */
    public function update(Request $request, $id): JsonResponse
    {
        $laporan = Laporan::find($id);

        if (!$laporan) {
            return ResponseService::error('Laporan tidak ditemukan', null, 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'year' => 'required|integer|min:2000|max:' . (date('Y') + 1),
            'description' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf|max:51200', // 50MB max
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'status' => 'nullable|in:draft,published',
            'order' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return ResponseService::error('Validasi gagal', $validator->errors(), 422);
        }

        try {
            $data = $request->only(['title', 'year', 'description', 'status', 'order']);

            // Update PDF if new file uploaded
            if ($request->hasFile('file')) {
                // Delete old file
                if ($laporan->file_path && Storage::disk('public')->exists($laporan->file_path)) {
                    Storage::disk('public')->delete($laporan->file_path);
                }

                $pdfFile = $request->file('file');
                $pdfFilename = time() . '_' . Str::slug($request->title) . '.pdf';
                $pdfPath = $pdfFile->storeAs('laporan/pdf', $pdfFilename, 'public');
                
                $fileSizeInMB = round($pdfFile->getSize() / 1048576, 2);
                
                $data['file_path'] = $pdfPath;
                $data['file_size'] = $fileSizeInMB . ' MB';
            }

            // Update cover image if new file uploaded
            if ($request->hasFile('cover_image')) {
                // Delete old cover
                if ($laporan->cover_image && Storage::disk('public')->exists($laporan->cover_image)) {
                    Storage::disk('public')->delete($laporan->cover_image);
                }

                $coverImage = $request->file('cover_image');
                $coverFilename = time() . '_cover_' . Str::slug($request->title) . '.' . $coverImage->getClientOriginalExtension();
                $coverPath = $coverImage->storeAs('laporan/covers', $coverFilename, 'public');
                $data['cover_image'] = $coverPath;
            }

            $laporan->update($data);

            return ResponseService::success($laporan->fresh(), 'Laporan berhasil diupdate');

        } catch (\Exception $e) {
            return ResponseService::error('Gagal mengupdate laporan', $e->getMessage(), 500);
        }
    }

    /**
     * Delete laporan (Admin)
     */
    public function destroy($id): JsonResponse
    {
        $laporan = Laporan::find($id);

        if (!$laporan) {
            return ResponseService::error('Laporan tidak ditemukan', null, 404);
        }

        try {
            // Delete PDF file
            if ($laporan->file_path && Storage::disk('public')->exists($laporan->file_path)) {
                Storage::disk('public')->delete($laporan->file_path);
            }

            // Delete cover image
            if ($laporan->cover_image && Storage::disk('public')->exists($laporan->cover_image)) {
                Storage::disk('public')->delete($laporan->cover_image);
            }

            $laporan->delete();

            return ResponseService::success(null, 'Laporan berhasil dihapus');

        } catch (\Exception $e) {
            return ResponseService::error('Gagal menghapus laporan', $e->getMessage(), 500);
        }
    }

    /**
     * Toggle publish status (Admin)
     */
    public function togglePublish($id): JsonResponse
    {
        $laporan = Laporan::find($id);

        if (!$laporan) {
            return ResponseService::error('Laporan tidak ditemukan', null, 404);
        }

        try {
            $newStatus = $laporan->status === 'published' ? 'draft' : 'published';
            $laporan->update(['status' => $newStatus]);

            return ResponseService::success($laporan->fresh(), 'Status berhasil diubah');

        } catch (\Exception $e) {
            return ResponseService::error('Gagal mengubah status', $e->getMessage(), 500);
        }
    }
}