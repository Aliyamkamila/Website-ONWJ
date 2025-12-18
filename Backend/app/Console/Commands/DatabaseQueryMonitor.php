<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Command untuk monitoring database queries
 */
class DatabaseQueryMonitor extends Command
{
    protected $signature = 'db:monitor {duration=60}';

    protected $description = 'Monitor database queries for specified duration (seconds)';

    public function handle()
    {
        $duration = (int) $this->argument('duration');
        
        $this->info("📊 Monitoring database queries for {$duration} seconds...");
        $this->info("Make requests to your API endpoints during this time.");
        $this->newLine();

        $queries = [];
        $totalTime = 0;

        // Enable query log
        DB::enableQueryLog();

        // Monitor
        $startTime = time();
        $this->output->progressStart($duration);

        while (time() - $startTime < $duration) {
            sleep(1);
            $this->output->progressAdvance();

            // Collect queries
            $logged = DB::getQueryLog();
            foreach ($logged as $query) {
                $queries[] = $query;
                $totalTime += $query['time'];
            }

            DB::flushQueryLog();
        }

        $this->output->progressFinish();
        $this->newLine();

        // Analysis
        $queryCount = count($queries);
        $avgTime = $queryCount > 0 ? round($totalTime / $queryCount, 2) : 0;

        $this->info("📈 Query Statistics:");
        $this->line("  Total Queries: {$queryCount}");
        $this->line("  Total Time: {$totalTime}ms");
        $this->line("  Average Time: {$avgTime}ms");
        $this->newLine();

        // Slow queries
        $slowQueries = array_filter($queries, fn($q) => $q['time'] > 100);
        
        if (!empty($slowQueries)) {
            $this->warn("⚠ Slow Queries (>100ms):");
            
            usort($slowQueries, fn($a, $b) => $b['time'] <=> $a['time']);
            
            foreach (array_slice($slowQueries, 0, 10) as $query) {
                $this->line("  {$query['time']}ms:  " .substr($query['query'], 0, 100));
            }
            
            $this->newLine();
            $this->line("  Total slow queries: " .count($slowQueries));
        } else {
            $this->info("✓ No slow queries detected");
        }

        $this->newLine();

        // Duplicate queries
        $queryStrings = array_map(fn($q) => $q['query'], $queries);
        $uniqueQueries = array_unique($queryStrings);
        $duplicates = $queryCount - count($uniqueQueries);

        if ($duplicates > 0) {
            $duplicatePercent = round(($duplicates / $queryCount) * 100, 2);
            $this->warn("⚠ Duplicate Queries:  {$duplicates} ({$duplicatePercent}%)");
            $this->line("  Consider implementing query caching");
        } else {
            $this->info("✓ No duplicate queries");
        }

        return self:: SUCCESS;
    }
}