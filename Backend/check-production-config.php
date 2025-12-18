<?php

/**
 * Production Configuration Checker
 * Run this script to verify production settings
 * 
 * Usage: php check-production-config.php
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "\n";
echo "╔════════════════════════════════════════════════════╗\n";
echo "║   ONWJ PRODUCTION CONFIGURATION CHECKER           ║\n";
echo "╚════════════════════════════════════════════════════╝\n";
echo "\n";

$issues = [];
$warnings = [];

// Check 1: Environment
$env = app()->environment();
echo "Environment: ";
if ($env === 'production') {
    echo "✓ production\n";
} else {
    echo "⚠ {$env} (expected: production)\n";
    $warnings[] = "Running in {$env} environment";
}

// Check 2: Debug Mode
echo "Debug Mode: ";
$debug = config('app.debug');
if ($debug === false) {
    echo "✓ disabled\n";
} else {
    echo "✗ ENABLED\n";
    $issues[] = "APP_DEBUG is enabled in production";
}

// Check 3: Log Level
echo "Log Level: ";
$logLevel = config('logging.channels.daily.level');
if (in_array($logLevel, ['warning', 'error', 'critical'])) {
    echo "✓ {$logLevel}\n";
} else {
    echo "⚠ {$logLevel} (recommended: warning or error)\n";
    $warnings[] = "Log level is verbose ({$logLevel})";
}

// Check 4: Config Cache
echo "Config Cached: ";
if (file_exists(base_path('bootstrap/cache/config.php'))) {
    echo "✓ yes\n";
} else {
    echo "✗ no\n";
    $issues[] = "Configuration not cached";
}

// Check 5: Route Cache
echo "Routes Cached:  ";
if (file_exists(base_path('bootstrap/cache/routes-v7.php'))) {
    echo "✓ yes\n";
} else {
    echo "✗ no\n";
    $issues[] = "Routes not cached";
}

// Check 6: View Cache
echo "Views Compiled: ";
$viewsPath = storage_path('framework/views');
if (is_dir($viewsPath) && count(scandir($viewsPath)) > 2) {
    echo "✓ yes\n";
} else {
    echo "⚠ no\n";
    $warnings[] = "Views not compiled";
}

// Check 7: OPcache
echo "OPcache: ";
if (function_exists('opcache_get_status')) {
    $opcache = opcache_get_status();
    if ($opcache && $opcache['opcache_enabled']) {
        $hitRate = round($opcache['opcache_statistics']['opcache_hit_rate'] ?? 0, 2);
        echo "✓ enabled (hit rate: {$hitRate}%)\n";
    } else {
        echo "⚠ disabled\n";
        $warnings[] = "OPcache is not enabled";
    }
} else {
    echo "✗ not available\n";
    $issues[] = "OPcache extension not installed";
}

// Check 8: Session Configuration
echo "Session Secure: ";
$sessionSecure = config('session.secure');
if ($sessionSecure === true || $env !== 'production') {
    echo "✓ yes\n";
} else {
    echo "⚠ no\n";
    $warnings[] = "SESSION_SECURE_COOKIE should be true in production";
}

echo "\n";
echo "═══════════════════════════════════════════════════\n";
echo "\n";

// Performance estimate
$configCached = file_exists(base_path('bootstrap/cache/config.php'));
$routesCached = file_exists(base_path('bootstrap/cache/routes-v7.php'));
$opcacheEnabled = function_exists('opcache_get_status') && 
                  opcache_get_status() && 
                  opcache_get_status()['opcache_enabled'];

$performanceScore = 0;
if (! $debug) $performanceScore += 40;
if (in_array($logLevel, ['warning', 'error', 'critical'])) $performanceScore += 20;
if ($configCached) $performanceScore += 15;
if ($routesCached) $performanceScore += 15;
if ($opcacheEnabled) $performanceScore += 10;

echo "Performance Score: {$performanceScore}/100\n";
echo "\n";

if (count($issues) > 0) {
    echo "❌ CRITICAL ISSUES:\n";
    foreach ($issues as $issue) {
        echo "   • {$issue}\n";
    }
    echo "\n";
}

if (count($warnings) > 0) {
    echo "⚠️  WARNINGS:\n";
    foreach ($warnings as $warning) {
        echo "   • {$warning}\n";
    }
    echo "\n";
}

if (count($issues) === 0 && count($warnings) === 0) {
    echo "✅ All checks passed! Application is production-ready.\n";
} elseif (count($issues) === 0) {
    echo "✓ No critical issues, but there are some warnings to address.\n";
} else {
    echo "❌ Critical issues found.Fix them before deploying to production.\n";
    echo "\nRun: php artisan optimize:production\n";
}

echo "\n";

exit(count($issues) > 0 ? 1 : 0);