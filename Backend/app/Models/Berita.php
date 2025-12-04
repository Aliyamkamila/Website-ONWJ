<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class Berita extends Model
{
    use HasFactory, SoftDeletes;

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
        'published_at',
    ];

    protected $casts = [
        'date' => 'date',
        'show_in_tjsl' => 'boolean',
        'show_in_media_informasi' => 'boolean',
        'show_in_dashboard' => 'boolean',
        'pin_to_homepage' => 'boolean',
        'views' => 'integer',
        'published_at' => 'datetime',
    ];

    protected $appends = ['full_image_url', 'formatted_date'];

    // ===== BOOT METHOD =====
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($berita) {
            if (empty($berita->slug)) {
                $berita->slug = static::generateUniqueSlug($berita->title);
            }
            
            if ($berita->status === 'published' && empty($berita->published_at)) {
                $berita->published_at = now();
            }
        });

        static::updating(function ($berita) {
            if ($berita->isDirty('status') && $berita->status === 'published' && empty($berita->published_at)) {
                $berita->published_at = now();
            }
        });

        static::deleting(function ($berita) {
            if ($berita->image_path && Storage::disk('public')->exists($berita->image_path)) {
                Storage::disk('public')->delete($berita->image_path);
            }
        });
    }

    // ===== ACCESSORS (FIXED) =====
    public function getFullImageUrlAttribute()
    {
        if ($this->image_url) {
            return $this->image_url;
        }
        
        if ($this->image_path) {
            // ✅ FIXED: Gunakan asset() alih-alih Storage::url()
            return asset('storage/' . $this->image_path);
        }
        
        return asset('images/default-berita.jpg');
    }

    public function getFormattedDateAttribute()
    {
        // ✅ FIXED: Parse date sebagai Carbon instance
        return $this->date ? Carbon::parse($this->date)->format('F d, Y') : null;
    }

    // ===== SCOPES =====
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeShowInTJSL($query)
    {
        return $query->where('show_in_tjsl', true);
    }

    public function scopeShowInMediaInformasi($query)
    {
        return $query->where('show_in_media_informasi', true);
    }

    public function scopePinned($query)
    {
        return $query->where('pin_to_homepage', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('short_description', 'like', "%{$search}%")
              ->orWhere('content', 'like', "%{$search}%")
              ->orWhere('author', 'like', "%{$search}%");
        });
    }

    public function scopeRecent($query, $limit = 5)
    {
        return $query->published()
                     ->orderBy('date', 'desc')
                     ->limit($limit);
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
            'published' => static::published()->count(),
            'draft' => static::draft()->count(),
            'tjsl' => static::showInTJSL()->count(),
            'pinned' => static::pinned()->count(),
            'total_views' => static::sum('views'),
        ];
    }
}