<?php

namespace App\Http\Controllers\Api;
use App\Models\InstagramPost;
use App\Http\Controllers\Controller; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class InstagramPostController extends Controller
{
    /**
     * Get all Instagram posts (Admin)
     */
    public function index()
    {
        try {
            $posts = InstagramPost::orderBy('order', 'asc')
                                  ->orderBy('posted_at', 'desc')
                                  ->get();

            return response()->json([
                'success' => true,
                'data' => $posts,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching Instagram posts: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data Instagram posts',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create new Instagram post
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'instagram_url' => 'required|url|unique:instagram_posts,instagram_url',
            'caption' => 'nullable|string',
            'image_url' => 'nullable|url',
            'media_type' => 'nullable|in:IMAGE,VIDEO,CAROUSEL_ALBUM',
            'posted_at' => 'nullable|date',
            'show_in_media' => 'nullable|boolean',
            'status' => 'nullable|in:published,draft',
            'order' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Extract Instagram post ID from URL
            $instagramId = $this->extractInstagramId($request->instagram_url);

            $post = InstagramPost::create([
                'instagram_url' => $request->instagram_url,
                'instagram_id' => $instagramId,
                'caption' => $request->caption ?? '',
                'image_url' => $request->image_url,
                'thumbnail_url' => $request->image_url, // Use same as image_url
                'media_type' => $request->media_type ?? 'IMAGE',
                'posted_at' => $request->posted_at ?? now(),
                'show_in_media' => $request->show_in_media ?? true,
                'status' => $request->status ?? 'published',
                'order' => $request->order ?? 0,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Instagram post berhasil ditambahkan',
                'data' => $post,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating Instagram post: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan Instagram post',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update Instagram post
     */
    public function update(Request $request, $id)
    {
        $post = InstagramPost::find($id);

        if (!$post) {
            return response()->json([
                'success' => false,
                'message' => 'Instagram post tidak ditemukan',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'instagram_url' => 'nullable|url|unique:instagram_posts,instagram_url,' . $id,
            'caption' => 'nullable|string',
            'image_url' => 'nullable|url',
            'media_type' => 'nullable|in:IMAGE,VIDEO,CAROUSEL_ALBUM',
            'posted_at' => 'nullable|date',
            'show_in_media' => 'nullable|boolean',
            'status' => 'nullable|in:published,draft',
            'order' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $data = $request->only([
                'instagram_url',
                'caption',
                'image_url',
                'media_type',
                'posted_at',
                'show_in_media',
                'status',
                'order',
            ]);

            // Update instagram_id if URL changed
            if (isset($data['instagram_url'])) {
                $data['instagram_id'] = $this->extractInstagramId($data['instagram_url']);
            }

            $post->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Instagram post berhasil diupdate',
                'data' => $post->fresh(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating Instagram post: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate Instagram post',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete Instagram post
     */
    public function destroy($id)
    {
        $post = InstagramPost::find($id);

        if (!$post) {
            return response()->json([
                'success' => false,
                'message' => 'Instagram post tidak ditemukan',
            ], 404);
        }

        try {
            $post->delete();

            return response()->json([
                'success' => true,
                'message' => 'Instagram post berhasil dihapus',
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting Instagram post: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus Instagram post',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Helper: Extract Instagram post ID from URL
     */
    private function extractInstagramId($url)
    {
        // Instagram URL format: https://www.instagram.com/p/{POST_ID}/ or /reel/{POST_ID}/
        preg_match('/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/', $url, $matches);
        return $matches[1] ?? null;
    }
}