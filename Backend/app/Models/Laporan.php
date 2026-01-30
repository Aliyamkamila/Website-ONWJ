<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Laporan extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'laporan';

    protected $fillable = [
        'title',
        'year',
        'description',
        'file_path',
        'cover_image',
        'file_size',
        'status',
        'views',
        'order',
    ];

    protected $casts = [
        'year' => 'integer',
        'views' => 'integer',
        'order' => 'integer',
    ];

    // ✅ Accessor untuk full URL
    public function getFullFileUrlAttribute()
    {
        return $this->file_path ? asset('storage/' . $this->file_path) : null;
    }

    public function getFullCoverUrlAttribute()
    {
        return $this->cover_image ? asset('storage/' . $this->cover_image) : null;
    }

    // ✅ Scope untuk published only
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}