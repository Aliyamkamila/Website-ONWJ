<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            // Log exceptions jika diperlukan
            if ($this->shouldReport($e)) {
                \Illuminate\Support\Facades\Log::error('Exception caught: ' . $e->getMessage(), [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'trace' => $e->getTraceAsString()
                ]);
            }
        });

        // ✅ Handle AuthenticationException secara spesifik
        $this->renderable(function (AuthenticationException $e, Request $request) {
            // Untuk API routes, return JSON response
            if ($request->expectsJson() || $request->is('api/*') || $request->is('admin/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated. Token tidak valid atau sudah kadaluarsa.',
                    'error' => 'unauthenticated'
                ], 401);
            }
            
            // Untuk web routes, redirect ke halaman login
            return redirect()->guest(route('admin.login'));
        });

        // ✅ Handle semua exception lain untuk API
        $this->renderable(function (Throwable $e, Request $request) {
            // Hanya untuk API requests
            if ($request->expectsJson() || $request->is('api/*') || $request->is('admin/*')) {
                $statusCode = $this->getStatusCode($e);
                $message = $e->getMessage();
                
                // Di environment production, jangan tampilkan error details
                if (!app()->environment('local') && $statusCode === 500) {
                    $message = 'Terjadi kesalahan pada server.';
                }

                return response()->json([
                    'success' => false,
                    'message' => $message,
                    'error' => app()->environment('local') ? [
                        'type' => get_class($e),
                        'file' => $e->getFile(),
                        'line' => $e->getLine(),
                        'trace' => $e->getTraceAsString()
                    ] : null
                ], $statusCode);
            }
        });
    }

    /**
     * ✅ OVERRIDE: Handle unauthenticated untuk API dengan lebih baik
     */
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        // ✅ Kalau request ke API atau admin endpoint, return JSON (BUKAN redirect)
        if ($request->expectsJson() || $request->is('api/*') || $request->is('admin/*')) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Silakan login terlebih dahulu.',
                'error' => 'unauthenticated'
            ], 401);
        }

        // ✅ Kalau request web, redirect ke halaman login admin
        return redirect()->guest(url('/admin/login'));
    }

    /**
     * ✅ Helper: Get HTTP status code from exception
     */
    private function getStatusCode(Throwable $e): int
    {
        if (method_exists($e, 'getStatusCode')) {
            return $e->getStatusCode();
        }

        // Default status codes based on exception type
        return match (get_class($e)) {
            'Illuminate\Database\Eloquent\ModelNotFoundException' => 404,
            'Symfony\Component\HttpKernel\Exception\NotFoundHttpException' => 404,
            'Illuminate\Auth\Access\AuthorizationException' => 403,
            'Illuminate\Validation\ValidationException' => 422,
            default => 500,
        };
    }

    /**
     * ✅ OPTIONAL: Override method untuk handle response secara umum
     */
    protected function shouldReturnJson($request, Throwable $e): bool
    {
        return $request->expectsJson() || $request->is('api/*') || $request->is('admin/*');
    }
}