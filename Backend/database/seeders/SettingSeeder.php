<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // Company Info
            [
                'key' => 'company_name',
                'value' => 'PT Migas Hulu Jabar ONWJ',
                'type' => 'text',
                'category' => 'company',
                'label' => 'Nama Perusahaan',
                'description' => 'Nama resmi perusahaan',
                'order' => 1
            ],
            [
                'key' => 'company_address',
                'value' => 'Jl. Jakarta No. 40, Kebonwaru, Batununggal, Kota Bandung, Jawa Barat 40272',
                'type' => 'textarea',
                'category' => 'company',
                'label' => 'Alamat Kantor',
                'description' => 'Alamat lengkap kantor pusat',
                'order' => 2
            ],
            [
                'key' => 'company_phone',
                'value' => '(022) 1234 5678',
                'type' => 'tel',
                'category' => 'company',
                'label' => 'Telepon',
                'description' => 'Nomor telepon kantor',
                'order' => 3
            ],
            [
                'key' => 'company_email',
                'value' => 'corsec@muj-onwj.com',
                'type' => 'email',
                'category' => 'company',
                'label' => 'Email',
                'description' => 'Email resmi perusahaan',
                'order' => 4
            ],
            [
                'key' => 'company_fax',
                'value' => '(022) 1234 5679',
                'type' => 'tel',
                'category' => 'company',
                'label' => 'Fax',
                'description' => 'Nomor fax kantor',
                'order' => 5
            ],

            // Social Media
            [
                'key' => 'social_facebook',
                'value' => 'https://facebook.com/muj. onwj',
                'type' => 'url',
                'category' => 'social_media',
                'label' => 'Facebook',
                'description' => 'URL halaman Facebook',
                'order' => 1
            ],
            [
                'key' => 'social_instagram',
                'value' => 'https://instagram.com/muj.onwj',
                'type' => 'url',
                'category' => 'social_media',
                'label' => 'Instagram',
                'description' => 'URL profil Instagram',
                'order' => 2
            ],
            [
                'key' => 'social_twitter',
                'value' => 'https://twitter.com/muj_onwj',
                'type' => 'url',
                'category' => 'social_media',
                'label' => 'Twitter/X',
                'description' => 'URL profil Twitter/X',
                'order' => 3
            ],
            [
                'key' => 'social_linkedin',
                'value' => 'https://linkedin.com/company/muj-onwj',
                'type' => 'url',
                'category' => 'social_media',
                'label' => 'LinkedIn',
                'description' => 'URL halaman LinkedIn',
                'order' => 4
            ],
            [
                'key' => 'social_youtube',
                'value' => 'https://youtube.com/@muj. onwj',
                'type' => 'url',
                'category' => 'social_media',
                'label' => 'YouTube',
                'description' => 'URL channel YouTube',
                'order' => 5
            ],

            // Contact Info
            [
                'key' => 'contact_email',
                'value' => 'info@muj-onwj. com',
                'type' => 'email',
                'category' => 'contact',
                'label' => 'Email Customer Service',
                'description' => 'Email untuk pertanyaan umum',
                'order' => 1
            ],
            [
                'key' => 'contact_phone',
                'value' => '(022) 1234 5678',
                'type' => 'tel',
                'category' => 'contact',
                'label' => 'Telepon Hotline',
                'description' => 'Nomor telepon layanan pelanggan',
                'order' => 2
            ],
            [
                'key' => 'contact_whatsapp',
                'value' => '6281234567890',
                'type' => 'tel',
                'category' => 'contact',
                'label' => 'WhatsApp',
                'description' => 'Nomor WhatsApp (format: 62xxx)',
                'order' => 3
            ],

            // Operating Hours
            [
                'key' => 'hours_weekday',
                'value' => 'Senin - Jumat: 08:00 - 17:00 WIB',
                'type' => 'text',
                'category' => 'operating_hours',
                'label' => 'Jam Kerja (Hari Kerja)',
                'description' => 'Jam operasional hari Senin-Jumat',
                'order' => 1
            ],
            [
                'key' => 'hours_weekend',
                'value' => 'Sabtu - Minggu:  Tutup',
                'type' => 'text',
                'category' => 'operating_hours',
                'label' => 'Jam Kerja (Akhir Pekan)',
                'description' => 'Jam operasional hari Sabtu-Minggu',
                'order' => 2
            ],

            // SEO Settings
            [
                'key' => 'seo_meta_title',
                'value' => 'PT Migas Hulu Jabar ONWJ - Energi Untuk Kemakmuran Daerah',
                'type' => 'text',
                'category' => 'seo',
                'label' => 'Meta Title',
                'description' => 'Judul SEO untuk search engine',
                'order' => 1
            ],
            [
                'key' => 'seo_meta_description',
                'value' => 'PT Migas Hulu Jabar ONWJ berkomitmen menghadirkan solusi energi berkelanjutan untuk kemajuan Indonesia melalui program TJSL dan TEKKOM.',
                'type' => 'textarea',
                'category' => 'seo',
                'label' => 'Meta Description',
                'description' => 'Deskripsi SEO untuk search engine',
                'order' => 2
            ],
            [
                'key' => 'seo_meta_keywords',
                'value' => 'migas, oil and gas, ONWJ, TJSL, TEKKOM, energi, pertamina, hulu migas',
                'type' => 'textarea',
                'category' => 'seo',
                'label' => 'Meta Keywords',
                'description' => 'Keywords SEO (pisahkan dengan koma)',
                'order' => 3
            ],

            // Footer Content
            [
                'key' => 'footer_about_text',
                'value' => 'PT Migas Hulu Jabar ONWJ adalah perusahaan energi yang berkomitmen untuk menghadirkan solusi berkelanjutan bagi kemakmuran daerah.',
                'type' => 'textarea',
                'category' => 'footer',
                'label' => 'About Text (Footer)',
                'description' => 'Teks deskripsi singkat di footer',
                'order' => 1
            ],
            [
                'key' => 'footer_copyright',
                'value' => '© 2025 PT Migas Hulu Jabar ONWJ.  All rights reserved.',
                'type' => 'text',
                'category' => 'footer',
                'label' => 'Copyright Text',
                'description' => 'Teks copyright di footer',
                'order' => 2
            ],

            // Logo (values will be file paths)
            [
                'key' => 'logo_main',
                'value' => null,
                'type' => 'image',
                'category' => 'logo',
                'label' => 'Logo Utama',
                'description' => 'Logo untuk header (PNG/SVG, max 2MB)',
                'order' => 1
            ],
            [
                'key' => 'logo_footer',
                'value' => null,
                'type' => 'image',
                'category' => 'logo',
                'label' => 'Logo Footer',
                'description' => 'Logo untuk footer (PNG/SVG, max 2MB)',
                'order' => 2
            ],
            [
                'key' => 'logo_favicon',
                'value' => null,
                'type' => 'image',
                'category' => 'logo',
                'label' => 'Favicon',
                'description' => 'Icon browser tab (ICO/PNG, 32x32px)',
                'order' => 3
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}