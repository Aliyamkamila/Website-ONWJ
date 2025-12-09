<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GalleryCategory;

class GalleryCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Program TJSL',
                'slug' => 'program-tjsl',
                'description' => 'Foto-foto kegiatan program Tanggung Jawab Sosial dan Lingkungan',
                'icon' => 'users',
                'order' => 1,
                'is_active' => true
            ],
            [
                'name' => 'Kegiatan & Event',
                'slug' => 'kegiatan-event',
                'description' => 'Dokumentasi kegiatan dan event perusahaan',
                'icon' => 'calendar',
                'order' => 2,
                'is_active' => true
            ],
            [
                'name' => 'Fasilitas',
                'slug' => 'fasilitas',
                'description' => 'Foto fasilitas dan infrastruktur perusahaan',
                'icon' => 'building',
                'order' => 3,
                'is_active' => true
            ],
            [
                'name' => 'Wilayah Kerja',
                'slug' => 'wilayah-kerja',
                'description' => 'Foto area operasional dan wilayah kerja',
                'icon' => 'map',
                'order' => 4,
                'is_active' => true
            ],
            [
                'name' => 'Tim & Karyawan',
                'slug' => 'tim-karyawan',
                'description' => 'Foto tim manajemen dan karyawan',
                'icon' => 'user-friends',
                'order' => 5,
                'is_active' => true
            ],
            [
                'name' => 'Penghargaan',
                'slug' => 'penghargaan',
                'description' => 'Dokumentasi penerimaan penghargaan dan prestasi',
                'icon' => 'award',
                'order' => 6,
                'is_active' => true
            ],
        ];

        foreach ($categories as $category) {
            GalleryCategory::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}