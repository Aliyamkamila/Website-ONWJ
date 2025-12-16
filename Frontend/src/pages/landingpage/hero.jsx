import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../../assets/hero-bg.png';
import videoSample from '../../assets/talk 1.MOV';

// Carousel data - add your videos and images here
const carouselItems = [
  {
    type: 'image',
    src: heroBg,
    duration: 5000, // 5 seconds for images
    label: 'PT Migas Hulu Jabar ONWJ',
    title: 'Energi Untuk\nKemakmuran Daerah',
    description: 'Berkomitmen menghadirkan solusi energi berkelanjutan untuk kemajuan Indonesia.',
  },
  {
    type: 'video',
    src: videoSample,
    duration: 8000, // 8 seconds - adjust based on actual video length
    label: 'Inovasi Berkelanjutan',
    title: 'Teknologi Terdepan\nuntuk Masa Depan',
  },
  {
    type: 'image',
    src: heroBg,
    duration: 5000, // 5 seconds for images
    label: 'Komitmen Sosial',
    title: 'Memberdayakan\nMasyarakat Lokal',
    description: 'Bersama komunitas membangun ekonomi yang kuat dan berkelanjutan di setiap daerah.',
  },
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const currentItem = carouselItems[currentIndex];
  const isVideo = currentItem.type === 'video';

  // Get duration for current item
  const getDuration = () => {
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
  }, [currentIndex, isVideo]);

  // Video playback control
  useEffect(() => {
    if (isVideo && videoRef.current) {
      videoRef.current.play();
    }
  }, [isVideo]);

  // Reset progress on slide change
  useEffect(() => {
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [currentIndex]);

  return (
    <section 
      id="hero-section" 
      className="relative min-h-screen bg-gradient-to-r from-primary-600 to-primary-800 overflow-hidden"
    >
      {/* Background Media */}
      <div className="fixed top-0 left-0 right-0 w-full h-screen z-0">
        {isVideo ? (
          <video
            ref={videoRef}
            src={currentItem.src}
            className="w-full h-full object-cover"
            onTimeUpdate={handleVideoTimeUpdate}
            onEnded={handleVideoEnd}
            muted
            playsInline
          />
        ) : (
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${currentItem.src})`,
              transition: 'background-image 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-screen w-full flex flex-col">
        {/* Main Content - Show for all, but different styling for video */}
        <div className="flex-1 flex items-center">
          <div className="centered-content w-full transition-opacity duration-300" style={{ opacity: isTransitioning ? 0 : 1 }}>
            {!isVideo && (
            <div className="max-w-3xl space-y-grid-4">
              {/* Heading */}
              <h1 className="font-heading text-display-sm sm:text-display-lg lg:text-display-xl text-white text-balance animate-slide-up whitespace-pre-line">
                {currentItem.title}
              </h1>
              
              {/* Description */}
              <p className="text-body-md sm:text-body-lg lg:text-body-xl text-white/90 max-w-2xl leading-relaxed animate-slide-up animate-stagger-1">
                {currentItem.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-grid-3 pt-grid-4 animate-slide-up animate-stagger-2">
                <Link to="/tentang" className="btn-white btn-lg">
                  Pelajari Lebih Lanjut
                </Link>
                <Link 
                  to="/kontak" 
                  className="btn btn-lg bg-transparent text-white border-2 border-white hover:bg-white hover:text-primary-600 transition-all duration-300"
                >
                  Hubungi Kami
                </Link>
              </div>
            </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation Titles with Reveal Animation */}
        <div className="pb-8 sm:pb-12 transition-opacity duration-300" style={{ opacity: isTransitioning ? 0 : 1 }}>
          <div className="centered-content w-full">
            <div className="flex items-center gap-0 w-full">
              {carouselItems.map((item, index) => {
                const revealPosition = index === currentIndex ? progress : 0;
                return (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className="flex-1 relative group text-center transition-all duration-300"
                  >
                    {item.label ? (
                      <div
                        className={`font-heading text-label-xs sm:text-label-sm uppercase tracking-wider transition-colors duration-100 relative overflow-hidden ${
                          index === currentIndex 
                            ? 'text-white' 
                            : 'text-white/40 hover:text-white/70'
                        }`}
                      >
                        {/* Base text with initial low opacity */}
                        <span style={{ opacity: 0.3 }}>{item.label}</span>
                        
                        {/* Reveal overlay - left to right on active */}
                        {index === currentIndex && (
                          <span
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              backgroundImage: `linear-gradient(
                                90deg,
                                rgba(255, 255, 255, 0) 0%,
                                rgba(255, 255, 255, 0) ${Math.max(0, revealPosition - 10)}%,
                                rgba(255, 255, 255, 1) ${revealPosition}%,
                                rgba(255, 255, 255, 1) 100%
                              )`,
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundSize: '100% 100%',
                            }}
                          >
                            {item.label}
                          </span>
                        )}
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;