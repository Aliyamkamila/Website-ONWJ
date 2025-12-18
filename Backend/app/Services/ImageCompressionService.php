<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Log;

class ImageCompressionService
{
    protected ImageManager $manager;

    public function __construct()
    {
        // Intervention Image v3 - Initialize with GD driver instance
        $this->manager = new ImageManager(new Driver());
    }

    /**
     * Compress and optimize image for web
     * - Resize to max width while maintaining aspect ratio
     * - Convert to WebP format
     * - Reduce quality to 80% for web optimization
     * 
     * @param UploadedFile $file The uploaded image file
     * @param int $maxWidth Maximum width in pixels (default: 2000px)
     * @param int $quality Compression quality 1-100 (default: 80)
     * @return UploadedFile The processed image file
     */
    public function compress(
        UploadedFile $file,
        int $maxWidth = 2000,
        int $quality = 80
    ): UploadedFile {
        try {
            // Read the uploaded file
            $image = $this->manager->read($file->getStream());

            // Get original dimensions
            $originalWidth = $image->width();

            // Resize if larger than maxWidth (maintains aspect ratio)
            if ($originalWidth > $maxWidth) {
                $image = $image->scaleDown(width: $maxWidth);
            }

            // Convert to WebP for better compression
            $image = $image->toWebp(quality: $quality);

            // Create a temporary file
            $tempPath = tempnam(sys_get_temp_dir(), 'img');
            
            // Save the compressed image
            $image->save($tempPath);

            // Create new UploadedFile instance from compressed image
            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $compressedFile = new UploadedFile(
                path: $tempPath,
                originalName: $originalName.'.webp',
                mimeType: 'image/webp',
                error: null,
                test: false
            );

            return $compressedFile;
        } catch (\Exception $e) {
            // If compression fails, return original file
            Log::warning('Image compression failed, using original', [
                'file' => $file->getClientOriginalName(),
                'error' => $e->getMessage(),
            ]);
            return $file;
        }
    }

    /**
     * Compress image without type conversion
     * Keeps original format but reduces file size
     * 
     * @param UploadedFile $file The uploaded image file
     * @param int $maxWidth Maximum width in pixels
     * @param int $quality Compression quality 1-100
     * @return UploadedFile The processed image file
     */
    public function compressKeepFormat(
        UploadedFile $file,
        int $maxWidth = 2000,
        int $quality = 80
    ): UploadedFile {
        try {
            $image = $this->manager->read($file->getStream());
            $originalWidth = $image->width();

            if ($originalWidth > $maxWidth) {
                $image = $image->scaleDown(width: $maxWidth);
            }

            // Encode based on original format
            $mimeType = $file->getMimeType();
            $extension = $file->getClientOriginalExtension();

            if ($mimeType === 'image/png') {
                $image = $image->toPng();
            } elseif ($mimeType === 'image/jpeg') {
                $image = $image->toJpeg(quality: $quality);
            } else {
                $image = $image->toWebp(quality: $quality);
            }

            $tempPath = tempnam(sys_get_temp_dir(), 'img');
            $image->save($tempPath);

            $compressedFile = new UploadedFile(
                path: $tempPath,
                originalName: $file->getClientOriginalName(),
                mimeType: $mimeType,
                error: null,
                test: false
            );

            return $compressedFile;
        } catch (\Exception $e) {
            Log::warning('Image compression failed', [
                'file' => $file->getClientOriginalName(),
                'error' => $e->getMessage(),
            ]);
            return $file;
        }
    }

    /**
     * Get compression stats (for logging/debugging)
     * 
     * @param UploadedFile $original Original file
     * @param UploadedFile $compressed Compressed file
     * @return array Compression statistics
     */
    public function getStats(UploadedFile $original, UploadedFile $compressed): array
    {
        $originalSize = $original->getSize();
        $compressedSize = $compressed->getSize();
        $reduction = $originalSize - $compressedSize;
        $percentage = $originalSize > 0 ? round(($reduction / $originalSize) * 100, 2) : 0;

        return [
            'original_size' => $originalSize,
            'compressed_size' => $compressedSize,
            'reduction_bytes' => $reduction,
            'reduction_percentage' => $percentage,
        ];
    }
}
