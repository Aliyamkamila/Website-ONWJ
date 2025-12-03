<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Penghargaan;
use Carbon\Carbon;

class PenghargaanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $penghargaanData = [
            [
                'title' => 'Best HSE Performance Award',
                'category' => 'K3 (Kesehatan & Keselamatan Kerja)',
                'given_by' => 'Kementerian ESDM',
                'year' => 2024,
                'month' => 'November',
                'date' => '2024-11-15',
                'description' => 'Penghargaan atas kinerja terbaik dalam implementasi Kesehatan, Keselamatan, dan Lingkungan (HSE) di industri migas Indonesia.',
                'show_in_landing' => true,
                'show_in_media_informasi' => true,
            ],
            [
                'title' => 'Community Empowerment Excellence',
                'category' => 'CSR & TJSL',
                'given_by' => 'CSR Outlook Awards',
                'year' => 2024,
                'month' => 'September',
                'date' => '2024-09-20',
                'description' => 'Apresiasi atas program pemberdayaan masyarakat yang berkelanjutan dan memberikan dampak positif bagi komunitas lokal.',
                'show_in_landing' => true,
                'show_in_media_informasi' => true,
            ],
            [
                'title' => 'Innovation in Offshore Technology',
                'category' => 'Inovasi & Teknologi',
                'given_by' => 'Asia Petroleum Expo',
                'year' => 2023,
                'month' => 'Oktober',
                'date' => '2023-10-12',
                'description' => 'Pengakuan atas inovasi teknologi offshore yang meningkatkan efisiensi operasional dan keselamatan kerja di lepas pantai.',
                'show_in_landing' => true,
                'show_in_media_informasi' => true,
            ],
            [
                'title' => 'Sustainable Company of the Year',
                'category' => 'Lingkungan',
                'given_by' => 'National Geographic Forum',
                'year' => 2023,
                'month' => 'Juni',
                'date' => '2023-06-08',
                'description' => 'Penghargaan sebagai perusahaan dengan komitmen terbaik dalam praktik bisnis berkelanjutan dan pelestarian lingkungan.',
                'show_in_landing' => false,
                'show_in_media_informasi' => true,
            ],
            [
                'title' => 'Top Performer in Oil & Gas Sector',
                'category' => 'Manajemen Terbaik',
                'given_by' => 'Energy & Mining Weekly',
                'year' => 2022,
                'month' => 'Desember',
                'date' => '2022-12-05',
                'description' => 'Penghargaan sebagai perusahaan dengan kinerja terbaik di sektor minyak dan gas Indonesia tahun 2022.',
                'show_in_landing' => false,
                'show_in_media_informasi' => true,
            ],
            [
                'title' => 'Environmental Stewardship Award',
                'category' => 'Lingkungan',
                'given_by' => 'Green Earth Foundation',
                'year' => 2022,
                'month' => 'Agustus',
                'date' => '2022-08-18',
                'description' => 'Apresiasi atas komitmen dan upaya nyata dalam pengelolaan lingkungan dan program konservasi ekosistem laut.',
                'show_in_landing' => false,
                'show_in_media_informasi' => true,
            ],
        ];

        foreach ($penghargaanData as $data) {
            Penghargaan::create($data);
        }

        $this->command->info('✅ Penghargaan seeder completed successfully!');
    }
}