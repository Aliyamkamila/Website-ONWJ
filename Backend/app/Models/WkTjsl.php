<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WkTjsl extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'wk_tjsl';

    protected $fillable = [
        'area_id',
        'name',
        'position_x',
        'position_y',
        'color',
        'description',
        'programs',
        'status',
        'beneficiaries',
        'budget',
        'duration',
        'impact',
        'order',
        'is_active',
        'related_news_id', // ✅ Ditambahkan
    ];

    protected $casts = [
        'programs' => 'array',
        'position_x' => 'decimal:5',
        'position_y' => 'decimal:5',
        'order' => 'integer',
        'is_active' => 'boolean',
        'related_news_id' => 'integer', // ✅ Ditambahkan
    ];

    /**
     * Relationship to Berita model
     */
    public function relatedNews() // ✅ Ditambahkan
    {
        return $this->belongsTo(Berita::class, 'related_news_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeAktif($query)
    {
        return $query->where('status', 'Aktif');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc')->orderBy('name', 'asc');
    }

    // Accessors
    public function getPositionAttribute()
    {
        return [
            'x' => (float) $this->position_x,
            'y' => (float) $this->position_y,
        ];
    }

    public function getCategoryAttribute()
    {
        return 'TJSL';
    }
}