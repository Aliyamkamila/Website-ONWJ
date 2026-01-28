import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import heroService from '../../services/heroService';

// Helper function to get full media URL
const getMediaUrl = (src) => {
  if (!src) return '';
  // Return URLs as is (frontend-only mode)
  return src;
};

const Hero = () => {
  const [carouselItems, setCarouselItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const currentItem = carouselItems[currentIndex];
  const isVideo = currentItem?.type === 'video';

  // Get duration for current item
  const getDuration = () => {
    if (!currentItem) return 5000;
    if (isVideo && videoRef.current) {
      return videoRef.current.duration * 1000;
    }
    return currentItem.duration || 5000;
  };

  // Navigate to specific slide
  const goToSlide = (index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setProgress(0);
      startTimeRef.current = Date.now();
      setIsTransitioning(false);
      
      if (isVideo && videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    }, 300);
  };

  // Navigate to next slide
  const nextSlide = () => {
    goToSlide((currentIndex + 1) % carouselItems.length);
  };

  // Handle video time update
  const handleVideoTimeUpdate = () => {
    if (videoRef.current && isVideo) {
      const duration = videoRef.current.duration;
      const currentTime = videoRef.current.currentTime;
      setProgress((currentTime / duration) * 100);
    }
  };

  // Handle video end
  const handleVideoEnd = () => {
    nextSlide();
  };

  // Auto-advance
  useEffect(() => {
    // Don't run if no carousel items yet
    if (carouselItems.length === 0) return;

    startTimeRef.current = Date.now();
    const duration = getDuration();

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = (elapsed / duration) * 100;

      if (newProgress >= 100) {
        nextSlide();
      } else {
        setProgress(newProgress);
        timerRef.current = requestAnimationFrame(updateProgress);
      }
    };

    timerRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, [currentIndex, isVideo, carouselItems.length]);

  // Video playback control
  useEffect(() => {
    if (isVideo && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked, ignore error
      });
    }
  }, [isVideo, carouselItems.length]);

  // Reset progress on slide change
  useEffect(() => {
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [currentIndex]);

  // Fetch hero sections from backend on component mount
  useEffect(() => {
    const fetchHeroSections = async () => {
      try {
        setIsLoading(true);
        const data = await heroService.getHeroSections();
        
        if (data && data.length > 0) {
          setCarouselItems(data);
        } else {
          console.warn('No hero sections found');
        }
      } catch (error) {
        console.error('Error fetching hero sections:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroSections();
  }, []);

  if (isLoading) {
    return (
      <div className="relative w-full h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!currentItem || carouselItems.length === 0) {
    return (
      <div className="relative w-full h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">No content available</div>
      </div>
    );
  }

  return (
    <section id="hero-section" className="relative w-full h-screen overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0">
        {isVideo ? (
          <video
            ref={videoRef}
            src={getMediaUrl(currentItem.src)}
            className="w-full h-full object-cover"
            muted
            playsInline
            onTimeUpdate={handleVideoTimeUpdate}
            onEnded={handleVideoEnd}
          />
        ) : (
          <img
            src={getMediaUrl(currentItem.src)}
            alt={currentItem.title}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h1 
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 transition-all duration-500 ${
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            {currentItem.title}
          </h1>
          <p 
            className={`text-lg sm:text-xl lg:text-2xl mb-8 transition-all duration-500 delay-100 ${
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            {currentItem.description}
          </p>
          <Link
            to={currentItem.link}
            className={`inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 ${
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="group relative"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div 
              className={`w-12 h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            >
              {index === currentIndex && (
                <div 
                  className="h-full bg-primary-500 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;