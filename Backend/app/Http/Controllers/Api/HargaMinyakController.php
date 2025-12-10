<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Harga;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class HargaMinyakController extends Controller
{
    /**
     * Get data harga dengan filter (Public)
     */
    public function index(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'periode' => 'nullable|in:day,week,month,year',
                'from' => 'nullable|date',
                'to' => 'nullable|date|after_or_equal:from',
                'tahun' => 'nullable|integer|min:2020|max:2030',
                'bulan' => 'nullable|integer|min:1|max:12',
                'limit' => 'nullable|integer|min:1|max:1000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $periode = $request->input('periode', 'month');
            $limit = $request->input('limit');
            $query = Harga::query();

            // Filter berdasarkan periode
            $query->where('periode', $periode);

            // Filter berdasarkan range tanggal
            if ($request->has('from') && $request->has('to')) {
                $query->whereBetween('tanggal', [$request->from, $request->to]);
            } else {
                // Default range jika tidak ada filter
                $this->applyDefaultRange($query, $periode);
            }

            // Filter tambahan
            if ($request->has('tahun')) {
                $query->where('tahun', $request->tahun);
            }

            if ($request->has('bulan')) {
                $query->where('bulan', $request->bulan);
            }

            // Order by tanggal
            $query->orderBy('tanggal', 'asc');

            // Apply limit if provided
            if ($limit) {
                $query->limit($limit);
            }

            $data = $query->get();

            // Transform data untuk response
            $chartData = $data->map(function ($item) {
                return [
                    'id' => $item->id,
                    'tanggal' => $item->tanggal->format('Y-m-d'),
                    'label' => $item->label,
                    'fullLabel' => $item->full_label,
                    'brent' => (float) $item->brent,
                    'duri' => (float) $item->duri,
                    'arjuna' => (float) $item->arjuna,
                    'kresna' => (float) $item->kresna,
                    'icp' => (float) $item->icp,
                    'periode' => $item->periode,
                    'tahun' => $item->tahun,
                    'bulan' => $item->bulan,
                    'minggu' => $item->minggu,
                ];
            });

            // Get statistics
            $filters = [
                'from' => $request->from,
                'to' => $request->to,
                'tahun' => $request->tahun,
                'bulan' => $request->bulan,
            ];

            $stats = Harga::getStats($periode, array_filter($filters));

            return response()->json([
                'success' => true,
                'message' => 'Data berhasil diambil',
                'data' => [
                    'chartData' => $chartData,
                    'stats' => $stats['stats'],
                    'total' => $chartData->count(),
                    'periode' => $periode,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan:  ' .$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get statistics
     */
    public function statistics(Request $request)
    {
        try {
            $periode = $request->input('periode', 'month');
            
            $stats = Harga:: getStats($periode, []);

            return response()->json([
                'success' => true,
                'message' => 'Statistik berhasil diambil',
                'data' => $stats,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan:  ' .$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get latest data
     */
    public function latest(Request $request)
    {
        try {
            $limit = $request->input('limit', 10);
            $periode = $request->input('periode', 'day');

            $data = Harga:: where('periode', $periode)
                ->orderBy('tanggal', 'desc')
                ->limit($limit)
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Data terbaru berhasil diambil',
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' .$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show single harga data
     */
    public function show($id)
    {
        try {
            $harga = Harga::findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Data berhasil diambil',
                'data' => $harga,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' .$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin:  Get all data with pagination
     */
    public function adminIndex(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 15);
            $search = $request->input('search');
            $periode = $request->input('periode');
            $tahun = $request->input('tahun');
            $bulan = $request->input('bulan');
            $sortBy = $request->input('sort_by', 'tanggal');
            $sortOrder = $request->input('sort_order', 'desc');

            $query = Harga::query();

            // Search
            if ($search) {
                $query->where('tanggal', 'like', "%{$search}%");
            }

            // Filter periode
            if ($periode) {
                $query->where('periode', $periode);
            }

            // Filter tahun
            if ($tahun) {
                $query->where('tahun', $tahun);
            }

            // Filter bulan
            if ($bulan) {
                $query->where('bulan', $bulan);
            }

            // Sorting
            $query->orderBy($sortBy, $sortOrder);

            $data = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Data berhasil diambil',
                'data' => $data->items(),
                'pagination' => [
                    'total' => $data->total(),
                    'per_page' => $data->perPage(),
                    'current_page' => $data->currentPage(),
                    'last_page' => $data->lastPage(),
                    'from' => $data->firstItem(),
                    'to' => $data->lastItem(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' .$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin: Store new harga data
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'tanggal' => 'required|date|unique:harga,tanggal',
                'brent' => 'required|numeric|min:0|max:9999.99',
                'duri' => 'required|numeric|min:0|max:9999.99',
                'arjuna' => 'required|numeric|min:0|max:9999.99',
                'kresna' => 'required|numeric|min:0|max:9999.99',
                'icp' => 'required|numeric|min:0|max:9999.99',
                'periode' => 'nullable|in:day,week,month,year',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $date = Carbon::parse($request->tanggal);

            $harga = Harga::create([
                'tanggal' => $request->tanggal,
                'brent' => $request->brent,
                'duri' => $request->duri,
                'arjuna' => $request->arjuna,
                'kresna' => $request->kresna,
                'icp' => $request->icp,
                'periode' => $request->input('periode', 'day'),
                'tahun' => $date->year,
                'bulan' => $date->month,
                'minggu' => $date->weekOfYear,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Data berhasil ditambahkan',
                'data' => $harga,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' .$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin: Update harga data
     */
    public function update(Request $request, $id)
    {
        try {
            $harga = Harga::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'tanggal' => 'required|date|unique:harga,tanggal,' .$id,
                'brent' => 'required|numeric|min:0|max:9999.99',
                'duri' => 'required|numeric|min:0|max:9999.99',
                'arjuna' => 'required|numeric|min:0|max:9999.99',
                'kresna' => 'required|numeric|min: 0|max:9999.99',
                'icp' => 'required|numeric|min: 0|max:9999.99',
                'periode' => 'nullable|in:day,week,month,year',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $date = Carbon::parse($request->tanggal);

            $harga->update([
                'tanggal' => $request->tanggal,
                'brent' => $request->brent,
                'duri' => $request->duri,
                'arjuna' => $request->arjuna,
                'kresna' => $request->kresna,
                'icp' => $request->icp,
                'periode' => $request->input('periode', $harga->periode),
                'tahun' => $date->year,
                'bulan' => $date->month,
                'minggu' => $date->weekOfYear,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Data berhasil diperbarui',
                'data' => $harga,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' .$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin: Delete harga data
     */
    public function destroy($id)
    {
        try {
            $harga = Harga::findOrFail($id);
            $harga->delete();

            return response()->json([
                'success' => true,
                'message' => 'Data berhasil dihapus',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' .$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin: Bulk insert data
     */
    public function bulkStore(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'data' => 'required|array|min:1',
                'data.*.tanggal' => 'required|date',
                'data.*.brent' => 'required|numeric|min:0|max:9999.99',
                'data.*.duri' => 'required|numeric|min:0|max:9999.99',
                'data.*.arjuna' => 'required|numeric|min:0|max:9999.99',
                'data.*.kresna' => 'required|numeric|min:0|max:9999.99',
                'data.*.icp' => 'required|numeric|min: 0|max:9999.99',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $inserted = [];
            $errors = [];

            foreach ($request->data as $item) {
                try {
                    $date = Carbon::parse($item['tanggal']);
                    
                    // Check if date already exists
                    $exists = Harga::where('tanggal', $item['tanggal'])->exists();
                    
                    if ($exists) {
                        $errors[] = [
                            'tanggal' => $item['tanggal'],
                            'error' => 'Tanggal sudah ada',
                        ];
                        continue;
                    }

                    $harga = Harga::create([
                        'tanggal' => $item['tanggal'],
                        'brent' => $item['brent'],
                        'duri' => $item['duri'],
                        'arjuna' => $item['arjuna'],
                        'kresna' => $item['kresna'],
                        'icp' => $item['icp'],
                        'periode' => $item['periode'] ?? 'day',
                        'tahun' => $date->year,
                        'bulan' => $date->month,
                        'minggu' => $date->weekOfYear,
                    ]);

                    $inserted[] = $harga;
                } catch (\Exception $e) {
                    $errors[] = [
                        'tanggal' => $item['tanggal'],
                        'error' => $e->getMessage(),
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'message' => count($inserted) .' data berhasil ditambahkan',
                'data' => [
                    'inserted' => $inserted,
                    'errors' => $errors,
                    'total_inserted' => count($inserted),
                    'total_errors' => count($errors),
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' .$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin:  Bulk delete
     */
    public function bulkDelete(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'ids' => 'required|array|min:1',
                'ids.*' => 'required|integer|exists:harga,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $deleted = Harga::whereIn('id', $request->ids)->delete();

            return response()->json([
                'success' => true,
                'message' => "{$deleted} data berhasil dihapus",
                'data' => [
                    'deleted_count' => $deleted,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' .$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Apply default range based on periode
     */
    private function applyDefaultRange($query, $periode)
    {
        $now = Carbon::now();

        switch ($periode) {
            case 'day':
                // Last 31 days
                $query->whereBetween('tanggal', [
                    $now->copy()->subDays(30)->format('Y-m-d'),
                    $now->format('Y-m-d')
                ]);
                break;
            case 'week':
                // Last 10 weeks
                $query->whereBetween('tanggal', [
                    $now->copy()->subWeeks(9)->startOfWeek()->format('Y-m-d'),
                    $now->format('Y-m-d')
                ]);
                break;
            case 'month':
                // This year
                $query->whereBetween('tanggal', [
                    $now->copy()->startOfYear()->format('Y-m-d'),
                    $now->format('Y-m-d')
                ]);
                break;
            case 'year':
                // Last 5 years
                $query->whereBetween('tanggal', [
                    $now->copy()->subYears(4)->startOfYear()->format('Y-m-d'),
                    $now->format('Y-m-d')
                ]);
                break;
        }
    }
}