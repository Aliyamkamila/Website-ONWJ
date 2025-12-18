<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

/**
 * Middleware untuk memastikan konfigurasi production aman
 * dan memberikan warning jika debug mode aktif di production
 */
class EnsureProductionSafety
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if running in production with debug enabled
        if (app()->environment('production') && config('app.debug') === true) {
            // Log critical warning
            Log::channel('emergency')->critical('DEBUG MODE IS ENABLED IN PRODUCTION', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'url' => $request->fullUrl(),
            ]);

            // In production, we should NOT expose this to users
            // But log it for monitoring
        }

        // Check verbose logging in production
        if (app()->environment('production') && config('logging.channels.daily.level') === 'debug') {
            Log::channel('emergency')->warning('VERBOSE LOGGING ENABLED IN PRODUCTION');
        }

        return $next($request);
    }
}