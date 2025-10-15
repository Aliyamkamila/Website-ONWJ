import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaYoutube, FaInstagram } from 'react-icons/fa';

import bannerImage from '../../assets/hero-bg.png';
import articleImage from '../../assets/rectangle.png';
import logo from '../../assets/logo.webp';

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
  <article className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <div className="relative">
      <Link to={`/artikel/${item.slug}`}>
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full">
        <FaInstagram className="text-gray-700 h-5 w-5" />
      </div>
    </div>
    <div className="p-5 flex flex-col">
      <p className="text-sm mb-2 text-gray-500">
        <time dateTime={item.date}>{item.date}</time>
      </p>
      <h2 className="text-lg font-bold text-gray-800 mb-3 leading-tight flex-grow">
        <Link to={`/artikel/${item.slug}`} className="hover:text-blue-600 transition-colors">
          {item.title}
        </Link>
      </h2>
      <Link
        to={`/artikel/${item.slug}`}
        className="font-semibold text-blue-600 flex items-center group self-start mt-4 text-sm"
      >
        Selengkapnya <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    </div>
  </article>
);

const VideoCard = ({ item }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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

// --- KOMPONEN BARU: SUB-NAVIGASI ---
const SubNav = () => {
  const activeStyle = {
    color: '#2563EB', // Tailwind: blue-600
    borderBottom: '2px solid #2563EB',
  };

  return (
    <div className="bg-white border-b sticky top-0 z-40">
      <nav className="container mx-auto px-8 lg:px-16 flex space-x-8">
        <NavLink
          to="/media-informasi"
          end
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
          className="font-semibold text-gray-500 hover:text-blue-600 py-4 transition-colors"
        >
          Media & Informasi
        </NavLink>
        <NavLink
          to="/penghargaan"
          style={({ isActive }) => (isActive ? activeStyle : undefined)}
          className="font-semibold text-gray-500 hover:text-blue-600 py-4 transition-colors"
        >
          Penghargaan
        </NavLink>
      </nav>
    </div>
  );
};

// --- HALAMAN UTAMA ---
const MediaInformasiPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner */}
      <section className="relative h-72 md:h-80 w-full flex items-center justify-center text-center">
        <img
          src={bannerImage}
          alt="Banner Media & Informasi"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <h1 className="text-white text-4xl md:text-5xl font-bold pb-4">
            Media & Informasi
            <span className="block w-16 h-1 bg-blue-500 mt-3 mx-auto"></span>
          </h1>
        </div>
        <img
          src={logo}
          alt="Logo Perusahaan"
          className="h-10 absolute top-8 right-8 lg:right-16 z-20"
        />
      </section>

      {/* Sub Navigasi */}
      <SubNav />

      {/* Konten Utama */}
      <main className="container mx-auto px-8 lg:px-16 py-16 space-y-16">
        {/* Berita */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Berita Terkini</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mediaBerita.map((item) => (
              <BeritaCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Video */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Video Terkini</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videoData.map((item) => (
              <VideoCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MediaInformasiPage;
