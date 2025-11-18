<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Program;
use Illuminate\Support\Str;

class ProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $programs = [
            [
                'name' => 'Program Kesehatan (Sungai Buntu)',
                'category' => 'Kesehatan',
                'location' => 'Sungai Buntu',
                'latitude' => -6.0563,
                'longitude' => 107.4026,
                'description' => 'Pusat layanan kesehatan air bersih untuk masyarakat Sungai Buntu. Program ini bertujuan untuk meningkatkan akses masyarakat terhadap air bersih dan layanan kesehatan dasar.',
                'facilities' => ['Klinik lapangan', 'Penyuluhan kesehatan', 'Pemeriksaan gratis'],
                'status' => 'Aktif',
                'year' => 2025,
                'target' => '500 keluarga',
            ],
            [
                'name' => 'Program Mangrove (Muara Gembong)',
                'category' => 'Lingkungan',
                'location' => 'Muara Gembong',
                'latitude' => -5.9972,
                'longitude' => 107.0394,
                'description' => 'Penanaman 5.000 bibit mangrove untuk menjaga ekosistem pesisir dan mencegah abrasi pantai. Program ini melibatkan masyarakat lokal dalam upaya konservasi lingkungan.',
                'facilities' => ['Penanaman bibit', 'Edukasi lingkungan', 'Monitoring pertumbuhan'],
                'status' => 'Aktif',
                'year' => 2025,
                'target' => '3 desa pesisir',
            ],
            [
                'name' => 'Program Pendidikan Lokal',
                'category' => 'Pendidikan',
                'location' => 'Bekasi',
                'latitude' => -6.2383,
                'longitude' => 106.9756,
                'description' => 'Supporting local education facilities and scholarships for underprivileged students.',
                'facilities' => ['Beasiswa', 'Renovasi sekolah', 'Pelatihan guru'],
                'status' => 'Aktif',
                'year' => 2025,
                'target' => '200 siswa',
            ],
            [
                'name' => 'Konservasi Lingkungan Pesisir',
                'category' => 'Lingkungan',
                'location' => 'Pantai Indah',
                'latitude' => -6.1234,
                'longitude' => 106.8765,
                'description' => 'Protecting marine ecosystems and coastal areas through community engagement and conservation efforts.',
                'facilities' => ['Patroli pantai', 'Pembersihan sampah', 'Workshop lingkungan'],
                'status' => 'Dalam Proses',
                'year' => 2025,
                'target' => '5 km garis pantai',
            ],
            [
                'name' => 'Bantuan Kesehatan Masyarakat',
                'category' => 'Kesehatan',
                'location' => 'Jakarta Utara',
                'latitude' => -6.1381,
                'longitude' => 106.8636,
                'description' => 'Providing health services and facilities for communities in need.',
                'facilities' => ['Posyandu', 'Vaksinasi', 'Penyuluhan gizi'],
                'status' => 'Aktif',
                'year' => 2025,
                'target' => '1000 warga',
            ],
            [
                'name' => 'Pemberdayaan Ekonomi Lokal',
                'category' => 'Ekonomi',
                'location' => 'Karawang',
                'latitude' => -6.3063,
                'longitude' => 107.3019,
                'description' => 'Empowering local communities through economic development programs and skills training.',
                'facilities' => ['Pelatihan kewirausahaan', 'Modal usaha', 'Pendampingan bisnis'],
                'status' => 'Selesai',
                'year' => 2024,
                'target' => '100 pelaku UMKM',
            ],
        ];

        foreach ($programs as $program) {
            Program::create($program);
        }
    }
}