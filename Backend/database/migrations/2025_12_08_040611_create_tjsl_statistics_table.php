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
        Schema::create('tjsl_statistics', function (Blueprint $table) {
            $table->id();
            
            // Statistic keys (unique)
            $table->string('key', 100)->unique(); // penerimaan_manfaat, infrastruktur, dll
            
            // Display information
            $table->string('label', 255); // Label yang ditampilkan
            $table->string('unit', 100)->nullable(); // Satuan (Jiwa, Unit, dll)
            
            // Values
            $table->bigInteger('value')->default(0); // Nilai angka
            
            // Display order
            $table->integer('display_order')->default(0);
            
            // Metadata
            $table->string('icon_name', 100)->nullable(); // Nama icon untuk mapping
            $table->string('color', 50)->default('blue'); // orange, blue, green, purple
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
            
            // Indexes
            $table->index('key');
            $table->index('display_order');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tjsl_statistics');
    }
};