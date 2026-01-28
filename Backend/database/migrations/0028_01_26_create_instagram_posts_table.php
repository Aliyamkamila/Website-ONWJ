<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('instagram_posts', function (Blueprint $table) {
            $table->id();
            $table->string('instagram_url')->unique(); // URL post Instagram
            $table->string('instagram_id')->nullable(); // ID post dari Instagram
            $table->text('caption')->nullable(); // Caption dari Instagram
            $table->string('image_url')->nullable(); // URL gambar dari Instagram
            $table->string('thumbnail_url')->nullable(); // Thumbnail jika video
            $table->enum('media_type', ['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM'])->default('IMAGE');
            $table->integer('like_count')->default(0);
            $table->integer('comment_count')->default(0);
            $table->timestamp('posted_at')->nullable(); // Tanggal post Instagram
            $table->boolean('show_in_media')->default(true); // Tampil di Media & Informasi?
            $table->boolean('featured')->default(false); // Featured post?
            $table->integer('order')->default(0); // Urutan tampil
            $table->enum('status', ['published', 'draft'])->default('published');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('instagram_posts');
    }
};