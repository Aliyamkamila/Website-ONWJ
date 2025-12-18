<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Intervention\Image\Interfaces\EncoderInterface;

/**
 * Async job untuk image optimization
 * 
 * Menghindari blocking request saat user upload image
 * Process berat dijalankan di background via Redis queue
 */
class ProcessImageOptimization implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 10;

    /**
     * The maximum number of seconds the job can run.
     */
    public int $timeout = 120;

    protected string $imagePath;
    protected array $sizes;

    /**
     * Create a new job instance.
     */
    public function __construct(string $imagePath, array $sizes = [])
    {
        $this->imagePath = $imagePath;
        $this->sizes = $sizes ?: [
            'thumbnail' => [150, 150],
            'medium' => [600, 400],
            'large' => [1200, 800],
        ];
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Load original image
            $manager = new ImageManager(new Driver());
            $image = $manager->read(Storage::disk('public')->path($this->imagePath));

            // Generate optimized versions
            foreach ($this->sizes as $sizeName => $dimensions) {
                [$width, $height] = $dimensions;

                $optimized = clone $image;
                // Scale down (won't upscale) to fit dimensions maintaining aspect ratio
                $optimized->scaleDown($width, $height);

                // Generate path for optimized version
                $pathInfo = pathinfo($this->imagePath);
                $optimizedPath = $pathInfo['dirname'] .'/' .
                                $pathInfo['filename'] .'_' .$sizeName .'.' .
                                $pathInfo['extension'];

                // Save optimized version
                $encoded = $optimized->encode();
                Storage::disk('public')->put(
                    $optimizedPath,
                    $encoded->toFilePointer()
                );
            }

            Log::info('Image optimization completed', [
                'path' => $this->imagePath,
                'sizes' => array_keys($this->sizes)
            ]);

        } catch (\Exception $e) {
            Log::error('Image optimization failed', [
                'path' => $this->imagePath,
                'error' => $e->getMessage()
            ]);

            throw $e; // Re-throw untuk trigger retry
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Image optimization job failed after all retries', [
            'path' => $this->imagePath,
            'error' => $exception->getMessage()
        ]);
    }
}