<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReorderHeroSectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['required', 'exists:hero_sections,id'],
            'items.*.order' => ['required', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'items.required' => 'Data urutan wajib diisi.',
            'items.array' => 'Data urutan harus berupa array.',
            'items.min' => 'Minimal satu item untuk diurutkan.',
            'items.*.id.required' => 'ID hero section wajib diisi.',
            'items.*.id.exists' => 'Hero section tidak ditemukan.',
            'items.*.order.required' => 'Urutan wajib diisi.',
            'items.*.order.integer' => 'Urutan harus berupa angka.',
            'items.*.order.min' => 'Urutan minimal 0.',
        ];
    }
}
