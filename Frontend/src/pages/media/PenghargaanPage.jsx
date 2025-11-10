import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import bannerImage from '../../assets/hero-bg.png';
import awardImage from '../../assets/rectangle.png';
import logo from '../../assets/logo.webp';
import { FaHome, FaYoutube, FaInstagram } from 'react-icons/fa';

const awardsData = [
  { year: 2024, title: 'Best HSE Performance Award', givenBy: 'Kementerian ESDM' },
  { year: 2024, title: 'Community Empowerment Excellence', givenBy: 'CSR Outlook Awards' },
  { year: 2023, title: 'Innovation in Offshore Technology', givenBy: 'Asia Petroleum Expo' },
  { year: 2023, title: 'Sustainable Company of the Year', givenBy: 'National Geographic Forum' },
  { year: 2022, title: 'Top Performer in Oil & Gas Sector', givenBy: 'Energy & Mining Weekly' },
  { year: 2022, title: 'Environmental Stewardship Award', givenBy: 'Green Earth Foundation' },
];

const AwardCard = ({ award, index, visible }) => (
  <div
    className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group transition-all duration-700 hover:shadow-2xl hover:-translate-y-2`}
    style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(40px)',
      transitionDelay: `${index * 100}ms`,
    }}
  >
    <div className="relative h-48 overflow-hidden">
      <img
        src={awardImage}
        alt={award.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
    <div className="p-6">
      <p className="text-sm font-semibold text-blue-600 mb-1 tracking-wide">{award.year}</p>
      <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
        {award.title}
      </h3>
      <p className="text-sm text-gray-500 mt-2 italic">Diberikan oleh {award.givenBy}</p>
    </div>
  </div>
);


const PenghargaanPage = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const SubNav = () => {
    const activeStyle = "font-semibold text-blue-600 border-b-2 border-blue-600 py-4";
    const inactiveStyle = "font-medium text-gray-500 hover:text-blue-600 border-b-2 border-transparent py-4 transition-colors";

    return (
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
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
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        <div className="relative container mx-auto px-8 lg:px-16 h-full flex items-center">
            <div className="max-w-3xl text-white">
                <div className="flex items-center gap-2 mb-4 text-sm">
                    <Link to="/" className="text-gray-300 hover:text-white flex items-center gap-1">
                        <FaHome /> Home
                    </Link>
                    <span>/</span>
                    <span className="font-semibold text-white">Media & Informasi</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Media & Informasi</h1>
                <p className="text-lg text-gray-200 leading-relaxed">
                    Kumpulan berita, rilis media, dan galeri video terbaru dari aktivitas perusahaan kami.
                </p>
            </div>
        </div>
    </div>
);

  return (
    <div className="bg-gray-50">
      <MediaHero />
      <SubNav />
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 py-16">
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
