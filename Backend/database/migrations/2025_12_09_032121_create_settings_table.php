<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('text'); // text, textarea, image, url, email, tel
            $table->string('category')->nullable(); // ✅ TAMBAHKAN ->nullable()
            $table->string('label')->nullable(); // ✅ TAMBAHKAN ->nullable() juga
            $table->text('description')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
            
            // Indexes
            $table->index('category');
            $table->index('key');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};