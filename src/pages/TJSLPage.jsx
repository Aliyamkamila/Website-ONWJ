// src/pages/TJSLPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import bannerImage from '../assets/hero-bg.png';
import programImage from '../assets/rectangle.png';
import logo from '../assets/logo.webp';

const sustainablePrograms = [
  {
    title: 'Social Impact Assessment and Community Involvement',
    date: '05 January 2025',
    link: '#',
    image: programImage,
  },
  {
    title: 'Energi Berdikari Village',
    date: '05 January 2025',
    link: '#',
    image: programImage,
  },
  {
    title: 'Community Development Program',
    date: '05 January 2025',
    link: '#',
    image: programImage,
  },
];

const carouselImages = [programImage, programImage, programImage, programImage, programImage];


const TJSLPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const goNext = () => {
    setActiveIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };

  return (
    <div className="bg-white">
      {/* Banner Section */}
      <div className="relative h-80 w-full">
        <img src={bannerImage} alt="TJSL Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute top-0 right-0 p-8">
            <Link to="/">
                <img src={logo} alt="Logo" className="h-10" />
            </Link>
        </div>
        {/* --- PERUBAHAN DI SINI --- (Padding bottom 'pb' ditambah) */}
        <div className="absolute bottom-0 left-0 container mx-auto px-8 lg:px-16 pb-16">
          <h1 className="text-white text-5xl font-bold relative inline-block">
            Tanggung Jawab Sosial Dan Lingkungan
            {/* --- PERUBAHAN DI SINI --- (Posisi bottom diubah) */}
            <span className="absolute -bottom-4 left-0 w-1/2 h-1 bg-blue-500"></span>
          </h1>
        </div>
      </div>

      {/* Intro Section */}
      <section className="py-24">
        <div className="container mx-auto px-8 lg:px-16 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <p className="text-blue-600 font-semibold mb-2">Program Kami</p>
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              Tanggung Jawab Sosial Dan Lingkungan
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-gray-600 text-lg">
              In line with core values and PHE ethics to preserve corporate business sustainability, PHE use their policy of sustainability as one of main Company’s responsibility. This policy includes guidelines on how PHE did to create a better Company’s activity and strategy, moreover, in Environmental, Social and Governance (ESG) and a sustainable economy.
            </p>
          </div>
        </div>
      </section>

      {/* Image Carousel Section */}
      <section className="pb-24">
        <div className="container mx-auto px-8 lg:px-16 relative">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${activeIndex * (100 / 3)}%)` }}>
              {carouselImages.map((img, index) => (
                <div key={index} className="w-1/3 flex-shrink-0 px-2">
                  <img src={img} alt={`Slide ${index + 1}`} className="w-full h-auto object-cover rounded-lg aspect-[3/2]" />
                </div>
              ))}
            </div>
          </div>
          <button onClick={goPrev} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-md hover:bg-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={goNext} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-md hover:bg-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex space-x-2">
            {carouselImages.map((_, index) => (
              <button key={index} onClick={() => setActiveIndex(index)} className={`w-2.5 h-2.5 rounded-full ${activeIndex === index ? 'bg-blue-600' : 'bg-gray-300'}`}></button>
            ))}
          </div>
        </div>
      </section>

      {/* Program Berkelanjutan Section */}
      <section className="bg-gray-100 py-24">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Program Berkelanjutan</h2>
            <a href="#" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">See All</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sustainablePrograms.map((prog, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <img src={prog.image} alt={prog.title} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-4 text-gray-800 h-16">{prog.title}</h3>
                  <p className="text-gray-500 text-sm mt-auto flex items-center">
                    {prog.date}
                    <span className="ml-auto text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">→</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TJSLPage;