<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        Admin::create([
            'name' => 'Super Admin',
            'email' => 'admin@mujonwj.com',
            'password' => Hash::make('adminjuara2026'),
        ]);

        $this->command->info('✅ Admin user created!');
        $this->command->info('📧 Email: admin@mujonwj.com');
        $this->command->info('🔑 Password: adminjuara2026');
    }
}