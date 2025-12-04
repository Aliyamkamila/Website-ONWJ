<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Berita;
use Illuminate\Support\Str;

class BeritaSeeder extends Seeder
{
    public function run(): void
    {
        $beritaData = [
            [
                'title' => 'Komitmen Kami dalam Penilaian Dampak Sosial',
                'category' => 'Sosial',
                'date' => '2025-01-15',
                'author' => 'Admin TJSL',
                'short_description' => 'We are committed to drive positive impact dalam setiap program TJSL yang kami jalankan.',
                'content' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Program penilaian dampak sosial kami dirancang untuk memastikan setiap kegiatan memberikan manfaat nyata bagi masyarakat.. .',
                'status' => 'published',
                'show_in_tjsl' => true,
                'show_in_media_informasi' => true,
                'show_in_dashboard' => true,
                'pin_to_homepage' => false,
            ],
            [
                'title' => 'Inisiatif Penanaman Pohon untuk Masa Depan',
                'category' => 'Lingkungan',
                'date' => '2025-01-12',
                'author' => 'Admin Tekom',
                'short_description' => 'A new initiative focused on environmental sustainability melalui program penanaman pohon massal.',
                'content' => 'Program penanaman pohon ini merupakan bagian dari komitmen kami terhadap kelestarian lingkungan.. .',
                'status' => 'draft',
                'show_in_tjsl' => true,
                'show_in_media_informasi' => false,
                'show_in_dashboard' => false,
                'pin_to_homepage' => true,
            ],
            [
                'title' => 'Program Edukasi Untuk Generasi Muda',
                'category' => 'Pendidikan',
                'date' => '2025-01-10',
                'author' => 'Admin TJSL',
                'short_description' => 'Membangun masa depan melalui pendidikan berkualitas untuk anak-anak di wilayah kerja kami.',
                'content' => 'Program edukasi ini mencakup pemberian beasiswa, pelatihan guru, dan pembangunan fasilitas pendidikan.. .',
                'status' => 'published',
                'show_in_tjsl' => true,
                'show_in_media_informasi' => true,
                'show_in_dashboard' => true,
                'pin_to_homepage' => true,
            ],
        ];

        foreach ($beritaData as $data) {
            $data['slug'] = Berita::generateUniqueSlug($data['title']);
            $data['published_at'] = $data['status'] === 'published' ? now() : null;
            
            Berita::create($data);
        }
    }
}