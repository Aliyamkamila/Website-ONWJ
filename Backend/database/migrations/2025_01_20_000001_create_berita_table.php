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
        Schema::create('berita', function (Blueprint $table) {
            $table->id();
            
            // Basic Information
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category');
            $table->date('date');
            $table->string('author')->nullable();
            
            // Content
            $table->text('short_description')->nullable();
            $table->longText('content');
            
            // Media
            $table->string('image_path')->nullable();
            $table->string('image_url')->nullable();
            
            // Status & Settings
            $table->enum('status', ['published', 'draft'])->default('draft');
            $table->string('display_option')->nullable();
            $table->string('auto_link')->default('none');
            
            // Distribution Options
            $table->boolean('show_in_tjsl')->default(false);
            $table->boolean('show_in_media_informasi')->default(true);
            $table->boolean('show_in_dashboard')->default(false);
            $table->boolean('pin_to_homepage')->default(false);
            
            // Metadata
            $table->integer('views')->default(0);
            $table->integer('display_order')->default(0);  // ← ADDED!
            $table->timestamp('published_at')->nullable();
            
            // Timestamps
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('slug');
            $table->index('category');
            $table->index('status');
            $table->index('date');
            $table->index('display_order');  // ← ADDED!
            $table->index(['show_in_tjsl', 'status']);
            $table->index(['show_in_media_informasi', 'status']);
            $table->index(['pin_to_homepage', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('berita');
    }
};