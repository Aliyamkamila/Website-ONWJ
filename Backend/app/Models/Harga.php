<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Harga extends Model
{
    use HasFactory;

    protected $table = 'harga';

    protected $fillable = [
        'tanggal',
        'brent',
        'duri',
        'arjuna',
        'kresna',
        'icp',
        'periode',
        'tahun',
        'bulan',
        'minggu',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'brent' => 'decimal:2',
        'duri' => 'decimal:2',
        'arjuna' => 'decimal:2',
        'kresna' => 'decimal:2',
        'icp' => 'decimal:2',
        'tahun' => 'integer',
        'bulan' => 'integer',
        'minggu' => 'integer',
    ];

    // Scope untuk filter berdasarkan periode
    public function scopePeriode($query, $periode)
    {
        return $query->where('periode', $periode);
    }

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

    // Scope untuk filter berdasarkan minggu
    public function scopeMinggu($query, $minggu)
    {
        return $query->where('minggu', $minggu);
    }

    // Accessor untuk format label
    public function getLabelAttribute()
    {
        $date = Carbon::parse($this->tanggal);
        
        switch ($this->periode) {
            case 'day': 
                return $date->format('d/m');
            case 'week': 
                return 'W' .$date->weekOfMonth;
            case 'month': 
                return $date->format('M');
            case 'year': 
                return $date->format('Y');
            default:
                return $date->format('d/m/Y');
        }
    }

    // Accessor untuk full label
    public function getFullLabelAttribute()
    {
        $date = Carbon::parse($this->tanggal);
        
        switch ($this->periode) {
            case 'day': 
                return $date->translatedFormat('d F Y');
            case 'week': 
                return 'Minggu ' .$date->weekOfMonth .', ' .$date->translatedFormat('F Y');
            case 'month':
                return $date->translatedFormat('F Y');
            case 'year':
                return 'Tahun ' .$date->format('Y');
            default: 
                return $date->translatedFormat('d F Y');
        }
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
    public static function getStats($periode = 'month', $filters = [])
    {
        $query = self::query()->periode($periode);

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

        if (isset($filters['minggu'])) {
            $query->minggu($filters['minggu']);
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
                    'change' => self::calculateChange($latest->duri, $previous->duri),
                ],
                'arjuna' => [
                    'current' => $latest->arjuna,
                    'change' => self::calculateChange($latest->arjuna, $previous->arjuna),
                ],
                'kresna' => [
                    'current' => $latest->kresna,
                    'change' => self::calculateChange($latest->kresna, $previous->kresna),
                ],
                'icp' => [
                    'current' => $latest->icp,
                    'change' => self::calculateChange($latest->icp, $previous->icp),
                ],
            ],
        ];
    }
}