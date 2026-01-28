<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class AdminLoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'email', // ✅ HAPUS :rfc,dns
                'max:100',
            ],
            'password' => [
                'required',
                'string',
                'min:6', // ✅ TURUNKAN JADI 6
                'max:255'
            ],
            'remember' => 'nullable|boolean'
        ];
    }

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

    protected function prepareForValidation(): void
    {
        // Sanitize input to prevent XSS
        if ($this->email) {
            $this->merge([
                'email' => strip_tags(trim($this->email)),
            ]);
        }
    }
}