import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import profileImage from '../../assets/rectangle.png';

const Profile = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          entry.target.classList.remove('opacity-0');

          if (imageRef.current) {
            imageRef.current.classList.add('translate-x-0', 'opacity-100');
            imageRef.current.classList.remove('-translate-x-full', 'opacity-0');
          }

          if (contentRef.current) {
            contentRef.current.classList.add('translate-x-0', 'opacity-100');
            contentRef.current.classList.remove('translate-x-full', 'opacity-0');
          }
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-20 bg-white" // Adjusted padding
    >
      <div className="section-container">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Image - Left Side */}
          <div 
            ref={imageRef}
            className="lg:w-[50%] h-[400px] md:h-[450px] opacity-0 -translate-x-full transition-smooth-slow"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl h-full">
              <img
                src={profileImage}
                alt="Offshore Platform"
                className="w-full h-full object-cover hover:scale-105 transition-smooth-slow"
              />
            </div>
          </div>

          {/* Text Content - Right Side */}
          <div 
            ref={contentRef}
            className="lg:w-[50%] space-y-6 opacity-0 translate-x-full transition-smooth-slow"
          >
            <div className="space-y-3">
              <p className="text-primary-600 text-sm font-semibold tracking-widest uppercase">
                Tentang Kami
              </p>
              <h2 className="text-display-md text-gray-900">
                Visi dan Misi Kami
              </h2>
            </div>
            
            <p className="text-gray-600 text-lg leading-relaxed">
              Kami berkomitmen untuk menjadi perusahaan energi terdepan yang mengutamakan keberlanjutan lingkungan dan pemberdayaan masyarakat lokal. Dengan teknologi terkini dan tim profesional, kami menciptakan dampak positif untuk generasi mendatang.
            </p>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Inovasi berkelanjutan dalam teknologi energi</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Komitmen terhadap lingkungan dan keamanan</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Pemberdayaan masyarakat dan ekonomi lokal</span>
              </li>
            </ul>

            <Link to="/tentang" className="group inline-flex items-center text-primary-600 hover:text-primary-700 transition-smooth font-semibold mt-4">
              <span className="text-lg">Pelajari Lebih Lanjut</span>
              <svg 
                className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6" 
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;