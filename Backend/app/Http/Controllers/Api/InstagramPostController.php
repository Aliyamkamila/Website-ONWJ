<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InstagramPost;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage; // ✅ IMPORT STORAGE

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
     * Create new Instagram post with thumbnail upload
     */
    public function store(Request $request)
    {
        // ✅ DEBUG: Log SEMUA input dengan format lebih jelas
        Log::info('=== Instagram POST Request ===');
        Log::info('📝 Request all():', $request->all());
        Log::info('📁 Request allFiles():', $request->allFiles());
        Log::info('📎 Has file thumbnail?', [$request->hasFile('thumbnail') ? 'YES' : 'NO']);
        
        if ($request->hasFile('thumbnail')) {
            $file = $request->file('thumbnail');
            Log::info('📸 File thumbnail details:', [
                'original_name' => $file->getClientOriginalName(),
                'extension' => $file->getClientOriginalExtension(),
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize() . ' bytes',
                'error' => $file->getError(),
                'is_valid' => $file->isValid() ? 'YES' : 'NO',
                'path' => $file->getPathname(),
            ]);
        } else {
            Log::warning('⚠️ TIDAK ADA FILE THUMBNAIL dalam request!');
        }
        
        Log::info('📨 Content-Type:', [$request->header('Content-Type')]);
        Log::info('🔧 Request method:', [$request->method()]);
        Log::info('🌐 Request URL:', [$request->fullUrl()]);
        Log::info('==================================');

        // Cek apakah request adalah multipart/form-data
        if (strpos($request->header('Content-Type'), 'multipart/form-data') === false) {
            Log::warning('⚠️ Request BUKAN multipart/form-data! Content-Type: ' . $request->header('Content-Type'));
        }

        $validator = Validator::make($request->all(), [
            'instagram_url' => 'required|url|unique:instagram_posts,instagram_url',
            'caption' => 'nullable|string',
            'thumbnail' => 'required|image|mimes:jpeg,jpg,png,webp|max:5120', // ✅ WAJIB UPLOAD (max 5MB)
            'media_type' => 'nullable|in:IMAGE,VIDEO,CAROUSEL_ALBUM',
            'posted_at' => 'nullable|date',
            'show_in_media' => 'nullable|boolean',
            'status' => 'nullable|in:published,draft',
            'order' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            // ✅ Log error validasi dengan detail
            Log::error('❌ Validasi gagal:', [
                'errors' => $validator->errors()->toArray()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Extract Instagram post ID from URL
            $instagramId = $this->extractInstagramId($request->instagram_url);

            // ✅ Handle thumbnail upload
            $imageUrl = null;
            $thumbnailUrl = null;
            
            if ($request->hasFile('thumbnail')) {
                $image = $request->file('thumbnail');
                
                // Log detail file (lagi, untuk memastikan)
                Log::info('📸 Memproses upload file:', [
                    'original_name' => $image->getClientOriginalName(),
                    'extension' => $image->getClientOriginalExtension(),
                    'mime_type' => $image->getMimeType(),
                    'size' => $image->getSize() . ' bytes',
                    'error' => $image->getError(),
                    'is_valid' => $image->isValid() ? 'YES' : 'NO',
                ]);

                $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                
                // Store in storage/app/public/instagram
                $path = $image->storeAs('public/instagram', $filename);
                
                Log::info('✅ File tersimpan di: ' . $path);
                
                // Generate URL for frontend
                $imageUrl = url('storage/instagram/' . $filename);
                $thumbnailUrl = $imageUrl;
                
                Log::info('🔗 URL gambar: ' . $imageUrl);
            } else {
                Log::error('❌ File thumbnail TIDAK ADA saat proses upload!');
                // Ini seharusnya tidak terjadi karena sudah divalidasi, tapi kita log untuk jaga-jaga
            }

            $post = InstagramPost::create([
                'instagram_url' => $request->instagram_url,
                'instagram_id' => $instagramId,
                'caption' => $request->caption ?? '',
                'image_url' => $imageUrl,
                'thumbnail_url' => $thumbnailUrl,
                'media_type' => $request->media_type ?? 'IMAGE',
                'posted_at' => $request->posted_at ?? now(),
                'show_in_media' => $request->show_in_media ?? true,
                'status' => $request->status ?? 'published',
                'order' => $request->order ?? 0,
            ]);

            Log::info('✅ Instagram post berhasil dibuat dengan ID: ' . $post->id);

            return response()->json([
                'success' => true,
                'message' => 'Instagram post berhasil ditambahkan',
                'data' => $post,
            ], 201);
        } catch (\Exception $e) {
            Log::error('❌ Error creating Instagram post: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan Instagram post: ' . $e->getMessage(),
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update Instagram post (with optional thumbnail upload)
     */
    public function update(Request $request, $id)
    {
        // ✅ DEBUG: Log semua input untuk update
        Log::info('=== Instagram UPDATE Request ===');
        Log::info('🆔 ID:', [$id]);
        Log::info('📝 Request all():', $request->all());
        Log::info('📁 Request allFiles():', $request->allFiles());
        Log::info('📎 Has file thumbnail?', [$request->hasFile('thumbnail') ? 'YES' : 'NO']);
        
        if ($request->hasFile('thumbnail')) {
            $file = $request->file('thumbnail');
            Log::info('📸 File thumbnail details:', [
                'original_name' => $file->getClientOriginalName(),
                'extension' => $file->getClientOriginalExtension(),
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize() . ' bytes',
                'is_valid' => $file->isValid() ? 'YES' : 'NO',
            ]);
        }
        
        Log::info('📨 Content-Type:', [$request->header('Content-Type')]);
        Log::info('🔧 Request method:', [$request->method()]);
        Log::info('==================================');

        $post = InstagramPost::find($id);

        if (!$post) {
            Log::warning('❌ Instagram post tidak ditemukan dengan ID: ' . $id);
            return response()->json([
                'success' => false,
                'message' => 'Instagram post tidak ditemukan',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'instagram_url' => 'nullable|url|unique:instagram_posts,instagram_url,' . $id,
            'caption' => 'nullable|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120', // ✅ OPTIONAL saat update
            'media_type' => 'nullable|in:IMAGE,VIDEO,CAROUSEL_ALBUM',
            'posted_at' => 'nullable|date',
            'show_in_media' => 'nullable|boolean',
            'status' => 'nullable|in:published,draft',
            'order' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            Log::warning('❌ Validasi update gagal:', [
                'errors' => $validator->errors()->toArray()
            ]);
            
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
                'media_type',
                'posted_at',
                'show_in_media',
                'status',
                'order',
            ]);

            // Update instagram_id if URL changed
            if (isset($data['instagram_url']) && $data['instagram_url'] !== $post->instagram_url) {
                $data['instagram_id'] = $this->extractInstagramId($data['instagram_url']);
                Log::info('🔄 Instagram URL berubah, ID baru: ' . $data['instagram_id']);
            }

            // ✅ Handle new thumbnail upload
            if ($request->hasFile('thumbnail')) {
                $image = $request->file('thumbnail');
                
                // Log detail file
                Log::info('📸 Update: File thumbnail details:', [
                    'original_name' => $image->getClientOriginalName(),
                    'extension' => $image->getClientOriginalExtension(),
                    'mime_type' => $image->getMimeType(),
                    'size' => $image->getSize() . ' bytes',
                    'is_valid' => $image->isValid() ? 'YES' : 'NO',
                ]);

                // Delete old image if exists
                if ($post->image_url) {
                    // Extract filename from URL
                    $oldPath = str_replace(url('storage/'), '', $post->image_url);
                    $oldPath = ltrim($oldPath, '/');
                    
                    // Delete from storage
                    if (Storage::exists('public/' . $oldPath)) {
                        Storage::delete('public/' . $oldPath);
                        Log::info('🗑️ Deleted old thumbnail: ' . 'public/' . $oldPath);
                    } else {
                        Log::warning('⚠️ File lama tidak ditemukan: ' . 'public/' . $oldPath);
                    }
                }

                // Upload new image
                $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                
                // Store in storage/app/public/instagram
                $path = $image->storeAs('public/instagram', $filename);
                
                Log::info('✅ Update: File tersimpan di: ' . $path);
                
                // Generate URL for frontend
                $data['image_url'] = url('storage/instagram/' . $filename);
                $data['thumbnail_url'] = $data['image_url'];
                
                Log::info('🔗 Update: URL gambar baru: ' . $data['image_url']);
            }

            $post->update($data);
            
            Log::info('✅ Instagram post berhasil diupdate dengan ID: ' . $post->id);

            return response()->json([
                'success' => true,
                'message' => 'Instagram post berhasil diupdate',
                'data' => $post->fresh(),
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error updating Instagram post: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate Instagram post: ' . $e->getMessage(),
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete Instagram post
     */
    public function destroy($id)
    {
        Log::info('🗑️ Attempting to delete Instagram post ID: ' . $id);
        
        $post = InstagramPost::find($id);

        if (!$post) {
            Log::warning('❌ Instagram post tidak ditemukan dengan ID: ' . $id);
            return response()->json([
                'success' => false,
                'message' => 'Instagram post tidak ditemukan',
            ], 404);
        }

        try {
            // ✅ Delete associated image file
            if ($post->image_url) {
                $oldPath = str_replace(url('storage/'), '', $post->image_url);
                $oldPath = ltrim($oldPath, '/');
                
                Log::info('📁 Attempting to delete file: public/' . $oldPath);
                
                if (Storage::exists('public/' . $oldPath)) {
                    Storage::delete('public/' . $oldPath);
                    Log::info('🗑️ Deleted thumbnail: ' . 'public/' . $oldPath);
                } else {
                    Log::warning('⚠️ File tidak ditemukan: ' . 'public/' . $oldPath);
                }
            }

            $post->delete();

            Log::info('✅ Instagram post berhasil dihapus dengan ID: ' . $id);

            return response()->json([
                'success' => true,
                'message' => 'Instagram post berhasil dihapus',
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error deleting Instagram post: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus Instagram post',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Fetch Instagram data via oEmbed API (for frontend manual trigger)
     */
    public function fetchInstagramData(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'url' => 'required|url'
            ]);

            $instagramUrl = $request->input('url');
            
            Log::info('🔍 Fetching Instagram data for URL: ' . $instagramUrl);

            // Try Instagram oEmbed API (no token needed for public posts)
            $oembedUrl = 'https://api.instagram.com/oembed/?url=' . urlencode($instagramUrl);

            $response = Http::timeout(10)->get($oembedUrl);

            if (!$response->successful()) {
                Log::warning('⚠️ Instagram oEmbed API failed, using Open Graph fallback');
                
                // Fallback to Open Graph scraping
                $thumbnailData = $this->fetchInstagramThumbnail($instagramUrl);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Instagram data fetched successfully (via fallback)',
                    'data' => [
                        'thumbnail_url' => $thumbnailData['image_url'],
                        'caption' => $thumbnailData['caption'],
                        'media_type' => $thumbnailData['media_type'],
                        'author_name' => '',
                        'author_url' => '',
                    ]
                ]);
            }

            $data = $response->json();

            // Extract thumbnail dari response
            $thumbnailUrl = $data['thumbnail_url'] ?? null;
            $caption = $data['title'] ?? '';
            $mediaType = $data['type'] ?? 'image'; // "image" or "video"

            Log::info('✅ Instagram data fetched successfully:', [
                'thumbnail_url' => $thumbnailUrl,
                'caption_length' => strlen($caption),
                'media_type' => $mediaType
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Instagram data fetched successfully',
                'data' => [
                    'thumbnail_url' => $thumbnailUrl,
                    'caption' => $caption,
                    'media_type' => strtoupper($mediaType),
                    'author_name' => $data['author_name'] ?? '',
                    'author_url' => $data['author_url'] ?? '',
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('❌ Error fetching Instagram data', [
                'error' => $e->getMessage(),
                'url' => $request->input('url')
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch Instagram data',
                'error' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * ==================== HELPER FUNCTIONS ====================
     */

    /**
     * Helper: Extract Instagram post ID from URL
     */
    private function extractInstagramId($url)
    {
        // Instagram URL format: https://www.instagram.com/p/{POST_ID}/ or /reel/{POST_ID}/
        preg_match('/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/', $url, $matches);
        $id = $matches[1] ?? null;
        
        Log::info('🔍 Extracted Instagram ID: ' . ($id ?? 'null') . ' from URL: ' . $url);
        
        return $id;
    }

    /**
     * Helper: Fetch Instagram thumbnail from URL using Open Graph
     */
    private function fetchInstagramThumbnail($url)
    {
        try {
            // Fetch HTML content
            $response = Http::timeout(10)->get($url);

            if (!$response->successful()) {
                Log::warning('⚠️ Failed to fetch Instagram URL: ' . $url);
                return [
                    'image_url' => null,
                    'thumbnail_url' => null,
                    'caption' => null,
                    'media_type' => 'IMAGE',
                ];
            }

            $html = $response->body();

            // Extract Open Graph meta tags
            $imageUrl = $this->extractMetaTag($html, 'og:image');
            $description = $this->extractMetaTag($html, 'og:description');
            $videoUrl = $this->extractMetaTag($html, 'og:video');

            // Determine media type
            $mediaType = $videoUrl ? 'VIDEO' : 'IMAGE';

            Log::info('📸 Open Graph data extracted:', [
                'image_url' => $imageUrl ? 'found' : 'not found',
                'description' => $description ? 'found' : 'not found',
                'media_type' => $mediaType
            ]);

            return [
                'image_url' => $imageUrl,
                'thumbnail_url' => $imageUrl, // Instagram OG image is already optimized as thumbnail
                'caption' => $description,
                'media_type' => $mediaType,
            ];

        } catch (\Exception $e) {
            Log::error('❌ Error fetching Instagram thumbnail: ' . $e->getMessage());
            
            return [
                'image_url' => null,
                'thumbnail_url' => null,
                'caption' => null,
                'media_type' => 'IMAGE',
            ];
        }
    }

    /**
     * Helper: Extract meta tag from HTML
     */
    private function extractMetaTag($html, $property)
    {
        // Match meta tag with property
        $pattern = '/<meta[^>]*property=["\']' . preg_quote($property, '/') . '["\'][^>]*content=["\'](.*?)["\']/i';
        
        if (preg_match($pattern, $html, $matches)) {
            return $matches[1];
        }

        // Alternative: match with name attribute
        $pattern = '/<meta[^>]*name=["\']' . preg_quote($property, '/') . '["\'][^>]*content=["\'](.*?)["\']/i';
        
        if (preg_match($pattern, $html, $matches)) {
            return $matches[1];
        }

        return null;
    }
}