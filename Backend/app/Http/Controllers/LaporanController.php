<?php

namespace App\Http\Controllers;

use App\Models\Laporan;
use App\Services\ResponseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
}