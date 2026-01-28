<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InstagramPost extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'instagram_url',
        'instagram_id',
        'caption',
        'image_url',
        'thumbnail_url',
        'media_type',
        'like_count',
        'comment_count',
        'posted_at',
        'show_in_media',
        'status',
        'order',
    ];

    protected $casts = [
        'show_in_media' => 'boolean',
        'posted_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Scope untuk post yang tampil di media
    public function scopeShowInMedia($query)
    {
        return $query->where('show_in_media', true)
                     ->where('status', 'published');
    }
}