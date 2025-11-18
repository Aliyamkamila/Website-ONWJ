<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Services\ResponseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AdminController extends Controller
{
    /**
     * Get all admins
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search');

        $admins = Admin::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return ResponseService::success($admins);
    }

    /**
     * Create new admin
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email:rfc,dns|max:100|unique:admins,email',
            'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()->symbols()],
            'phone' => 'nullable|string|max:20|regex:/^[0-9+\-\s()]+$/',
            'status' => 'required|in:active,inactive'
        ], [
            'name.required' => 'Nama wajib diisi',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah terdaftar',
            'password.required' => 'Password wajib diisi',
            'password.confirmed' => 'Konfirmasi password tidak cocok',
            'status.required' => 'Status wajib diisi',
            'status.in' => 'Status tidak valid',
        ]);

        $admin = Admin::create([
            'name' => strip_tags($validated['name']),
            'email' => strip_tags($validated['email']),
            'password' => Hash::make($validated['password']),
            'phone' => isset($validated['phone']) ? strip_tags($validated['phone']) : null,
            'status' => $validated['status'],
        ]);

        return ResponseService::success(
            [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'phone' => $admin->phone,
                'status' => $admin->status,
            ],
            'Admin berhasil ditambahkan',
            201
        );
    }

    /**
     * Get single admin
     */
    public function show(string $id): JsonResponse
    {
        $admin = Admin::find($id);

        if (!$admin) {
            return ResponseService::notFound('Admin tidak ditemukan');
        }

        return ResponseService::success([
            'id' => $admin->id,
            'name' => $admin->name,
            'email' => $admin->email,
            'phone' => $admin->phone,
            'status' => $admin->status,
            'last_login_at' => $admin->last_login_at?->format('Y-m-d H:i:s'),
            'created_at' => $admin->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $admin->updated_at->format('Y-m-d H:i:s'),
        ]);
    }

    /**
     * Update admin
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $admin = Admin::find($id);

        if (!$admin) {
            return ResponseService::notFound('Admin tidak ditemukan');
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'email' => 'sometimes|required|email:rfc,dns|max:100|unique:admins,email,' . $id,
            'password' => ['nullable', 'confirmed', Password::min(8)->mixedCase()->numbers()->symbols()],
            'phone' => 'nullable|string|max:20|regex:/^[0-9+\-\s()]+$/',
            'status' => 'sometimes|required|in:active,inactive'
        ]);

        $updateData = [];

        if (isset($validated['name'])) {
            $updateData['name'] = strip_tags($validated['name']);
        }

        if (isset($validated['email'])) {
            $updateData['email'] = strip_tags($validated['email']);
        }

        if (isset($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        if (isset($validated['phone'])) {
            $updateData['phone'] = strip_tags($validated['phone']);
        }

        if (isset($validated['status'])) {
            $updateData['status'] = $validated['status'];
        }

        $admin->update($updateData);

        return ResponseService::success(
            [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'phone' => $admin->phone,
                'status' => $admin->status,
            ],
            'Admin berhasil diupdate'
        );
    }

    /**
     * Delete admin
     */
    public function destroy(string $id): JsonResponse
    {
        $admin = Admin::find($id);

        if (!$admin) {
            return ResponseService::notFound('Admin tidak ditemukan');
        }

        // Prevent deleting own account
        if ($admin->id === auth('sanctum')->id()) {
            return ResponseService::error('Tidak dapat menghapus akun sendiri');
        }

        $admin->delete();

        return ResponseService::success(null, 'Admin berhasil dihapus');
    }
}