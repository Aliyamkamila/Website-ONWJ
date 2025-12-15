<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProduksiBulanan extends Model
{
    use HasFactory;

    protected $table = 'produksi_bulanan';

    protected $fillable = [
        'wk_tekkom_id',
        'bulan',
        'tahun',
        'produksi_minyak',
        'produksi_gas',
        'catatan',
        'wells',
        'depth',
        'pressure',
        'temperature',
        'facilities',
        'status',
    ];

    protected $casts = [
        'produksi_minyak' => 'decimal:2',
        'produksi_gas' => 'decimal:2',
        'bulan' => 'integer',
        'tahun' => 'integer',
        'wells' => 'integer',
        'facilities' => 'array',
    ];

    /**
     * Relationship: Produksi belongs to WkTekkom
     */
    public function wkTekkom()
    {
        return $this->belongsTo(WkTekkom::class, 'wk_tekkom_id');
    }

    /**
     * Scope: Filter by tahun
     */
    public function scopeByTahun($query, $tahun)
    {
        return $query->where('tahun', $tahun);
    }

    /**
     * Scope: Filter by bulan
     */
    public function scopeByBulan($query, $bulan)
    {
        return $query->where('bulan', $bulan);
    }

    /**
     * Scope: Filter by area
     */
    public function scopeByArea($query, $wkTekkomId)
    {
        return $query->where('wk_tekkom_id', $wkTekkomId);
    }

    /**
     * Accessor: Get formatted produksi minyak
     */
    public function getFormattedProduksiMinyakAttribute()
    {
        return $this->produksi_minyak ? number_format($this->produksi_minyak, 2) . ' BOPD' : '-';
    }

    /**
     * Accessor: Get formatted produksi gas
     */
    public function getFormattedProduksiGasAttribute()
    {
        return $this->produksi_gas ? number_format($this->produksi_gas, 2) . ' MMSCFD' : '-';
    }

    /**
     * Accessor: Get bulan name
     */
    public function getBulanNameAttribute()
    {
        $months = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
        ];
        return $months[$this->bulan] ?? '';
    }
}
