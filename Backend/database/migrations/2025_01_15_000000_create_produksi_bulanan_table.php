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
        Schema::create('produksi_bulanan', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('wk_tekkom_id');
            $table->integer('bulan')->comment('1-12');
            $table->integer('tahun')->comment('2021-2099');
            $table->decimal('produksi_minyak', 10, 2)->nullable()->comment('BOPD - Barrel Oil Per Day');
            $table->decimal('produksi_gas', 10, 2)->nullable()->comment('MMSCFD - Million Standard Cubic Feet per Day');
            $table->text('catatan')->nullable();
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('wk_tekkom_id')
                  ->references('id')
                  ->on('wk_tekkom')
                  ->onDelete('cascade');

            // Unique constraint: one record per area per month per year
            $table->unique(['wk_tekkom_id', 'bulan', 'tahun'], 'unique_produksi_per_bulan');
            
            // Indexes for better query performance
            $table->index(['tahun', 'bulan']);
            $table->index('wk_tekkom_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produksi_bulanan');
    }
};
