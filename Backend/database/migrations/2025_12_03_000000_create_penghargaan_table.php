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
        Schema::create('penghargaan', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category');
            $table->string('given_by'); // Pemberi penghargaan
            $table->integer('year');
            $table->string('month');
            $table->date('date'); // Tanggal penerimaan lengkap
            $table->text('description');
            $table->string('image')->nullable(); // Path gambar
            $table->boolean('show_in_landing')->default(false);
            $table->boolean('show_in_media_informasi')->default(true);
            $table->timestamps();
            $table->softDeletes(); // Untuk soft delete
            
            // Index untuk performa query
            $table->index('year');
            $table->index('category');
            $table->index(['show_in_landing', 'show_in_media_informasi']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penghargaan');
    }
};