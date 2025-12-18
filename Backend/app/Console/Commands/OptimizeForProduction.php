<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

class OptimizeForProduction extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'optimize:production
                            {--check : Only check optimization status}
                            {--clear : Clear all caches before optimizing}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Optimize application for production deployment';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 ONWJ Production Optimization');
        $this->newLine();

        // Check environment
        if ($this->option('check')) {
            return $this->checkOptimizationStatus();
        }

        // Verify we're not in local development
        if (app()->environment('local')) {
            if (! $this->confirm('You are in LOCAL environment.Continue optimization?', false)) {
                $this->warn('Optimization cancelled.');
                return self::FAILURE;
            }
        }

        // Clear caches if requested
        if ($this->option('clear')) {
            $this->clearAllCaches();
        }

        $this->info('Step 1/6: Caching configuration...');
        Artisan::call('config:cache');
        $this->line('   ✓ Configuration cached');

        $this->info('Step 2/6: Caching routes...');
        Artisan::call('route:cache');
        $this->line('   ✓ Routes cached');

        $this->info('Step 3/6: Caching views...');
        Artisan::call('view:cache');
        $this->line('   ✓ Views compiled and cached');

        $this->info('Step 4/6: Caching events...');
        Artisan::call('event:cache');
        $this->line('   ✓ Events cached');

        $this->info('Step 5/6: Running general optimization...');
        Artisan::call('optimize');
        $this->line('   ✓ Application optimized');

        $this->info('Step 6/6:  Generating autoload files...');
        exec('cd ' .base_path() .' && composer dump-autoload -o', $output, $returnVar);
        if ($returnVar === 0) {
            $this->line('   ✓ Autoload optimized');
        } else {
            $this->warn('   ⚠ Could not optimize autoload (composer not found or error)');
        }

        $this->newLine();
        $this->info('✅ Production optimization complete!');
        $this->newLine();

        // Show optimization status
        $this->checkOptimizationStatus();

        return self::SUCCESS;
    }

    /**
     * Clear all caches
     */
    private function clearAllCaches()
    {
        $this->warn('Clearing all caches...');
        
        Artisan::call('config:clear');
        Artisan::call('route:clear');
        Artisan::call('view:clear');
        Artisan::call('event:clear');
        Artisan::call('cache:clear');
        
        $this->line('   ✓ All caches cleared');
        $this->newLine();
    }

    /**
     * Check optimization status
     */
    private function checkOptimizationStatus()
    {
        $this->info('📊 Optimization Status Check');
        $this->newLine();

        $status = [];

        // Check environment
        $env = app()->environment();
        $status['Environment'] = $env;
        $this->line("Environment: <fg=yellow>{$env}</>");

        // Check debug mode
        $debug = config('app.debug');
        $debugStatus = $debug ? '<fg=red>ENABLED ⚠</>' : '<fg=green>DISABLED ✓</>';
        $status['Debug Mode'] = $debug;
        $this->line("Debug Mode: {$debugStatus}");

        // Check log level
        $logLevel = config('logging.channels.daily.level', 'not set');
        $logStatus = in_array($logLevel, ['debug', 'info']) 
            ? '<fg=red>' .$logLevel .' ⚠</>' 
            : '<fg=green>' .$logLevel .' ✓</>';
        $status['Log Level'] = $logLevel;
        $this->line("Log Level: {$logStatus}");

        // Check cached config
        $configCached = File::exists(base_path('bootstrap/cache/config.php'));
        $configStatus = $configCached ? '<fg=green>YES ✓</>' : '<fg=red>NO ⚠</>';
        $status['Config Cached'] = $configCached;
        $this->line("Config Cached: {$configStatus}");

        // Check cached routes
        $routesCached = File::exists(base_path('bootstrap/cache/routes-v7.php'));
        $routesStatus = $routesCached ?  '<fg=green>YES ✓</>' : '<fg=red>NO ⚠</>';
        $status['Routes Cached'] = $routesCached;
        $this->line("Routes Cached: {$routesStatus}");

        // Check compiled views
        $viewsCompiled = count(File::files(storage_path('framework/views'))) > 0;
        $viewsStatus = $viewsCompiled ? '<fg=green>YES ✓</>' : '<fg=red>NO ⚠</>';
        $status['Views Compiled'] = $viewsCompiled;
        $this->line("Views Compiled: {$viewsStatus}");

        // Check OPcache status (if PHP extension loaded)
        if (function_exists('opcache_get_status')) {
            $opcache = opcache_get_status();
            $opcacheEnabled = $opcache['opcache_enabled'] ??  false;
            $opcacheStatus = $opcacheEnabled ? '<fg=green>ENABLED ✓</>' : '<fg=red>DISABLED ⚠</>';
            $status['OPcache'] = $opcacheEnabled;
            $this->line("OPcache: {$opcacheStatus}");

            if ($opcacheEnabled) {
                $hitRate = round($opcache['opcache_statistics']['opcache_hit_rate'] ??  0, 2);
                $this->line("  ↳ Hit Rate: <fg=cyan>{$hitRate}%</>");
                $this->line("  ↳ Memory Used: <fg=cyan>" .
                    round($opcache['memory_usage']['used_memory'] / 1024 / 1024, 2) ." MB</>");
            }
        } else {
            $this->line("OPcache:  <fg=yellow>NOT AVAILABLE</>");
        }

        $this->newLine();

        // Production readiness score
        $readyForProduction = 
            !$debug && 
            in_array($logLevel, ['warning', 'error', 'critical']) && 
            $configCached && 
            $routesCached;

        if ($readyForProduction) {
            $this->info('✅ Application is READY for production');
        } else {
            $this->error('❌ Application is NOT READY for production');
            $this->warn('   Run:  php artisan optimize: production');
        }

        return self::SUCCESS;
    }
}