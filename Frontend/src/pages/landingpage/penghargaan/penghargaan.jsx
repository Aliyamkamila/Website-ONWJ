import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';
import './penghargaan.css';

// ============================================
// ASSETS
// ============================================
import contoh1 from '../../../assets/contoh1.png';
import contoh2 from '../../../assets/contoh2.png';
import contoh3 from '../../../assets/contoh3.png';

// ============================================
// CONSTANTS
// ============================================
const AWARDS_DATA = [
  {
    id: 1,
    title: 'National Awards 2019',
    image: contoh1,
    description: 'Best Industry Leader',
    fullDescription: 'Penghargaan ini diberikan sebagai pengakuan atas kepemimpinan luar biasa dalam industri minyak dan gas.Prestasi ini mencerminkan dedikasi kami dalam memberikan layanan terbaik dan inovasi berkelanjutan.',
    year: '2019',
  },
  {
    id: 2,
    title: 'Excellence Award 2020',
    image: contoh2,
    description: 'Outstanding Performance',
    fullDescription: 'Diberikan atas kinerja luar biasa dalam pengelolaan operasional dan pencapaian target yang melampaui ekspektasi.Penghargaan ini membuktikan komitmen kami terhadap keunggulan operasional.',
    year: '2020',
  },
  {
    id: 3,
    title: 'Innovation Award 2021',
    image: contoh3,
    description: 'Technology Pioneer',
    fullDescription: 'Penghargaan inovasi ini mengakui kontribusi kami dalam mengembangkan teknologi terdepan di industri energi.Kami terus berinovasi untuk masa depan yang lebih berkelanjutan.',
    year: '2021',
  },
  {
    id: 4,
    title: 'Global Recognition 2022',
    image: contoh1,
    description: 'International Excellence',
    fullDescription: 'Pengakuan internasional atas standar keunggulan global yang kami terapkan.Penghargaan ini menegaskan posisi kami sebagai pemain kelas dunia di industri energi.',
    year: '2022',
  },
  {
    id: 5,
    title: 'Prestige Award 2023',
    image: contoh2,
    description: 'Industry Champion',
    fullDescription: 'Sebagai juara industri, penghargaan ini mengakui kepemimpinan kami dalam menetapkan standar baru dan mendorong pertumbuhan sektor energi secara berkelanjutan.',
    year: '2023',
  },
  {
    id: 6,
    title: 'Achievement Award 2024',
    image: contoh3,
    description: 'Outstanding Service',
    fullDescription: 'Penghargaan pencapaian tertinggi untuk layanan luar biasa kepada stakeholder dan masyarakat.Komitmen kami terhadap pelayanan prima terus diakui secara nasional.',
    year: '2024',
  },
];

const STATISTICS_DATA = [
  { id: 1, value: 20, suffix: '+', label: 'Tahun Pengalaman' },
  { id: 2, value: 35, suffix: '+', label: 'Penghargaan Diterima' },
  { id: 3, value: 1750, suffix: '+', label: 'Pelanggan Puas', separator: ',' },
  { id: 4, value: 120, suffix: '+', label: 'Staf Profesional' },
];

const CAROUSEL_CONFIG = {
  SPEED: 20000,
  CARD_WIDTH: 200,
  CARD_HEIGHT: 280,
  GAP: 40,
  UPDATE_INTERVAL: 100, // Throttled update
};

