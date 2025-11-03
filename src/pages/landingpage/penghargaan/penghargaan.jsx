import React from 'react';
import { Link } from 'react-router-dom';
import CountUp from './CountUp';

const awardsData = [
  {
    id: 1,
    title: 'Best Innovation Award',
    icon: '🏆',
    description:
      'Penghargaan atas inovasi berkelanjutan yang menjadi standar baru di industri dan mendorong kemajuan teknologi.',
  },
  {
    id: 2,
    title: 'Customer Excellence Award',
    icon: '⭐',
    description:
      'Dianugerahkan atas dedikasi kami dalam memberikan pelayanan terbaik dan melampaui ekspektasi pelanggan.',
  },
  {
    id: 3,
    title: 'Industry Leader Award',
    icon: '👑',
    description:
      'Diberikan sebagai pengakuan atas peran kami sebagai pemimpin industri yang membentuk arah masa depan.',
  },
];

const statisticsData = [
  { id: 1, value: 20, suffix: '+', label: 'Tahun Pengalaman' },
  { id: 2, value: 35, suffix: '+', label: 'Penghargaan Diterima' },
  { id: 3, value: 1750, suffix: '+', label: 'Pelanggan Puas', separator: ',' },
  { id: 4, value: 120, suffix: '+', label: 'Staf Profesional' },
];

const AwardCard = ({ award, index }) => (
  <div
    key={award.id}
    role="article"
    aria-labelledby={`award-title-${award.id}`}
    style={{
      background: 'white',
      borderRadius: '15px',
      padding: '25px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      textAlign: 'center',
      animationDelay: `${index * 0.1}s`,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-6px)';
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    }}
  >
    <div
      className="penghargaan-icon"
      role="img"
      aria-label={`${award.title} icon`}
      style={{ fontSize: '2.5rem', marginBottom: '15px' }}
    >
      {award.icon}
    </div>
    <h3
      id={`award-title-${award.id}`}
      style={{
        fontSize: '1.25rem',
        marginBottom: '10px',
        color: '#222',
        fontWeight: '600',
      }}
    >
      {award.title}
    </h3>
    <p
      style={{
        fontSize: '0.95rem',
        color: '#555',
        lineHeight: '1.6',
      }}
    >
      {award.description}
    </p>
  </div>
);

const StatCard = ({ stat, index }) => (
  <div
    key={stat.id}
    role="article"
    aria-labelledby={`stat-label-${stat.id}`}
    style={{
      textAlign: 'center',
      minWidth: '150px',
    }}
  >
    <div
      style={{
        fontSize: '2.4rem',
        fontWeight: '700',
        marginBottom: '8px',
      }}
    >
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
      style={{
        fontSize: '1rem',
        color: 'rgba(255,255,255,0.9)',
      }}
    >
      {stat.label}
    </div>
  </div>
);

export default function Penghargaan() {
  return (
    <section
      id="awards"
      aria-labelledby="awards-heading"
      style={{
        backgroundColor: '#f9fafc',
        padding: '80px 0',
        fontFamily: "'Poppins', sans-serif",
        color: '#222',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '60px',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
        }}
      >
        {/* Header */}
        <header
          style={{
            background: 'linear-gradient(135deg, #0055a5 0%, #0078d7 100%)',
            color: 'white',
            borderRadius: '20px',
            padding: '50px',
            textAlign: 'center',
            boxShadow: '0 8px 20px rgba(0, 85, 165, 0.2)',
            width: '100%',
            maxWidth: '900px',
          }}
        >
          <h2
            id="awards-heading"
            style={{ fontSize: '2.4rem', marginBottom: '20px' }}
          >
            Penghargaan
          </h2>
          <p
            style={{
              fontSize: '1.1rem',
              lineHeight: '1.7',
              maxWidth: '700px',
              margin: '0 auto 30px',
            }}
          >
            Dedikasi kami terhadap inovasi, kualitas, dan layanan unggul telah
            mendapatkan berbagai penghargaan bergengsi. Setiap pencapaian menjadi
            bukti nyata komitmen kami dalam memberikan yang terbaik bagi pelanggan
            dan industri.
          </p>
          <Link
            to="/penghargaan"
            aria-label="Lihat semua penghargaan"
            style={{
              display: 'inline-block',
              background: 'white',
              color: '#0055a5',
              fontWeight: '600',
              borderRadius: '50px',
              padding: '10px 25px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#003c7a';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#0055a5';
            }}
          >
            Lihat Selengkapnya
          </Link>
        </header>

        {/* Award Cards */}
        <div
          role="list"
          aria-label="Daftar penghargaan"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px',
            width: '100%',
          }}
        >
          {awardsData.map((award, index) => (
            <AwardCard key={award.id} award={award} index={index} />
          ))}
        </div>
      </div>

      {/* Statistik Section */}
      <section
        aria-labelledby="statistics-heading"
        style={{
          marginTop: '80px',
          backgroundColor: '#0055a5',
          color: 'white',
          padding: '60px 0',
          textAlign: 'center',
        }}
      >
        <h2 id="statistics-heading" style={{ display: 'none' }}>
          Statistik Kami
        </h2>
        <div
          role="list"
          aria-label="Data statistik"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '50px',
            maxWidth: '1000px',
            margin: '0 auto',
          }}
        >
          {statisticsData.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} index={index} />
          ))}
        </div>
      </section>
    </section>
  );
}
