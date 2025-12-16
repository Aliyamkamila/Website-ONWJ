<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSection extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'type',
        'src',
        'duration',
        'label',
        'title',
        'description',
        'order',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'duration' => 'integer',
        'order' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get the full URL for the media file
     */
    public function getFullSrcAttribute(): string
    {
        if (str_starts_with($this->src, 'http')) {
            return $this->src;
        }
        return url('storage/' . $this->src);
    }

    /**
     * Scope query to only active hero sections
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope query to order by order column
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }
}
