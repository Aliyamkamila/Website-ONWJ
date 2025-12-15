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
        Schema::table('produksi_bulanan', function (Blueprint $table) {
            // Data Teknis
            $table->integer('wells')->nullable()->after('catatan')->comment('Jumlah sumur');
            $table->string('depth')->nullable()->after('wells')->comment('Kedalaman sumur, e.g., "3,450 m"');
            $table->string('pressure')->nullable()->after('depth')->comment('Tekanan, e.g., "2,850 psi"');
            $table->string('temperature')->nullable()->after('pressure')->comment('Temperatur, e.g., "85°C"');
            
            // Fasilitas & Infrastruktur
            $table->json('facilities')->nullable()->after('temperature')->comment('Array fasilitas & infrastruktur');
            
            // Status Operasional
            $table->enum('status', ['Operasional', 'Non-Operasional'])->default('Operasional')->after('facilities');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produksi_bulanan', function (Blueprint $table) {
            $table->dropColumn(['wells', 'depth', 'pressure', 'temperature', 'facilities', 'status']);
        });
    }
};
