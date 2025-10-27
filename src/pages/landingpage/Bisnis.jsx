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
    title: "Bisnis",
    description: "Kami mengembangkan solusi bisnis energi yang berkelanjutan dan menguntungkan dengan fokus pada inovasi teknologi.",
    link: "/bisnis",
    themeColor: "from-primary-600/80 to-primary-700/90",
  },
  {
    backgroundImage: monitoringBackground,
    cardImage: monitoringCard,
    title: "Monitoring",
    description: "Sistem monitoring canggih untuk mengoptimalkan operasional dan memastikan keselamatan kerja.",
    link: "/bisnis",
    themeColor: "from-secondary-500/80 to-secondary-600/90",
  },
  {
    backgroundImage: lokasiBackground,
    cardImage: lokasiCard,
    title: "Lokasi",
    description: "Eksplorasi dan pengembangan lokasi strategis untuk memaksimalkan potensi energi.",
    link: "/bisnis",
    themeColor: "from-primary-500/80 to-primary-600/90",
  },
  {
    backgroundImage: tjslBackground,
    cardImage: tjslCard,
    title: "TJSL",
    description: "Program Tanggung Jawab Sosial dan Lingkungan untuk pemberdayaan masyarakat.",
    link: "/tjsl",
    themeColor: "from-secondary-400/80 to-secondary-500/90",
  },
];

const Bisnis = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState('next');
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const goToSlide = (index) => {
    setDirection(index > activeIndex ? 'next' : 'prev');
    setActiveIndex(index);
    setIsAutoPlay(false);
  };

  const nextSlide = () => {
    setDirection('next');
    setActiveIndex((prevIndex) =>
      prevIndex === slidesData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setDirection('prev');
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? slidesData.length - 1 : prevIndex - 1
    );
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
    <section className="relative min-h-[70vh] w-full flex items-center justify-center overflow-hidden bg-gray-50"> {/* Adjusted height */}
      {/* Background dengan transisi smooth */}
      <div className="absolute inset-0 w-full h-full">
        {slidesData.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-smooth ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${slide.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-b ${slide.themeColor}`} />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 section-container w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Kiri: Teks */}
          <div className="text-white space-y-6">
            <div 
              className={`transition-all duration-700 ${
                activeIndex !== undefined ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                style={{ textShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
              >
                {slidesData[activeIndex].title}
              </h1>
            </div>

            <p className={`text-lg text-white/90 max-w-lg transition-all duration-700 delay-100 ${
                activeIndex !== undefined ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {slidesData[activeIndex].description}
            </p>

            <Link
              to={slidesData[activeIndex].link}
              className={`group inline-flex items-center gap-3 px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg transition-smooth hover:bg-primary-50 hover:shadow-lg transition-all duration-700 delay-200 ${
                activeIndex !== undefined ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span>Explore Now</span>
              <svg 
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Kanan: Card Carousel */}
          <div className="relative h-[50vh] md:h-[60vh] flex items-center justify-center perspective">
            {/* Previous Card */}
            <div
              className={`absolute w-3/4 max-w-xs h-full transform transition-all duration-800 ease-smooth opacity-30 scale-75 z-0 shadow-2xl`}
              style={{
                transform: `${direction === 'next' ? 'translateX(-120%)' : 'translateX(120%)'} scale(0.75)`,
              }}
            >
              <img
                src={slidesData[prevIndex].cardImage}
                alt={slidesData[prevIndex].title}
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent to-black/40" />
            </div>

            {/* Active Card */}
            <div
              className="absolute w-3/4 max-w-xs h-full transform scale-100 z-10 transition-all duration-800 ease-smooth shadow-2xl hover:shadow-3xl hover:scale-105"
            >
              <img
                src={slidesData[activeIndex].cardImage}
                alt={slidesData[activeIndex].title}
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent to-black/30" />
            </div>

            {/* Next Card */}
            <div
              className={`absolute w-3/4 max-w-xs h-full transform transition-all duration-800 ease-smooth opacity-30 scale-75 z-0 shadow-2xl`}
              style={{
                transform: `${direction === 'next' ? 'translateX(120%)' : 'translateX(-120%)'} scale(0.75)`,
              }}
            >
              <img
                src={slidesData[nextIndex].cardImage}
                alt={slidesData[nextIndex].title}
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-transparent to-black/40" />
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
            className="text-white/75 hover:text-white transition-smooth p-2 hover:scale-110 transform duration-200"
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
                className={`h-3 rounded-full transition-all duration-300 ${
                  activeIndex === index 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 w-3 hover:bg-white/75'
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
            className="text-white/75 hover:text-white transition-smooth p-2 hover:scale-110 transform duration-200"
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