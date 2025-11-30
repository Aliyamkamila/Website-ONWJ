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
            {/* Label - 10px → 11px → 12px */}
            <p className="font-heading text-label-xs sm:text-label-sm lg:text-label-md text-white/90 uppercase tracking-wider animate-fade-in">
              PT Migas Hulu Jabar ONWJ
            </p>
            
            {/* Heading - 20px → 30px → 36px (COMPACT!) */}
            <h1 className="font-heading text-display-sm sm:text-display-lg lg:text-display-xl text-white text-balance animate-slide-up">
              Energi Untuk<br />
              Kemakmuran Daerah
            </h1>
            
            {/* Description - 14px → 15px → 16px */}
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

      {/* Scroll Indicator */}
      <div className="absolute bottom-grid-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <div className="w-5 h-9 rounded-full border-2 border-white/50 flex justify-center pt-1.5">
          <div className="w-1 h-2.5 bg-white/80 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;