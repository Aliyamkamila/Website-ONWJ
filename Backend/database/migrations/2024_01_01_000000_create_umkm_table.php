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
            $table->string('name');
            $table->string('category');
            $table->string('owner');
            $table->string('location');
            $table->text('description');
            $table->text('testimonial')->nullable();
            $table->string('shop_link')->nullable();
            $table->string('contact_number')->nullable();
            $table->enum('status', ['Aktif', 'Lulus Binaan', 'Dalam Proses'])->default('Aktif');
            $table->year('year_started');
            $table->string('achievement')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->string('image_url')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('category');
            $table->index('status');
            $table->index('is_featured');
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