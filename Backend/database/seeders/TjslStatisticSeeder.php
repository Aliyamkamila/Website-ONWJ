<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TjslStatistic;

class TjslStatisticSeeder extends Seeder
{
    public function run(): void
    {
        $statistics = [
            [
                'key' => 'program_count',
                'value' => 150,
                'label' => 'Program Terlaksana',
                'unit' => 'Program',
                'icon_name' => 'book',
                'color' => 'blue',
                'display_order' => 1,
                'is_active' => true,
            ],
            [
                'key' => 'beneficiary_count',
                'value' => 5000,
                'label' => 'Penerima Manfaat',
                'unit' => 'Orang',
                'icon_name' => 'users',
                'color' => 'green',
                'display_order' => 2,
                'is_active' => true,
            ],
            [
                'key' => 'village_count',
                'value' => 25,
                'label' => 'Desa Dampingan',
                'unit' => 'Desa',
                'icon_name' => 'building',
                'color' => 'orange',
                'display_order' => 3,
                'is_active' => true,
            ],
            [
                'key' => 'fund_allocated',
                'value' => 10000000000,
                'label' => 'Dana Tersalurkan',
                'unit' => 'Rupiah',
                'icon_name' => 'hands',
                'color' => 'purple',
                'display_order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($statistics as $stat) {
            TjslStatistic::updateOrCreate(
                ['key' => $stat['key']],
                $stat
            );
        }
    }
}