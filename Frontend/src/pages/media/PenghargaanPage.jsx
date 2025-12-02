import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import bannerImage from '../../assets/hero-bg.png';
import awardImage from '../../assets/rectangle.png';
import logo from '../../assets/logo.webp';
import { FaHome, FaYoutube, FaInstagram, FaDownload, FaFilePdf } from 'react-icons/fa';

const awardsData = [
  { 
    year: 2024, 
    title: 'Best HSE Performance Award', 
    givenBy: 'Kementerian ESDM',
    certificateUrl: '/certificates/hse-2024.pdf'
  },
  { 
    year: 2024, 
    title: 'Community Empowerment Excellence', 
    givenBy: 'CSR Outlook Awards',
    certificateUrl: '/certificates/community-2024.pdf'
  },
  { 
    year: 2023, 
    title: 'Innovation in Offshore Technology', 
    givenBy: 'Asia Petroleum Expo',
    certificateUrl: '/certificates/innovation-2023.pdf'
  },
  { 
    year: 2023, 
    title: 'Sustainable Company of the Year', 
    givenBy: 'National Geographic Forum',
    certificateUrl: '/certificates/sustainable-2023.pdf'
  },
  { 
    year: 2022, 
    title: 'Top Performer in Oil & Gas Sector', 
    givenBy: 'Energy & Mining Weekly',
    certificateUrl: '/certificates/performer-2022.pdf'
  },
  { 
    year: 2022, 
    title: 'Environmental Stewardship Award', 
    givenBy: 'Green Earth Foundation',
    certificateUrl: '/certificates/environmental-2022.pdf'
  },
];

const AwardCard = ({ award, index, visible }) => {
  const handleDownload = (e) => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = award.certificateUrl;
    link.download = `${award.title.replace(/\s+/g, '_')}_${award.year}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden group transition-all duration-700 hover:shadow-lg hover:-translate-y-1`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ?  'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div className="relative h-48 overflow-hidden bg-secondary-50">
        <img
          src={awardImage}
          alt={award.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/60 to-transparent" />
        
        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg">
          <p className="text-sm font-bold text-primary-600">{award.year}</p>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-bold text-secondary-900 group-hover:text-primary-600 transition-colors mb-2 leading-tight">
          {award.title}
        </h3>
        <p className="text-sm text-secondary-600 mb-4">
          <span className="font-medium">Diberikan oleh:</span> {award.givenBy}
        </p>
        
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-sm font-semibold group/btn"
        >
          <FaDownload className="w-4 h-4 group-hover/btn:animate-bounce" />
          <span>Unduh Sertifikat</span>
        </button>
      </div>
    </div>
  );
};

const PenghargaanPage = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const SubNav = () => {
    const activeStyle = "font-semibold text-primary-600 border-b-2 border-primary-600 py-4";
    const inactiveStyle = "font-medium text-secondary-600 hover:text-primary-600 border-b-2 border-transparent py-4 transition-colors";

    return (
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm border-b border-secondary-200">
        <nav className="container mx-auto px-8 lg:px-16 flex space-x-8">
          <NavLink 
            to="/media-informasi" 
            end
            className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
          >
            Media & Berita
          </NavLink>
          <NavLink 
            to="/penghargaan" 
            className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
          >
            Penghargaan
          </NavLink>
        </nav>
      </div>
    );
  };

  const MediaHero = () => (
    <div className="relative h-[60vh] overflow-hidden">
      <div className="absolute inset-0">
        <img src={bannerImage} alt="Banner Media" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/70 to-secondary-900/50" />
      </div>
      <div className="relative container mx-auto px-8 lg:px-16 h-full flex items-center">
        <div className="max-w-3xl text-white">
          <div className="flex items-center gap-2 mb-4 text-sm">
            <Link to="/" className="text-white/70 hover:text-white flex items-center gap-1 transition-colors">
              <FaHome /> Home
            </Link>
            <span className="text-white/50">/</span>
            <span className="font-semibold text-white">Penghargaan</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight text-white">
            Penghargaan
          </h1>
          <p className="text-lg text-white/90 leading-relaxed">
            Kumpulan berita Penghargaan aktivitas perusahaan kami.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-secondary-50">
      <MediaHero />
      <SubNav />
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 py-16">
        <div className="text-center mb-12">
          <h2 className="text-display-md font-heading font-bold text-secondary-900 mb-3">
            Penghargaan Kami
          </h2>
          <p className="text-body-md text-secondary-600 max-w-2xl mx-auto">
            Apresiasi dan pengakuan atas dedikasi kami dalam industri energi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {awardsData.map((award, index) => (
            <AwardCard key={index} award={award} index={index} visible={visible} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PenghargaanPage;