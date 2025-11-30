import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import contoh1 from '../../assets/contoh1.png';
import contoh2 from '../../assets/contoh2.png';
import contoh3 from '../../assets/contoh3.png';
import contoh4 from '../../assets/contoh4.png';

/**
 * Constants
 */
const AUTO_INTERVAL = 6000; // 6 detik per slide
const FADE_DURATION = 500;

/**
 * PSejarah Component - COMPLETE REDESIGN
 * 
 * Features:
 * - Auto-play dengan progress bar visual
 * - Manual navigation (click dots, arrows, timeline)
 * - Smooth fade transitions
 * - Pause on hover/interaction
 */
const PSejarah = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  
  const progressRef = useRef(null);
  const autoPlayRef = useRef(null);
  
  const images = useMemo(() => [contoh1, contoh2, contoh3, contoh4], []);
  
  const timelineData = useMemo(() => 
    Array.from({ length: 13 }, (_, index) => ({
      year: 2010 + index,
      title: `Milestone ${2010 + index}`,
      content: `Tahun ${2010 + index} menandai pencapaian penting dalam perjalanan kami.Berbagai inisiatif strategis dilaksanakan untuk memperkuat posisi perusahaan dalam industri energi nasional.`,
      image: images[index % images.length]
    })),
    [images]
  );

  // Reset progress dan start timer
  const startProgress = useCallback(() => {
    setProgress(0);
    
    if (progressRef.current) {
      cancelAnimationFrame(progressRef.current);
    }
    
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / AUTO_INTERVAL) * 100, 100);
      
      setProgress(newProgress);
      
      if (newProgress < 100 && isAutoPlaying) {
        progressRef.current = requestAnimationFrame(animate);
      }
    };
    
    if (isAutoPlaying) {
      progressRef.current = requestAnimationFrame(animate);
    }
  }, [isAutoPlaying]);

  // Navigate to index dengan fade effect
  const goToSlide = useCallback((index) => {
    if (isFading || index === activeIndex) return;
    
    setIsFading(true);
    
    setTimeout(() => {
      setActiveIndex(index);
      setIsFading(false);
      startProgress();
    }, FADE_DURATION / 2);
  }, [activeIndex, isFading, startProgress]);

  // Auto-play logic
  useEffect(() => {
    if (! isAutoPlaying) {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
      return;
    }

    startProgress();
    
    autoPlayRef.current = setTimeout(() => {
      const nextIndex = (activeIndex + 1) % timelineData.length;
      goToSlide(nextIndex);
    }, AUTO_INTERVAL);

    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
    };
  }, [activeIndex, isAutoPlaying, timelineData.length, goToSlide, startProgress]);

  // Pause on interaction
  const handleInteractionStart = () => setIsAutoPlaying(false);
  const handleInteractionEnd = () => setIsAutoPlaying(true);

  const goToPrev = () => {
    const prevIndex = activeIndex === 0 ? timelineData.length - 1 : activeIndex - 1;
    goToSlide(prevIndex);
  };

  const goToNext = () => {
    const nextIndex = (activeIndex + 1) % timelineData.length;
    goToSlide(nextIndex);
  };

  const currentItem = timelineData[activeIndex];

  return (
    <section 
      id="sejarah"
      className="py-grid-12 lg:py-grid-16 bg-gradient-to-b from-secondary-900 to-secondary-800"
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      aria-labelledby="sejarah-title"
    >
      <div className="section-container">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-grid-4 mb-grid-8 lg:mb-grid-10">
          <div>
            <span className="text-label-sm text-primary-400 uppercase tracking-wider">
              Perjalanan Kami
            </span>
            <h2 
              id="sejarah-title" 
              className="text-display-lg lg:text-display-xl font-bold text-white mt-grid-2"
            >
              Sejarah Perusahaan
            </h2>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center gap-grid-4">
            {/* Arrows */}
            <div className="flex items-center gap-grid-2">
              <button
                onClick={goToPrev}
                className="w-10 h-10 rounded-full border border-secondary-600
                           flex items-center justify-center
                           text-secondary-400 hover:text-white hover:border-white
                           transition-colors duration-base
                           focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Sebelumnya"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <span className="text-body-sm text-secondary-400 min-w-[50px] text-center tabular-nums">
                {activeIndex + 1} / {timelineData.length}
              </span>
              
              <button
                onClick={goToNext}
                className="w-10 h-10 rounded-full border border-secondary-600
                           flex items-center justify-center
                           text-secondary-400 hover:text-white hover:border-white
                           transition-colors duration-base
                           focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Selanjutnya"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Auto-play indicator */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`
                w-10 h-10 rounded-full border
                flex items-center justify-center
                transition-colors duration-base
                focus:outline-none focus:ring-2 focus:ring-primary-500
                ${isAutoPlaying 
                  ? 'border-primary-500 text-primary-400 bg-primary-500/10' 
                  : 'border-secondary-600 text-secondary-400'
                }
              `}
              aria-label={isAutoPlaying ?  'Pause autoplay' : 'Play autoplay'}
            >
              {isAutoPlaying ?  (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Timeline Bar */}
        <div className="relative mb-grid-10 overflow-x-auto custom-scrollbar pb-grid-2">
          {/* Progress Line Background */}
          <div className="absolute top-[7px] left-0 right-0 h-0.5 bg-secondary-700" aria-hidden="true" />
          
          {/* Active Progress Line */}
          <div 
            className="absolute top-[7px] left-0 h-0.5 bg-primary-500 transition-all duration-300"
            style={{ width: `${(activeIndex / (timelineData.length - 1)) * 100}%` }}
            aria-hidden="true"
          />
          
          {/* Timeline Points */}
          <div className="relative flex justify-between min-w-[800px]">
            {timelineData.map((item, index) => (
              <button
                key={item.year}
                onClick={() => goToSlide(index)}
                className={`
                  flex flex-col items-center
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-secondary-900
                  rounded transition-all duration-base
                  group
                `}
                aria-label={`Tahun ${item.year}`}
                aria-pressed={index === activeIndex}
              >
                {/* Dot */}
                <div 
                  className={`
                    w-3.5 h-3.5 rounded-full transition-all duration-base
                    ${index === activeIndex 
                      ? 'bg-primary-500 ring-4 ring-primary-500/30 scale-125' 
                      : index < activeIndex 
                        ? 'bg-primary-600' 
                        : 'bg-secondary-600 group-hover:bg-secondary-500'
                    }
                  `}
                />
                
                {/* Year Label */}
                <span 
                  className={`
                    mt-grid-3 text-body-xs font-medium transition-colors duration-base
                    ${index === activeIndex 
                      ? 'text-primary-400' 
                      : 'text-secondary-500 group-hover:text-secondary-400'
                    }
                  `}
                >
                  {item.year}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div 
          className={`
            grid lg:grid-cols-2 gap-grid-8 lg:gap-grid-12 items-center
            transition-opacity duration-300
            ${isFading ? 'opacity-0' : 'opacity-100'}
          `}
        >
          {/* Text */}
          <div className="order-2 lg:order-1">
            <div className="inline-block px-grid-3 py-grid-1 bg-primary-500/20 rounded-full mb-grid-4">
              <span className="text-label-sm text-primary-400 uppercase tracking-wider">
                Tahun {currentItem.year}
              </span>
            </div>
            
            <h3 className="text-display-md lg:text-display-lg font-bold text-white mb-grid-4">
              {currentItem.title}
            </h3>
            
            <p className="text-body-lg text-secondary-300 leading-relaxed mb-grid-6">
              {currentItem.content}
            </p>

            {/* Progress Bar - Visual auto-play indicator */}
            {isAutoPlaying && (
              <div className="w-full max-w-xs h-1 bg-secondary-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 transition-none"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {/* Quick Navigation Dots */}
            <div className="flex items-center gap-grid-2 mt-grid-6">
              {timelineData.slice(
                Math.max(0, activeIndex - 2),
                Math.min(timelineData.length, activeIndex + 3)
              ).map((item, idx) => {
                const realIndex = Math.max(0, activeIndex - 2) + idx;
                return (
                  <button
                    key={realIndex}
                    onClick={() => goToSlide(realIndex)}
                    className={`
                      h-2 rounded-full transition-all duration-base
                      ${realIndex === activeIndex 
                        ? 'w-8 bg-primary-500' 
                        : 'w-2 bg-secondary-600 hover:bg-secondary-500'
                      }
                    `}
                    aria-label={`Tahun ${item.year}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={currentItem.image}
                alt={`${currentItem.title}`}
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
              />
              
              {/* Year Badge on Image */}
              <div 
                className="absolute top-4 left-4 px-grid-4 py-grid-2 
                           bg-white/95 backdrop-blur-sm rounded-lg shadow-lg"
              >
                <span className="text-display-sm font-bold text-secondary-900">
                  {currentItem.year}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PSejarah;