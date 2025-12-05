<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Berita;
use Illuminate\Support\Facades\DB;

class BeritaSeeder extends Seeder
{
    /**
     * Run the database seeds. 
     */
    public function run(): void
    {
        // Clear existing data
        DB::table('berita')->truncate();

        $beritaData = [
            [
                'title' => 'Komitmen Kami dalam Penilaian Dampak Sosial',
                'category' => 'CSR',
                'date' => '2024-12-01',
                'author' => 'Tim CSR MHJ ONWJ',
                'short_description' => 'MHJ ONWJ berkomitmen melakukan penilaian dampak sosial secara berkala untuk memastikan program TJSL berjalan efektif.',
                'content' => "Sebagai perusahaan yang peduli terhadap tanggung jawab sosial, MHJ ONWJ terus melakukan evaluasi dan penilaian dampak sosial dari setiap program TJSL yang dijalankan.\n\nKami percaya bahwa penilaian dampak yang komprehensif akan membantu kami untuk:\n1. Memahami kebutuhan masyarakat dengan lebih baik\n2.  Meningkatkan efektivitas program\n3. Memastikan keberlanjutan manfaat bagi masyarakat\n\nProgram evaluasi kami melibatkan berbagai stakeholder termasuk masyarakat penerima manfaat, pemerintah daerah, dan lembaga independen.",
                'status' => 'published',
                'show_in_tjsl' => true,
                'show_in_media_informasi' => true,
                'show_in_dashboard' => true,
                'pin_to_homepage' => true,
                'display_order' => 100,
            ],
            [
                'title' => 'Program Pemberdayaan UMKM Binaan Tahun 2024',
                'category' => 'UMKM',
                'date' => '2024-11-28',
                'author' => 'Tim TJSL',
                'short_description' => 'MHJ ONWJ meluncurkan program pemberdayaan UMKM dengan fokus pada peningkatan kapasitas produksi dan pemasaran digital.',
                'content' => "Tahun 2024 menjadi tahun yang penuh prestasi bagi UMKM binaan MHJ ONWJ. Program pemberdayaan yang kami jalankan telah memberikan dampak signifikan.\n\nHighlight program:\n• 50 UMKM mendapat pelatihan manajemen usaha\n• 30 UMKM berhasil go digital melalui marketplace\n• Peningkatan omzet rata-rata 200%\n• Ekspor perdana ke Malaysia dan Singapura\n\nKami akan terus mendukung UMKM binaan untuk berkembang dan mandiri.",
                'status' => 'published',
                'show_in_tjsl' => true,
                'show_in_media_informasi' => true,
                'show_in_dashboard' => true,
                'pin_to_homepage' => false,
                'display_order' => 90,
            ],
            [
                'title' => 'Pelatihan Kewirausahaan untuk Pemuda Pesisir',
                'category' => 'Pendidikan',
                'date' => '2024-11-20',
                'author' => 'Humas MHJ ONWJ',
                'short_description' => 'Sebanyak 100 pemuda dari wilayah pesisir mengikuti pelatihan kewirausahaan yang diselenggarakan MHJ ONWJ.',
                'content' => "MHJ ONWJ menggelar pelatihan kewirausahaan bagi 100 pemuda dari wilayah pesisir Muara Gembong dan sekitarnya.\n\nMateri pelatihan mencakup:\n- Identifikasi peluang usaha\n- Business model canvas\n- Digital marketing\n- Manajemen keuangan sederhana\n\nPeserta juga mendapatkan modal usaha dan pendampingan selama 6 bulan ke depan.",
                'status' => 'published',
                'show_in_tjsl' => true,
                'show_in_media_informasi' => true,
                'show_in_dashboard' => false,
                'pin_to_homepage' => false,
                'display_order' => 80,
            ],
            [
                'title' => 'Bantuan Sarana Pendidikan untuk Sekolah di Wilayah Terpencil',
                'category' => 'Pendidikan',
                'date' => '2024-11-15',
                'author' => 'Tim TJSL',
                'short_description' => 'MHJ ONWJ menyalurkan bantuan berupa buku, alat tulis, dan komputer untuk 5 sekolah di wilayah terpencil.',
                'content' => "Sebagai wujud kepedulian terhadap pendidikan, MHJ ONWJ menyalurkan bantuan sarana pendidikan kepada 5 sekolah di wilayah terpencil.\n\nBantuan yang diberikan:\n• 5. 000 buku pelajaran\n• 10. 000 paket alat tulis\n• 25 unit komputer\n• Renovasi perpustakaan\n\nKami berharap bantuan ini dapat meningkatkan kualitas pendidikan di wilayah tersebut.",
                'status' => 'published',
                'show_in_tjsl' => true,
                'show_in_media_informasi' => true,
                'show_in_dashboard' => false,
                'pin_to_homepage' => false,
                'display_order' => 70,
            ],
            [
                'title' => 'Program Penanaman Mangrove Mencapai 10.000 Pohon',
                'category' => 'Lingkungan',
                'date' => '2024-11-10',
                'author' => 'Tim Lingkungan',
                'short_description' => 'Program konservasi mangrove MHJ ONWJ berhasil menanam 10.000 pohon mangrove di pesisir utara Jawa.',
                'content' => "Program penanaman mangrove yang diinisiasi MHJ ONWJ telah mencapai target 10.000 pohon.\n\nManfaat program:\n- Mencegah abrasi pantai\n- Menjaga ekosistem pesisir\n- Meningkatkan tangkapan ikan nelayan\n- Menyerap karbon dioksida\n\nProgram ini melibatkan 200 relawan dan masyarakat setempat.",
                'status' => 'published',
                'show_in_tjsl' => true,
                'show_in_media_informasi' => true,
                'show_in_dashboard' => true,
                'pin_to_homepage' => false,
                'display_order' => 60,
            ],
            [
                'title' => 'Draft: Rencana Program TJSL 2025',
                'category' => 'CSR',
                'date' => '2024-12-05',
                'author' => 'Tim CSR',
                'short_description' => 'Rencana program TJSL untuk tahun 2025 sedang dalam tahap penyusunan.',
                'content' => "Draft rencana program TJSL 2025 mencakup berbagai bidang strategis.\n\nBidang fokus:\n1. Pemberdayaan ekonomi masyarakat\n2. Pendidikan dan pelatihan\n3. Kesehatan masyarakat\n4.  Konservasi lingkungan\n\nDraft ini akan difinalisasi setelah konsultasi dengan stakeholder.",
                'status' => 'draft',
                'show_in_tjsl' => false,
                'show_in_media_informasi' => false,
                'show_in_dashboard' => false,
                'pin_to_homepage' => false,
                'display_order' => 50,
            ],
        ];

        foreach ($beritaData as $data) {
            Berita::create($data);
        }

        $this->command->info('✅ Berita seeder completed! ' . count($beritaData) . ' berita created.');
    }
}