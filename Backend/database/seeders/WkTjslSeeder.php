<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\WkTjsl;

class WkTjslSeeder extends Seeder
{
    public function run(): void
    {
        $tjslData = [
            [
                'area_id' => 'KEPULAUAN_SERIBU',
                'name' => 'Kepulauan Seribu',
                'position_x' => 5.44,
                'position_y' => 36.96,
                'color' => '#0EA5E9',
                'description' => 'Program TJSL di Kepulauan Seribu fokus pada konservasi terumbu karang, pemberdayaan nelayan, dan pengembangan ekowisata berkelanjutan.',
                'programs' => [
                    'Konservasi Terumbu Karang',
                    'Pemberdayaan Nelayan',
                    'Program Ekowisata',
                    'Pengelolaan Sampah Laut',
                    'Pendidikan Lingkungan'
                ],
                'beneficiaries' => '850 Keluarga',
                'status' => 'Aktif',
                'budget' => 'Rp 2.8 Miliar',
                'duration' => '2023-2025',
                'impact' => 'Peningkatan 35% pendapatan nelayan lokal',
                'order' => 11,
            ],
            [
                'area_id' => 'KALI_BARU',
                'name' => 'Kali Baru',
                'position_x' => 20.44,
                'position_y' => 68.51,
                'color' => '#22C55E',
                'description' => 'Program TJSL di Kali Baru berfokus pada revitalisasi sungai, sanitasi lingkungan, dan pemberdayaan ekonomi masyarakat pesisir.',
                'programs' => [
                    'Revitalisasi Sungai',
                    'Program Sanitasi Lingkungan',
                    'Pemberdayaan UMKM',
                    'Bank Sampah',
                    'Pelatihan Kewirausahaan'
                ],
                'beneficiaries' => '1,200 Keluarga',
                'status' => 'Aktif',
                'budget' => 'Rp 3.5 Miliar',
                'duration' => '2024-2026',
                'impact' => 'Pengurangan 60% pencemaran sungai',
                'order' => 12,
            ],
            [
                'area_id' => 'MUARA_GEMBONG',
                'name' => 'Muara Gembong',
                'position_x' => 25.47,
                'position_y' => 62.64,
                'color' => '#EAB308',
                'description' => 'Program TJSL di Muara Gembong menangani reboisasi mangrove, mitigasi abrasi pantai, dan peningkatan kesejahteraan petambak.',
                'programs' => [
                    'Penanaman Mangrove',
                    'Mitigasi Abrasi Pantai',
                    'Pemberdayaan Petambak',
                    'Teknologi Tambak Ramah Lingkungan',
                    'Program Kesehatan Masyarakat'
                ],
                'beneficiaries' => '950 Keluarga',
                'status' => 'Aktif',
                'budget' => 'Rp 4.2 Miliar',
                'duration' => '2023-2026',
                'impact' => '150 hektar mangrove berhasil ditanam',
                'order' => 13,
            ],
            [
                'area_id' => 'SUNGAI_BUNTU',
                'name' => 'Sungai Buntu',
                'position_x' => 40.05,
                'position_y' => 66.26,
                'color' => '#A855F7',
                'description' => 'Program TJSL di Sungai Buntu fokus pada pengelolaan air bersih, infrastruktur desa, dan pendidikan anak pesisir.',
                'programs' => [
                    'Penyediaan Air Bersih',
                    'Pembangunan Infrastruktur Desa',
                    'Beasiswa Pendidikan',
                    'Perpustakaan Desa',
                    'Program Literasi Digital'
                ],
                'beneficiaries' => '680 Keluarga',
                'status' => 'Aktif',
                'budget' => 'Rp 2.6 Miliar',
                'duration' => '2024-2025',
                'impact' => '500 siswa menerima beasiswa',
                'order' => 14,
            ],
            [
                'area_id' => 'MAYANGAN',
                'name' => 'Mayangan',
                'position_x' => 53.28,
                'position_y' => 76.86,
                'color' => '#EC4899',
                'description' => 'Program TJSL di Mayangan mengedepankan peningkatan kapasitas nelayan, konservasi laut, dan pengembangan produk perikanan bernilai tambah.',
                'programs' => [
                    'Pelatihan Teknologi Penangkapan Ikan',
                    'Konservasi Biota Laut',
                    'Pengolahan Produk Perikanan',
                    'Koperasi Nelayan',
                    'Pemasaran Digital Produk Laut'
                ],
                'beneficiaries' => '1,100 Keluarga',
                'status' => 'Aktif',
                'budget' => 'Rp 3.8 Miliar',
                'duration' => '2023-2025',
                'impact' => 'Peningkatan 45% nilai jual produk perikanan',
                'order' => 15,
            ],
            [
                'area_id' => 'BALONGAN',
                'name' => 'Balongan',
                'position_x' => 78.79,
                'position_y' => 80.59,
                'color' => '#F97316',
                'description' => 'Program TJSL di Balongan berfokus pada pembangunan fasilitas kesehatan, peningkatan SDM lokal, dan diversifikasi ekonomi masyarakat.',
                'programs' => [
                    'Posyandu dan Klinik Kesehatan',
                    'Pelatihan Vokasi',
                    'Pemberdayaan Ibu Rumah Tangga',
                    'Program CSR Kesehatan',
                    'Pengembangan Agribisnis'
                ],
                'beneficiaries' => '1,350 Keluarga',
                'status' => 'Aktif',
                'budget' => 'Rp 4.5 Miliar',
                'duration' => '2024-2026',
                'impact' => '90% peningkatan akses kesehatan',
                'order' => 16,
            ],
            [
                'area_id' => 'JAWA_BARAT',
                'name' => 'Jawa Barat',
                'position_x' => 39.79,
                'position_y' => 94.27,
                'color' => '#14B8A6',
                'description' => 'Program TJSL di wilayah Jawa Barat mencakup pengembangan pertanian berkelanjutan, energi terbarukan, dan pemberdayaan pemuda.',
                'programs' => [
                    'Pertanian Organik',
                    'Panel Surya Komunitas',
                    'Inkubator Bisnis Pemuda',
                    'Pelatihan Teknologi Informasi',
                    'Program Wirausaha Muda'
                ],
                'beneficiaries' => '2,400 Keluarga',
                'status' => 'Aktif',
                'budget' => 'Rp 6.2 Miliar',
                'duration' => '2023-2027',
                'impact' => '300 wirausaha baru tercipta',
                'order' => 17,
            ],
        ];

        foreach ($tjslData as $data) {
            WkTjsl::create($data);
        }
    }
}