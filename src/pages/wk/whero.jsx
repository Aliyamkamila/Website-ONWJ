// src/pages/wk/whero.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import platformImage from '../../assets/hero-bg.png'; // Ganti dengan gambar yg lebih relevan
import { FaHome } from 'react-icons/fa';

const WHero = () => {
  return (
    <div className="relative h-[60vh] overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={platformImage} 
          alt="Platform"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
      </div>
      <div className="relative container mx-auto px-8 lg:px-16 h-full flex items-center">
        <div className="max-w-3xl text-white">
          <div className="flex items-center gap-2 mb-4 text-sm">
            <Link to="/" className="text-gray-300 hover:text-white flex items-center gap-1">
              <FaHome /> Home
            </Link>
            <span>/</span>
            <span className="font-semibold text-white">Wilayah Kerja</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Wilayah Kerja</h1>
          <p className="text-lg text-gray-200 leading-relaxed">
            Menjelajahi area operasi PT Migas Hulu Jabar ONWJ di lepas pantai utara Jawa Barat.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WHero;