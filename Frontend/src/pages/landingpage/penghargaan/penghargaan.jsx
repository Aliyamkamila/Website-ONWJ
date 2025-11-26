import React, { useState, useEffect, useRef } from 'react';
import CountUp from './CountUp';
import LogoLoop from '../logoloop';
import './penghargaan.css';

import contoh1 from '../../../assets/contoh1.png';
import contoh2 from '../../../assets/contoh2.png';
import contoh3 from '../../../assets/contoh3.png';

const awardsData = [
  {
    id: 1,
    title: 'National Awards 2019',
    image: contoh1,
    description: 'Best Industry Leader',
    fullDescription: 'Penghargaan ini diberikan sebagai pengakuan atas kepemimpinan luar biasa dalam industri minyak dan gas. Prestasi ini mencerminkan dedikasi kami dalam memberikan layanan terbaik dan inovasi berkelanjutan.',
    year: '2019',
  },
  {
    id: 2,
    title: 'Excellence Award 2020',
    image: contoh2,
    description: 'Outstanding Performance',
    fullDescription: 'Diberikan atas kinerja luar biasa dalam pengelolaan operasional dan pencapaian target yang melampaui ekspektasi. Penghargaan ini membuktikan komitmen kami terhadap keunggulan operasional.',
    year: '2020',
  },
  {
    id: 3,
    title: 'Innovation Award 2021',
    image: contoh3,
    description: 'Technology Pioneer',
    fullDescription: 'Penghargaan inovasi ini mengakui kontribusi kami dalam mengembangkan teknologi terdepan di industri energi. Kami terus berinovasi untuk masa depan yang lebih berkelanjutan.',
    year: '2021',
  },
  {
    id: 4,
    title: 'Global Recognition 2022',
    image: contoh1,
    description: 'International Excellence',
    fullDescription: 'Pengakuan internasional atas standar keunggulan global yang kami terapkan. Penghargaan ini menegaskan posisi kami sebagai pemain kelas dunia di industri energi.',
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
    fullDescription: 'Penghargaan pencapaian tertinggi untuk layanan luar biasa kepada stakeholder dan masyarakat. Komitmen kami terhadap pelayanan prima terus diakui secara nasional.',
    year: '2024',
  },
];

const statisticsData = [
  { id: 1, value: 20, suffix: '+', label: 'Tahun Pengalaman' },
  { id: 2, value: 35, suffix: '+', label: 'Penghargaan Diterima' },
  { id: 3, value: 1750, suffix: '+', label: 'Pelanggan Puas', separator: ',' },
  { id: 4, value: 120, suffix: '+', label: 'Staf Profesional' },
];

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="modal-body">
          <div className="modal-image-container">
            <img src={award.image} alt={award.title} className="modal-image" />
            <div className="modal-year-badge">{award.year}</div>
          </div>
          
          <div className="modal-info">
            <h3 className="modal-title">{award.title}</h3>
            <p className="modal-subtitle">{award.description}</p>
            <div className="modal-divider"></div>
            <p className="modal-description">{award.fullDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ stat, index }) => (
  <div className="statistik-card" role="article" aria-labelledby={`stat-label-${stat.id}`}>
    <div className="statistik-number">
      <CountUp
        to={stat.value}
        from={0}
        direction="up"
        delay={index * 0.2}
        duration={2}
        separator={stat.separator || ''}
        className="statistik-number-value"
      />
      {stat.suffix}
    </div>
    <div id={`stat-label-${stat.id}`} className="statistik-label">
      {stat.label}
    </div>
  </div>
);

export default function Penghargaan() {
  const [selectedAward, setSelectedAward] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const carouselRef = useRef(null);

  // Center Focus Effect
  useEffect(() => {
    const updateCenterFocus = () => {
      if (!carouselRef.current) return;

      const container = carouselRef.current;
      const items = container.querySelectorAll('.logo-item');
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;

      items.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const distanceFromCenter = Math.abs(containerCenter - itemCenter);
        const maxDistance = containerRect.width / 2;

        // Remove all classes first
        item.classList.remove('center-focus', 'near-center', 'far');

        // Calculate position and apply appropriate class
        if (distanceFromCenter < 100) {
          // Very close to center
          item.classList.add('center-focus');
        } else if (distanceFromCenter < maxDistance * 0.4) {
          // Near center
          item.classList.add('near-center');
        } else {
          // Far from center
          item.classList.add('far');
        }
      });
    };

    // Update on scroll/animation
    const interval = setInterval(updateCenterFocus, 50);

    // Update on mount and resize
    updateCenterFocus();
    window.addEventListener('resize', updateCenterFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateCenterFocus);
    };
  }, []);

  const handleAwardClick = (award) => {
    setSelectedAward(award);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedAward(null), 300);
  };

  const awardLogos = awardsData.map(award => ({
    src: award.image,
    alt: award.title,
    title: award.description,
    onClick: () => handleAwardClick(award),
  }));

  return (
    <>
      {/* Awards Section */}
      <section id="awards" className="awards-section" aria-labelledby="awards-heading">
        <div className="section-container">
          {/* Header */}
          <header className="awards-header">
            <p className="awards-subtitle">OUR AWARDS</p>
            <h2 id="awards-heading" className="awards-title">
              Awards & Recognition
            </h2>
            <p className="awards-description">
              Our commitment to excellence has been acknowledged by industry leaders
            </p>
          </header>

          {/* Award Logos Carousel */}
          <div className="awards-carousel-wrapper">
            <div className="awards-carousel" ref={carouselRef} role="list" aria-label="Daftar penghargaan">
              <LogoLoop
                logos={awardLogos}
                speed={30}
                direction="left"
                logoHeight={120}
                gap={32}
                pauseOnHover={true}
                scaleOnHover={false}
                fadeOut={false}
                ariaLabel="Our awards carousel"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="statistik-section" aria-labelledby="statistics-heading">
        <div className="section-container">
          <h2 id="statistics-heading" className="sr-only">Statistik Kami</h2>
          <div className="statistik-container" role="list" aria-label="Data statistik">
            {statisticsData.map((stat, index) => (
              <StatCard key={stat.id} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Award Modal */}
      <AwardModal award={selectedAward} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}