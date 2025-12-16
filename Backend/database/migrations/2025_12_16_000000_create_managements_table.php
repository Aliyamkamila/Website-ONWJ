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
        Schema::create('managements', function (Blueprint $table) {
            $table->id();
            
            // Type: 'director', 'commissioner', 'organizational_structure'
            $table->enum('type', ['director', 'commissioner', 'organizational_structure'])
                ->default('director')
                ->index();
            
            // Personal/Position Info
            $table->string('name', 100);
            $table->string('position', 150);
            
            // For organizational structure
            $table->enum('level', ['board', 'director', 'department', 'division'])
                ->nullable()
                ->comment('Level in organizational structure');
            
            // Description/Bio
            $table->text('description')->nullable();
            
            // Image
            $table->string('image_path')->nullable();
            
            // Status & Ordering
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            
            // Timestamps
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['type', 'is_active']);
            $table->index('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('managements');
    }
};
