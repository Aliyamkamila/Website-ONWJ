import React from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../../assets/hero-bg.png';

const Hero = () => {
  return (
    <section 
      id="hero-section" 
      className="relative min-h-screen bg-gradient-to-r from-primary-600 to-primary-800"
    >
      {/* Background Image */}
      <div 
        className="fixed top-0 left-0 right-0 w-full h-screen z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-screen w-full">
        <div className="centered-content h-full flex flex-col justify-center">
          <div className="max-w-3xl space-y-grid-4">
            {/* Label */}
            <p className="font-heading text-label-xs sm:text-label-sm lg: text-label-md text-white/90 uppercase tracking-wider animate-fade-in">
              PT Migas Hulu Jabar ONWJ
            </p>
            
            {/* Heading */}
            <h1 className="font-heading text-display-sm sm:text-display-lg lg:text-display-xl text-white text-balance animate-slide-up">
              Energi Untuk<br />
              Kemakmuran Daerah
            </h1>
            
            {/* Description */}
            <p className="text-body-md sm:text-body-lg lg:text-body-xl text-white/90 max-w-2xl leading-relaxed animate-slide-up animate-stagger-1">
              Berkomitmen menghadirkan solusi energi berkelanjutan 
              untuk kemajuan Indonesia.
            </p>

            {/* CTA Button */}
            <div className="flex flex-wrap gap-grid-3 pt-grid-4 animate-slide-up animate-stagger-2">
              <Link to="/tentang" className="btn-white btn-lg">
                Pelajari Lebih Lanjut
              </Link>
              <Link 
                to="/kontak" 
                className="btn btn-lg bg-transparent text-white border-2 border-white hover:bg-white hover:text-primary-600"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ OPSI 1:  Animated Arrow Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer group">
        <span className="text-white/70 text-sm font-medium uppercase tracking-wider group-hover:text-white transition-colors">
          Scroll
        </span>
        <div className="flex flex-col gap-1 animate-bounce">
          <svg 
            className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <svg 
            className="w-6 h-6 text-white/70 group-hover:text-white transition-colors -mt-3" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Add Custom Animation */}
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;