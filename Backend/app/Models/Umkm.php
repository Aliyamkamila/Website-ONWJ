<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str; // ✅ PENTING: Import Str untuk generate slug

class Umkm extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'umkm';

    protected $fillable = [
        'name',
        'slug', // ✅ PENTING: Tambahkan ini agar bisa disimpan
        'category',
        'owner',
        'location',
        'description',
        'testimonial',
        'shop_link',
        'contact_number',
        'image_path',
        'status',
        'year_started',
        'achievement',
        'is_featured',
        'views',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'views' => 'integer',
        'year_started' => 'integer',
    ];

    protected $appends = ['full_image_url', 'whatsapp_link'];

    /**
     * ✅ LOGIKA OTOMATIS GENERATE SLUG & HAPUS GAMBAR
     * Fungsi boot() ini akan berjalan otomatis setiap ada event create/update/delete
     */
    protected static function boot()
    {
        parent::boot();

        // 1. Saat Membuat Data Baru (Creating)
        static::creating(function ($umkm) {
            // Jika slug kosong, buat dari nama (contoh: "Kopi Enak" -> "kopi-enak")
            if (empty($umkm->slug)) {
                $umkm->slug = static::generateUniqueSlug($umkm->name);
            }
        });

        // 2. Saat Mengupdate Data (Updating)
        static::updating(function ($umkm) {
            // Jika nama berubah, update slug juga agar sinkron
            if ($umkm->isDirty('name')) {
                $umkm->slug = static::generateUniqueSlug($umkm->name, $umkm->id);
            }
        });

        // 3. Saat Menghapus Data (Deleting)
        static::deleting(function ($umkm) {
            // Hapus file gambar dari storage jika ada
            if ($umkm->image_path && Storage::disk('public')->exists($umkm->image_path)) {
                Storage::disk('public')->delete($umkm->image_path);
            }
        });
    }

    /**
     * ✅ Helper untuk memastikan slug unik (tidak duplikat)
     * Misal: "kopi-enak" sudah ada, maka jadi "kopi-enak-1", "kopi-enak-2", dst.
     */
    public static function generateUniqueSlug($name, $id = null)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 1;

        // Cek database apakah slug sudah dipakai (kecuali oleh ID sendiri saat update)
        while (static::where('slug', $slug)
                    ->when($id, fn($q) => $q->where('id', '!=', $id))
                    ->exists()) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        return $slug;
    }

    // --- ACCESSORS & SCOPES ---

    public function getFullImageUrlAttribute()
    {
        if (! $this->image_path) {
            return null;
        }

        if (Storage::disk('public')->exists($this->image_path)) {
            return url('storage/' . $this->image_path);
        }

        return null;
    }

    public function getWhatsappLinkAttribute()
    {
        if (!$this->contact_number) {
            return null;
        }

        // Bersihkan karakter non-angka
        $phone = preg_replace('/\D/', '', $this->contact_number);

        // Ubah 08xxx jadi 628xxx
        if (substr($phone, 0, 1) === '0') {
            $phone = '62' . substr($phone, 1);
        }

        $message = urlencode("Halo, saya tertarik dengan produk {$this->name} dari UMKM Binaan MHJ ONWJ. Bisa dibantu informasi lebih lanjut?");

        return "https://wa.me/{$phone}?text={$message}";
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('name');
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('owner', 'like', "%{$search}%")
              ->orWhere('location', 'like', "%{$search}%")
              ->orWhere('category', 'like', "%{$search}%");
        });
    }

    public function incrementViews()
    {
        $this->increment('views');
    }

    public static function getCategories()
    {
        return self::select('category')
                   ->distinct()
                   ->pluck('category')
                   ->filter()
                   ->values()
                   ->toArray();
    }

    public static function getCategoryCounts()
    {
        return self::selectRaw('category, COUNT(*) as count')
                   ->groupBy('category')
                   ->get()
                   ->mapWithKeys(function ($item) {
                       return [$item->category => $item->count];
                   });
    }
}