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
            AdminSeeder::class,
            BeritaSeeder::class,
            ContactSeeder::class,
            GalleryCategorySeeder::class,
            HargaMinyakSeeder::class,
            PenghargaanSeeder::class,
            ProgramSeeder::class,
            RealisasiBulananSeeder::class,
            SettingSeeder::class,
            TestimonialSeeder::class,
            TjslStatisticSeeder::class,
            UmkmSeeder::class,
            WkTekkomSeeder::class,
            WkTjslSeeder::class,
            // Tambahkan seeder lain di sini jika ada
            // ProgramSeeder::class,
            // BeritaSeeder::class,
        ]);
    }
}