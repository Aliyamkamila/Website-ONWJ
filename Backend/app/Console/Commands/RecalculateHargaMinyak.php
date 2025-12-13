<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Harga;
use App\Models\RealisasiBulanan;

class RecalculateHargaMinyak extends Command
{
    protected $signature = 'harga:recalculate {--year=} {--month=}';
    protected $description = 'Recalculate Ardjuna & Kresna prices based on current alpha values';

    public function handle()
    {
        $year = $this->option('year');
        $month = $this->option('month');

        $query = Harga::query();

        if ($year) {
            $query->where('tahun', $year);
            $this->info("Filtering by year: {$year}");
        }

        if ($month) {
            $query->where('bulan', $month);
            $this->info("Filtering by month: {$month}");
        }

        $data = $query->orderBy('tanggal')->get();
        $total = $data->count();

        if ($total === 0) {
            $this->error('No data found to recalculate! ');
            return 1;
        }

        $this->info("Found {$total} records to recalculate...\n");

        $bar = $this->output->createProgressBar($total);
        $bar->start();

        $updated = 0;

        foreach ($data as $harga) {
            // Get alpha for this month
            $alpha = RealisasiBulanan:: getCurrentMonthAlpha($harga->tahun, $harga->bulan);

            // Calculate new values
            $ardjuna = round($harga->brent + $alpha['avg_alpha_ardjuna'], 2);
            $kresna = round($harga->brent + $alpha['avg_alpha_kresna'], 2);

            // Update only if changed
            if ($harga->ardjuna != $ardjuna || $harga->kresna != $kresna) {
                $harga->update([
                    'ardjuna' => $ardjuna,
                    'kresna' => $kresna,
                ]);
                $updated++;
            }

            $bar->advance();
        }

        $bar->finish();

        $this->newLine(2);
        $this->info("✅ Recalculation complete!");
        $this->info("Total records:   {$total}");
        $this->info("Updated:        {$updated}");
        $this->info("Unchanged:      " .($total - $updated));

        return 0;
    }
}