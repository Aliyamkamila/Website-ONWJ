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
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            
            // Personal Information
            $table->string('name', 255); // Nama lengkap pemberi testimonial
            $table->string('location', 255); // Lokasi/Desa (Muara Gembong, Bekasi)
            
            // Program Related
            $table->string('program', 100); // Program terkait (Program Mangrove, dll)
            
            // Testimonial Content
            $table->text('testimonial'); // Isi testimonial
            
            // Avatar/Photo
            $table->string('avatar_path', 500)->nullable(); // Path ke storage
            $table->string('avatar_url', 500)->nullable(); // External URL (opsional)
            
            // Publication Status
            $table->enum('status', ['published', 'draft'])->default('draft');
            
            // Display Control
            $table->boolean('featured')->default(false); // Untuk highlight testimonial
            $table->integer('display_order')->default(0); // Urutan tampilan
            
            // Metadata
            $table->string('created_by', 100)->nullable(); // Admin yang input
            $table->timestamp('published_at')->nullable(); // Tanggal publikasi
            
            // Timestamps
            $table->timestamps();
            $table->softDeletes(); // Untuk soft delete
            
            // Indexes untuk performa
            $table->index('status');
            $table->index('program');
            $table->index('featured');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};