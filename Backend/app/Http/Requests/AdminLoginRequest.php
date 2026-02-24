<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class AdminLoginRequest extends FormRequest
{
    /**
     * Tentukan apakah user diperbolehkan melakukan request ini.
     * Set ke true karena proteksi sebenarnya ada di layer autentikasi.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Aturan validasi untuk login admin.
     * * @return array
     */
    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'email', // ✅ Dipermudah (tanpa :rfc,dns) agar lebih kompatibel di berbagai server
                'max:100',
            ],
            'password' => [
                'required',
                'string',
                'min:6', // ✅ Diturunkan ke 6 karakter sesuai kebutuhan kamu
                'max:255'
            ],
            'remember' => 'nullable|boolean'
        ];
    }

    /**
     * Custom error messages dalam Bahasa Indonesia.
     * * @return array
     */
    public function messages(): array
    {
        return [
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.max' => 'Email maksimal 100 karakter',
            'password.required' => 'Password wajib diisi',
            'password.min' => 'Password minimal 6 karakter',
            'password.max' => 'Password maksimal 255 karakter',
        ];
    }

    /**
     * Menangani kegagalan validasi dan mengembalikan respon JSON.
     * Sangat berguna untuk integrasi dengan React/Frontend.
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422)
        );
    }

    /**
     * Persiapan data sebelum divalidasi (Sanitasi).
     */
    protected function prepareForValidation(): void
    {
        if ($this->email) {
            $this->merge([
                'email' => strip_tags(trim($this->email)),
            ]);
        }
    }
}   