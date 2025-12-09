<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gallery', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('gallery_categories')->onDelete('cascade');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('caption')->nullable();
            $table->text('description')->nullable();
            $table->string('image_path');
            $table->string('thumbnail_path')->nullable();
            $table->string('alt_text')->nullable();
            $table->integer('file_size')->nullable(); // in bytes
            $table->string('mime_type')->nullable();
            $table->integer('width')->nullable();
            $table->integer('height')->nullable();
            $table->date('taken_date')->nullable(); // Photo taken date
            $table->string('photographer')->nullable();
            $table->string('location')->nullable();
            $table->json('tags')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->integer('views')->default(0);
            $table->timestamps();
            
            // Indexes
            $table->index('category_id');
            $table->index('slug');
            $table->index('is_published');
            $table->index('is_featured');
            $table->index('created_at');
            $table->index('order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery');
    }
};