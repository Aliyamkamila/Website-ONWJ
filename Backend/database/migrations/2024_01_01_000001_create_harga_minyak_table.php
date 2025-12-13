<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema:: create('harga_minyak', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal')->unique();
            
            // Brent (input manual per hari)
            $table->decimal('brent', 8, 2);
            
            // Duri (konstan 80.08)
            $table->decimal('duri', 8, 2)->default(80.08);
            
            // Ardjuna (calculated)
            $table->decimal('ardjuna', 8, 2);
            
            // Kresna (calculated)
            $table->decimal('kresna', 8, 2);
            
            $table->integer('tahun');
            $table->integer('bulan');
            $table->integer('minggu');
            
            $table->timestamps();
            
            // Indexes
            $table->index('tanggal');
            $table->index(['tahun', 'bulan']);
        });

        // Tabel untuk menyimpan realisasi bulanan
        Schema::create('realisasi_bulanan', function (Blueprint $table) {
            $table->id();
            $table->integer('tahun');
            $table->integer('bulan');
            
            // Realisasi (input manual per bulan)
            $table->decimal('realisasi_brent', 8, 2);
            $table->decimal('realisasi_ardjuna', 8, 2);
            $table->decimal('realisasi_kresna', 8, 2);
            
            // Alpha (calculated)
            $table->decimal('alpha_ardjuna', 8, 2);
            $table->decimal('alpha_kresna', 8, 2);
            
            // Rata-rata 3 bulan (calculated)
            $table->decimal('avg_alpha_ardjuna_3m', 8, 2)->nullable();
            $table->decimal('avg_alpha_kresna_3m', 8, 2)->nullable();
            
            $table->timestamps();
            
            $table->unique(['tahun', 'bulan']);
            $table->index(['tahun', 'bulan']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('harga_minyak');
        Schema::dropIfExists('realisasi_bulanan');
    }
};