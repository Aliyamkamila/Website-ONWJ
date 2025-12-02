import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import platformImage from '../../assets/hero-bg.png';

const WHero = () => {
  return (
    <div className="relative h-[60vh] overflow-hidden" id="hero-section">
      <div className="absolute inset-0">
        <img 
          src={platformImage} 
          alt="Platform Migas"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/70 to-secondary-900/50" />
      </div>
      
      <div className="relative section-container h-full flex items-center">
        <div className="max-w-3xl text-white">
          <div className="flex items-center gap-2 mb-4 text-body-sm">
            <Link 
              to="/" 
              className="text-white/70 hover:text-white flex items-center gap-1 transition-colors duration-200"
            >
              <FaHome className="w-4 h-4" /> 
              <span>Home</span>
            </Link>
            <span className="text-white/50">/</span>
            <span className="font-semibold text-white">Wilayah Kerja</span>
          </div>
          
          <h1 className="text-display-lg lg:text-display-xl font-heading font-bold mb-6 text-white leading-tight">
            Wilayah Kerja
          </h1>
          
          <p className="text-body-lg text-white/90 leading-relaxed">
            Menjelajahi area operasi PT Migas Hulu Jabar ONWJ di lepas pantai utara Jawa Barat
          </p>
        </div>
      </div>
    </div>
  );
};

export default WHero;