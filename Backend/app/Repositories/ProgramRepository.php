<?php

namespace App\Repositories;

use App\Models\Program;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * Program Repository dengan implementasi cache
 */
class ProgramRepository extends BaseRepository
{
    protected int $cacheTTL = 1800; // 30 minutes

    public function __construct(Program $model)
    {
        parent::__construct($model);
    }

    /**
     * Get published programs dengan cache
     */
    public function getPublished()
    {
        return $this->cacheQuery('published', function () {
            return $this->model
                ->where('is_published', true)
                ->with(['category', 'testimonials'])
                ->select(['id', 'title', 'slug', 'category_id', 'description', 'image'])
                ->orderBy('created_at', 'desc')
                ->get();
        });
    }

    /**
     * Get program by slug dengan cache
     */
    public function findBySlug(string $slug)
    {
        return $this->cacheQuery("slug:{$slug}", function () use ($slug) {
            return $this->model
                ->where('slug', $slug)
                ->where('is_published', true)
                ->with(['category', 'testimonials'])
                ->first();
        });
    }

    /**
     * Get programs by category dengan cache
     */
    public function getByCategory(int $categoryId)
    {
        return $this->cacheQuery("category:{$categoryId}", function () use ($categoryId) {
            return $this->model
                ->where('category_id', $categoryId)
                ->where('is_published', true)
                ->select(['id', 'title', 'slug', 'description', 'image'])
                ->get();
        });
    }

    /**
     * Get program statistics dengan cache (longer TTL)
     */
    public function getStatistics()
    {
        return $this->remember(
            $this->getCacheKey('statistics', []),
            7200, // 2 hours
            function () {
                return [
                    'total' => $this->model->count(),
                    'published' => $this->model->where('is_published', true)->count(),
                    'by_category' => $this->model
                        ->select('category_id', DB::raw('count(*) as total'))
                        ->where('is_published', true)
                        ->groupBy('category_id')
                        ->get(),
                ];
            }
        );
    }
}