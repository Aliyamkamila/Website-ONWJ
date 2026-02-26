<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TjslStatistic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class TjslStatisticController extends Controller
{
    // ===== PUBLIC ROUTES (untuk TJSLPage.jsx) =====

    /**
     * Get TJSL statistics for public display
     */
    public function index()
    {
        try {
            $statistics = TjslStatistic::getFormattedStatistics();

            return response()->json([
                'success' => true,
                'message' => 'TJSL statistics retrieved successfully',
                'data' => $statistics,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve TJSL statistics: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve TJSL statistics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // ===== ADMIN ROUTES (untuk ManageAngkaStatistikTJSL.jsx) =====

    /**
     * Get all statistics for admin (with full details)
     */
    public function adminIndex()
    {
        try {
            $statistics = TjslStatistic::ordered()->get();

            // Format untuk admin panel
            $formatted = [];
            foreach ($statistics as $stat) {
                // Convert key dari snake_case ke camelCase untuk frontend
                $camelKey = str_replace('_', '', ucwords($stat->key, '_'));
                $camelKey = lcfirst($camelKey);

                $formatted[$camelKey] = [
                    'id' => $stat->id,
                    'key' => $stat->key,
                    'value' => $stat->value,
                    'label' => $stat->label,
                    'unit' => $stat->unit,
                    'icon_name' => $stat->icon_name,
                    'color' => $stat->color,
                    'display_order' => $stat->display_order,
                    'is_active' => $stat->is_active,
                ];
            }

            return response()->json([
                'success' => true,
                'message' => 'Statistics retrieved successfully',
                'data' => $formatted,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve admin statistics: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get single statistic by key
     */
    public function show($key)
    {
        try {
            $statistic = TjslStatistic::where('key', $key)->firstOrFail();

            return response()->json([
                'success' => true,
                'message' => 'Statistic retrieved successfully',
                'data' => $statistic,
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Statistic not found',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve statistic: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistic',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update single statistic
     */
    public function update(Request $request, $id)
    {
        try {
            $statistic = TjslStatistic::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'value' => 'required|integer|min:0',
                'label' => 'sometimes|required|string|max:255',
                'unit' => 'nullable|string|max:100',
                'icon_name' => 'nullable|string|max:100',
                'color' => 'nullable|string|max:50',
                'is_active' => 'sometimes|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $updateData = $request->only(['value', 'label', 'unit', 'icon_name', 'color', 'is_active']);
            $statistic->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Statistic updated successfully',
                'data' => $statistic,
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Statistic not found',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Failed to update statistic: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update statistic',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Bulk update statistics (untuk save semua sekaligus)
     */
    public function bulkUpdate(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'statistics' => 'required|array',
                'statistics.*.key' => 'required|string',
                'statistics.*.value' => 'required|integer|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
                ], 422);
            }

            foreach ($request->statistics as $item) {
                // Convert camelCase key to snake_case jika perlu
                $snakeKey = isset($item['key']) ? strtolower(preg_replace('/([a-z])([A-Z])/', '$1_$2', $item['key'])) : null;
                
                // Coba cari berdasarkan key asli atau snake_case
                $statistic = TjslStatistic::where('key', $item['key'])
                                ->orWhere('key', $snakeKey)
                                ->first();
                
                if ($statistic) {
                    $statistic->update(['value' => $item['value']]);
                }
            }

            // Get updated data
            $statistics = TjslStatistic::getFormattedStatistics();

            return response()->json([
                'success' => true,
                'message' => 'Statistics updated successfully',
                'data' => $statistics,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to bulk update statistics: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update statistics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Reset statistics to default values
     */
    public function reset()
    {
        try {
            // Default values sesuai dengan database
            $defaults = [
                'penerimaan_manfaat' => 99500,
                'infrastruktur' => 4,
                'ebtke' => 8,
                'paket_pendidikan' => 800,
                'kelompok_binaan' => 3,
            ];

            foreach ($defaults as $key => $value) {
                TjslStatistic::where('key', $key)->update(['value' => $value]);
            }

            $statistics = TjslStatistic::getFormattedStatistics();

            return response()->json([
                'success' => true,
                'message' => 'Statistics reset to default values',
                'data' => $statistics,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to reset statistics: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to reset statistics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}