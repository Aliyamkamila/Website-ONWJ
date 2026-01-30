<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laporan', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->integer('year');
            $table->text('description')->nullable();
            $table->string('file_path'); // Path ke PDF
            $table->string('cover_image')->nullable(); // Cover image
            $table->string('file_size')->nullable(); // e.g., "12.5 MB"
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->integer('views')->default(0);
            $table->integer('order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laporan');
    }
};