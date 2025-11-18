<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Program extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'slug',
        'category',
        'location',
        'latitude',
        'longitude',
        'description',
        'facilities',
        'status',
        'year',
        'target',
        'image_url',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'facilities' => 'array',
        'latitude' => 'decimal:6',
        'longitude' => 'decimal:6',
        'year' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * The attributes that should be hidden.
     */
    protected $hidden = [
        'deleted_at',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-generate slug when creating
        static::creating(function ($program) {
            if (empty($program->slug)) {
                $program->slug = Str::slug($program->name);
                
                // Ensure slug is unique
                $originalSlug = $program->slug;
                $count = 1;
                while (static::where('slug', $program->slug)->exists()) {
                    $program->slug = $originalSlug . '-' . $count;
                    $count++;
                }
            }
        });

        // Update slug when updating name
        static::updating(function ($program) {
            if ($program->isDirty('name') && !$program->isDirty('slug')) {
                $program->slug = Str::slug($program->name);
                
                // Ensure slug is unique (excluding current record)
                $originalSlug = $program->slug;
                $count = 1;
                while (static::where('slug', $program->slug)
                    ->where('id', '!=', $program->id)
                    ->exists()) {
                    $program->slug = $originalSlug . '-' . $count;
                    $count++;
                }
            }
        });
    }

    /**
     * Scope for filtering by category
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope for filtering by status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope for filtering by year
     */
    public function scopeByYear($query, $year)
    {
        return $query->where('year', $year);
    }

    /**
     * Scope for active programs only
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'Aktif');
    }

    /**
     * Scope for recent programs
     */
    public function scopeRecent($query, $limit = 3)
    {
        return $query->orderBy('created_at', 'desc')->limit($limit);
    }

    /**
     * Get formatted date for display
     */
    public function getFormattedDateAttribute()
    {
        return $this->created_at->format('d F Y');
    }

    /**
     * Get full image URL
     */
    public function getImageUrlFullAttribute()
    {
        if ($this->image_url) {
            return url('storage/' . $this->image_url);
        }
        return null;
    }
}