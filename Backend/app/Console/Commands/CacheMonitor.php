<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;

/**
 * Command untuk monitoring cache performance
 */
class CacheMonitor extends Command
{
    protected $signature = 'cache:monitor
                            {--clear :  Clear statistics}
                            {--keys : Show cached keys}';

    protected $description = 'Monitor cache performance and statistics';

    public function handle()
    {
        $this->info('📊 Cache Performance Monitor');
        $this->newLine();

        if ($this->option('clear')) {
            return $this->clearStats();
        }

        if ($this->option('keys')) {
            return $this->showKeys();
        }

        // Get Redis info
        $redis = Redis::connection('cache');
        $info = $redis->info();

        // Memory usage
        $this->info('💾 Memory Usage: ');
        $usedMemory = $info['used_memory_human'] ??  'N/A';
        $peakMemory = $info['used_memory_peak_human'] ??  'N/A';
        $this->line("  Used: {$usedMemory}");
        $this->line("  Peak: {$peakMemory}");
        $this->newLine();

        // Hit/Miss ratio
        $this->info('🎯 Cache Statistics:');
        $hits = $info['keyspace_hits'] ?? 0;
        $misses = $info['keyspace_misses'] ?? 0;
        $total = $hits + $misses;
        $hitRate = $total > 0 ? round(($hits / $total) * 100, 2) : 0;

        $this->line("  Hits: " .number_format($hits));
        $this->line("  Misses: " .number_format($misses));
        $this->line("  Hit Rate:  {$hitRate}%");
        $this->newLine();

        // Keys count
        $this->info('🔑 Keys Information:');
        
        foreach (['cache', 'session', 'queue'] as $dbName) {
            $connection = Redis::connection($dbName);
            $dbSize = $connection->dbsize();
            $this->line("  {$dbName}: " .number_format($dbSize) ." keys");
        }
        
        $this->newLine();

        // Recommendations
        $this->info('💡 Recommendations:');
        
        if ($hitRate < 70) {
            $this->warn("  ⚠ Cache hit rate is below 70%.Consider:");
            $this->line("    - Increasing cache TTL");
            $this->line("    - Reviewing cache invalidation strategy");
        } elseif ($hitRate >= 90) {
            $this->line("  ✓ Excellent cache hit rate!");
        } else {
            $this->line("  ✓ Good cache performance");
        }

        $usedMemoryBytes = $info['used_memory'] ?? 0;
        $maxMemoryBytes = $info['maxmemory'] ?? 0;
        
        if ($maxMemoryBytes > 0) {
            $memoryUsagePercent = ($usedMemoryBytes / $maxMemoryBytes) * 100;
            
            if ($memoryUsagePercent > 80) {
                $this->warn("  ⚠ Memory usage is above 80%.Consider increasing maxmemory.");
            }
        }

        $this->newLine();

        return self::SUCCESS;
    }

    private function showKeys()
    {
        $this->info('🔑 Cached Keys Sample (first 50):');
        $this->newLine();

        $redis = Redis::connection('cache');
        $keys = $redis->keys('*');
        
        $sample = array_slice($keys, 0, 50);
        
        foreach ($sample as $key) {
            $ttl = $redis->ttl($key);
            $ttlFormatted = $ttl > 0 ? "{$ttl}s" : ($ttl === -1 ? 'never' : 'expired');
            $this->line("  {$key} (TTL: {$ttlFormatted})");
        }

        $this->newLine();
        $this->info("Total keys: " .count($keys));

        return self::SUCCESS;
    }

    private function clearStats()
    {
        $redis = Redis::connection('cache');
        $redis->command('CONFIG', ['RESETSTAT']);

        $this->info('✓ Cache statistics cleared');

        return self::SUCCESS;
    }
}