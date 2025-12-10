<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Harga;
use Carbon\Carbon;

class HargaSeeder extends Seeder
{
    public function run(): void
    {
        // Generate data harian untuk 2025
        $startDate = Carbon::create(2025, 1, 1);
        $endDate = Carbon::create(2025, 12, 31);
        
        $currentDate = $startDate->copy();
        
        while ($currentDate <= $endDate) {
            $basePrice = 75 + sin($currentDate->dayOfYear * 0.1) * 10;
            
            Harga::create([
                'tanggal' => $currentDate->format('Y-m-d'),
                'brent' => round($basePrice + rand(0, 400) / 100, 2),
                'duri' => round($basePrice - 3 + rand(0, 300) / 100, 2),
                'arjuna' => round($basePrice - 2 + rand(0, 300) / 100, 2),
                'kresna' => round($basePrice - 1 + rand(0, 250) / 100, 2),
                'icp' => round($basePrice - 4 + rand(0, 350) / 100, 2),
                'periode' => 'day',
                'tahun' => $currentDate->year,
                'bulan' => $currentDate->month,
                'minggu' => $currentDate->weekOfYear,
            ]);
            
            $currentDate->addDay();
        }

        // Generate data untuk tahun 2021-2024
        for ($year = 2021; $year <= 2024; $year++) {
            for ($month = 1; $month <= 12; $month++) {
                $date = Carbon::create($year, $month, 15);
                $basePrice = 60 + ($year - 2021) * 5 + $month * 0.5;
                
                Harga::create([
                    'tanggal' => $date->format('Y-m-d'),
                    'brent' => round($basePrice + 8 + rand(0, 500) / 100, 2),
                    'duri' => round($basePrice + 3 + rand(0, 400) / 100, 2),
                    'arjuna' => round($basePrice + 5 + rand(0, 400) / 100, 2),
                    'kresna' => round($basePrice + 6 + rand(0, 350) / 100, 2),
                    'icp' => round($basePrice + 2 + rand(0, 450) / 100, 2),
                    'periode' => 'month',
                    'tahun' => $date->year,
                    'bulan' => $date->month,
                    'minggu' => $date->weekOfYear,
                ]);
            }
        }
    }
}