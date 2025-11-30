import React from 'react';
import { Link } from 'react-router-dom';
import platformImage from '../../assets/contoh1.png';
import { FaHome, FaChevronRight } from 'react-icons/fa';

const BHero = () => {
  return (
    <section className="relative h-[65vh] min-h-[500px] overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 will-change-transform">
        <img 
          src={platformImage} 
          alt="Platform Oil & Gas"
          className="w-full h-full object-cover scale-105 transition-transform duration-slower ease-smart"
        />
        {/* Gradient Overlay with softer blend */}
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/85 via-secondary-800/70 to-primary-900/60" />
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/10 to-transparent backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative section-container h-full flex items-center">
        <div className="max-w-3xl">
          {/* Breadcrumb with better affordance */}
          <nav 
            className="flex items-center gap-2 mb-6 text-sm animate-fade-in"
            aria-label="Breadcrumb"
          >
            <Link 
              to="/" 
              className="group flex items-center gap-15 text-white/80 hover:text-white transition-colors duration-base"
            >
              <FaHome className="w-4 h-4 transition-transform duration-base group-hover:scale-110" />
              <span className="font-medium">Home</span>
            </Link>
            <FaChevronRight className="w-3 h-3 text-white/40" />
            <span className="text-accent-300 font-semibold">Bisnis Kami</span>
          </nav>

          {/* Heading with staggered animation */}
          <h1 className="text-display-lg sm:text-display-xl lg:text-display-2xl text-white font-heading mb-6 animate-slide-up">
            Bisnis <span className="text-accent-300">Kami</span>
          </h1>

          {/* Description with better readability */}
          <p className="text-body-lg sm:text-body-xl text-white/90 leading-relaxed max-w-2xl animate-slide-up animate-stagger-1">
            Mengelola dan mengoptimalkan aset energi melalui kolaborasi strategis dengan 
            para pemangku kepentingan untuk pembangunan berkelanjutan.
          </p>

          {/* CTA Button (optional enhancement) */}
          <div className="mt-8 animate-slide-up animate-stagger-2">
            <a 
              href="#bisnis-flow" 
              className="btn btn-white group inline-flex items-center gap-2"
            >
              Jelajahi Lebih Lanjut
              <FaChevronRight className="w-4 h-4 transition-transform duration-base group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default BHero;