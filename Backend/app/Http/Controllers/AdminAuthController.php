<?php

namespace App\Http\Controllers;

use App\Http\Requests\AdminLoginRequest;
use App\Models\Admin;
use App\Services\ResponseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class AdminAuthController extends Controller
{
    /**
     * Admin login
     */
    public function login(AdminLoginRequest $request): JsonResponse
    {
        // Rate limiting
        $key = Str::lower($request->input('email')) . '|' . $request->ip();
        
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return ResponseService::error(
                "Terlalu banyak percobaan login. Silakan coba lagi dalam {$seconds} detik.",
                null,
                429
            );
        }

        $validated = $request->validated();
        
        // Find admin by email
        $admin = Admin::where('email', $validated['email'])->first();

        // Check if admin exists
        if (!$admin) {
            RateLimiter::hit($key, 60);
            return ResponseService::unauthorized('Email atau password salah');
        }

        // Check if admin is locked
        if ($admin->isLocked()) {
            $minutes = now()->diffInMinutes($admin->locked_until);
            return ResponseService::forbidden(
                "Akun Anda terkunci. Silakan coba lagi dalam {$minutes} menit."
            );
        }

        // Check if admin is active
        if (!$admin->isActive()) {
            return ResponseService::forbidden('Akun Anda tidak aktif. Hubungi administrator.');
        }

        // Verify password
        if (!Hash::check($validated['password'], $admin->password)) {
            $admin->incrementLoginAttempts();
            RateLimiter::hit($key, 60);
            
            $remainingAttempts = 5 - $admin->login_attempts;
            if ($remainingAttempts > 0) {
                return ResponseService::unauthorized(
                    "Email atau password salah. {$remainingAttempts} percobaan tersisa."
                );
            } else {
                return ResponseService::forbidden(
                    'Akun Anda terkunci karena terlalu banyak percobaan login. Silakan coba lagi dalam 30 menit.'
                );
            }
        }

        // Reset login attempts and update last login
        $admin->resetLoginAttempts();
        $admin->updateLastLogin($request->ip());

        // Create token
        $token = $admin->createToken(
            'admin-token',
            ['admin'],
            now()->addHours(24)
        )->plainTextToken;

        // Clear rate limiter
        RateLimiter::clear($key);

        return ResponseService::success([
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'phone' => $admin->phone,
                'last_login_at' => $admin->last_login_at?->format('Y-m-d H:i:s'),
            ],
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => '24 hours'
        ], 'Login berhasil');
    }

    /**
     * Admin logout
     */
    public function logout(Request $request): JsonResponse
    {
        // Revoke current token
        $request->user('sanctum')->currentAccessToken()->delete();

        return ResponseService::success(null, 'Logout berhasil');
    }

    /**
     * Get authenticated admin info
     */
    public function me(Request $request): JsonResponse
    {
        $admin = $request->user('sanctum');

        return ResponseService::success([
            'id' => $admin->id,
            'name' => $admin->name,
            'email' => $admin->email,
            'phone' => $admin->phone,
            'status' => $admin->status,
            'last_login_at' => $admin->last_login_at?->format('Y-m-d H:i:s'),
            'created_at' => $admin->created_at->format('Y-m-d H:i:s'),
        ]);
    }

    /**
     * Refresh token
     */
    public function refresh(Request $request): JsonResponse
    {
        $admin = $request->user('sanctum');
        
        // Revoke current token
        $request->user('sanctum')->currentAccessToken()->delete();
        
        // Create new token
        $token = $admin->createToken(
            'admin-token',
            ['admin'],
            now()->addHours(24)
        )->plainTextToken;

        return ResponseService::success([
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => '24 hours'
        ], 'Token berhasil diperbarui');
    }
}