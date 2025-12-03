<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Penghargaan extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The table associated with the model.
     */
    protected $table = 'penghargaan';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'title',
        'category',
        'given_by',
        'year',
        'month',
        'date',
        'description',
        'image',
        'show_in_landing',
        'show_in_media_informasi',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'year' => 'integer',
        'date' => 'date',
        'show_in_landing' => 'boolean',
        'show_in_media_informasi' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     */
    protected $appends = ['image_url'];

    /**
     * Get the full URL for the image.
     */
    public function getImageUrlAttribute(): ? string
    {
        if ($this->image) {
            return Storage::url($this->image);
        }
        return null;
    }

    /**
     * Scope untuk filter berdasarkan tahun
     */
    public function scopeByYear($query, $year)
    {
        if ($year && $year !== 'all') {
            return $query->where('year', $year);
        }
        return $query;
    }

    /**
     * Scope untuk filter berdasarkan kategori
     */
    public function scopeByCategory($query, $category)
    {
        if ($category) {
            return $query->where('category', $category);
        }
        return $query;
    }

    /**
     * Scope untuk pencarian
     */
    public function scopeSearch($query, $search)
    {
        if ($search) {
            return $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%")
                  ->orWhere('given_by', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        return $query;
    }

    /**
     * Scope untuk tampilan di landing page
     */
    public function scopeForLanding($query)
    {
        return $query->where('show_in_landing', true)
                    ->orderBy('year', 'desc')
                    ->orderBy('date', 'desc');
    }

    /**
     * Scope untuk tampilan di media informasi
     */
    public function scopeForMediaInformasi($query)
    {
        return $query->where('show_in_media_informasi', true)
                    ->orderBy('year', 'desc')
                    ->orderBy('date', 'desc');
    }

    /**
     * Boot method untuk handle events
     */
    protected static function boot()
    {
        parent::boot();

        // Hapus gambar ketika record dihapus permanent
        static::forceDeleted(function ($penghargaan) {
            if ($penghargaan->image) {
                Storage::disk('public')->delete($penghargaan->image);
            }
        });
    }
}