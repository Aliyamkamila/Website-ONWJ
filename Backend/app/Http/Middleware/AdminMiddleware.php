<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Please login first.'
            ], 401);
        }

        // Check if user has admin role (adjust based on your auth system)
        // if (!auth()->user()->is_admin) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Forbidden. Admin access only.'
        //     ], 403);
        // }

        return $next($request);
    }
}