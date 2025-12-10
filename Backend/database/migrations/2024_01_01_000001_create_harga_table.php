<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('harga', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal')->unique();
            $table->decimal('brent', 8, 2);
            $table->decimal('duri', 8, 2);
            $table->decimal('arjuna', 8, 2);
            $table->decimal('kresna', 8, 2);
            $table->decimal('icp', 8, 2);
            $table->enum('periode', ['day', 'week', 'month', 'year'])->default('day');
            $table->integer('tahun')->default(2025);
            $table->integer('bulan')->nullable();
            $table->integer('minggu')->nullable();
            $table->timestamps();
            
            // Indexes untuk performa query
            $table->index('tanggal');
            $table->index('periode');
            $table->index(['tahun', 'bulan']);
            $table->index(['tahun', 'minggu']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('harga');
    }
};