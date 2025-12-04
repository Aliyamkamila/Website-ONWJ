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
        Schema::create('umkm', function (Blueprint $table) {
            $table->id();
            
            // Basic Information
            $table->string('name'); // Nama UMKM/Produk
            $table->string('slug')->unique(); // URL-friendly name
            $table->string('category'); // Kuliner, Kerajinan, dll
            $table->string('owner'); // Nama pemilik
            $table->string('location'); // Lokasi/Wilayah
            
            // Content
            $table->text('description'); // Deskripsi produk/usaha
            $table->text('testimonial')->nullable(); // Cerita sukses
            
            // Media
            $table->string('image_path')->nullable(); // Path file di storage
            $table->string('image_url')->nullable(); // External URL (optional)
            
            // Contact & Links
            $table->string('shop_link')->nullable(); // Link toko online
            $table->string('contact_number')->nullable(); // WhatsApp number
            
            // Status & Meta
            $table->enum('status', ['Aktif', 'Lulus Binaan', 'Dalam Proses'])->default('Aktif');
            $table->year('year_started'); // Tahun mulai binaan
            $table->string('achievement')->nullable(); // Pencapaian/Omzet
            
            // Display Options
            $table->boolean('is_featured')->default(false); // Featured UMKM
            $table->integer('display_order')->default(0); // Urutan tampilan
            $table->integer('views')->default(0); // View counter
            
            // Timestamps
            $table->timestamps();
            $table->softDeletes(); // For soft delete
            
            // Indexes
            $table->index('category');
            $table->index('status');
            $table->index('is_featured');
            $table->index('year_started');
        });
    }

    /**
     * Reverse the migrations. 
     */
    public function down(): void
    {
        Schema::dropIfExists('umkm');
    }
};