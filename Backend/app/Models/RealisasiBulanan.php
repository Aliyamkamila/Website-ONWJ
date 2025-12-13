<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use illuminate\Support\Facades\Validator;

class RealisasiBulanan extends Model
{
    use HasFactory;

    protected $table = 'realisasi_bulanan';

    protected $fillable = [
        'tahun',
        'bulan',
        'realisasi_brent',
        'realisasi_ardjuna',
        'realisasi_kresna',
        'alpha_ardjuna',
        'alpha_kresna',
        'avg_alpha_ardjuna_3m',
        'avg_alpha_kresna_3m',
    ];

    protected $casts = [
        'tahun' => 'integer',
        'bulan' => 'integer',
        'realisasi_brent' => 'decimal:2',
        'realisasi_ardjuna' => 'decimal:2',
        'realisasi_kresna' => 'decimal:2',
        'alpha_ardjuna' => 'decimal:2',
        'alpha_kresna' => 'decimal:2',
        'avg_alpha_ardjuna_3m' => 'decimal:2',
        'avg_alpha_kresna_3m' => 'decimal: 2',
    ];

    /**
     * Calculate alpha values
     */
    public static function calculateAlpha($realisasiBrent, $realisasiArdjuna, $realisasiKresna)
    {
        return [
            'alpha_ardjuna' => round($realisasiArdjuna - $realisasiBrent, 2),
            'alpha_kresna' => round($realisasiKresna - $realisasiBrent, 2),
        ];
    }

    /**
     * Calculate 3-month average alpha
     */
    public static function calculate3MonthAverage($tahun, $bulan)
    {
        // Ambil 3 bulan terakhir (termasuk bulan ini yang baru diinput)
        $data = self::where(function ($query) use ($tahun, $bulan) {
            $query->where('tahun', $tahun)
                ->where('bulan', '<=', $bulan);
        })
        ->orWhere(function ($query) use ($tahun, $bulan) {
            if ($bulan <= 3) {
                $prevYear = $tahun - 1;
                $prevMonthsNeeded = 3 - $bulan;
                $query->where('tahun', $prevYear)
                    ->where('bulan', '>', 12 - $prevMonthsNeeded);
            }
        })
        ->orderBy('tahun', 'desc')
        ->orderBy('bulan', 'desc')
        ->limit(3)
        ->get();

        if ($data->count() < 3) {
            // Jika belum cukup 3 bulan, return null (akan pakai data yang ada saja)
            return null;
        }

        return [
            'avg_alpha_ardjuna_3m' => round($data->avg('alpha_ardjuna'), 2),
            'avg_alpha_kresna_3m' => round($data->avg('alpha_kresna'), 2),
        ];
    }

    /**
     * Get current month average alpha (untuk perhitungan harian)
     */
        public static function getCurrentMonthAlpha($tahun, $bulan)
    {
        // Coba ambil 3 bulan terakhir (termasuk bulan ini)
        $data = self::where(function ($query) use ($tahun, $bulan) {
            $query->where('tahun', $tahun)
                ->where('bulan', '<=', $bulan);
        })
        ->orWhere(function ($query) use ($tahun, $bulan) {
            // Include bulan-bulan dari tahun sebelumnya jika bulan < 3
            if ($bulan <= 3) {
                $query->where('tahun', $tahun - 1)
                    ->where('bulan', '>', 12 - (3 - $bulan));
            }
        })
        ->orderBy('tahun', 'desc')
        ->orderBy('bulan', 'desc')
        ->limit(3)
        ->get();

        if ($data->count() < 3) {
            // Jika data kurang dari 3 bulan, ambil semua yang ada
            $data = self:: orderBy('tahun', 'desc')
                        ->orderBy('bulan', 'desc')
                        ->limit(3)
                        ->get();
        }

        if ($data->isEmpty()) {
            // Default fallback jika tidak ada data sama sekali
            return [
                'avg_alpha_ardjuna' => 0,
                'avg_alpha_kresna' => 0,
            ];
        }

        // Hitung rata-rata dari 3 bulan terakhir
        return [
            'avg_alpha_ardjuna' => round($data->avg('alpha_ardjuna'), 2),
            'avg_alpha_kresna' => round($data->avg('alpha_kresna'), 2),
        ];
    }

        public function storeRealisasiBulanan(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'tahun' => 'required|integer|min:2020|max:2030',
                'bulan' => 'required|integer|min: 1|max:12',
                'realisasi_brent' => 'required|numeric|min:0|max:9999.99',
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

            // ✅ PENTING: Recalculate data harian untuk bulan ini DAN bulan berikutnya
            $this->recalculateMonthlyPrices($request->tahun, $request->bulan);
            
            // ✅ Recalculate bulan berikutnya juga (jika ada data)
            $nextMonth = $request->bulan + 1;
            $nextYear = $request->tahun;
            if ($nextMonth > 12) {
                $nextMonth = 1;
                $nextYear++;
            }
            
            $hasNextMonthData = Harga::where('tahun', $nextYear)
                                    ->where('bulan', $nextMonth)
                                    ->exists();
            
            if ($hasNextMonthData) {
                $this->recalculateMonthlyPrices($nextYear, $nextMonth);
            }

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
                'message' => 'Terjadi kesalahan:  ' .$e->getMessage(),
            ], 500);
        }
    }
}