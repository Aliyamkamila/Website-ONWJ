// src/pages/media/MediaInformasiPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Import aset dan ikon
import bannerImage from '../../assets/hero-bg.png'; // Ganti dengan banner media jika ada
import articleImage from '../../assets/rectangle.png';
import logo from '../../assets/logo.webp';
import { FaHome, FaYoutube, FaInstagram } from 'react-icons/fa'; // Pastikan 'npm install react-icons'

// --- DATA DUMMY ---
const mediaBerita = [
    { id: 1, slug: 'social-impact-assessment-and-community-involvement', source: 'Instagram', date: 'October 14, 2025', title: 'Komitmen Kami dalam Penilaian Dampak Sosial', image: articleImage },
    { id: 2, slug: 'new-tree-planting-initiative-for-greener-future', source: 'Instagram', date: 'October 12, 2025', title: 'Inisiatif Penanaman Pohon untuk Masa Depan yang Lebih Hijau', image: articleImage },
    { id: 3, slug: 'artikel-ketiga-yang-baru', source: 'Instagram', date: 'October 10, 2025', title: 'Pengembangan Energi Terbarukan di Wilayah Operasi', image: articleImage },
];

const videoData = [
    { id: 1, title: "Profil Perusahaan PT Migas Hulu Jabar ONWJ", embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { id: 2, title: "Inovasi Teknologi Pengeboran Lepas Pantai", embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
];

// --- SUB-KOMPONEN ---

// 1. Hero Banner (diadaptasi dari phero.jsx)
const MediaHero = () => (
  <div className="relative h-[60vh] overflow-hidden">
    <div className="absolute inset-0">
      <img src={bannerImage} alt="Media Banner" className="w-full h-full object-cover" />
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
          Ikuti kabar terbaru, publikasi, dan galeri video dari aktivitas perusahaan kami.
        </p>
      </div>
    </div>
  </div>
);

// 2. Kartu Berita
const BeritaCard = ({ item }) => (
    <article className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative">
            <Link to={`/artikel/${item.slug}`}>
                <img src={item.image} alt={item.title} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            </Link>
            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full">
                <FaInstagram className="text-gray-700 h-5 w-5" />
            </div>
        </div>
        <div className="p-5 flex flex-col">
            <p className="text-sm mb-2 text-gray-500"><time dateTime={item.date}>{item.date}</time></p>
            <h2 className="text-lg font-bold text-gray-800 mb-3 leading-tight flex-grow">
                <Link to={`/artikel/${item.slug}`} className="hover:text-blue-600 transition-colors">{item.title}</Link>
            </h2>
            <Link to={`/artikel/${item.slug}`} className="font-semibold text-blue-600 flex items-center group self-start mt-4 text-sm">
                Selengkapnya <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
        </div>
    </article>
);

// 3. Kartu Video
const VideoCard = ({ item }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg">
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
        <div className="p-5">
            <h3 className="font-bold text-gray-800">{item.title}</h3>
        </div>
    </div>
);

// --- MAIN PAGE COMPONENT ---
const MediaInformasiPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <MediaHero />

            {/* Section Berita Terkini */}
            <section className="py-20">
                <div className="container mx-auto px-8 lg:px-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Berita Terkini</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mediaBerita.map((item) => <BeritaCard key={item.id} item={item} />)}
                    </div>
                </div>
            </section>

            {/* Section Video Terkini */}
            <section className="bg-white py-20">
                <div className="container mx-auto px-8 lg:px-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Galeri Video</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {videoData.map((item) => <VideoCard key={item.id} item={item} />)}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MediaInformasiPage;