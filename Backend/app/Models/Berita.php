<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class Berita extends Model
{
    use HasFactory, SoftDeletes;

    private const FALLBACK_IMAGE = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22400%22%20height%3D%22300%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23e5e7eb%22/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%236b7280%22%20font-family%3D%22Arial%2CHelvetica%2Csans-serif%22%20font-size%3D%2220%22%3ENo%20Image%3C/text%3E%3C/svg%3E';

    protected $table = 'berita';

    protected $fillable = [
        'title',
        'slug',
        'category',
        'date',
        'author',
        'short_description',
        'content',
        'image_path',
        'image_url',
        'status',
        'display_option',
        'auto_link',
        'show_in_tjsl',
        'show_in_media_informasi',
        'show_in_dashboard',
        'pin_to_homepage',
        'views',
        'display_order',
    ];

    protected $casts = [
        'date' => 'date',
        'show_in_tjsl' => 'boolean',
        'show_in_media_informasi' => 'boolean',
        'show_in_dashboard' => 'boolean',
        'pin_to_homepage' => 'boolean',
        'views' => 'integer',
        'display_order' => 'integer',
    ];

    protected $appends = ['full_image_url', 'formatted_date'];

    // ===== BOOT METHOD =====
    protected static function boot()
    {
        parent::boot();

        // Auto-generate slug
        static::creating(function ($berita) {
            if (empty($berita->slug)) {
                $berita->slug = static::generateUniqueSlug($berita->title);
            }
        });

        // Delete image when deleting
        static::deleting(function ($berita) {
            if ($berita->image_path && Storage::disk('public')->exists($berita->image_path)) {
                Storage::disk('public')->delete($berita->image_path);
            }
        });
    }

    // ===== ACCESSORS =====
    public function getFullImageUrlAttribute()
    {
        if ($this->image_url) {
            return $this->image_url;
        }

        if ($this->image_path) {
            // Return the public URL; storage:link creates symlink from public/storage to storage/app/public
            return asset('storage/' .$this->image_path);
        }

        return self::FALLBACK_IMAGE;
    }

    public function getFormattedDateAttribute()
    {
        return $this->date ? $this->date->format('d F Y') : null;
    }

    // ===== SCOPES =====
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopePinned($query)
    {
        return $query->where('pin_to_homepage', true);
    }

    public function scopeInTjsl($query)
    {
        return $query->where('show_in_tjsl', true);
    }

    public function scopeInMediaInformasi($query)
    {
        return $query->where('show_in_media_informasi', true);
    }

    public function scopeInDashboard($query)
    {
        return $query->where('show_in_dashboard', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('author', 'like', "%{$search}%")
              ->orWhere('content', 'like', "%{$search}%")
              ->orWhere('short_description', 'like', "%{$search}%");
        });
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order', 'desc')
                     ->orderBy('date', 'desc')
                     ->orderBy('created_at', 'desc');
    }

    // ===== HELPER METHODS =====
    public static function generateUniqueSlug($title, $id = null)
    {
        $slug = Str::slug($title);
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

    public static function getStatistics()
    {
        return [
            'total' => static::count(),
            'published' => static::where('status', 'published')->count(),
            'tjsl' => static::where('show_in_tjsl', true)->count(),
            'pinned' => static::where('pin_to_homepage', true)->count(),
            'total_views' => static::sum('views'),
        ];
    }
}