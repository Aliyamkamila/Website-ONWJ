<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TjslStatistic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TjslStatisticController extends Controller
{
    /**
     * Display a listing of TJSL statistics for admin.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function adminIndex()
    {
        try {
            $statistics = TjslStatistic::ordered()->get();

            // ✅ Return as indexed object (bukan array)
            $formatted = [];
            foreach ($statistics as $stat) {
                $formatted[$stat->key] = [
                    'id' => $stat->id,
                    'key' => $stat->key,
                    'value' => $stat->value,
                    'label' => $stat->label,
                    'unit' => $stat->unit,
                    'icon_name' => $stat->icon_name,
                    'color' => $stat->color,
                    'display_order' => $stat->display_order ?? 0,
                    'is_active' => $stat->is_active ?? true,
                ];
            }

            return response()->json([
                'success' => true,
                'message' => 'Statistics retrieved successfully',
                'data' => $formatted, // ✅ Return as object
            ], 200);

        } catch (\Exception $e) {
            Log::error('❌ Error in adminIndex: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified statistic.
     *
     * @param  string  $key
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($key)
    {
        try {
            $statistic = TjslStatistic::where('key', $key)->first();
            
            if (!$statistic) {
                return response()->json([
                    'success' => false,
                    'message' => 'Statistic not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Statistic retrieved successfully',
                'data' => $statistic
            ], 200);

        } catch (\Exception $e) {
            Log::error('❌ Error in show: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistic',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified statistic.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $key
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $key)
    {
        try {
            $statistic = TjslStatistic::where('key', $key)->first();
            
            if (!$statistic) {
                return response()->json([
                    'success' => false,
                    'message' => 'Statistic not found'
                ], 404);
            }

            $validated = $request->validate([
                'value' => 'sometimes|numeric',
                'label' => 'sometimes|string|max:255',
                'unit' => 'nullable|string|max:50',
                'icon_name' => 'nullable|string|max:100',
                'color' => 'nullable|string|max:50',
                'display_order' => 'sometimes|integer',
                'is_active' => 'sometimes|boolean',
            ]);

            $statistic->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Statistic updated successfully',
                'data' => $statistic
            ], 200);

        } catch (\Exception $e) {
            Log::error('❌ Error in update: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update statistic',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Bulk update statistics.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function bulkUpdate(Request $request)
    {
        try {
            $validated = $request->validate([
                'statistics' => 'required|array',
                'statistics.*.key' => 'required|string',
                'statistics.*.value' => 'required|numeric',
            ]);

            foreach ($validated['statistics'] as $data) {
                TjslStatistic::where('key', $data['key'])->update([
                    'value' => $data['value']
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Statistics updated successfully',
            ], 200);

        } catch (\Exception $e) {
            Log::error('❌ Error in bulkUpdate: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update statistics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Reset statistics to default values.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function reset()
    {
        try {
            // Define default values for statistics
            $defaults = [
                'program_count' => 0,
                'beneficiary_count' => 0,
                'village_count' => 0,
                'fund_allocated' => 0,
            ];

            foreach ($defaults as $key => $value) {
                TjslStatistic::where('key', $key)->update([
                    'value' => $value
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Statistics reset successfully',
            ], 200);

        } catch (\Exception $e) {
            Log::error('❌ Error in reset: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to reset statistics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display statistics for public API.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $statistics = TjslStatistic::where('is_active', true)
                ->ordered()
                ->get(['key', 'value', 'label', 'unit', 'icon_name', 'color']);

            return response()->json([
                'success' => true,
                'message' => 'Statistics retrieved successfully',
                'data' => $statistics
            ], 200);

        } catch (\Exception $e) {
            Log::error('❌ Error in index: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}