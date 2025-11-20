<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wk_tjsl', function (Blueprint $table) {
            $table->id();
            $table->string('area_id')->unique(); // KEPULAUAN_SERIBU, etc.
            $table->string('name'); // Display name
            $table->decimal('position_x', 8, 5); // X coordinate percentage
            $table->decimal('position_y', 8, 5); // Y coordinate percentage
            $table->string('color', 7); // HEX color code
            $table->text('description');
            $table->json('programs')->nullable(); // Array of programs
            $table->enum('status', ['Aktif', 'Non-Aktif'])->default('Aktif');
            $table->string('beneficiaries')->nullable(); // e.g., "850 Keluarga"
            $table->string('budget')->nullable(); // e.g., "Rp 2.8 Miliar"
            $table->string('duration')->nullable(); // e.g., "2023-2025"
            $table->string('impact')->nullable(); // Impact description
            $table->integer('order')->default(0); // Display order
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wk_tjsl');
    }
};