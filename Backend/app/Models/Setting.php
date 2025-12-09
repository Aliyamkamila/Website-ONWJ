<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
        'category',
        'label',
        'description',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    /**
     * Boot model events
     */
    protected static function boot()
    {
        parent:: boot();

        // Clear cache when settings are updated
        static::saved(function () {
            Cache::forget('site_settings');
        });

        static::deleted(function () {
            Cache:: forget('site_settings');
        });
    }

    /**
     * Get setting value by key
     */
    public static function get($key, $default = null)
    {
        $settings = self::getAllCached();
        return $settings[$key] ?? $default;
    }

    /**
     * Set setting value by key
     */
    public static function set($key, $value)
    {
        return self::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
    }

    /**
     * Get all settings (cached)
     */
    public static function getAllCached()
    {
        return Cache::rememberForever('site_settings', function () {
            return self::pluck('value', 'key')->toArray();
        });
    }

    /**
     * Get settings grouped by category
     */
    public static function getByCategory()
    {
        return self:: orderBy('order')
            ->orderBy('label')
            ->get()
            ->groupBy('category');
    }

    /**
     * Get image URL
     */
    public function getImageUrlAttribute()
    {
        if ($this->type === 'image' && $this->value) {
            return Storage::url($this->value);
        }
        return null;
    }
}