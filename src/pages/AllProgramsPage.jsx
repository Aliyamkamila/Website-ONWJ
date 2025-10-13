// src/pages/AllProgramsPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import ProgramCard from '../components/ProgramCard'; // Menggunakan komponen yang bisa dipakai ulang

// Placeholder Images
import bannerImage from '../assets/hero-bg.png';
import programImage from '../assets/rectangle.png';
import logo from '../assets/logo.webp';

// --- Data Placeholder (lebih banyak dari sebelumnya) ---
const allProgramsData = [
  { title: 'Social Impact Assessment', date: '05 January 2025', image: programImage },
  { title: 'Energi Berdikari Village', date: '12 February 2025', image: programImage },
  { title: 'Community Development Program', date: '18 March 2025', image: programImage },
  { title: 'Program Pendidikan Lokal', date: '22 April 2025', image: programImage },
  { title: 'Konservasi Lingkungan Pesisir', date: '30 May 2025', image: programImage },
  { title: 'Bantuan Kesehatan Masyarakat', date: '15 June 2025', image: programImage },
];

const AllProgramsPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Banner */}
      <div className="relative h-72 w-full">
        <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute top-8 right-8 lg:right-16">
          <Link to="/"><img src={logo} alt="Logo" className="h-10" /></Link>
        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <div className="container mx-auto px-8 lg:px-16 pb-16">
            <h1 className="text-white text-5xl font-bold relative inline-block">
              Program Berkelanjutan
              <span className="absolute -bottom-4 left-0 w-1/2 h-1 bg-blue-500"></span>
            </h1>
          </div>
        </div>
      </div>

      {/* Grid of All Programs */}
      <section className="py-20">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProgramsData.map((prog, index) => (
              <ProgramCard key={index} program={prog} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllProgramsPage;