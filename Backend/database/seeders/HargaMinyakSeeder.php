<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Harga;
use App\Models\RealisasiBulanan;
use Carbon\Carbon;

class HargaMinyakSeeder extends Seeder
{
    public function run(): void
    {
        // Data dari CSV - hanya Brent yang memiliki nilai
        $csvData = $this->loadCSVData();

        foreach ($csvData as $row) {
            if (empty($row['brent'])) {
                continue; // Skip empty rows (weekend/holiday)
            }

            $date = Carbon::parse($row['tanggal']);
            
            // Get alpha average for this month
            $alpha = RealisasiBulanan::getCurrentMonthAlpha($date->year, $date->month);

            // Calculate Ardjuna and Kresna
            $brent = (float) $row['brent'];
            $ardjuna = round($brent + $alpha['avg_alpha_ardjuna'], 2);
            $kresna = round($brent + $alpha['avg_alpha_kresna'], 2);

            Harga::create([
                'tanggal' => $date->format('Y-m-d'),
                'brent' => $brent,
                'duri' => 80.08, // Constant
                'ardjuna' => $ardjuna,
                'kresna' => $kresna,
                'tahun' => $date->year,
                'bulan' => $date->month,
                'minggu' => $date->weekOfYear,
            ]);
        }

        $this->command->info('✅ Harga minyak seeded successfully!');
    }

    private function loadCSVData()
    {
        $csvFile = database_path('seeders/DataMinyak.csv');
        
        if (! file_exists($csvFile)) {
            throw new \Exception("CSV file not found: {$csvFile}");
        }

        $data = [];
        $handle = fopen($csvFile, 'r');
        
        // Skip header
        fgetcsv($handle, 1000, ',');

        while (($row = fgetcsv($handle, 1000, ',')) !== false) {
            if (empty($row[0]) || empty($row[1])) {
                continue; // Skip empty rows
            }

            $tanggal = $this->parseDate($row[0]);
            $brent = $this->parseDecimal($row[1]);

            // Only add if brent has value
            if ($brent !== null && $brent > 0) {
                $data[] = [
                    'tanggal' => $tanggal,
                    'brent' => $brent,
                ];
            }
        }

        fclose($handle);
        return $data;
    }

    private function parseDate($dateStr)
    {
        // Convert from "1/2/2025" to "2025-01-02"
        $parts = explode('/', trim($dateStr));
        if (count($parts) == 3) {
            $month = str_pad($parts[0], 2, '0', STR_PAD_LEFT);
            $day = str_pad($parts[1], 2, '0', STR_PAD_LEFT);
            $year = $parts[2];
            return "{$year}-{$month}-{$day}";
        }
        return $dateStr;
    }

    private function parseDecimal($value)
    {
        if (empty($value) || trim($value) === '') {
            return null;
        }
        // Convert "75,93" to "75.93"
        return (float) str_replace(',', '.', trim($value));
    }
}