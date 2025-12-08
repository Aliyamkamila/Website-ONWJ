<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TjslStatistic;

class TjslStatisticSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statistics = [
            [
                'key' => 'penerimaan_manfaat',
                'label' => 'Penerima Manfaat',
                'unit' => 'Jiwa',
                'value' => 99500,
                'display_order' => 1,
                'icon_name' => 'users',
                'color' => 'orange',
                'is_active' => true,
            ],
            [
                'key' => 'infrastruktur',
                'label' => 'Infrastruktur',
                'unit' => 'terbangun',
                'value' => 4,
                'display_order' => 2,
                'icon_name' => 'building',
                'color' => 'blue',
                'is_active' => true,
            ],
            [
                'key' => 'ebtke',
                'label' => 'Unit EBTKE',
                'unit' => '',
                'value' => 8,
                'display_order' => 3,
                'icon_name' => 'solar',
                'color' => 'green',
                'is_active' => true,
            ],
            [
                'key' => 'paket_pendidikan',
                'label' => 'Paket Pendidikan',
                'unit' => '',
                'value' => 800,
                'display_order' => 4,
                'icon_name' => 'book',
                'color' => 'purple',
                'is_active' => true,
            ],
            [
                'key' => 'kelompok_binaan',
                'label' => 'Kelompok Binaan',
                'unit' => '',
                'value' => 3,
                'display_order' => 5,
                'icon_name' => 'hands',
                'color' => 'orange',
                'is_active' => true,
            ],
        ];

        foreach ($statistics as $stat) {
            TjslStatistic::create($stat);
        }

        $this->command->info('✅ TJSL Statistics seeded successfully!');
    }
}