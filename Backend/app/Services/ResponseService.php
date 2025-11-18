<?php

namespace App\Services;

use Illuminate\Http\JsonResponse;

class ResponseService
{
    /**
     * Success response
     */
    public static function success(
        $data = null, 
        string $message = 'Operasi berhasil', 
        int $code = 200
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], $code);
    }

    /**
     * Error response
     */
    public static function error(
        string $message = 'Operasi gagal', 
        $errors = null, 
        int $code = 400
    ): JsonResponse {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    /**
     * Unauthorized response
     */
    public static function unauthorized(string $message = 'Unauthorized'): JsonResponse
    {
        return self::error($message, null, 401);
    }

    /**
     * Forbidden response
     */
    public static function forbidden(string $message = 'Forbidden'): JsonResponse
    {
        return self::error($message, null, 403);
    }

    /**
     * Not found response
     */
    public static function notFound(string $message = 'Data tidak ditemukan'): JsonResponse
    {
        return self::error($message, null, 404);
    }

    /**
     * Validation error response
     */
    public static function validationError($errors, string $message = 'Validasi gagal'): JsonResponse
    {
        return self::error($message, $errors, 422);
    }

    /**
     * Server error response
     */
    public static function serverError(string $message = 'Terjadi kesalahan server'): JsonResponse
    {
        return self::error($message, null, 500);
    }
}