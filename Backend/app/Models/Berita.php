<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Berita extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'berita';

    /*
    |--------------------------------------------------------------------------
    | FALLBACK IMAGE
    |--------------------------------------------------------------------------
    */
    private const FALLBACK_IMAGE =
        'data:image/svg+xml;charset=UTF-8,
        %3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E
        %3Crect width="100%25" height="100%25" fill="%23e5e7eb"/%3E
        %3Ctext x="50%25" y="50%25"
        dominant-baseline="middle"
        text-anchor="middle"
        fill="%236b7280"
        font-family="Arial"
        font-size="20"%3ENo Image%3C/text%3E
        %3C/svg%3E';

    /*
    |--------------------------------------------------------------------------
    | MASS ASSIGNMENT
    |--------------------------------------------------------------------------
    */
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

    /*
    |--------------------------------------------------------------------------
    | CASTS
    |--------------------------------------------------------------------------
    */
    protected $casts = [
        'date' => 'date',
        'show_in_tjsl' => 'boolean',
        'show_in_media_informasi' => 'boolean',
        'show_in_dashboard' => 'boolean',
        'pin_to_homepage' => 'boolean',
        'views' => 'integer',
        'display_order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | APPENDED ATTRIBUTES
    |--------------------------------------------------------------------------
    */
    protected $appends = [
        'full_image_url',
        'formatted_date',
    ];

    /*
    |--------------------------------------------------------------------------
    | BOOT
    |--------------------------------------------------------------------------
    */
    protected static function boot()
    {
        parent::boot();

        // Auto slug
        static::creating(function ($berita) {
            if (empty($berita->slug)) {
                $berita->slug =
                    static::generateUniqueSlug($berita->title);
            }
        });

        // Delete image when deleted
        static::deleting(function ($berita) {
            if (
                $berita->image_path &&
                Storage::disk('public')->exists($berita->image_path)
            ) {
                Storage::disk('public')
                    ->delete($berita->image_path);
            }
        });
    }

    /*
    |--------------------------------------------------------------------------
    | ACCESSORS
    |--------------------------------------------------------------------------
    */
    public function getFullImageUrlAttribute()
    {
        if ($this->image_url) {
            return $this->image_url;
        }

        if ($this->image_path) {
            return asset('storage/' . $this->image_path);
        }

        return self::FALLBACK_IMAGE;
    }

    public function getFormattedDateAttribute()
    {
        return $this->date
            ? $this->date->format('d F Y')
            : null;
    }

    /*
    |--------------------------------------------------------------------------
    | SCOPES
    |--------------------------------------------------------------------------
    */
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

    /*
    |--------------------------------------------------------------------------
    | HELPERS
    |--------------------------------------------------------------------------
    */
    public static function generateUniqueSlug($title, $id = null)
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $count = 1;

        while (
            static::where('slug', $slug)
                ->when(
                    $id,
                    fn ($q) => $q->where('id', '!=', $id)
                )
                ->exists()
        ) {
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
            'published' =>
                static::where('status', 'published')->count(),
            'tjsl' =>
                static::where('show_in_tjsl', true)->count(),
            'pinned' =>
                static::where('pin_to_homepage', true)->count(),
            'total_views' =>
                static::sum('views'),
        ];
    }
}