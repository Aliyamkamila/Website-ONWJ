<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

/**
 * Response Cache Middleware
 * 
 * Cache entire HTTP response untuk public endpoints
 * Mendukung cache invalidation via cache tags
 */
class CacheResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  int  $ttl  Cache TTL dalam detik
     * @param  string|null  $tag  Cache tag untuk group invalidation
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, int $ttl = 3600, ?string $tag = null): Response
    {
        // Only cache GET requests
        if (! $request->isMethod('GET')) {
            return $next($request);
        }

        // Skip cache untuk authenticated admin users
        if ($request->user()) {
            return $next($request);
        }

        // Generate cache key berdasarkan full URL + query params
        $cacheKey = $this->generateCacheKey($request);

        // Determine cache store & tag support
        $driver = config('cache.default');
        $store = \Illuminate\Support\Facades\Cache::store($driver);
        $supportsTags = in_array($driver, ['redis', 'redis-tags', 'memcached'], true);
        $cacheTags = $tag ? [$tag] : ['responses'];

        // Try to get from cache
        $cachedResponse = $supportsTags
            ? Cache::tags($cacheTags)->get($cacheKey)
            : $store->get($cacheKey);

        if ($cachedResponse) {
            // Return cached response dengan cache header
            return response($cachedResponse['content'], $cachedResponse['status'])
                ->withHeaders(array_merge($cachedResponse['headers'], [
                    'X-Cache-Status' => 'HIT',
                    'X-Cache-Key' => $cacheKey,
                ]));
        }

        // Process request
        $response = $next($request);

        // Only cache successful responses
        if ($response->isSuccessful()) {
            $payload = [
                'content' => $response->getContent(),
                'status' => $response->getStatusCode(),
                'headers' => $response->headers->all(),
            ];
            if ($supportsTags) {
                Cache::tags($cacheTags)->put($cacheKey, $payload, $ttl);
            } else {
                $store->put($cacheKey, $payload, $ttl);
            }
        }

        // Add cache miss header
        $response->headers->set('X-Cache-Status', 'MISS');
        $response->headers->set('X-Cache-Key', $cacheKey);

        return $response;
    }

    /**
     * Generate cache key dari request
     */
    private function generateCacheKey(Request $request): string
    {
        $url = $request->fullUrl();
        $queryParams = $request->query();
        
        // Sort query params untuk consistency
        ksort($queryParams);
        
        return 'response:' . md5($url .  serialize($queryParams));
    }
}