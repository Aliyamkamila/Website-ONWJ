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
        Schema::create('hero_sections', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['image', 'video'])->default('image');
            $table->string('src'); // path/url to image or video
            $table->integer('duration')->nullable(); // duration in milliseconds
            $table->string('label')->nullable(); // slide label/title
            $table->string('title')->nullable(); // main heading
            $table->text('description')->nullable(); // description text
            $table->integer('order')->default(0); // sort order
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hero_sections');
    }
};
