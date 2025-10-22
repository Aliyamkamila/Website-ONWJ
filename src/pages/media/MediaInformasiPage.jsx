// src/pages/media/MediaInformasiPage.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom'; // Gunakan NavLink untuk active style

// Import Aset
import bannerImage from '../../assets/hero-bg.png'; // Banner
import articleImage from '../../assets/rectangle.png'; // Gambar berita
import logo from '../../assets/logo.webp';
import { FaHome, FaYoutube, FaInstagram } from 'react-icons/fa'; // Ikon

// --- DATA DUMMY ---
const mediaBerita = [
    { id: 1, slug: 'social-impact-assessment-and-community-involvement', source: 'Instagram', date: 'October 14, 2025', title: 'Komitmen Kami dalam Penilaian Dampak Sosial', image: articleImage },
    { id: 2, slug: 'new-tree-planting-initiative-for-greener-future', source: 'Instagram', date: 'October 12, 2025', title: 'Inisiatif Penanaman Pohon untuk Masa Depan', image: articleImage },
    { id: 3, slug: 'artikel-ketiga-yang-baru', source: 'Instagram', date: 'October 10, 2025', title: 'Pengembangan Energi Terbarukan di Wilayah Operasi', image: articleImage },
];

const videoData = [
    { id: 1, title: "Profil Perusahaan PT Migas Hulu Jabar ONWJ", embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Mengenal lebih dekat visi, misi, dan operasi PT Migas Hulu Jabar ONWJ dalam mengelola energi untuk kemakmuran daerah." },
    { id: 2, title: "Inovasi Teknologi Pengeboran Lepas Pantai", embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Lihat bagaimana kami menerapkan teknologi terkini untuk memastikan operasi yang aman dan efisien." },
    { id: 3, title: "Program TJSL: Pemberdayaan Masyarakat Pesisir", embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Kisah sukses program TJSL kami bersama para nelayan dan masyarakat pesisir." },
];

const featuredVideo = videoData[0]; // Ambil video pertama sebagai featured
const galleryVideos = videoData.slice(1); // Sisanya untuk galeri

// --- SUB-KOMPONEN ---

// 1. Hero Banner (diadaptasi dari phero.jsx)
const MediaHero = () => (
    <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
            <img src={bannerImage} alt="Banner Media" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        <div className="relative container mx-auto px-8 lg:px-16 h-full flex items-center">
            <div className="max-w-3xl text-white">
                <div className="flex items-center gap-2 mb-4 text-sm">
                    <Link to="/" className="text-gray-300 hover:text-white flex items-center gap-1">
                        <FaHome /> Home
                    </Link>
                    <span>/</span>
                    <span className="font-semibold text-white">Media & Informasi</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Media & Informasi</h1>
                <p className="text-lg text-gray-200 leading-relaxed">
                    Kumpulan berita, rilis media, dan galeri video terbaru dari aktivitas perusahaan kami.
                </p>
            </div>
        </div>
    </div>
);

// 2. Sub-Navigasi (Dibuat STICKY)
const SubNav = () => {
    // Style untuk link yang aktif dan tidak aktif
    const activeStyle = "font-semibold text-blue-600 border-b-2 border-blue-600 py-4";
    const inactiveStyle = "font-medium text-gray-500 hover:text-blue-600 border-b-2 border-transparent py-4 transition-colors";

    return (
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
            <nav className="container mx-auto px-8 lg:px-16 flex space-x-8">
                <NavLink 
                    to="/media-informasi" 
                    end // 'end' prop penting agar tidak match dengan /penghargaan
                    className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
                >
                    Media & Berita
                </NavLink>
                <NavLink 
                    to="/penghargaan" 
                    className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
                >
                    Penghargaan
                </NavLink>
                {/* Tambahkan link sub-menu lain di sini jika perlu */}
            </nav>
        </div>
    );
};

// 3. Featured Video Section (BARU)
const FeaturedVideo = ({ item }) => (
    <section className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="aspect-video rounded-lg overflow-hidden shadow-md">
                <iframe
                    src={item.embedUrl}
                    title={item.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                ></iframe>
            </div>
            <div className="space-y-4">
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Featured Video</p>
                <h2 className="text-3xl font-bold text-gray-900">{item.title}</h2>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
        </div>
    </section>
);


// 4. Kartu Berita (Vertikal)
const BeritaCard = ({ item }) => (
    <article className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col">
        <div className="h-48 overflow-hidden relative">
            <Link to={`/artikel/${item.slug}`}>
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            </Link>
            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full">
                <FaInstagram className="text-gray-700 h-5 w-5" />
            </div>
        </div>
        <div className="p-5 flex flex-col flex-grow">
            <p className="text-sm mb-2 text-gray-500"><time dateTime={item.date}>{item.date}</time></p>
            <h2 className="text-lg font-bold text-gray-800 mb-3 leading-tight flex-grow">
                <Link to={`/artikel/${item.slug}`} className="hover:text-blue-600 transition-colors line-clamp-2">{item.title}</Link>
            </h2>
            <Link to={`/artikel/${item.slug}`} className="font-semibold text-blue-600 flex items-center group self-start mt-4 text-sm">
                Selengkapnya <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
        </div>
    </article>
);

// 5. Kartu Video Galeri
const VideoCard = ({ item }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
        <div className="aspect-video">
            <iframe
                src={item.embedUrl}
                title={item.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
            ></iframe>
        </div>
        <div className="p-5 flex-grow">
            <h3 className="font-bold text-gray-800 line-clamp-2">{item.title}</h3>
        </div>
    </div>
);

// --- MAIN PAGE COMPONENT ---
const MediaInformasiPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <MediaHero />
            <SubNav />

            {/* Konten Utama */}
            <div className="container mx-auto px-8 lg:px-16 py-16 space-y-16">
                
                {/* Featured Video Section */}
                <FeaturedVideo item={featuredVideo} />

                {/* Section Berita Terkini */}
                <section>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Berita Terkini</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mediaBerita.map((item) => <BeritaCard key={item.id} item={item} />)}
                    </div>
                </section>

                {/* Section Galeri Video */}
                <section>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Galeri Video</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {galleryVideos.map((item) => <VideoCard key={item.id} item={item} />)}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default MediaInformasiPage;