import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import bisnisBackground from '../../assets/contoh1.png';
import monitoringBackground from '../../assets/contoh2.png';
import lokasiBackground from '../../assets/contoh3.png';
import tjslBackground from '../../assets/contoh4.png';

import bisnisCard from '../../assets/contoh4.png';
import monitoringCard from '../../assets/contoh3.png';
import lokasiCard from '../../assets/contoh2.png';
import tjslCard from '../../assets/contoh1.png';

const slidesData = [
  {
    backgroundImage: bisnisBackground,
    cardImage: bisnisCard,
    title: "Eksplorasi & Produksi",
    description:
      "Dari hulu ke hilir — menggali potensi energi dan menghadirkan nilai berkelanjutan untuk daerah.",
    link: "/eksplorasi-produksi",
    themeColor: "from-primary-600/80 to-primary-700/90",
  },
  {
    backgroundImage: monitoringBackground,
    cardImage: monitoringCard,
    title: "Program TJSL",
    description:
      "Komitmen kami terhadap tanggung jawab sosial dan lingkungan demi masyarakat yang lebih mandiri.",
    link: "/tjsl",
    themeColor: "from-secondary-500/80 to-secondary-600/90",
  },
  {
    backgroundImage: lokasiBackground,
    cardImage: lokasiCard,
    title: "Wilayah Kerja",
    description:
      "Area operasi kami di berbagai titik strategis yang mendukung ketahanan energi nasional.",
    link: "/wilayah-kerja",
    themeColor: "from-primary-500/80 to-primary-600/90",
  },
  {
    backgroundImage: tjslBackground,
    cardImage: tjslCard,
    title: "UMKM Binaan",
    description:
      "Profil dan perjalanan para pelaku usaha yang tumbuh bersama program pemberdayaan kami.",
    link: "/umkm-binaan",
    themeColor: "from-secondary-400/80 to-secondary-500/90",
  },
];

