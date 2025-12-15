<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WkTekkom extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'wk_tekkom';

    protected $fillable = [
        'area_id',
        'name',
        'position_x',
        'position_y',
        'color',
        'description',
        'facilities',
        'production',
        'status',
        'wells',
        'depth',
        'pressure',
        'temperature',
        'order',
        'is_active',
    ];

    protected $casts = [
        'facilities' => 'array',
        'position_x' => 'decimal:5',
        'position_y' => 'decimal:5',
        'wells' => 'integer',
        'order' => 'integer',
        'is_active' => 'boolean',
    ];

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOperasional($query)
    {
        return $query->where('status', 'Operasional');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc')->orderBy('name', 'asc');
    }

    // Relationships
    public function produksiBulanan()
    {
        return $this->hasMany(ProduksiBulanan::class, 'wk_tekkom_id');
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
        return 'TEKKOM';
    }
}