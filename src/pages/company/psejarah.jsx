import React, { useState, useEffect, useRef } from 'react';
import contoh1 from '../../assets/contoh1.png';
import contoh2 from '../../assets/contoh2.png';
import contoh3 from '../../assets/contoh3.png';
import contoh4 from '../../assets/contoh4.png';

const TimelinePoint = ({ year, isActive, progress, onClick }) => (
  <div className="flex flex-col items-center">
    <button 
      onClick={onClick}
      className={`relative transition-all duration-500 ease-out group ${
        isActive ? 'text-blue-600 scale-110' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <div className="flex flex-col items-center">
        {/* Timeline dot and line container */}
        <div className="relative">
          {/* Horizontal line */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-24 h-0.5 bg-gray-300" />
          
          {/* Progress line */}
          {isActive && (
            <div className="absolute left-2 top-1/2 -translate-y-1/2 h-0.5 bg-blue-600 transition-all ease-linear"
              style={{ 
                width: `${progress}%`,
                maxWidth: '96px', // same as w-24
                transitionDuration: '10000ms'
              }}
            />
          )}
          
          {/* Dot */}
          <div className={`relative z-10 w-4 h-4 rounded-full transition-all duration-500 ease-out ${
            isActive ? 'bg-blue-600' : 'bg-gray-300'
          }`} />
          
          {/* Moving dot for active state */}
          {isActive && (
            <div 
              className="absolute z-20 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-600 transition-all ease-linear"
              style={{ 
                left: `${progress}%`,
                maxLeft: '96px', // same as w-24
                transitionDuration: '10000ms'
              }}
            />
          )}
        </div>
      </div>
    </button>
    {/* Year label */}
    <span className="mt-4 text-sm font-medium whitespace-nowrap text-gray-600">
      {year}
    </span>
  </div>
);

const PSejarah = () => {
  const [activeYear, setActiveYear] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timelineRef = useRef(null);
  const progressInterval = useRef(null);
  const autoSlideTimer = useRef(null);

  const images = [contoh1, contoh2, contoh3, contoh4];

  const timelineData = Array.from({ length: 13 }, (_, index) => ({
    year: `${2010 + index}`,
    title: `Fase ${index + 1}`,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
    image: images[index % images.length]
  }));

  const startProgress = () => {
    setProgress(0);
    if (progressInterval.current) clearInterval(progressInterval.current);
    
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval.current);
          return 0;
        }
        return prev + 1;
      });
    }, 100);
  };

  const startAutoSlide = () => {
    if (autoSlideTimer.current) clearTimeout(autoSlideTimer.current);
    startProgress();
    
    autoSlideTimer.current = setTimeout(() => {
      if (!isPaused) {
        handleYearClick((activeYear + 1) % timelineData.length);
      }
    }, 10000);
  };

  const handleYearClick = (index) => {
    if (isAnimating || index === activeYear) return;
    setIsAnimating(true);
    setActiveYear(index);
    startProgress();
    
    setTimeout(() => {
      setIsAnimating(false);
      startAutoSlide();
    }, 500);
  };

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (autoSlideTimer.current) clearTimeout(autoSlideTimer.current);
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [activeYear, isPaused]);

  useEffect(() => {
    if (isPaused) {
      if (progressInterval.current) clearInterval(progressInterval.current);
    } else {
      startProgress();
    }
  }, [isPaused]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timelineRef.current.classList.add('opacity-100', 'translate-y-0');
          timelineRef.current.classList.remove('opacity-0', 'translate-y-10');
        }
      },
      { threshold: 0.1 }
    );

    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      className="relative py-20 overflow-hidden bg-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-8 lg:px-16">
        <div ref={timelineRef} className="opacity-0 translate-y-10 transition-all duration-500 ease-out">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            Sejarah Perusahaan
          </h2>

          {/* Timeline Navigation */}
            <div className="mb-16">
            <div className="flex justify-between items-center px-4 max-w-6xl mx-auto">
                {timelineData.map((item, index) => (
                <TimelinePoint
                    key={index}
                    year={item.year}
                    isActive={index === activeYear}
                    progress={index === activeYear ? progress : 0}
                    onClick={() => handleYearClick(index)}
                />
                ))}
            </div>
            </div>

          {/* Timeline Content */}
          <div className="relative h-[500px]">
            {timelineData.map((item, index) => (
              <div
                key={index}
                className={`absolute inset-0 w-full transition-all duration-500 ease-out flex items-center
                  ${index === activeYear ? 'opacity-100 translate-x-0' : 
                    index < activeYear ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full'}
                `}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h3 className="text-3xl font-bold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.content}</p>
                  </div>

                  <div className="relative">
                    <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transform transition-all duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-100 rounded-full opacity-50" />
                    <div className="absolute -left-4 -top-4 w-16 h-16 bg-yellow-100 rounded-full opacity-50" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-12">
            <button
              onClick={() => handleYearClick((activeYear - 1 + timelineData.length) % timelineData.length)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => handleYearClick((activeYear + 1) % timelineData.length)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PSejarah;