// ============================================
// CUSTOM HOOKS
// ============================================
const useCountUp = ({ to, from = 0, delay = 0, duration = 2, separator = '' }) => {
  const ref = useRef(null);
  const motionValue = useMotionValue(from);
  
  const springValue = useSpring(motionValue, {
    damping: 10 + 20 * (1 / duration),
    stiffness: 50 * (1 / duration),
  });

  const isInView = useInView(ref, { once: true, margin: '0px' });

  const getDecimalPlaces = (num) => {
    const str = num.toString();
    if (str.includes('.')) {
      const decimals = str.split('.')[1];
      if (parseInt(decimals) !== 0) return decimals.length;
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = String(from);
    }
  }, [from]);

  useEffect(() => {
    if (isInView) {
      const timeoutId = setTimeout(() => {
        motionValue.set(to);
      }, delay * 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isInView, motionValue, to, delay]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        const hasDecimals = maxDecimals > 0;
        const options = {
          useGrouping: !!separator,
          minimumFractionDigits: hasDecimals ? maxDecimals : 0,
          maximumFractionDigits: hasDecimals ? maxDecimals : 0,
        };
        const formattedNumber = Intl.NumberFormat('en-US', options).format(latest);
        ref.current.textContent = separator 
          ? formattedNumber.replace(/,/g, separator) 
          : formattedNumber;
      }
    });
    return () => unsubscribe();
  }, [springValue, separator, maxDecimals]);

  return ref;
};

const useInfiniteCarousel = (itemsCount) => {
  const [duplicateCount, setDuplicateCount] = useState(2);
  const trackRef = useRef(null);

  useEffect(() => {
    if (trackRef.current) {
      const container = trackRef.current.parentElement;
      const logoSetWidth = trackRef.current.firstChild?.offsetWidth || 0;
      const containerWidth = container?.offsetWidth || 0;
      const setsNeeded = Math.ceil((containerWidth * 2) / logoSetWidth);
      setDuplicateCount(Math.max(2, setsNeeded));
    }
  }, [itemsCount]);

  return { trackRef, duplicateCount };
};

// FIXED: Throttled center focus to prevent jitter
const useCenterFocus = (carouselRef) => {
  const rafRef = useRef(null);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    const updateCenterFocus = () => {
      const now = Date.now();
      
      // Throttle updates to every 100ms
      if (now - lastUpdateRef.current < CAROUSEL_CONFIG.UPDATE_INTERVAL) {
        rafRef.current = requestAnimationFrame(updateCenterFocus);
        return;
      }

      lastUpdateRef.current = now;

      if (! carouselRef.current) {
        rafRef.current = requestAnimationFrame(updateCenterFocus);
        return;
      }

      const container = carouselRef.current;
      const items = container.querySelectorAll('.award-item');
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      items.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const distanceFromCenter = Math.abs(containerCenter - itemCenter);
        const maxDistance = containerRect.width / 2;

        item.classList.remove('center-focus', 'near-center', 'far');

        if (distanceFromCenter < 120) {
          item.classList.add('center-focus');
        } else if (distanceFromCenter < maxDistance * 0.45) {
          item.classList.add('near-center');
        } else {
          item.classList.add('far');
        }
      });

      rafRef.current = requestAnimationFrame(updateCenterFocus);
    };

    rafRef.current = requestAnimationFrame(updateCenterFocus);

    const handleResize = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(updateCenterFocus);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [carouselRef]);
};

// ============================================
// SUB-COMPONENTS
// ============================================
const CountUp = ({ to, from, delay, duration, separator }) => {
  const ref = useCountUp({ to, from, delay, duration, separator });
  return <span ref={ref} className="inline-block" />;
};

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const AwardCard = ({ award, onClick }) => (
  <div
    className="award-item"
    onClick={() => onClick(award)}
    onKeyPress={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(award);
      }
    }}
    role="button"
    tabIndex={0}
    aria-label={`View ${award.title} details`}
  >
    <img src={award.image} alt={award.title} className="award-image" loading="lazy" />
    <div className="award-year-badge">{award.year}</div>
  </div>
);

