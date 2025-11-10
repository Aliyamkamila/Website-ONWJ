// src/pages/UmkmPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaStore, FaBookOpen } from 'react-icons/fa'; // Ikon baru

// --- Aset Placeholder (Kita pakai yang sudah ada) ---
import bannerImage from '../assets/hero-bg.png'; // Ganti dengan gambar banner UMKM jika ada
import featuredImage from '../assets/contoh1.png'; // Ganti dengan foto UMKM unggulan
import productImage from '../assets/rectangle.png'; // Ganti dengan foto produk

// --- DATA DUMMY (Nanti bisa kamu ganti) ---
const featuredUmkm = {
    id: "f1",
    name: "Kopi Mangrove Segara",
    owner: "Ibu Siti",
    quote: "Dulu saya cuma bisa jual 10 bungkus, setelah dapat pelatihan pengemasan dari MUJ ONWJ, sekarang bisa kirim ke luar kota. Omzet naik 300%!",
    category: "Kuliner",
    location: "Muara Gembong, Bekasi",
    image: featuredImage,
    slug: "kopi-mangrove-segara" // Nanti ini bisa jadi link ke artikelnya
};

const umkmGalleryData = [
    {
        id: "u1",
        name: "Kerajinan Enceng Gondok",
        category: "Kerajinan",
        location: "Kalibaru, Jakarta Utara",
        image: productImage,
        shopLink: "https://tokopedia.com/...", // Ganti dengan link asli
        slug: "#"
    },
    {
        id: "u2",
        name: "Madu Hutan Asli Subang",
        category: "Agribisnis",
        location: "Mayangan, Subang",
        image: productImage,
        shopLink: "", // Kosongkan jika tidak ada
        slug: "#"
    },
    {
        id: "u3",
        name: "Olahan Ikan Balongan",
        category: "Kuliner",
        location: "Balongan, Indramayu",
        image: productImage,
        shopLink: "https://shopee.co.id/...", // Ganti dengan link asli
        slug: "#"
    },
    {
        id: "u4",
        name: "Batik Pesisir",
        category: "Fashion",
        location: "Sungai Buntu, Karawang",
        image: productImage,
        shopLink: "",
        slug: "#"
    },
];

// --- SUB-KOMPONEN HALAMAN ---

// 1. Hero Banner
const UmkmHero = () => (
    <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
            <img src={bannerImage} alt="Banner UMKM" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        <div className="relative container mx-auto px-8 lg:px-16 h-full flex items-center">
            <div className="max-w-3xl text-white">
                <div className="flex items-center gap-2 mb-4 text-sm">
                    <Link to="/" className="text-gray-300 hover:text-white flex items-center gap-1"><FaHome /> Home</Link>
                    <span>/</span>
                    <Link to="/tjsl" className="text-gray-300 hover:text-white">TJSL</Link>
                    <span>/</span>
                    <span className="font-semibold text-white">UMKM Binaan</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">UMKM Binaan</h1>
                <p className="text-lg text-gray-200 leading-relaxed">
                    Etalase produk dan cerita sukses dari para mitra binaan UMKM kami yang berdaya dan mandiri.
                </p>
            </div>
        </div>
    </div>
);

// 2. Featured Story Section
const FeaturedUmkm = ({ item }) => (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-8 lg:px-16">
            <div className="flex flex-col lg:flex-row items-center gap-12 bg-gray-50 p-8 rounded-2xl shadow-lg">
                <div className="lg:w-1/2">
                    <div className="rounded-2xl overflow-hidden shadow-xl">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover aspect-[4/3]" />
                    </div>
                </div>
                <div className="lg:w-1/2 space-y-6">
                    <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Cerita Sukses Unggulan</p>
                    <h2 className="text-4xl font-bold text-gray-900">{item.name}</h2>
                    <blockquote className="text-xl italic text-gray-700 border-l-4 border-blue-500 pl-4">
                        "{item.quote}"
                        <cite className="block not-italic text-base font-semibold text-gray-800 mt-2">- {item.owner}, {item.location}</cite>
                    </blockquote>
                    <Link to={`/artikel/${item.slug}`} className="group inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-colors">
                        <span>Baca Cerita Lengkap</span>
                        <FaBookOpen className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    </section>
);

// 3. Kartu Galeri UMKM
const UmkmCard = ({ item }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
        <div className="h-48 overflow-hidden">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
        </div>
        <div className="p-5 flex flex-col flex-grow">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full self-start">{item.category}</span>
            <h3 className="text-lg font-bold text-gray-800 mt-3 mb-1 line-clamp-2">{item.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{item.location}</p>
            <div className="mt-auto">
                {item.shopLink ? (
                    <a href={item.shopLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm">
                        <FaStore /> Kunjungi Toko
                    </a>
                ) : (
                    <Link to={`/artikel/${item.slug}`} className="font-semibold text-blue-600 flex items-center group text-sm">
                        Lihat Cerita <span className="ml-1 transform group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                )}
            </div>
        </div>
    </div>
);

// --- MAIN PAGE COMPONENT ---
const UmkmPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <UmkmHero />
            <FeaturedUmkm item={featuredUmkm} />

            {/* Galeri Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-8 lg:px-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Galeri UMKM Binaan</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {umkmGalleryData.map((item) => (
                            <UmkmCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UmkmPage;