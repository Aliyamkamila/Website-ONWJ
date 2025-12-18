<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\HeroSection;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Warm critical caches in local HTTP environment to avoid cold-start latency
        if (! app()->runningInConsole() && app()->environment('local')) {
            try {
                // Warm DB connection to avoid first-request handshake latency
                DB::connection()->getPdo();

                if (! Cache::has('hero_sections:index')) {
                    Cache::remember('hero_sections:index', 300, function () {
                        return HeroSection::active()
                            ->ordered()
                            ->get()
                            ->map(function ($item) {
                                return [
                                    'id' => $item->id,
                                    'type' => $item->type,
                                    'src' => $item->getFullSrcAttribute(),
                                    'duration' => $item->duration,
                                    'label' => $item->label,
                                    'title' => $item->title,
                                    'description' => $item->description,
                                    'order' => $item->order,
                                ];
                            });
                    });
                }
            } catch (\Throwable $e) {
                Log::debug('Cache warm failed', ['error' => $e->getMessage()]);
            }
        }
    }
}
