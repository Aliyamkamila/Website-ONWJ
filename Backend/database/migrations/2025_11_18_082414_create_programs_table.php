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
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category');
            $table->string('location');
            $table->decimal('latitude', 10, 6);
            $table->decimal('longitude', 10, 6);
            $table->text('description');
            $table->json('facilities'); // Array of facilities
            $table->enum('status', ['Aktif', 'Selesai', 'Dalam Proses'])->default('Aktif');
            $table->year('year');
            $table->string('target')->nullable();
            $table->string('image_url')->nullable();
            $table->timestamps();
            $table->softDeletes(); // For soft delete functionality
            
            // Indexes for better performance
            $table->index('category');
            $table->index('status');
            $table->index('year');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programs');
    }
};