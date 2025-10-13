import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Import background images
import bisnisBackground from '../assets/contoh1.png';
import monitoringBackground from '../assets/contoh2.png';
import lokasiBackground from '../assets/contoh3.png';
import tjslBackground from '../assets/contoh4.png';

// Import card images
import bisnisCard from '../assets/contoh4.png';
import monitoringCard from '../assets/contoh3.png';
import lokasiCard from '../assets/contoh2.png';
import tjslCard from '../assets/contoh1.png';

// Data Slide dengan background dan card image yang berbeda
const slidesData = [
  {
    backgroundImage: bisnisBackground,
    cardImage: bisnisCard,
    title: "Bisnis",
    description:
      "Lorem ipsum dolor sit amet consectetur. Convallis tempus vitae nulla in consectetur sed feugiat nisi viverra eros vitae aliquet pulvinar.",
    link: "#",
    themeColor: "from-blue-600/80 to-blue-900/90", // gradient untuk overlay
  },
  {
    backgroundImage: monitoringBackground,
    cardImage: monitoringCard,
    title: "Monitoring",
    description:
      "Eu tellus metus pellentesque proin elit nibh viverra. Convallis tempus vitae nulla in consectetur sed feugiat nisi viverra.",
    link: "#",
    themeColor: "from-green-600/80 to-green-900/90",
  },
  {
    backgroundImage: lokasiBackground,
    cardImage: lokasiCard,
    title: "Lokasi",
    description:
      "Lorem ipsum dolor sit amet consectetur. Convallis tempus vitae nulla in consectetur sed feugiat nisi viverra eros vitae aliquet pulvinar.",
    link: "#",
    themeColor: "from-purple-600/80 to-purple-900/90",
  },
  {
    backgroundImage: tjslBackground,
    cardImage: tjslCard,
    title: "TJSL",
    description:
      "Eu tellus metus pellentesque proin elit nibh viverra. Convallis tempus vitae nulla in consectetur sed feugiat nisi viverra.",
    link: "/tjsl",
    themeColor: "from-red-600/80 to-red-900/90",
  },
];

const Bisnis = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState('next');
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const goToSlide = (index) => {
    setDirection(index > activeIndex ? 'next' : 'prev');
    setActiveIndex(index);
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
    resetTimeout();
    timeoutRef.current = setTimeout(nextSlide, 5000);
    return () => resetTimeout();
  }, [activeIndex]);

  const prevIndex = activeIndex === 0 ? slidesData.length - 1 : activeIndex - 1;
  const nextIndex = (activeIndex + 1) % slidesData.length;

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background dengan transisi */}
      <div className="absolute inset-0 w-full h-full">
        {slidesData.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
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

      {/* Konten */}
      <div className="relative z-10 container mx-auto px-8 lg:px-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Kiri: Teks */}
          <div className="text-white space-y-6">
            <h1 
              className="text-5xl md:text-7xl font-bold leading-tight opacity-0 animate-fadeIn"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
            >
              {slidesData[activeIndex].title}
            </h1>
            <p className="text-lg text-gray-100 max-w-lg opacity-0 animate-fadeIn animation-delay-200">
              {slidesData[activeIndex].description}
            </p>

            <Link
              to={slidesData[activeIndex].link}
              className="group inline-flex items-center space-x-2 text-white font-medium transition-all duration-300 opacity-0 animate-fadeIn animation-delay-400"
            >
              <span className="border-b-2 border-transparent group-hover:border-white pb-1 transition-all">
                Explore Now
              </span>
              <span className="transform group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>

          {/* Kanan: Card Carousel */}
          <div className="relative h-[60vh] flex items-center justify-center perspective">
            {/* Previous Card */}
            <div
              className={`absolute w-3/4 max-w-sm h-full transform 
                ${direction === 'next' ? '-translate-x-full' : 'translate-x-full'} 
                scale-75 opacity-30 z-0 transition-all duration-700 card-shadow`}
            >
              <img
                src={slidesData[prevIndex].cardImage}
                alt={slidesData[prevIndex].title}
                className="w-full h-full object-cover rounded-3xl"
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-transparent to-black/50" />
            </div>

            {/* Active Card */}
            <div
              className="absolute w-3/4 max-w-sm h-full transform scale-100 z-10 
                transition-all duration-700 ease-out card-shadow hover:scale-105"
            >
              <img
                src={slidesData[activeIndex].cardImage}
                alt={slidesData[activeIndex].title}
                className="w-full h-full object-cover rounded-3xl"
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-transparent to-black/30" />
            </div>

            {/* Next Card */}
            <div
              className={`absolute w-3/4 max-w-sm h-full transform 
                ${direction === 'next' ? 'translate-x-full' : '-translate-x-full'} 
                scale-75 opacity-30 z-0 transition-all duration-700 card-shadow`}
            >
              <img
                src={slidesData[nextIndex].cardImage}
                alt={slidesData[nextIndex].title}
                className="w-full h-full object-cover rounded-3xl"
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-transparent to-black/50" />
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-6 items-center">
          <button
            onClick={prevSlide}
            className="text-white/75 hover:text-white transition-colors p-2 hover:scale-110 transform duration-200"
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
                className={`w-3 h-3 rounded-full transition-all duration-300 
                  ${activeIndex === index 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="text-white/75 hover:text-white transition-colors p-2 hover:scale-110 transform duration-200"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .perspective {
          perspective: 1000px;
        }
        
        .card-shadow {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </section>
  );
};

export default Bisnis;