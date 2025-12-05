<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
// use App\Models\User;  // ← Comment ini

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database. 
     */
    public function run(): void
    {
        // ✅ COMMENT BAGIAN USER SEED (tidak dipakai)
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example. com',
        // ]);

        // ✅ PANGGIL SEEDER UMKM
        $this->call([
            UmkmSeeder::class,
            // Tambahkan seeder lain di sini jika ada
            // ProgramSeeder::class,
            // BeritaSeeder::class,
        ]);
    }
}