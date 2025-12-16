<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized - Please login',
            ], 401);
        }

        // Check if user is admin
        // Adjust this based on your user model role/permission system
        if ($request->user()->role !== 'admin' && $request->user()->role !== 'superadmin') {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden - Admin access required',
            ], 403);
        }

        return $next($request);
    }
}
