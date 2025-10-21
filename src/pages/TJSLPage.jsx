// src/pages/TJSLPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProgramCard from '../components/ProgramCard'; // Menggunakan komponen kartu yang sudah ada

// Placeholder Images
import bannerImage from '../assets/hero-bg.png'; // Ganti dengan gambar banner yang sesuai
import programImage from '../assets/rectangle.png'; // Gambar untuk program
import carouselImg1 from '../assets/contoh1.png'; // Ganti dengan gambar carousel 1
import carouselImg2 from '../assets/contoh2.png'; // Ganti dengan gambar carousel 2
import carouselImg3 from '../assets/contoh3.png'; // Ganti dengan gambar carousel 3
import logo from '../assets/logo.webp';

// --- DATA DUMMY ---
const sustainablePrograms = [
  { title: 'Social Impact Assessment and Community Involvement', date: '05 January 2025', image: programImage, slug: 'social-impact-assessment-and-community-involvement' },
  { title: 'Energi Berdikari Village', date: '05 January 2025', image: programImage, slug: 'energi-berdikari-village' },
  { title: 'Community Development Program', date: '05 January 2025', image: programImage, slug: 'community-development-program' },
];

const carouselImages = [carouselImg1, carouselImg2, carouselImg3, carouselImg1, carouselImg2]; // Duplikasi untuk efek loop

const TJSLPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Fungsi navigasi carousel (tidak perlu diubah)
  const goNext = () => setActiveIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  const goPrev = () => setActiveIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));

  return (
    <div className="bg-white">
      {/* Banner Section - Disesuaikan dengan image_faffc1.jpg */}
      <section className="relative h-80 w-full">
        <img src={bannerImage} alt="TJSL Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" /> {/* Overlay sedikit lebih gelap */}
        <div className="absolute top-8 right-8 lg:right-16 z-10">
          <Link to="/"><img src={logo} alt="Logo" className="h-10" /></Link>
        </div>
        <div className="absolute bottom-0 left-0 container mx-auto px-8 lg:px-16 pb-12">
          {/* Judul dengan garis biru */}
          <h1 className="text-white text-5xl font-bold relative inline-block">
            Tanggung Jawab Sosial Dan Lingkungan
            <span className="absolute -bottom-3 left-0 w-1/3 h-1 bg-blue-500 rounded-full"></span>
          </h1>
        </div>
      </section>

      {/* Intro Section - Disesuaikan dengan image_faffc1.jpg */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-8 lg:px-16 grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <p className="text-blue-600 font-semibold mb-2 text-sm uppercase tracking-wider">Program Kami</p>
            <h2 className="text-4xl font-bold text-gray-900 leading-snug">
              Tanggung Jawab Sosial Dan Lingkungan
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-gray-600 text-base leading-relaxed">
              In line with core values and PHE ethics to preserve corporate business sustainability, PHE use their policy of sustainability as one of main Company’s responsibility. This policy includes guidelines on how PHE did to create a better Company’s activity and strategy, moreover, in Environmental, Social and Governance (ESG) and a sustainable economy.
            </p>
          </div>
        </div>
      </section>

      {/* Image Carousel Section - Disesuaikan dengan image_faffc1.jpg */}
      <section className="pb-24 bg-white">
        <div className="container mx-auto px-8 lg:px-16 relative">
          <div className="overflow-hidden relative">
            {/* Wrapper for sliding effect */}
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${activeIndex * (100 / 3)}%)` }}>
              {carouselImages.map((img, index) => (
                <div key={index} className="w-1/3 flex-shrink-0 px-2">
                  <img src={img} alt={`Slide ${index + 1}`} className="w-full h-auto object-cover rounded-lg aspect-[4/3] shadow-md" />
                </div>
              ))}
            </div>
          </div>
          {/* Controls */}
          <button onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg hover:bg-white transition z-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-lg hover:bg-white transition z-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          {/* Dots */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {carouselImages.slice(0, 3).map((_, index) => ( // Hanya tampilkan 3 titik sesuai jumlah gambar unik
              <button key={index} onClick={() => setActiveIndex(index)} className={`w-3 h-3 rounded-full transition-colors duration-300 ${activeIndex === index ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'}`}></button>
            ))}
          </div>
        </div>
      </section>

      {/* Program Berkelanjutan Section - Disesuaikan dengan image_faffc1.jpg */}
      <section className="bg-gray-100 py-24">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Program Berkelanjutan</h2>
            <Link to="/program-berkelanjutan" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors text-sm">See All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sustainablePrograms.map((prog, index) => (
              // Menggunakan komponen ProgramCard yang sudah ada, tapi mungkin perlu sedikit penyesuaian styling jika diperlukan
              <ProgramCard key={index} program={prog} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TJSLPage;