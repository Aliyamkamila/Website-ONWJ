<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Artisan;

class SettingController extends Controller
{
    /**
     * ==================== PUBLIC ROUTES ====================
     */

    /**
     * Get all public settings
     * GET /api/v1/settings
     */
    public function index()
    {
        try {
            $settings = Setting::getAllCached();

            // Helper function to get value safely
            $get = function($key, $default = '') use ($settings) {
                return $settings[$key] ?? $default;
            };

            // Format settings for frontend
            $formatted = [
                'company' => [
                    'name' => $get('company_name'),
                    'address' => $get('company_address'),
                    'phone' => $get('company_phone'),
                    'email' => $get('company_email'),
                    'fax' => $get('company_fax'),
                ],
                'social_media' => [
                    'facebook' => $get('social_facebook'),
                    'instagram' => $get('social_instagram'),
                    'twitter' => $get('social_twitter'),
                    'linkedin' => $get('social_linkedin'),
                    'youtube' => $get('social_youtube'),
                ],
                'contact' => [
                    'email' => $get('contact_email'),
                    'phone' => $get('contact_phone'),
                    'whatsapp' => $get('contact_whatsapp'),
                ],
                'operating_hours' => [
                    'weekday' => $get('hours_weekday'),
                    'weekend' => $get('hours_weekend'),
                ],
                'seo' => [
                    'meta_title' => $get('seo_meta_title'),
                    'meta_description' => $get('seo_meta_description'),
                    'meta_keywords' => $get('seo_meta_keywords'),
                ],
                'footer' => [
                    'about_text' => $get('footer_about_text'),
                    'copyright' => $get('footer_copyright'),
                ],
                'logo' => [
                    'main' => $get('logo_main') ? Storage::url($get('logo_main')) : null,
                    'footer' => $get('logo_footer') ? Storage::url($get('logo_footer')) : null,
                    'favicon' => $get('logo_favicon') ? Storage::url($get('logo_favicon')) : null,
                ],
            ];

            return response()->json([
                'success' => true,
                'message' => 'Settings retrieved successfully',
                'data' => $formatted
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ==================== ADMIN ROUTES ====================
     */

    /**
     * Get all settings for admin (grouped by category)
     * GET /api/v1/admin/settings
     */
    public function adminIndex()
    {
        try {
            $settings = Setting:: getByCategory();

            return response()->json([
                'success' => true,
                'message' => 'Settings retrieved successfully',
                'data' => $settings
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update multiple settings
     * PUT /api/v1/admin/settings
     */
    public function update(Request $request)
    {
        try {
            $settings = $request->all();

            foreach ($settings as $key => $value) {
                // Skip file uploads (handled separately)
                if ($request->hasFile($key)) {
                    continue;
                }

                Setting::set($key, $value);
            }

            // Clear cache
            Cache::forget('site_settings');

            return response()->json([
                'success' => true,
                'message' => 'Settings updated successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload logo/image
     * POST /api/v1/admin/settings/upload
     */
    public function uploadImage(Request $request)
    {
        $validator = Validator:: make($request->all(), [
            'key' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $key = $request->key;
            $setting = Setting::where('key', $key)->first();

            if (!$setting) {
                return response()->json([
                    'success' => false,
                    'message' => 'Setting not found'
                ], 404);
            }

            // Delete old image
            if ($setting->value && Storage::exists($setting->value)) {
                Storage::delete($setting->value);
            }

            // Upload new image
            $file = $request->file('image');
            $filename = time() .'_' .$key .'.' .$file->getClientOriginalExtension();
            $path = $file->storeAs('settings', $filename, 'public');

            // Update setting
            $setting->update(['value' => $path]);

            // Clear cache
            Cache:: forget('site_settings');

            return response()->json([
                'success' => true,
                'message' => 'Image uploaded successfully',
                'data' => [
                    'key' => $key,
                    'path' => $path,
                    'url' => Storage::url($path)
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload image',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete image
     * DELETE /api/v1/admin/settings/image/{key}
     */
    public function deleteImage($key)
    {
        try {
            $setting = Setting:: where('key', $key)->first();

            if (!$setting) {
                return response()->json([
                    'success' => false,
                    'message' => 'Setting not found'
                ], 404);
            }

            // Delete image file
            if ($setting->value && Storage::exists($setting->value)) {
                Storage::delete($setting->value);
            }

            // Clear value
            $setting->update(['value' => null]);

            // Clear cache
            Cache::forget('site_settings');

            return response()->json([
                'success' => true,
                'message' => 'Image deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete image',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reset settings to default
     * POST /api/v1/admin/settings/reset
     */
    public function reset()
    {
        try {
            // Run seeder to reset to defaults
            Artisan::call('db:seed', ['--class' => 'SettingSeeder', '--force' => true]);

            // Clear cache
            Cache::forget('site_settings');

            return response()->json([
                'success' => true,
                'message' => 'Settings reset to default successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reset settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}