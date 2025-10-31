import React from 'react';
import heroBg from '../../assets/hero-bg.png';

const Hero = () => {
  return (
    <section id="hero-section" className="relative min-h-screen bg-gradient-to-r from-primary-600 to-primary-800">
      {/* Background Image yang diperluas ke header */}
      <div 
        className="fixed top-0 left-0 right-0 w-full h-screen z-0" // Menggunakan fixed positioning
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-screen w-full max-w-[1440px] mx-auto px-8 lg:px-16">
        <div className="flex flex-col justify-center h-full pt-20"> {/* Tambahkan padding top */}
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8">
              Energi Untuk<br />
              Kemakmuran Daerah
            </h1>
            
            <button className="group inline-flex items-center space-x-2 px-8 py-3 border-2 border-white text-white text-lg font-medium transition-all duration-300 hover:bg-white hover:text-gray-900 rounded-full">
              <span>Read More</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;