<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Umkm extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The table associated with the model.
     */
    protected $table = 'umkm';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'category',
        'owner',
        'location',
        'description',
        'testimonial',
        'shop_link',
        'contact_number',
        'status',
        'year_started',
        'achievement',
        'is_featured',
        'image_url',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'is_featured' => 'boolean',
        'year_started' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     */
    protected $appends = ['full_image_url'];

    /**
     * Get the full image URL.
     */
    public function getFullImageUrlAttribute(): ?string
    {
        if ($this->image_url) {
            return Storage::disk('public')->url($this->image_url);
        }
        return null;
    }

    /**
     * Scope a query to only include featured UMKM.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope a query to only include active UMKM.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'Aktif');
    }

    /**
     * Scope a query to filter by category.
     */
    public function scopeByCategory($query, $category)
    {
        if ($category && $category !== 'Semua') {
            return $query->where('category', $category);
        }
        return $query;
    }

    /**
     * Get available categories.
     */
    public static function getCategories(): array
    {
        return [
            'Kuliner',
            'Kerajinan',
            'Agribisnis',
            'Fashion',
            'Jasa',
            'Lainnya'
        ];
    }

    /**
     * Get available status options.
     */
    public static function getStatusOptions(): array
    {
        return [
            'Aktif',
            'Lulus Binaan',
            'Dalam Proses'
        ];
    }
}