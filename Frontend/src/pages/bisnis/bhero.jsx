import React from 'react';
import { Link } from 'react-router-dom';
import platformImage from '../../assets/contoh1.png';

/**
 * BHero Component - Simplified & Impactful
 */
const BHero = () => {
  return (
    <section 
      className="relative h-[45vh] min-h-[320px] max-h-[420px] overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img 
          src={platformImage} 
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-secondary-900/75" />
      </div>

      {/* Content */}
      <div className="relative z-10 section-container h-full flex flex-col justify-center">
        {/* Breadcrumb */}
        <nav className="mb-grid-4" aria-label="Breadcrumb">
          <ol className="flex items-center gap-grid-2 text-body-sm">
            <li>
              <Link to="/" className="text-secondary-400 hover:text-white transition-colors">
                Beranda
              </Link>
            </li>
            <li className="text-secondary-500">/</li>
            <li className="text-white font-medium">Bisnis Kami</li>
          </ol>
        </nav>

        {/* Title */}
        <h1 id="hero-title" className="text-white max-w-2xl">
          Bisnis Kami
        </h1>
        
        <p className="text-body-lg text-secondary-300 max-w-xl mt-grid-4">
          Mengelola dan mengoptimalkan aset energi melalui kolaborasi strategis untuk pembangunan berkelanjutan
        </p>
      </div>

      {/* Bottom Fade */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"
        aria-hidden="true"
      />
    </section>
  );
};

export default BHero;