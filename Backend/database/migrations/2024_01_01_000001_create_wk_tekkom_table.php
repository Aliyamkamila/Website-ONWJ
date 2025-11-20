<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wk_tekkom', function (Blueprint $table) {
            $table->id();
            $table->string('area_id')->unique(); // BRAVO, UNIFORM, etc.
            $table->string('name'); // Display name
            $table->decimal('position_x', 8, 5); // X coordinate percentage
            $table->decimal('position_y', 8, 5); // Y coordinate percentage
            $table->string('color', 7); // HEX color code
            $table->text('description');
            $table->json('facilities')->nullable(); // Array of facilities
            $table->string('production')->nullable(); // e.g., "5,200 BOPD"
            $table->enum('status', ['Operasional', 'Non-Operasional'])->default('Operasional');
            $table->integer('wells')->nullable(); // Number of wells
            $table->string('depth')->nullable(); // e.g., "3,450 m"
            $table->string('pressure')->nullable(); // e.g., "2,850 psi"
            $table->string('temperature')->nullable(); // e.g., "85°C"
            $table->integer('order')->default(0); // Display order
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wk_tekkom');
    }
};