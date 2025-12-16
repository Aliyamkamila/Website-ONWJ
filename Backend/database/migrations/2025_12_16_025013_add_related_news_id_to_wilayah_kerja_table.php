<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // PERHATIKAN: Gunakan Schema::table, BUKAN Schema::create
        Schema::table('wk_tjsl', function (Blueprint $table) {
            // Kita hanya menambahkan kolom baru, jangan tulis ulang kolom id, name, dll.
            $table->unsignedBigInteger('related_news_id')->nullable()->after('is_active');
            
            // Opsional: Foreign Key (aktifkan jika perlu)
            // $table->foreign('related_news_id')->references('id')->on('berita')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wk_tjsl', function (Blueprint $table) {
            // Hapus kolom jika rollback
            // $table->dropForeign(['related_news_id']); // Hapus ini commentnya jika pakai foreign key
            $table->dropColumn('related_news_id');
        });
    }
};