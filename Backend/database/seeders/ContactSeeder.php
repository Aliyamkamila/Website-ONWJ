<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Contact;
use Faker\Factory as Faker;

class ContactSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        $subjects = [
            'Pertanyaan tentang Program TJSL',
            'Kerjasama Bisnis',
            'Informasi Karir',
            'Keluhan Layanan',
            'Permintaan Data',
            'Partnership Opportunity',
        ];

        $statuses = ['new', 'read', 'replied'];

        // Create 20 sample contacts
        for ($i = 0; $i < 20; $i++) {
            Contact::create([
                'name' => $faker->name,
                'email' => $faker->safeEmail,
                'phone' => $faker->phoneNumber,
                'subject' => $faker->randomElement($subjects),
                'message' => $faker->paragraph(3),
                'status' => $faker->randomElement($statuses),
                'ip_address' => $faker->ipv4,
                'admin_notes' => $faker->boolean(30) ? $faker->sentence :  null,
                'created_at' => $faker->dateTimeBetween('-30 days', 'now'),
            ]);
        }
    }
}