<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    /**
     * ==================== PUBLIC ROUTES ====================
     */

    /**
     * Submit contact form (Public)
     * POST /api/v1/contact
     */
    public function store(Request $request)
    {
        $validator = Validator:: make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|min:10',
        ], [
            'name.required' => 'Nama wajib diisi',
            'email. required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'subject.required' => 'Subjek wajib diisi',
            'message.required' => 'Pesan wajib diisi',
            'message.min' => 'Pesan minimal 10 karakter',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Create contact
            $contact = Contact:: create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'subject' => $request->subject,
                'message' => $request->message,
                'status' => 'new',
                'ip_address' => $request->ip(),
            ]);

            // Send email notification to admin (optional)
            $this->sendAdminNotification($contact);

            return response()->json([
                'success' => true,
                'message' => 'Pesan Anda berhasil dikirim!  Kami akan segera menghubungi Anda.',
                'data' => [
                    'id' => $contact->id,
                    'name' => $contact->name,
                    'email' => $contact->email,
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('Contact form submission error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan.  Silakan coba lagi nanti.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * ==================== ADMIN ROUTES ====================
     */

    /**
     * Get all contacts (Admin)
     * GET /api/v1/admin/contacts
     */
    public function index(Request $request)
    {
        try {
            $query = Contact::query()->orderBy('created_at', 'desc');

            // Search
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('subject', 'like', "%{$search}%")
                      ->orWhere('message', 'like', "%{$search}%");
                });
            }

            // Filter by status
            if ($request->has('status') && $request->status) {
                $query->where('status', $request->status);
            }

            // Filter by date range
            if ($request->has('date_from')) {
                $query->whereDate('created_at', '>=', $request->date_from);
            }
            if ($request->has('date_to')) {
                $query->whereDate('created_at', '<=', $request->date_to);
            }

            // Pagination
            $perPage = $request->get('per_page', 15);
            $contacts = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Contacts retrieved successfully',
                'data' => $contacts->items(),
                'meta' => [
                    'current_page' => $contacts->currentPage(),
                    'last_page' => $contacts->lastPage(),
                    'per_page' => $contacts->perPage(),
                    'total' => $contacts->total(),
                    'from' => $contacts->firstItem(),
                    'to' => $contacts->lastItem(),
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve contacts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single contact detail (Admin)
     * GET /api/v1/admin/contacts/{id}
     */
    public function show($id)
    {
        try {
            $contact = Contact:: findOrFail($id);

            // Auto mark as read when viewed
            if ($contact->isNew()) {
                $contact->markAsRead();
            }

            return response()->json([
                'success' => true,
                'message' => 'Contact retrieved successfully',
                'data' => $contact
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Contact not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update contact status (Admin)
     * PATCH /api/v1/admin/contacts/{id}/status
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:new,read,replied',
            'admin_notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $contact = Contact::findOrFail($id);
            
            $contact->update([
                'status' => $request->status,
                'admin_notes' => $request->admin_notes ??  $contact->admin_notes,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Contact status updated successfully',
                'data' => $contact
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update contact status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete contact (Admin)
     * DELETE /api/v1/admin/contacts/{id}
     */
    public function destroy($id)
    {
        try {
            $contact = Contact::findOrFail($id);
            $contact->delete();

            return response()->json([
                'success' => true,
                'message' => 'Contact deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete contact',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk delete contacts (Admin)
     * POST /api/v1/admin/contacts/bulk-delete
     */
    public function bulkDelete(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:contacts,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $deleted = Contact::whereIn('id', $request->ids)->delete();

            return response()->json([
                'success' => true,
                'message' => "{$deleted} contacts deleted successfully",
                'data' => ['deleted_count' => $deleted]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete contacts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get contact statistics (Admin)
     * GET /api/v1/admin/contacts/statistics
     */
    public function statistics()
    {
        try {
            $stats = [
                'total' => Contact::count(),
                'new' => Contact::where('status', 'new')->count(),
                'read' => Contact::where('status', 'read')->count(),
                'replied' => Contact::where('status', 'replied')->count(),
                'today' => Contact::whereDate('created_at', today())->count(),
                'this_week' => Contact::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
                'this_month' => Contact::whereMonth('created_at', now()->month)->count(),
            ];

            return response()->json([
                'success' => true,
                'message' => 'Statistics retrieved successfully',
                'data' => $stats
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send email notification to admin
     */
    private function sendAdminNotification($contact)
    {
        try {
            // TODO: Implement email notification
            // You can use Laravel Mail facade or queue jobs
            
            // Example: 
            // Mail::to(config('mail.admin_email'))->send(new ContactNotification($contact));
            
            Log::info('New contact form submission', [
                'id' => $contact->id,
                'name' => $contact->name,
                'email' => $contact->email,
                'subject' => $contact->subject,
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send admin notification:  ' . $e->getMessage());
        }
    }
}