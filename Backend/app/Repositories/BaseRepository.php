<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * Base Repository dengan Query Cache Strategy
 * 
 * Menyediakan caching layer untuk model queries
 * Menggunakan cache tags untuk invalidation strategy
 */
abstract class BaseRepository
{
    protected Model $model;
    
    /**
     * Cache TTL dalam detik
     */
    protected int $cacheTTL = 3600; // 1 hour default

    /**
     * Cache tags untuk grup invalidation
     */
    protected array $cacheTags = [];

    public function __construct(Model $model)
    {
        $this->model = $model;
        $this->cacheTags = [$this->getCacheTag()];
    }

    /**
     * Get cache tag untuk model ini
     */
    protected function getCacheTag(): string
    {
        return strtolower(class_basename($this->model));
    }

    /**
     * Generate cache key
     */
    protected function getCacheKey(string $method, array $params = []): string
    {
        $modelName = strtolower(class_basename($this->model));
        $paramsHash = md5(serialize($params));
        return "{$modelName}:{$method}:{$paramsHash}";
    }

    /**
     * Determine if current cache driver supports tags.
     */
    protected function supportsTags(): bool
    {
        $driver = config('cache.default');
        return in_array($driver, ['redis', 'memcached', 'dynamodb'], true);
    }

    /**
     * Remember helper that falls back when tags are unsupported.
     */
    protected function remember(string $key, int $ttl, \Closure $callback)
    {
        if ($this->supportsTags()) {
            return \Illuminate\Support\Facades\Cache::tags($this->cacheTags)->remember($key, $ttl, $callback);
        }
        // Fallback: plain remember without tags (file/array/database drivers)
        return \Illuminate\Support\Facades\Cache::remember($key, $ttl, $callback);
    }

    /**
     * Get all records dengan cache
     */
    public function all(array $columns = ['*'])
    {
        $cacheKey = $this->getCacheKey('all', $columns);
        return $this->remember(
            $cacheKey,
            $this->cacheTTL,
            fn() => $this->model->get($columns)
        );
    }

    /**
     * Find by ID dengan cache
     */
    public function find(int $id, array $columns = ['*'])
    {
        $cacheKey = $this->getCacheKey('find', ['id' => $id, 'columns' => $columns]);
        return $this->remember(
            $cacheKey,
            $this->cacheTTL,
            fn() => $this->model->find($id, $columns)
        );
    }

    /**
     * Find by field dengan cache
     */
    public function findBy(string $field, $value, array $columns = ['*'])
    {
        $cacheKey = $this->getCacheKey('findBy', [
            'field' => $field,
            'value' => $value,
            'columns' => $columns
        ]);
        return $this->remember(
            $cacheKey,
            $this->cacheTTL,
            fn() => $this->model->where($field, $value)->get($columns)
        );
    }

    /**
     * Paginated results dengan cache
     */
    public function paginate(int $perPage = 15, array $columns = ['*'])
    {
        $page = request('page', 1);
        $cacheKey = $this->getCacheKey('paginate', [
            'perPage' => $perPage,
            'page' => $page,
            'columns' => $columns
        ]);
        return $this->remember(
            $cacheKey,
            $this->cacheTTL,
            fn() => $this->model->paginate($perPage, $columns)
        );
    }

    /**
     * Create dengan auto cache invalidation
     */
    public function create(array $data)
    {
        $record = $this->model->create($data);
        
        // Invalidate cache setelah create
        $this->clearCache();
        
        return $record;
    }

    /**
     * Update dengan auto cache invalidation
     */
    public function update(int $id, array $data)
    {
        $record = $this->model->find($id);
        
        if ($record) {
            $record->update($data);
            $this->clearCache();
        }
        
        return $record;
    }

    /**
     * Delete dengan auto cache invalidation
     */
    public function delete(int $id): bool
    {
        $result = $this->model->destroy($id);
        
        if ($result) {
            $this->clearCache();
        }
        
        return (bool) $result;
    }

    /**
     * Clear cache untuk model ini
     */
    public function clearCache(): void
    {
        if ($this->supportsTags()) {
            Cache::tags($this->cacheTags)->flush();
        } else {
            // Fallback: clear entire cache on non-tag drivers (acceptable in local dev)
            Cache::flush();
        }
    }

    /**
     * Custom query dengan cache
     */
    protected function cacheQuery(string $key, \Closure $callback, ? int $ttl = null)
    {
        return $this->remember(
            $this->getCacheKey('custom', ['key' => $key]),
            $ttl ?? $this->cacheTTL,
            $callback
        );
    }
}