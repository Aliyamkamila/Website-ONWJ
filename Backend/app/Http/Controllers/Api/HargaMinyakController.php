<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Harga;
use App\Models\RealisasiBulanan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class HargaMinyakController extends Controller
{
    /**
     * PUBLIC:  Get data harga dengan filter
     */
    public function index(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'from' => 'nullable|date',
                'to' => 'nullable|date|after_or_equal:from',
                'tahun' => 'nullable|integer|min:2020|max:2030',
                'bulan' => 'nullable|integer|min: 1|max:12',
                'limit' => 'nullable|integer|min:1|max:1000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $query = Harga::query();

            // Filter berdasarkan range tanggal
            if ($request->has('from') && $request->has('to')) {
                $query->whereBetween('tanggal', [$request->from, $request->to]);
            } else {
                // Default: last 3 months
                $query->where('tanggal', '>=', Carbon::now()->subMonths(3)->format('Y-m-d'));
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
            if ($request->has('limit')) {
                $query->limit($request->limit);
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
                    'ardjuna' => (float) $item->ardjuna,
                    'kresna' => (float) $item->kresna,
                ];
            });

            // Get statistics
            $filters = [
                'from' => $request->from,
                'to' => $request->to,
                'tahun' => $request->tahun,
                'bulan' => $request->bulan,
            ];

            $stats = Harga::getStats(array_filter($filters));

            return response()->json([
                'success' => true,
                'message' => 'Data berhasil diambil',
                'data' => [
                    'chartData' => $chartData,
                    'stats' => $stats['stats'],
                    'total' => $chartData->count(),
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
     * PUBLIC: Get statistics
     */
    public function statistics(Request $request)
    {
        try {
            $stats = Harga::getStats([]);

            return response()->json([
                'success' => true,
                'message' => 'Statistik berhasil diambil',
                'data' => $stats,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' .$e->getMessage(),
            ], 500);
        }
    }

    /**
     * PUBLIC: Get latest data
     */
    public function latest(Request $request)
    {
        try {
            $limit = $request->input('limit', 10);

            $data = Harga:: orderBy('tanggal', 'desc')
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
                'message' => 'Terjadi kesalahan:  ' .$e->getMessage(),
            ], 500);
        }
    }

    /**
     * PUBLIC: Show single harga data
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
                'message' => 'Data tidak ditemukan',
            ], 404);
        }
    }

    /**
     * ADMIN: Get all data with pagination
     */
    public function adminIndex(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 15);
            $search = $request->input('search');
            $tahun = $request->input('tahun');
            $bulan = $request->input('bulan');
            $sortBy = $request->input('sort_by', 'tanggal');
            $sortOrder = $request->input('sort_order', 'desc');

            $query = Harga::query();

            // Search
            if ($search) {
                $query->where('tanggal', 'like', "%{$search}%");
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
     * ADMIN: Store new harga data (hanya input Brent)
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'tanggal' => 'required|date|unique:harga_minyak,tanggal',
                'brent' => 'required|numeric|min:0|max:9999.99',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $date = Carbon::parse($request->tanggal);
            
            // Get alpha average for this month
            $alpha = RealisasiBulanan::getCurrentMonthAlpha($date->year, $date->month);

            // Calculate Ardjuna and Kresna
            $brent = (float) $request->brent;
            $ardjuna = round($brent + $alpha['avg_alpha_ardjuna'], 2);
            $kresna = round($brent + $alpha['avg_alpha_kresna'], 2);

            $harga = Harga::create([
                'tanggal' => $date->format('Y-m-d'),
                'brent' => $brent,
                'duri' => 80.08, // Constant
                'ardjuna' => $ardjuna,
                'kresna' => $kresna,
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
     * ADMIN: Update harga data (hanya update Brent)
     */
    public function update(Request $request, $id)
    {
        try {
            $harga = Harga::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'tanggal' => 'required|date|unique:harga_minyak,tanggal,' .$id,
                'brent' => 'required|numeric|min:0|max:9999.99',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $date = Carbon::parse($request->tanggal);
            
            // Get alpha average for this month
            $alpha = RealisasiBulanan::getCurrentMonthAlpha($date->year, $date->month);

            // Calculate Ardjuna and Kresna
            $brent = (float) $request->brent;
            $ardjuna = round($brent + $alpha['avg_alpha_ardjuna'], 2);
            $kresna = round($brent + $alpha['avg_alpha_kresna'], 2);

            $harga->update([
                'tanggal' => $date->format('Y-m-d'),
                'brent' => $brent,
                'duri' => 80.08, // Constant
                'ardjuna' => $ardjuna,
                'kresna' => $kresna,
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
     * ADMIN: Delete harga data
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
                'message' => 'Terjadi kesalahan:  ' .$e->getMessage(),
            ], 500);
        }
    }

    /**
     * ADMIN:  Bulk insert data (hanya Brent dari CSV/Excel)
     */
    public function bulkStore(Request $request)
    {
        try {
            $validator = Validator:: make($request->all(), [
                'data' => 'required|array|min:1',
                'data.*.tanggal' => 'required|date',
                'data.*.brent' => 'required|numeric|min:0|max:9999.99',
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

            DB::beginTransaction();

            foreach ($request->data as $item) {
                try {
                    $date = Carbon::parse($item['tanggal']);
                    
                    // Check if date already exists
                    $exists = Harga::where('tanggal', $date->format('Y-m-d'))->exists();
                    
                    if ($exists) {
                        $errors[] = [
                            'tanggal' => $item['tanggal'],
                            'error' => 'Tanggal sudah ada',
                        ];
                        continue;
                    }

                    // Get alpha average for this month
                    $alpha = RealisasiBulanan::getCurrentMonthAlpha($date->year, $date->month);

                    // Calculate Ardjuna and Kresna
                    $brent = (float) $item['brent'];
                    $ardjuna = round($brent + $alpha['avg_alpha_ardjuna'], 2);
                    $kresna = round($brent + $alpha['avg_alpha_kresna'], 2);

                    $harga = Harga::create([
                        'tanggal' => $date->format('Y-m-d'),
                        'brent' => $brent,
                        'duri' => 80.08, // Constant
                        'ardjuna' => $ardjuna,
                        'kresna' => $kresna,
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

            DB:: commit();

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
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' .$e->getMessage(),
            ], 500);
        }
    }

    /**
     * ADMIN:  Bulk delete
     */
    public function bulkDelete(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'ids' => 'required|array|min:1',
                'ids.*' => 'required|integer|exists:harga_minyak,id',
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
     * ADMIN:  Get realisasi bulanan
     */
    public function getRealisasiBulanan(Request $request)
    {
        try {
            $query = RealisasiBulanan::query();

            if ($request->has('tahun')) {
                $query->where('tahun', $request->tahun);
            }

            if ($request->has('bulan')) {
                $query->where('bulan', $request->bulan);
            }

            $data = $query->orderBy('tahun', 'desc')
                          ->orderBy('bulan', 'desc')
                          ->get();

            return response()->json([
                'success' => true,
                'message' => 'Data realisasi berhasil diambil',
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan:  ' .$e->getMessage(),
            ], 500);
        }
    }

    /**
     * ADMIN: Store/Update realisasi bulanan
     */
    public function storeRealisasiBulanan(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'tahun' => 'required|integer|min:2020|max:2030',
                'bulan' => 'required|integer|min:1|max: 12',
                'realisasi_brent' => 'required|numeric|min:0|max: 9999.99',
                'realisasi_ardjuna' => 'required|numeric|min:0|max:9999.99',
                'realisasi_kresna' => 'required|numeric|min:0|max:9999.99',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors(),
                ], 422);
            }

            DB::beginTransaction();

            // Calculate alpha
            $alpha = RealisasiBulanan::calculateAlpha(
                $request->realisasi_brent,
                $request->realisasi_ardjuna,
                $request->realisasi_kresna
            );

            // Create or update
            $realisasi = RealisasiBulanan::updateOrCreate(
                [
                    'tahun' => $request->tahun,
                    'bulan' => $request->bulan,
                ],
                [
                    'realisasi_brent' => $request->realisasi_brent,
                    'realisasi_ardjuna' => $request->realisasi_ardjuna,
                    'realisasi_kresna' => $request->realisasi_kresna,
                    'alpha_ardjuna' => $alpha['alpha_ardjuna'],
                    'alpha_kresna' => $alpha['alpha_kresna'],
                ]
            );

            // Calculate 3-month average
            $avg = RealisasiBulanan::calculate3MonthAverage($request->tahun, $request->bulan);
            
            if ($avg) {
                $realisasi->update($avg);
            }

            // Recalculate all daily prices for this month
            $this->recalculateMonthlyPrices($request->tahun, $request->bulan);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Data realisasi berhasil disimpan dan harga harian diperbarui',
                'data' => $realisasi,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' .$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Helper:  Recalculate monthly prices after realisasi update
     */
    private function recalculateMonthlyPrices($tahun, $bulan)
    {
        // Get alpha average for this month
        $alpha = RealisasiBulanan:: getCurrentMonthAlpha($tahun, $bulan);

        // Get all daily data for this month
        $dailyData = Harga::where('tahun', $tahun)
                          ->where('bulan', $bulan)
                          ->get();

        foreach ($dailyData as $data) {
            $ardjuna = round($data->brent + $alpha['avg_alpha_ardjuna'], 2);
            $kresna = round($data->brent + $alpha['avg_alpha_kresna'], 2);

            $data->update([
                'ardjuna' => $ardjuna,
                'kresna' => $kresna,
            ]);
        }
    }
}