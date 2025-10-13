import React, { useEffect, useRef } from 'react';
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
        } else {
          entry.target.classList.remove('opacity-100');
          entry.target.classList.add('opacity-0');

          if (imageRef.current) {
            imageRef.current.classList.remove('translate-x-0', 'opacity-100');
            imageRef.current.classList.add('-translate-x-full', 'opacity-0');
          }

          if (contentRef.current) {
            contentRef.current.classList.remove('translate-x-0', 'opacity-100');
            contentRef.current.classList.add('translate-x-full', 'opacity-0');
          }
        }
      },
      { threshold: 0.1 }
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
      className="container mx-auto px-8 lg:px-16 h-[75vh] flex items-center opacity-0 transition-opacity duration-500 ease-out"
    >
      <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-12">
        {/* Image - Left Side */}
        <div 
          ref={imageRef}
          className="lg:w-[45%] h-[65vh] order-2 lg:order-1 -translate-x-full opacity-0 transition-all duration-500 ease-out"
        >
          <div className="rounded-[57px] overflow-hidden shadow-xl h-full">
            <img
              src={profileImage}
              alt="Offshore Platform"
              className="w-full h-full object-cover" // Menggunakan object-cover
            />
          </div>
        </div>

        {/* Text Content - Right Side */}
        <div 
          ref={contentRef}
          className="lg:w-[45%] space-y-8 order-1 lg:order-2 translate-x-full opacity-0 transition-all duration-500 ease-out"
        >
          <div className="space-y-3">
            <h2 className="text-gray-600 text-xl font-medium tracking-wide">
              Profil Kami
            </h2>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Lorem ipsum
            </h1>
          </div>
          
          <p className="text-gray-600 text-lg leading-relaxed">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
            when an unknown printer took a galley of type and scrambled it to make a type 
            specimen book. It has survived not only five centuries, but also the leap into 
            electronic typesetting, remaining essentially unchanged.
          </p>

          <button className="group inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <span className="text-lg font-medium">Read More</span>
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
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profile;