const Bisnis = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState('next');
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === activeIndex) return;
    
    setIsTransitioning(true);
    setDirection(index > activeIndex ? 'next' : 'prev');
    setActiveIndex(index);
    setIsAutoPlay(false);
    
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setDirection('next');
    setActiveIndex((prevIndex) =>
      prevIndex === slidesData.length - 1 ? 0 : prevIndex + 1
    );
    
    setTimeout(() => setIsTransitioning(false), 800);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setDirection('prev');
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? slidesData.length - 1 : prevIndex - 1
    );
    
    setTimeout(() => setIsTransitioning(false), 800);
  };

  useEffect(() => {
    if (!isAutoPlay) {
      const timer = setTimeout(() => setIsAutoPlay(true), 10000);
      return () => clearTimeout(timer);
    }

    resetTimeout();
    timeoutRef.current = setTimeout(nextSlide, 6000);
    return () => resetTimeout();
  }, [activeIndex, isAutoPlay]);

  const prevIndex = activeIndex === 0 ? slidesData.length - 1 : activeIndex - 1;
  const nextIndex = (activeIndex + 1) % slidesData.length;

  return (
    <section className="relative min-h-[70vh] w-full flex items-center justify-center overflow-hidden bg-gray-50">
      {/* Background dengan transisi smooth */}
      <div className="absolute inset-0 w-full h-full">
        {slidesData.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[1200ms] ease-out ${
              index === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            style={{
              backgroundImage: `url(${slide.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-b ${slide.themeColor} transition-opacity duration-[800ms] ease-out`} />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 section-container w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Kiri: Teks */}
          <div className="text-white space-y-6">
            <div 
              key={`title-${activeIndex}`}
              className="animate-slide-in-content"
              style={{
                animation: 'slideInContent 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
            >
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                style={{ textShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
              >
                {slidesData[activeIndex].title}
              </h1>
            </div>

            <p 
              key={`desc-${activeIndex}`}
              className="text-lg text-white/90 max-w-lg"
              style={{
                animation: 'slideInContent 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards 100ms',
              }}
            >
              {slidesData[activeIndex].description}
            </p>

            <div
              key={`button-${activeIndex}`}
              style={{
                animation: 'slideInContent 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards 200ms',
              }}
            >
              <Link
                to={slidesData[activeIndex].link}
                className="group inline-flex items-center gap-3 px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 hover:shadow-xl transition-all duration-300 ease-out"
              >
                <span>Explore Now</span>
                <svg 
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300 ease-out" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Kanan: Card Carousel dengan Smart Animate */}
          <div className="relative h-[50vh] md:h-[60vh] flex items-center justify-center" style={{ perspective: '1500px' }}>
            {/* Previous Card */}
            <div
              key={`prev-${prevIndex}`}
              className="absolute w-3/4 max-w-xs h-full rounded-2xl overflow-hidden shadow-2xl"
              style={{
                transform: direction === 'next' 
                  ? 'translateX(-120%) translateZ(-200px) scale(0.75) rotateY(15deg)' 
                  : 'translateX(120%) translateZ(-200px) scale(0.75) rotateY(-15deg)',
                opacity: 0.3,
                transition: 'all 800ms cubic-bezier(0.16, 1, 0.3, 1)',
                transformStyle: 'preserve-3d',
              }}
            >
              <img
                src={slidesData[prevIndex].cardImage}
                alt={slidesData[prevIndex].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 transition-opacity duration-800 ease-out" />
            </div>

            {/* Active Card */}
            <div
              key={`active-${activeIndex}`}
              className="absolute w-3/4 max-w-xs h-full rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
              style={{
                transform: 'translateX(0) translateZ(0) scale(1) rotateY(0deg)',
                opacity: 1,
                zIndex: 10,
                transition: 'all 800ms cubic-bezier(0.16, 1, 0.3, 1)',
                transformStyle: 'preserve-3d',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(0) translateZ(20px) scale(1.05) rotateY(0deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0) translateZ(0) scale(1) rotateY(0deg)';
              }}
            >
              <img
                src={slidesData[activeIndex].cardImage}
                alt={slidesData[activeIndex].title}
                className="w-full h-full object-cover transition-transform duration-800 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 group-hover:to-black/30 transition-all duration-800 ease-out" />
            </div>

            {/* Next Card */}
            <div
              key={`next-${nextIndex}`}
              className="absolute w-3/4 max-w-xs h-full rounded-2xl overflow-hidden shadow-2xl"
              style={{
                transform: direction === 'next' 
                  ? 'translateX(120%) translateZ(-200px) scale(0.75) rotateY(-15deg)' 
                  : 'translateX(-120%) translateZ(-200px) scale(0.75) rotateY(15deg)',
                opacity: 0.3,
                transition: 'all 800ms cubic-bezier(0.16, 1, 0.3, 1)',
                transformStyle: 'preserve-3d',
              }}
            >
              <img
                src={slidesData[nextIndex].cardImage}
                alt={slidesData[nextIndex].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 transition-opacity duration-800 ease-out" />
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-6 z-20">
          <button
            onClick={() => {
              prevSlide();
              setIsAutoPlay(false);
            }}
            disabled={isTransitioning}
            className="text-white/75 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed p-2 hover:scale-110 transform transition-all duration-300 ease-out hover:bg-white/10 rounded-full"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Dots navigation */}
          <div className="flex space-x-3">
            {slidesData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                className={`h-3 rounded-full transition-all duration-800 ease-out disabled:cursor-not-allowed ${
                  activeIndex === index 
                    ? 'bg-white w-8 shadow-lg' 
                    : 'bg-white/50 w-3 hover:bg-white/75 hover:w-4'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              nextSlide();
              setIsAutoPlay(false);
            }}
            disabled={isTransitioning}
            className="text-white/75 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed p-2 hover:scale-110 transform transition-all duration-300 ease-out hover:bg-white/10 rounded-full"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Bisnis;