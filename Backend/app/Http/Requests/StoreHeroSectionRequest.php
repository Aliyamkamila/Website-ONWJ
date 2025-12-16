<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreHeroSectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::in(['image', 'video'])],
            'src' => ['required', 'string', 'max:2048'],
            'duration' => ['nullable', 'integer', 'min:1000'],
            'label' => ['nullable', 'string', 'max:255'],
            'title' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'type.required' => 'Tipe wajib diisi.',
            'type.in' => 'Tipe harus image atau video.',
            'src.required' => 'Sumber media wajib diisi.',
            'src.string' => 'Sumber media harus berupa teks.',
            'src.max' => 'Sumber media maksimal 2048 karakter.',
            'duration.integer' => 'Durasi harus berupa angka.',
            'duration.min' => 'Durasi minimal 1000 ms.',
            'label.string' => 'Label harus berupa teks.',
            'label.max' => 'Label maksimal 255 karakter.',
            'title.string' => 'Title harus berupa teks.',
            'title.max' => 'Title maksimal 255 karakter.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'order.integer' => 'Urutan harus berupa angka.',
            'order.min' => 'Urutan minimal 0.',
            'is_active.boolean' => 'Status aktif harus berupa boolean.',
        ];
    }
}
