import React from 'react';
import CountUp from './CountUp';
import './penghargaan.css';

import contoh1 from '../../../assets/contoh1.png';
import contoh2 from '../../../assets/contoh2.png';
import contoh3 from '../../../assets/contoh3.png';

// Hanya 3 awards sesuai permintaan - dengan gambar
const awardsData = [
  {
    id: 1,
    title: 'National Awards 2019',
    // Ganti dengan path gambar Anda
    image: contoh1,
    description: 'award winner',
    highlight: false,
  },
  {
    id: 2,
    title: 'National Awards 2019',
    // Ganti dengan path gambar Anda
    image: contoh2,
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
    highlight: true,
  },
  {
    id: 3,
    title: 'National Awards 2019',
    // Ganti dengan path gambar Anda
    image: contoh3,
    description: 'award winner',
    highlight: false,
  },
];

// Data statistik tetap sama (tidak diubah)
const statisticsData = [
  { id: 1, value: 20, suffix: '+', label: 'Tahun Pengalaman' },
  { id: 2, value: 35, suffix: '+', label: 'Penghargaan Diterima' },
  { id: 3, value: 1750, suffix: '+', label: 'Pelanggan Puas', separator: ',' },
  { id: 4, value: 120, suffix: '+', label: 'Staf Profesional' },
];

const AwardCard = ({ award }) => (
  <div
    className={`penghargaan-card ${award.highlight ? 'highlight' : ''}`}
    role="article"
    aria-labelledby={`award-title-${award.id}`}
  >
    <div
      className="penghargaan-icon"
      role="img"
      aria-label={`${award.title} icon`}
    >
      <img 
        src={award.image} 
        alt={award.title}
        loading="lazy"
      />
    </div>
    
    <div className="penghargaan-card-content">
      <h3
        id={`award-title-${award.id}`}
        className="penghargaan-card-title"
      >
        {award.title}
      </h3>
      <p className="penghargaan-card-description">
        {award.description}
      </p>
    </div>
  </div>
);

const StatCard = ({ stat, index }) => (
  <div
    className="statistik-card"
    key={stat.id}
    role="article"
    aria-labelledby={`stat-label-${stat.id}`}
  >
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
    <div
      id={`stat-label-${stat.id}`}
      className="statistik-label"
    >
      {stat.label}
    </div>
  </div>
);

export default function Penghargaan() {
  return (
    <>
      <section
        id="awards"
        className="penghargaan-section"
        aria-labelledby="awards-heading"
      >
        <div className="penghargaan-wrapper">
          {/* Header */}
          <header className="penghargaan-header">
            <div className="penghargaan-subtitle">
              OUR AWARDS
            </div>
            <h2
              id="awards-heading"
              className="penghargaan-title"
            >
              Awards speak about us more than us.
            </h2>
          </header>

          {/* Award Cards - Hanya 3 Cards dengan Gambar */}
          <div
            className="penghargaan-grid"
            role="list"
            aria-label="Daftar penghargaan"
          >
            {awardsData.map((award) => (
              <AwardCard key={award.id} award={award} />
            ))}
          </div>
        </div>
      </section>

      {/* Statistik Section - Jarak Diperkecil */}
      <section
        className="statistik-section"
        aria-labelledby="statistics-heading"
      >
        <h2 id="statistics-heading" style={{ display: 'none' }}>
          Statistik Kami
        </h2>
        <div
          className="statistik-container"
          role="list"
          aria-label="Data statistik"
        >
          {statisticsData.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </div>
      </section>
    </>
  );
}