const InfiniteCarousel = ({ items, onItemClick }) => {
  const { trackRef, duplicateCount } = useInfiniteCarousel(items.length);

  return (
    <div 
      className="award-carousel-track" 
      ref={trackRef}
      style={{
        '--speed': `${CAROUSEL_CONFIG.SPEED}ms`,
        '--gap': `${CAROUSEL_CONFIG.GAP}px`,
        '--card-width': `${CAROUSEL_CONFIG.CARD_WIDTH}px`,
        '--card-height': `${CAROUSEL_CONFIG.CARD_HEIGHT}px`,
      }}
    >
      {Array.from({ length: duplicateCount }).map((_, setIndex) => (
        <div key={setIndex} className="award-carousel-content">
          {items.map((award) => (
            <AwardCard 
              key={`${setIndex}-${award.id}`}
              award={award}
              onClick={onItemClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// FIXED: Modal with larger image
const AwardModal = ({ award, isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !award) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-secondary-900/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-secondary-900 text-white flex items-center justify-center hover:bg-primary-600 hover:rotate-90 transition-all duration-300 shadow-lg"
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>

        <div className="flex flex-col md:flex-row overflow-y-auto custom-scrollbar max-h-[90vh]">
          {/* FIXED: Larger image container */}
          <div className="relative w-full md:w-96 bg-gradient-to-br from-secondary-50 to-secondary-100 p-8 flex items-center justify-center min-h-80 md:min-h-[500px]">
            <img
              src={award.image}
              alt={award.title}
              className="w-full h-auto max-h-96 object-contain rounded-xl shadow-lg"
            />
            <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-primary-600 text-white font-heading font-bold text-sm shadow-lg">
              {award.year}
            </div>
          </div>

          <div className="flex-1 p-8">
            <h3 id="modal-title" className="font-heading font-bold text-2xl sm:text-3xl text-secondary-900 mb-2">
              {award.title}
            </h3>
            <p className="font-heading font-bold text-xs uppercase tracking-wider text-primary-600 mb-4">
              {award.description}
            </p>
            <div className="w-16 h-1 rounded-full bg-gradient-to-r from-primary-600 to-primary-400 mb-6" />
            <p className="text-base sm:text-lg text-secondary-600 leading-relaxed">
              {award.fullDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatisticCard = ({ stat, index }) => (
  <div 
    className="text-center p-5 rounded-xl bg-white border border-secondary-200 hover:border-primary-600 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg relative overflow-hidden group"
    role="article"
    aria-labelledby={`stat-label-${stat.id}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    
    <div className="relative font-heading font-bold text-4xl sm:text-5xl text-primary-600 mb-2 flex items-center justify-center gap-1 group-hover:scale-105 transition-transform duration-300">
      <CountUp to={stat.value} from={0} delay={index * 0.2} duration={2} separator={stat.separator || ''} />
      <span>{stat.suffix}</span>
    </div>
    
    <div id={`stat-label-${stat.id}`} className="relative font-body text-sm sm:text-base text-secondary-600 font-medium">
      {stat.label}
    </div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
const Penghargaan = () => {
  const [selectedAward, setSelectedAward] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const carouselRef = useRef(null);

  useCenterFocus(carouselRef);

  const handleAwardClick = useCallback((award) => {
    setSelectedAward(award);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedAward(null), 300);
  }, []);

  return (
    <section 
      id="awards" 
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white to-secondary-50"
      aria-labelledby="awards-heading"
    >
      <div className="section-container">
        {/* FIXED: Forced center alignment */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <span className="section-label">OUR AWARDS</span>
          <h2 
            id="awards-heading" 
            className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-secondary-900 mt-2 text-center"
            style={{ textAlign: 'center' }}
          >
            Awards & Recognition
          </h2>
          <p className="text-base sm:text-lg text-secondary-600 max-w-3xl mx-auto mt-4 text-center">
            Our commitment to excellence has been acknowledged by industry leaders
          </p>
        </div>

        {/* Carousel */}
        <div className="mb-10 sm:mb-12">
          <div 
            ref={carouselRef}
            className="award-carousel-wrapper"
            role="list"
            aria-label="Daftar penghargaan"
          >
            <InfiniteCarousel items={AWARDS_DATA} onItemClick={handleAwardClick} />
          </div>
        </div>

        {/* Statistics */}
        <div className="pt-8 sm:pt-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {STATISTICS_DATA.map((stat, index) => (
              <StatisticCard key={stat.id} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </div>

      <AwardModal award={selectedAward} isOpen={isModalOpen} onClose={handleCloseModal} />
    </section>
  );
};

export default Penghargaan;