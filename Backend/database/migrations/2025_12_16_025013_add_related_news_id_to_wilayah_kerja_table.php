<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // ✅ CEK DULU, KALAU BELUM ADA BARU TAMBAH
        if (!Schema::hasColumn('wk_tjsl', 'related_news_id')) {
            Schema::table('wk_tjsl', function (Blueprint $table) {
                $table->unsignedBigInteger('related_news_id')->nullable()->after('is_active');
            });
        }
        
        if (!Schema::hasColumn('wk_tekkom', 'related_news_id')) {
            Schema::table('wk_tekkom', function (Blueprint $table) {
                $table->unsignedBigInteger('related_news_id')->nullable()->after('is_active');
            });
        }
    }

    public function down()
    {
        if (Schema::hasColumn('wk_tjsl', 'related_news_id')) {
            Schema::table('wk_tjsl', function (Blueprint $table) {
                $table->dropColumn('related_news_id');
            });
        }
        
        if (Schema::hasColumn('wk_tekkom', 'related_news_id')) {
            Schema::table('wk_tekkom', function (Blueprint $table) {
                $table->dropColumn('related_news_id');
            });
        }
    }
};