<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Testimonial extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'testimonials';

    protected $fillable = [
        'name',
        'location',
        'program',
        'testimonial',
        'avatar_path',
        'avatar_url',
        'status',
        'featured',
        'display_order',
        'created_by',
        'published_at',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'display_order' => 'integer',
        'published_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $appends = ['full_avatar_url', 'formatted_date'];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($testimonial) {
            if ($testimonial->status === 'published' && !$testimonial->published_at) {
                $testimonial->published_at = now();
            }
        });

        static::deleting(function ($testimonial) {
            if ($testimonial->avatar_path && Storage::disk('public')->exists($testimonial->avatar_path)) {
                Storage::disk('public')->delete($testimonial->avatar_path);
            }
        });
    }

    public function getFullAvatarUrlAttribute()
    {
        if ($this->avatar_url) {
            return $this->avatar_url;
        }
        
        if ($this->avatar_path && Storage::disk('public')->exists($this->avatar_path)) {
            return asset('storage/' . $this->avatar_path);
        }
        
        return null;
    }

    public function getFormattedDateAttribute()
    {
        return $this->created_at ?  $this->created_at->format('d F Y') : null;
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                     ->whereNotNull('published_at');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopeByProgram($query, $program)
    {
        return $query->where('program', $program);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('location', 'like', "%{$search}%")
              ->orWhere('testimonial', 'like', "%{$search}%")
              ->orWhere('program', 'like', "%{$search}%");
        });
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order', 'desc')
                     ->orderBy('published_at', 'desc')
                     ->orderBy('created_at', 'desc');
    }

    public static function getPrograms()
    {
        return static::select('program')
                     ->distinct()
                     ->orderBy('program')
                     ->pluck('program')
                     ->toArray();
    }

    public static function getStatistics()
    {
        $now = now();
        $startOfMonth = $now->copy()->startOfMonth();
        
        return [
            'total' => static::count(),
            'published' => static::where('status', 'published')->count(),
            'draft' => static::where('status', 'draft')->count(),
            'this_month' => static::whereBetween('created_at', [$startOfMonth, $now])->count(),
            'featured' => static::where('featured', true)->count(),
        ];
    }

    public function toggleFeatured()
    {
        $this->featured = !$this->featured;
        $this->save();
        
        return $this->featured;
    }
}