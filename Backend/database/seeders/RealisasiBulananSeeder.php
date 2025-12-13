<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RealisasiBulanan;

class RealisasiBulananSeeder extends Seeder
{
    public function run(): void
    {
        $realisasiData = [
            ['tahun' => 2024, 'bulan' => 10, 'realisasi_brent' => 75.66, 'realisasi_ardjuna' => 75.49, 'realisasi_kresna' => 70.95],
            ['tahun' => 2024, 'bulan' => 11, 'realisasi_brent' => 74.47, 'realisasi_ardjuna' => 73.22, 'realisasi_kresna' => 67.70],
            ['tahun' => 2024, 'bulan' => 12, 'realisasi_brent' => 72.93, 'realisasi_ardjuna' => 73.97, 'realisasi_kresna' => 67.04],
            ['tahun' => 2025, 'bulan' => 1, 'realisasi_brent' => 78.15, 'realisasi_ardjuna' => 78.78, 'realisasi_kresna' => 70.84],
            ['tahun' => 2025, 'bulan' => 2, 'realisasi_brent' => 74.73, 'realisasi_ardjuna' => 76.17, 'realisasi_kresna' => 70.11],
            ['tahun' => 2025, 'bulan' => 3, 'realisasi_brent' => 71.28, 'realisasi_ardjuna' => 72.27, 'realisasi_kresna' => 67.35],
            ['tahun' => 2025, 'bulan' => 4, 'realisasi_brent' => 66.25, 'realisasi_ardjuna' => 66.62, 'realisasi_kresna' => 59.90],
            ['tahun' => 2025, 'bulan' => 5, 'realisasi_brent' => 63.73, 'realisasi_ardjuna' => 65.58, 'realisasi_kresna' => 59.23],
            ['tahun' => 2025, 'bulan' => 6, 'realisasi_brent' => 69.42, 'realisasi_ardjuna' => 71.69, 'realisasi_kresna' => 61.82],
            ['tahun' => 2025, 'bulan' => 7, 'realisasi_brent' => 69.19, 'realisasi_ardjuna' => 70.41, 'realisasi_kresna' => 60.60],
            ['tahun' => 2025, 'bulan' => 8, 'realisasi_brent' => 67.11, 'realisasi_ardjuna' => 68.58, 'realisasi_kresna' => 60.41],
            ['tahun' => 2025, 'bulan' => 9, 'realisasi_brent' => 67.39, 'realisasi_ardjuna' => 69.05, 'realisasi_kresna' => 62.89],
            ['tahun' => 2025, 'bulan' => 10, 'realisasi_brent' => 63.81, 'realisasi_ardjuna' => 65.96, 'realisasi_kresna' => 59.75],
        ];

        foreach ($realisasiData as $data) {
            // Calculate alpha
            $alpha = RealisasiBulanan::calculateAlpha(
                $data['realisasi_brent'],
                $data['realisasi_ardjuna'],
                $data['realisasi_kresna']
            );

            // Create record
            $realisasi = RealisasiBulanan::create([
                'tahun' => $data['tahun'],
                'bulan' => $data['bulan'],
                'realisasi_brent' => $data['realisasi_brent'],
                'realisasi_ardjuna' => $data['realisasi_ardjuna'],
                'realisasi_kresna' => $data['realisasi_kresna'],
                'alpha_ardjuna' => $alpha['alpha_ardjuna'],
                'alpha_kresna' => $alpha['alpha_kresna'],
            ]);

            // Calculate 3-month average
            $avg = RealisasiBulanan::calculate3MonthAverage($data['tahun'], $data['bulan']);
            
            if ($avg) {
                $realisasi->update($avg);
            }
        }
    }
}