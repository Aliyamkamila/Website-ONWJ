<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Harga extends Model
{
    use HasFactory;

    protected $table = 'harga_minyak';

    protected $fillable = [
        'tanggal',
        'brent',
        'duri',
        'ardjuna',
        'kresna',
        'tahun',
        'bulan',
        'minggu',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'brent' => 'decimal: 2',
        'duri' => 'decimal:2',
        'ardjuna' => 'decimal:2',
        'kresna' => 'decimal: 2',
        'tahun' => 'integer',
        'bulan' => 'integer',
        'minggu' => 'integer',
    ];

    // Scope untuk filter berdasarkan tanggal range
    public function scopeDateRange($query, $from, $to)
    {
        return $query->whereBetween('tanggal', [$from, $to]);
    }

    // Scope untuk filter berdasarkan tahun
    public function scopeTahun($query, $tahun)
    {
        return $query->where('tahun', $tahun);
    }

    // Scope untuk filter berdasarkan bulan
    public function scopeBulan($query, $bulan)
    {
        return $query->where('bulan', $bulan);
    }

    // Accessor untuk format label
    public function getLabelAttribute()
    {
        $date = Carbon::parse($this->tanggal);
        return $date->format('d/m');
    }

    // Accessor untuk full label
    public function getFullLabelAttribute()
    {
        $date = Carbon::parse($this->tanggal);
        return $date->translatedFormat('d F Y');
    }

    // Method untuk menghitung perubahan persentase
    public static function calculateChange($current, $previous)
    {
        if (! $previous || $previous == 0) {
            return 0;
        }
        return (($current - $previous) / $previous) * 100;
    }

    // Method untuk mendapatkan statistik
    public static function getStats($filters = [])
    {
        $query = self::query();

        // Apply filters
        if (isset($filters['from']) && isset($filters['to'])) {
            $query->dateRange($filters['from'], $filters['to']);
        }

        if (isset($filters['tahun'])) {
            $query->tahun($filters['tahun']);
        }

        if (isset($filters['bulan'])) {
            $query->bulan($filters['bulan']);
        }

        $data = $query->orderBy('tanggal', 'asc')->get();

        if ($data->isEmpty()) {
            return [
                'current' => null,
                'previous' => null,
                'stats' => [],
            ];
        }

        $latest = $data->last();
        $previous = $data->count() > 1 ? $data[$data->count() - 2] : $latest;

        return [
            'current' => $latest,
            'previous' => $previous,
            'stats' => [
                'brent' => [
                    'current' => $latest->brent,
                    'change' => self::calculateChange($latest->brent, $previous->brent),
                ],
                'duri' => [
                    'current' => $latest->duri,
                    'change' => 0, // Duri always constant
                ],
                'ardjuna' => [
                    'current' => $latest->ardjuna,
                    'change' => self::calculateChange($latest->ardjuna, $previous->ardjuna),
                ],
                'kresna' => [
                    'current' => $latest->kresna,
                    'change' => self::calculateChange($latest->kresna, $previous->kresna),
                ],
            ],
        ];
    }
}