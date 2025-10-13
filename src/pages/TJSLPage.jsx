// src/pages/TJSLPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

import bannerImage from '../assets/hero-bg.png';
import programImage from '../assets/rectangle.png';
import logo from '../assets/logo.webp';

const sustainablePrograms = [
  {
    title: 'Social Impact Assessment and Community Involvement',
    description: 'Assessing social impacts and engaging communities for sustainable development.',
    date: '05 January 2025',
    link: '/programs/social-impact',
    image: programImage,
  },
  {
    title: 'Energi Berdikari Village',
    description: 'Empowering villages with independent energy solutions for long-term sustainability.',
    date: '12 January 2025',
    link: '/programs/energi-berdikari',
    image: programImage,
  },
  {
    title: 'Community Development Program',
    description: 'Holistic programs to foster community growth and environmental stewardship.',
    date: '19 January 2025',
    link: '/programs/community-development',
    image: programImage,
  },
];

const carouselImages = [
  { src: programImage, alt: 'Sustainable energy project in rural area' },
  { src: programImage, alt: 'Community engagement workshop' },
  { src: programImage, alt: 'Environmental conservation initiative' },
  { src: programImage, alt: 'Social impact assessment meeting' },
  { src: programImage, alt: 'Village development program overview' },
];

const TJSLPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Responsive items per view
  const getItemsPerView = () => {
    if (windowWidth < 768) return 1; // Mobile: 1 item
    if (windowWidth < 1024) return 2; // Tablet: 2 items
    return 3; // Desktop: 3 items
  };

  const itemsPerView = getItemsPerView();
  const totalSlides = Math.ceil(carouselImages.length / itemsPerView);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  const goToSlide = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(goNext, 3000); // 3 seconds
    return () => clearInterval(interval);
  }, [goNext, isAutoPlaying]);

  // Pause on hover
  useEffect(() => {
    const handleMouseEnter = () => setIsAutoPlaying(false);
    const handleMouseLeave = () => setIsAutoPlaying(true);
    const carousel = document.querySelector('.carousel-container');
    if (carousel) {
      carousel.addEventListener('mouseenter', handleMouseEnter);
      carousel.addEventListener('mouseleave', handleMouseLeave);
    }
    return () => {
      if (carousel) {
        carousel.removeEventListener('mouseenter', handleMouseEnter);
        carousel.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Handle resize for responsive
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const translateX = `-${activeIndex * (100 / itemsPerView)}%`;

  return (
    <div className="bg-white min-h-screen">
      {/* Banner Section - Improved height and overlay */}
      <div className="relative h-screen w-full overflow-hidden">
        <img
          src={bannerImage}
          alt="TJSL Banner: Scenic view of sustainable community projects"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10">
          <Link to="/">
            <img src={logo} alt="PHE Company Logo" className="h-10 w-auto" />
          </Link>
        </div>
        <div className="absolute bottom-8 left-0 right-0 container mx-auto px-4 md:px-8 lg:px-16 text-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold relative inline-block leading-tight">
            Tanggung Jawab Sosial Dan Lingkungan
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </h1>
          <p className="text-white/90 text-lg md:text-xl mt-4 max-w-2xl mx-auto opacity-0 animate-fade-in">
            Committed to sustainability through ESG principles.
          </p>
        </div>
      </div>

      {/* Intro Section - Added fade-in animation */}
      <section className="py-16 md:py-24 animate-fade-in">
        <div className="container mx-auto px-4 md:px-8 lg:px-16 grid lg:grid-cols-12 gap-8 items-start lg:items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <p className="text-blue-600 font-semibold mb-2 uppercase tracking-wide">Program Kami</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Tanggung Jawab Sosial Dan Lingkungan
            </h2>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              In line with core values and PHE ethics to preserve corporate business sustainability, PHE implements a comprehensive sustainability policy as one of the main Company responsibilities. This policy provides guidelines on creating better Company activities and strategies, particularly in Environmental, Social, and Governance (ESG) frameworks and a sustainable economy.
            </p>
          </div>
        </div>
      </section>

      {/* Image Carousel Section - Responsive & Auto-play */}
      <section className="py-16 md:pb-24 relative">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">Our Initiatives in Action</h3>
          <div className="carousel-container relative overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(${translateX})` }}
              role="region"
              aria-label="Image carousel"
            >
              {carouselImages.map((img, index) => (
                <div key={index} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-64 md:h-80 object-cover rounded-lg"
                    loading="lazy"
                    onError={(e) => { e.target.src = '/fallback-image.jpg'; }} // Fallback image
                  />
                </div>
              ))}
            </div>
            <button
              onClick={goPrev}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all duration-200 z-10"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goNext}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all duration-200 z-10"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 pt-4">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    activeIndex === index ? 'bg-blue-600 scale-110' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Program Berkelanjutan Section - Added descriptions & better cards */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Program Berkelanjutan</h2>
            <Link
              to="/all-programs"
              className="font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
            >
              See All <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {sustainablePrograms.map((prog, index) => (
              <article key={index} className="bg-white rounded-xl shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in">
                <img
                  src={prog.image}
                  alt={`${prog.title} program image`}
                  className="w-full h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-3 text-gray-800 line-clamp-2">{prog.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{prog.description}</p>
                  <div className="flex justify-between items-center">
                    <time className="text-gray-500 text-sm" dateTime={prog.date}>
                      {prog.date}
                    </time>
                    <Link
                      to={prog.link}
                      className="text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-[-10px] group-hover:translate-x-0"
                    >
                      Learn More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default TJSLPage;