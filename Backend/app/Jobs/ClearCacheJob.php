<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use illuminate\Support\Facades\Log;

/**
 * Async job untuk cache invalidation
 * 
 * Mencegah cache clearing dari blocking HTTP response
 */
class ClearCacheJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 1;
    public int $timeout = 30;

    protected ? array $tags;
    protected ?string $pattern;

    /**
     * Create a new job instance.
     */
    public function __construct(?array $tags = null, ?string $pattern = null)
    {
        $this->tags = $tags;
        $this->pattern = $pattern;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if ($this->tags) {
            // Clear specific cache tags
            Cache::tags($this->tags)->flush();
            
            Log::info('Cache cleared by tags', [
                'tags' => $this->tags
            ]);
        } elseif ($this->pattern) {
            // Clear cache by pattern (Redis specific)
            $redis = Cache::getRedis();
            $keys = $redis->keys($this->pattern);
            
            if (! empty($keys)) {
                $redis->del($keys);
            }
            
            Log:: info('Cache cleared by pattern', [
                'pattern' => $this->pattern,
                'keys_deleted' => count($keys)
            ]);
        } else {
            // Clear all cache
            Cache::flush();
            
            Log:: info('All cache cleared');
        }
    }
}