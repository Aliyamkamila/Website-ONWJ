<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Testimonial;
use Carbon\Carbon;

class TestimonialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $testimonials = [
            [
                'name' => 'Ibu Siti Aminah',
                'location' => 'Muara Gembong, Bekasi',
                'program' => 'Program Mangrove',
                'testimonial' => 'Berkat program penanaman mangrove, pantai kami tidak lagi terkena abrasi. Anak-anak bisa bermain dengan aman di pesisir.  Terima kasih MHJ ONWJ!',
                'status' => 'published',
                'featured' => true,
                'display_order' => 3,
                'created_by' => 'Admin',
                'published_at' => Carbon::now()->subDays(5),
                'created_at' => Carbon::now()->subDays(5),
                'updated_at' => Carbon::now()->subDays(5),
            ],
            [
                'name' => 'Bapak Joko Widodo',
                'location' => 'Kalibaru, Jakarta Utara',
                'program' => 'Program Pendidikan',
                'testimonial' => 'Anak saya mendapat beasiswa dari program ini. Sekarang dia bisa melanjutkan sekolah hingga SMA. Terima kasih MHJ ONWJ!',
                'status' => 'published',
                'featured' => true,
                'display_order' => 2,
                'created_by' => 'Admin',
                'published_at' => Carbon::now()->subDays(7),
                'created_at' => Carbon::now()->subDays(7),
                'updated_at' => Carbon::now()->subDays(7),
            ],
            [
                'name' => 'Ibu Dewi Sartika',
                'location' => 'Sungai Buntu, Karawang',
                'program' => 'Program Kesehatan',
                'testimonial' => 'Klinik lapangan yang disediakan sangat membantu warga. Kami tidak perlu jauh-jauh ke kota untuk berobat.',
                'status' => 'draft',
                'featured' => false,
                'display_order' => 1,
                'created_by' => 'Admin',
                'published_at' => null,
                'created_at' => Carbon::now()->subDays(3),
                'updated_at' => Carbon::now()->subDays(3),
            ],
            [
                'name' => 'Pak Ahmad Fauzi',
                'location' => 'Tanjung Priok, Jakarta Utara',
                'program' => 'Program UKM',
                'testimonial' => 'Program UKM ini membantu usaha kecil kami berkembang. Omzet naik 50% dalam 3 bulan! ',
                'status' => 'published',
                'featured' => true,
                'display_order' => 5,
                'created_by' => 'Admin',
                'published_at' => Carbon::now()->subDays(10),
                'created_at' => Carbon::now()->subDays(10),
                'updated_at' => Carbon::now()->subDays(10),
            ],
            [
                'name' => 'Ibu Nurhayati',
                'location' => 'Cilincing, Jakarta Utara',
                'program' => 'Program Lingkungan',
                'testimonial' => 'Desa kami jadi lebih bersih dan hijau setelah program pengelolaan sampah ini.',
                'status' => 'published',
                'featured' => false,
                'display_order' => 4,
                'created_by' => 'Admin',
                'published_at' => Carbon::now()->subDays(12),
                'created_at' => Carbon::now()->subDays(12),
                'updated_at' => Carbon::now()->subDays(12),
            ],
            [
                'name' => 'Bapak Suryanto',
                'location' => 'Pantai Indah Kapuk, Jakarta Utara',
                'program' => 'Program Ekowisata',
                'testimonial' => 'Program ekowisata mangrove ini membuka lapangan pekerjaan baru bagi warga.',
                'status' => 'published',
                'featured' => false,
                'display_order' => 6,
                'created_by' => 'Admin',
                'published_at' => Carbon::now()->subDays(15),
                'created_at' => Carbon::now()->subDays(15),
                'updated_at' => Carbon::now()->subDays(15),
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::create($testimonial);
        }

        $this->command->info('✅ ' . count($testimonials) . ' testimonials seeded successfully!');
    }
}