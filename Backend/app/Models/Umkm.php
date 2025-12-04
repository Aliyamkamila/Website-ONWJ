<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class Umkm extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'umkm';

    protected $fillable = [
        'name',
        'slug',
        'category',
        'owner',
        'location',
        'description',
        'testimonial',
        'image_path',
        'image_url',
        'shop_link',
        'contact_number',
        'status',
        'year_started',
        'achievement',
        'is_featured',
        'display_order',
        'views',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'display_order' => 'integer',
        'views' => 'integer',
        'year_started' => 'integer',
    ];

    protected $appends = ['full_image_url'];

    // ===== BOOT METHOD =====
    protected static function boot()
    {
        parent::boot();

        // Auto-generate slug
        static::creating(function ($umkm) {
            if (empty($umkm->slug)) {
                $umkm->slug = static::generateUniqueSlug($umkm->name);
            }
        });

        // Delete image when deleting UMKM
        static::deleting(function ($umkm) {
            if ($umkm->image_path && Storage::disk('public')->exists($umkm->image_path)) {
                Storage::disk('public')->delete($umkm->image_path);
            }
        });
    }

    // ===== ACCESSORS =====
    public function getFullImageUrlAttribute()
    {
        // Priority: external URL > local storage > default
        if ($this->image_url) {
            return $this->image_url;
        }
        
        if ($this->image_path && Storage::disk('public')->exists($this->image_path)) {
            return asset('storage/' . $this->image_path);
        }
        
        return asset('images/default-umkm.jpg');
    }

    // ===== SCOPES =====
    public function scopeActive($query)
    {
        return $query->where('status', 'Aktif');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('owner', 'like', "%{$search}%")
              ->orWhere('location', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    // ✅ TAMBAHKAN SCOPE INI (INI YANG HILANG!)
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order', 'desc')
                     ->orderBy('created_at', 'desc');
    }

    // ===== HELPER METHODS =====
    public static function generateUniqueSlug($name, $id = null)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 1;

        while (static::where('slug', $slug)
                    ->when($id, fn($q) => $q->where('id', '!=', $id))
                    ->exists()) {
            $slug = $originalSlug . '-' . $count++;
        }

        return $slug;
    }

    public function incrementViews()
    {
        $this->increment('views');
    }

    public static function getCategories()
    {
        return static::select('category')
                     ->distinct()
                     ->orderBy('category')
                     ->pluck('category')
                     ->toArray();
    }

    public static function getCategoryCounts()
    {
        $categories = static::select('category', DB::raw('count(*) as count'))
                            ->groupBy('category')
                            ->pluck('count', 'category')
                            ->toArray();
        
        $categories['all'] = static::count();
        
        return $categories;
    }

    public static function getStatistics()
    {
        return [
            'total' => static::count(),
            'active' => static::where('status', 'Aktif')->count(),
            'graduated' => static::where('status', 'Lulus Binaan')->count(),
            'featured' => static::where('is_featured', true)->count(),
            'total_views' => static::sum('views'),
        ];
    }
}