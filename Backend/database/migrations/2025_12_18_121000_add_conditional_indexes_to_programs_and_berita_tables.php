<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Check if an index exists on a table.
     */
    protected function indexExists(string $table, string $indexName): bool
    {
        $database = DB::getDatabaseName();
        $count = DB::table('information_schema.statistics')
            ->where('table_schema', $database)
            ->where('table_name', $table)
            ->where('index_name', $indexName)
            ->count();
        return $count > 0;
    }

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Programs table conditional indexes
        if (Schema::hasTable('programs')) {
            Schema::table('programs', function (Blueprint $table) {
                if (Schema::hasColumn('programs', 'is_published') && ! $this->indexExists('programs', 'programs_is_published_index')) {
                    $table->index('is_published');
                }
                if (Schema::hasColumn('programs', 'category_id') && ! $this->indexExists('programs', 'programs_category_id_index')) {
                    $table->index('category_id');
                }
                if (Schema::hasColumn('programs', 'created_at') && ! $this->indexExists('programs', 'programs_created_at_index')) {
                    $table->index('created_at');
                }
            });
        }

        // Berita table conditional indexes
        if (Schema::hasTable('berita')) {
            Schema::table('berita', function (Blueprint $table) {
                if (Schema::hasColumn('berita', 'is_published') && ! $this->indexExists('berita', 'berita_is_published_index')) {
                    $table->index('is_published');
                }
                if (Schema::hasColumn('berita', 'category_id') && ! $this->indexExists('berita', 'berita_category_id_index')) {
                    $table->index('category_id');
                }
                if (Schema::hasColumn('berita', 'published_at') && ! $this->indexExists('berita', 'berita_published_at_index')) {
                    $table->index('published_at');
                }
                // slug is likely unique/indexed in earlier migration — skip to avoid conflicts
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop indexes defensively with try/catch in case they don't exist
        if (Schema::hasTable('programs')) {
            Schema::table('programs', function (Blueprint $table) {
                foreach (['programs_is_published_index', 'programs_category_id_index', 'programs_created_at_index'] as $index) {
                    try {
                        $table->dropIndex([$index]);
                    } catch (\Throwable $e) {
                        // ignore if index doesn't exist
                    }
                }
            });
        }

        if (Schema::hasTable('berita')) {
            Schema::table('berita', function (Blueprint $table) {
                foreach (['berita_is_published_index', 'berita_category_id_index', 'berita_published_at_index'] as $index) {
                    try {
                        $table->dropIndex([$index]);
                    } catch (\Throwable $e) {
                        // ignore if index doesn't exist
                    }
                }
            });
        }
    }
};
