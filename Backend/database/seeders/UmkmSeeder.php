<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Umkm;

class UmkmSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $umkmData = [
            [
                'name' => 'Kopi Mangrove Segara',
                'category' => 'Kuliner',
                'owner' => 'Ibu Siti',
                'location' => 'Muara Gembong, Bekasi',
                'description' => 'Kopi olahan dari biji kopi lokal dengan sentuhan aroma mangrove khas pesisir. Dikemas higienis dan ramah lingkungan.',
                'testimonial' => 'Dulu saya cuma bisa jual 10 bungkus, setelah dapat pelatihan pengemasan dari MUJ ONWJ, sekarang bisa kirim ke luar kota. Omzet naik 300%!',
                'shop_link' => 'https://tokopedia.com/kopi-mangrove',
                'contact_number' => '6281234567890',
                'status' => 'Aktif',
                'year_started' => 2024,
                'achievement' => 'Omzet naik 300%, ekspor ke 5 kota',
                'is_featured' => true,
            ],
            [
                'name' => 'Kerajinan Enceng Gondok',
                'category' => 'Kerajinan',
                'owner' => 'Bapak Joko',
                'location' => 'Kalibaru, Jakarta Utara',
                'description' => 'Produk kerajinan tangan dari enceng gondok yang ramah lingkungan. Berbagai macam tas, tempat pensil, dan aksesori rumah.',
                'testimonial' => '',
                'shop_link' => 'https://shopee.co.id/kerajinan-gondok',
                'contact_number' => '6281398765432',
                'status' => 'Aktif',
                'year_started' => 2023,
                'achievement' => '50 produk terjual/bulan',
                'is_featured' => false,
            ],
            [
                'name' => 'Madu Hutan Asli Subang',
                'category' => 'Agribisnis',
                'owner' => 'Ibu Aminah',
                'location' => 'Mayangan, Subang',
                'description' => 'Madu murni dari hutan Subang, dipanen langsung dari sarang lebah liar. Kualitas terjamin dan organik.',
                'testimonial' => '',
                'shop_link' => '',
                'contact_number' => '6281222333444',
                'status' => 'Aktif',
                'year_started' => 2023,
                'achievement' => '100 botol/bulan',
                'is_featured' => false,
            ],
            [
                'name' => 'Olahan Ikan Balongan',
                'category' => 'Kuliner',
                'owner' => 'Bapak Udin',
                'location' => 'Balongan, Indramayu',
                'description' => 'Berbagai olahan ikan segar khas Balongan. Ikan asin, kerupuk ikan, dan produk laut berkualitas.',
                'testimonial' => '',
                'shop_link' => 'https://shopee.co.id/olahan-ikan',
                'contact_number' => '',
                'status' => 'Aktif',
                'year_started' => 2024,
                'achievement' => 'Distribusi ke 10 toko',
                'is_featured' => false,
            ],
            [
                'name' => 'Batik Pesisir',
                'category' => 'Fashion',
                'owner' => 'Ibu Dewi',
                'location' => 'Sungai Buntu, Karawang',
                'description' => 'Batik tulis khas pesisir dengan motif tradisional dan modern. Kualitas premium dengan pewarna alami.',
                'testimonial' => '',
                'shop_link' => '',
                'contact_number' => '6281555666777',
                'status' => 'Lulus Binaan',
                'year_started' => 2022,
                'achievement' => 'Pameran di Jakarta Fashion Week',
                'is_featured' => false,
            ],
        ];

        foreach ($umkmData as $data) {
            Umkm::create($data);
        }
    }
}