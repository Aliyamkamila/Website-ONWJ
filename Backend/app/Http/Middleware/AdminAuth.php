<?php

namespace App\Http\Middleware;

use App\Services\ResponseService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminAuth
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user('sanctum')) {
            return ResponseService::unauthorized('Silakan login terlebih dahulu');
        }

        // Check if user is admin
        if (!$request->user('sanctum') instanceof \App\Models\Admin) {
            return ResponseService::forbidden('Akses ditolak');
        }

        $admin = $request->user('sanctum');

        // Check if admin is active
        if (!$admin->isActive()) {
            return ResponseService::forbidden('Akun Anda tidak aktif');
        }

        // Check if admin is locked
        if ($admin->isLocked()) {
            return ResponseService::forbidden('Akun Anda terkunci');
        }

        return $next($request);
    }
}