// src/pages/media/PenghargaanPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Placeholder Images
import bannerImage from '../../assets/hero-bg.png';
import awardImage from '../../assets/rectangle.png'; // Ganti dengan gambar piala/sertifikat nanti
import logo from '../../assets/logo.webp';

// --- DATA DUMMY PENGHARGAAN ---
const awardsData = [
  { year: 2024, title: 'Best HSE Performance Award', givenBy: 'Kementerian ESDM' },
  { year: 2024, title: 'Community Empowerment Excellence', givenBy: 'CSR Outlook Awards' },
  { year: 2023, title: 'Innovation in Offshore Technology', givenBy: 'Asia Petroleum Expo' },
  { year: 2023, title: 'Sustainable Company of the Year', givenBy: 'National Geographic Forum' },
  { year: 2022, title: 'Top Performer in Oil & Gas Sector', givenBy: 'Energy & Mining Weekly' },
  { year: 2022, title: 'Environmental Stewardship Award', givenBy: 'Green Earth Foundation' },
];

// --- SUB-KOMPONEN ---
const AwardCard = ({ award }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div className="h-48 overflow-hidden">
      <img src={awardImage} alt={award.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
    </div>
    <div className="p-5">
      <p className="text-sm font-semibold text-blue-600 mb-1">{award.year}</p>
      <h3 className="text-lg font-bold text-gray-800 leading-tight">{award.title}</h3>
      <p className="text-sm text-gray-500 mt-2">Diberikan oleh: {award.givenBy}</p>
    </div>
  </div>
);

const PenghargaanPage = () => {
  return (
    <div className="bg-gray-50">
      {/* Banner */}
      <section className="relative h-72 md:h-80 w-full">
        {/* Gambar banner */}
        <img
          src={bannerImage}
          alt="Banner Penghargaan"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        {/* Teks di tengah */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold relative inline-block pb-4">
            Penghargaan
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-blue-500"></span>
          </h1>
        </div>

        {/* Logo pojok kanan atas */}
        <img
          src={logo}
          alt="Logo"
          className="h-10 absolute top-8 right-8 lg:right-16"
        />
      </section>

      {/* Konten Utama */}
      <div className="container mx-auto px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {awardsData.map((award, index) => (
            <AwardCard key={index} award={award} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PenghargaanPage;