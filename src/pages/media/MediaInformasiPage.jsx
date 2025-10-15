import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder Images
import bannerImage from '../../assets/hero-bg.png';
import articleImage from '../../assets/rectangle.png';
import logo from '../../assets/logo.webp';
import { FaYoutube, FaInstagram } from 'react-icons/fa';

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
const BeritaCard = ({ item }) => (
    <article className="group bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2" aria-labelledby={`berita-title-${item.id}`}>
        <div className="relative">
            <Link to={`/artikel/${item.slug}`}>
                <img src={item.image} alt={item.title} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            </Link>
            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full">
                <FaInstagram className="text-gray-700 h-5 w-5" aria-hidden="true" />
            </div>
        </div>
        <div className="p-6 flex flex-col">
            <p className="text-sm mb-2 text-gray-500" id={`berita-title-${item.id}`}><time dateTime={item.date}>{item.date}</time></p>
            <h2 className="text-lg font-bold text-gray-800 mb-3 leading-tight">
                <Link to={`/artikel/${item.slug}`} className="hover:text-blue-600 transition-colors">{item.title}</Link>
            </h2>
            <Link to={`/artikel/${item.slug}`} className="font-semibold text-blue-600 flex items-center text-sm mt-auto">
                Selengkapnya <span className="ml-2 transform transition-transform group-hover:translate-x-1">→</span>
            </Link>
        </div>
    </article>
);

const VideoCard = ({ item }) => (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden" aria-labelledby={`video-title-${item.id}`}>
        <div className="aspect-video">
            <iframe
                src={item.embedUrl}
                title={item.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                loading="lazy"
            ></iframe>
        </div>
        <div className="p-6">
            <h3 className="font-bold text-gray-800" id={`video-title-${item.id}`}>{item.title}</h3>
        </div>
    </div>
);

const MediaInformasiPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Banner */}
            <section
                className="relative h-72 md:h-96 w-full flex items-center justify-center text-center"
                aria-labelledby="media-banner"
            >
                <img
                    src={bannerImage}
                    alt="Banner Media & Informasi"
                    className="w-full h-full object-cover"
                    loading="lazy"
                />

                {/* Overlay gelap */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Konten di tengah */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <h1
                        className="text-white text-4xl md:text-5xl font-bold pb-4"
                        id="media-banner"
                    >
                        Media & Informasi
                        <span className="block w-16 h-1 bg-blue-500 mt-3 mx-auto"></span>
                    </h1>
                </div>

                {/* Logo di pojok kanan atas */}
                <img
                    src={logo}
                    alt="Logo Perusahaan"
                    className="h-10 absolute top-8 right-8 lg:right-16 z-20"
                />
            </section>
=
            {/* Konten Utama */}
            <main className="container mx-auto px-8 lg:px-16 py-16 space-y-16">
                {/* Section Berita Terkini */}
                <section aria-labelledby="berita-heading">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6" id="berita-heading">Berita Terkini</h2>
                    <p className="text-gray-600 mb-8">Ikuti update terbaru dari kami melalui media sosial dan berita resmi.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mediaBerita.map((item) => <BeritaCard key={item.id} item={item} />)}
                    </div>
                </section>

                {/* Section Video Terkini */}
                <section aria-labelledby="video-heading">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6" id="video-heading">Video Terkini</h2>
                    <p className="text-gray-600 mb-8">Jelajahi video-video informatif tentang kegiatan dan inovasi kami.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {videoData.map((item) => <VideoCard key={item.id} item={item} />)}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default MediaInformasiPage;