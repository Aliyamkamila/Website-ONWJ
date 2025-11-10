import React from 'react';
import platformImage from '../../assets/contoh1.png';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const PHero = () => {
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
        <div className="max-w-2xl text-white">
          <div className="flex items-center gap-2 mb-4">
            <Link to="/" className="text-gray-300 hover:text-white flex items-center gap-1">
              <FaHome /> Home
            </Link>
            <span>/</span>
            <span className="text-sm text-blue-400">Tentang Kami</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Tentang Kami</h1>
          <p className="text-lg text-gray-200">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PHero;