<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TjslStatistic extends Model
{
    use HasFactory;

    protected $table = 'tjsl_statistics';

    protected $fillable = [
        'key',
        'label',
        'unit',
        'value',
        'display_order',
        'icon_name',
        'color',
        'is_active',
    ];

    protected $casts = [
        'value' => 'integer',
        'display_order' => 'integer',
        'is_active' => 'boolean',
    ];

    // ===== SCOPES =====

    /**
     * Scope for active statistics
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for ordered display
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order', 'asc')
                     ->orderBy('id', 'asc');
    }

    // ===== HELPER METHODS =====

    /**
     * Get all statistics formatted for frontend
     */
    public static function getFormattedStatistics()
    {
        $statistics = static::active()->ordered()->get();
        
        $formatted = [];
        foreach ($statistics as $stat) {
            $formatted[$stat->key] = [
                'label' => $stat->label,
                'unit' => $stat->unit,
                'value' => $stat->value,
                'icon_name' => $stat->icon_name,
                'color' => $stat->color,
            ];
        }
        
        return $formatted;
    }

    /**
     * Update statistic value by key
     */
    public static function updateByKey($key, $value)
    {
        $statistic = static::where('key', $key)->first();
        
        if ($statistic) {
            $statistic->value = $value;
            $statistic->save();
            return true;
        }
        
        return false;
    }

    /**
     * Bulk update statistics
     */
    public static function bulkUpdate($data)
    {
        foreach ($data as $key => $item) {
            static::where('key', $key)->update([
                'value' => $item['value'] ?? 0,
                'label' => $item['label'] ??  null,
                'unit' => $item['unit'] ?? null,
            ]);
        }
        
        return true;
    }
}