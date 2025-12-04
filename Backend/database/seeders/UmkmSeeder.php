<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Umkm;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UmkmSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing data
        DB::table('umkm')->truncate();

        $umkmData = [
            [
                'name' => 'Kopi Mangrove Segara',
                'slug' => Str::slug('Kopi Mangrove Segara'), // ← TAMBAHKAN SLUG
                'category' => 'Kuliner',
                'owner' => 'Ibu Siti Aminah',
                'location' => 'Muara Gembong, Bekasi',
                'description' => 'Kopi premium yang dihasilkan dari biji kopi mangrove pilihan. Memiliki cita rasa unik dengan aroma khas hutan mangrove yang menyegarkan.',
                'testimonial' => 'Dulu saya cuma bisa jual 10 bungkus sehari. Setelah dapat pelatihan pengemasan dari MHJ ONWJ, sekarang produk saya bisa dikirim ke luar kota.  Omzet naik 300%!',
                'shop_link' => 'https://tokopedia.com/kopi-mangrove',
                'contact_number' => '6281234567890',
                'status' => 'Aktif',
                'year_started' => 2022,
                'achievement' => 'Omzet naik 300%, ekspansi ke 5 kota',
                'is_featured' => true,
                'display_order' => 100,
                'image_url' => null,
            ],
            [
                'name' => 'Kerajinan Bambu Hijau',
                'slug' => Str::slug('Kerajinan Bambu Hijau'), // ← TAMBAHKAN SLUG
                'category' => 'Kerajinan',
                'owner' => 'Bapak Joko Susilo',
                'location' => 'Karawang',
                'description' => 'Kerajinan tangan dari bambu berkualitas tinggi. Produk meliputi peralatan rumah tangga, dekorasi, dan furniture ramah lingkungan.',
                'testimonial' => 'Berkat pembinaan MHJ, saya bisa memasarkan produk secara online. Sekarang pesanan datang dari berbagai daerah.',
                'shop_link' => 'https://shopee.co.id/bambu-hijau',
                'contact_number' => '6281234567891',
                'status' => 'Aktif',
                'year_started' => 2021,
                'achievement' => 'Ekspor ke Malaysia',
                'is_featured' => false,
                'display_order' => 90,
            ],
            [
                'name' => 'Gula Aren Organik',
                'slug' => Str::slug('Gula Aren Organik'), // ← TAMBAHKAN SLUG
                'category' => 'Agribisnis',
                'owner' => 'Ibu Dewi Lestari',
                'location' => 'Subang',
                'description' => 'Gula aren murni 100% tanpa campuran gula pasir. Diproses secara tradisional dengan standar kebersihan modern.',
                'shop_link' => 'https://bukalapak.com/gula-aren-organik',
                'contact_number' => '6281234567892',
                'status' => 'Aktif',
                'year_started' => 2023,
                'achievement' => 'Sertifikat Organic',
                'is_featured' => false,
                'display_order' => 80,
            ],
            [
                'name' => 'Batik Pesisir',
                'slug' => Str::slug('Batik Pesisir'), // ← TAMBAHKAN SLUG
                'category' => 'Fashion',
                'owner' => 'Ibu Sri Mulyani',
                'location' => 'Indramayu',
                'description' => 'Batik tulis dan cap dengan motif khas pesisir utara Jawa.  Menggunakan pewarna alami dari tumbuhan lokal.',
                'testimonial' => 'Produk batik saya sekarang dikenal sampai Jakarta. Terima kasih MHJ ONWJ atas pelatihan dan bantuan pemasarannya! ',
                'shop_link' => null,
                'contact_number' => '6281234567893',
                'status' => 'Lulus Binaan',
                'year_started' => 2020,
                'achievement' => 'Pameran di Jakarta Fashion Week',
                'is_featured' => false,
                'display_order' => 70,
            ],
            [
                'name' => 'Ikan Asap Muara',
                'slug' => Str::slug('Ikan Asap Muara'), // ← TAMBAHKAN SLUG
                'category' => 'Kuliner',
                'owner' => 'Bapak Ahmad Fauzi',
                'location' => 'Muara Gembong, Bekasi',
                'description' => 'Ikan asap dengan bumbu tradisional khas pesisir. Proses pengasapan menggunakan kayu mangrove yang memberikan aroma unik.',
                'shop_link' => 'https://tokopedia.com/ikan-asap-muara',
                'contact_number' => '6281234567894',
                'status' => 'Aktif',
                'year_started' => 2022,
                'is_featured' => false,
                'display_order' => 60,
            ],
            [
                'name' => 'Anyaman Pandan Wangi',
                'slug' => Str::slug('Anyaman Pandan Wangi'), // ← TAMBAHKAN SLUG
                'category' => 'Kerajinan',
                'owner' => 'Ibu Rina Wati',
                'location' => 'Bekasi',
                'description' => 'Tas, dompet, dan aksesoris dari anyaman pandan berkualitas. Desain modern dengan sentuhan tradisional.',
                'contact_number' => '6281234567895',
                'status' => 'Dalam Proses',
                'year_started' => 2024,
                'is_featured' => false,
                'display_order' => 50,
            ],
        ];

        foreach ($umkmData as $data) {
            Umkm::create($data);
        }

        $this->command->info('✅ UMKM seeder completed!  ' . count($umkmData) . ' UMKM created.');
    }
}