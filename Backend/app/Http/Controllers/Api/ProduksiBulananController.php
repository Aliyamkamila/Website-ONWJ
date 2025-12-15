<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProduksiBulanan;
use App\Models\WkTekkom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ProduksiBulananController extends Controller
{
    /**
     * PUBLIC: Get produksi data for specific area
     */
    public function index(Request $request)
    {
        try {
            $query = ProduksiBulanan::with('wkTekkom:id,area_id,name');

            // Filter by area
            if ($request->has('wk_tekkom_id')) {
                $query->where('wk_tekkom_id', $request->wk_tekkom_id);
            }

            // Filter by tahun
            if ($request->has('tahun')) {
                $query->where('tahun', $request->tahun);
            }

            // Filter by bulan
            if ($request->has('bulan')) {
                $query->where('bulan', $request->bulan);
            }

            // Sort by newest first
            $query->orderBy('tahun', 'desc')
                  ->orderBy('bulan', 'desc');

            $produksi = $query->get();

            // Transform data
            $data = $produksi->map(function ($item) {
                return [
                    'id' => $item->id,
                    'area_id' => $item->wkTekkom->area_id ?? null,
                    'area_name' => $item->wkTekkom->name ?? null,
                    'bulan' => $item->bulan,
                    'bulan_name' => $item->bulan_name,
                    'tahun' => $item->tahun,
                    'periode' => $item->bulan_name . ' ' . $item->tahun,
                    'produksi_minyak' => $item->produksi_minyak,
                    'produksi_gas' => $item->produksi_gas,
                    'produksi_minyak_formatted' => $item->formatted_produksi_minyak,
                    'produksi_gas_formatted' => $item->formatted_produksi_gas,
                    'catatan' => $item->catatan,
                    // Data Teknis
                    'wells' => $item->wells,
                    'depth' => $item->depth,
                    'pressure' => $item->pressure,
                    'temperature' => $item->temperature,
                    // Fasilitas & Infrastruktur
                    'facilities' => $item->facilities ?? [],
                    'status' => $item->status,
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Data produksi berhasil diambil',
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data produksi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * PUBLIC: Get produksi statistics
     */
    public function statistics(Request $request)
    {
        try {
            $tahun = $request->get('tahun', date('Y'));

            $stats = [
                'total_produksi_minyak' => ProduksiBulanan::where('tahun', $tahun)
                    ->sum('produksi_minyak'),
                'total_produksi_gas' => ProduksiBulanan::where('tahun', $tahun)
                    ->sum('produksi_gas'),
                'rata_rata_minyak' => ProduksiBulanan::where('tahun', $tahun)
                    ->avg('produksi_minyak'),
                'rata_rata_gas' => ProduksiBulanan::where('tahun', $tahun)
                    ->avg('produksi_gas'),
                'total_records' => ProduksiBulanan::where('tahun', $tahun)->count(),
            ];

            return response()->json([
                'success' => true,
                'message' => 'Statistik produksi berhasil diambil',
                'data' => $stats,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil statistik',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ADMIN: Get all produksi (with filters)
     */
    public function adminIndex(Request $request)
    {
        try {
            $query = ProduksiBulanan::with('wkTekkom:id,area_id,name');

            // Search
            if ($request->has('search')) {
                $search = $request->search;
                $query->whereHas('wkTekkom', function ($q) use ($search) {
                    $q->where('area_id', 'like', "%{$search}%")
                      ->orWhere('name', 'like', "%{$search}%");
                });
            }

            // Filter by tahun
            if ($request->has('tahun')) {
                $query->where('tahun', $request->tahun);
            }

            // Filter by bulan
            if ($request->has('bulan')) {
                $query->where('bulan', $request->bulan);
            }

            // Filter by area
            if ($request->has('wk_tekkom_id')) {
                $query->where('wk_tekkom_id', $request->wk_tekkom_id);
            }

            // Sort
            $sortBy = $request->get('sort_by', 'tahun');
            $sortOrder = $request->get('sort_order', 'desc');
            
            if ($sortBy === 'area') {
                $query->join('wk_tekkom', 'produksi_bulanan.wk_tekkom_id', '=', 'wk_tekkom.id')
                      ->orderBy('wk_tekkom.area_id', $sortOrder)
                      ->select('produksi_bulanan.*');
            } else {
                $query->orderBy($sortBy, $sortOrder);
            }

            $produksi = $query->get();

            // Transform data
            $data = $produksi->map(function ($item) {
                return [
                    'id' => $item->id,
                    'wk_tekkom_id' => $item->wk_tekkom_id,
                    'area_id' => $item->wkTekkom->area_id ?? null,
                    'area_name' => $item->wkTekkom->name ?? null,
                    'bulan' => $item->bulan,
                    'bulan_name' => $item->bulan_name,
                    'tahun' => $item->tahun,
                    'periode' => $item->bulan_name . ' ' . $item->tahun,
                    'produksi_minyak' => $item->produksi_minyak,
                    'produksi_gas' => $item->produksi_gas,
                    'catatan' => $item->catatan,
                    // Data Teknis
                    'wells' => $item->wells,
                    'depth' => $item->depth,
                    'pressure' => $item->pressure,
                    'temperature' => $item->temperature,
                    // Fasilitas & Infrastruktur
                    'facilities' => $item->facilities ?? [],
                    'status' => $item->status,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Data produksi berhasil diambil',
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data produksi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ADMIN: Store new produksi
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'wk_tekkom_id' => 'required|exists:wk_tekkom,id',
                'bulan' => 'required|integer|min:1|max:12',
                'tahun' => 'required|integer|min:2021|max:2099',
                'produksi_minyak' => 'nullable|numeric|min:0',
                'produksi_gas' => 'nullable|numeric|min:0',
                'catatan' => 'nullable|string|max:1000',
                // Data Teknis
                'wells' => 'nullable|integer|min:0',
                'depth' => 'nullable|string|max:100',
                'pressure' => 'nullable|string|max:100',
                'temperature' => 'nullable|string|max:100',
                // Fasilitas & Infrastruktur
                'facilities' => 'nullable|array',
                'facilities.*' => 'string|max:255',
                'status' => 'nullable|in:Operasional,Non-Operasional',
            ], [
                'wk_tekkom_id.required' => 'Area wajib dipilih',
                'wk_tekkom_id.exists' => 'Area tidak valid',
                'bulan.required' => 'Bulan wajib diisi',
                'bulan.min' => 'Bulan harus antara 1-12',
                'bulan.max' => 'Bulan harus antara 1-12',
                'tahun.required' => 'Tahun wajib diisi',
                'tahun.min' => 'Tahun minimal 2021',
                'produksi_minyak.numeric' => 'Produksi minyak harus berupa angka',
                'produksi_gas.numeric' => 'Produksi gas harus berupa angka',
                'wells.integer' => 'Jumlah sumur harus berupa angka bulat',
                'status.in' => 'Status harus Operasional atau Non-Operasional',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Check duplicate
            $exists = ProduksiBulanan::where('wk_tekkom_id', $request->wk_tekkom_id)
                ->where('bulan', $request->bulan)
                ->where('tahun', $request->tahun)
                ->exists();

            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data produksi untuk area, bulan, dan tahun ini sudah ada',
                ], 422);
            }

            $produksi = ProduksiBulanan::create($request->all());
            $produksi->load('wkTekkom:id,area_id,name');

            return response()->json([
                'success' => true,
                'message' => 'Data produksi berhasil disimpan',
                'data' => $produksi,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan data produksi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ADMIN: Update produksi
     */
    public function update(Request $request, $id)
    {
        try {
            $produksi = ProduksiBulanan::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'wk_tekkom_id' => 'required|exists:wk_tekkom,id',
                'bulan' => 'required|integer|min:1|max:12',
                'tahun' => 'required|integer|min:2021|max:2099',
                'produksi_minyak' => 'nullable|numeric|min:0',
                'produksi_gas' => 'nullable|numeric|min:0',
                'catatan' => 'nullable|string|max:1000',
                // Data Teknis
                'wells' => 'nullable|integer|min:0',
                'depth' => 'nullable|string|max:100',
                'pressure' => 'nullable|string|max:100',
                'temperature' => 'nullable|string|max:100',
                // Fasilitas & Infrastruktur
                'facilities' => 'nullable|array',
                'facilities.*' => 'string|max:255',
                'status' => 'nullable|in:Operasional,Non-Operasional',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Check duplicate (exclude current record)
            $exists = ProduksiBulanan::where('wk_tekkom_id', $request->wk_tekkom_id)
                ->where('bulan', $request->bulan)
                ->where('tahun', $request->tahun)
                ->where('id', '!=', $id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data produksi untuk area, bulan, dan tahun ini sudah ada',
                ], 422);
            }

            $produksi->update($request->all());
            $produksi->load('wkTekkom:id,area_id,name');

            return response()->json([
                'success' => true,
                'message' => 'Data produksi berhasil diupdate',
                'data' => $produksi,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate data produksi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ADMIN: Delete produksi
     */
    public function destroy($id)
    {
        try {
            $produksi = ProduksiBulanan::findOrFail($id);
            $produksi->delete();

            return response()->json([
                'success' => true,
                'message' => 'Data produksi berhasil dihapus',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus data produksi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ADMIN: Get available areas for dropdown
     */
    public function getAreas()
    {
        try {
            $areas = WkTekkom::where('is_active', true)
                ->orderBy('area_id')
                ->get(['id', 'area_id', 'name']);

            return response()->json([
                'success' => true,
                'message' => 'Data area berhasil diambil',
                'data' => $areas,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data area',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
