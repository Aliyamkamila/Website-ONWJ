import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import bannerImage from '../../assets/hero-bg.png';
import awardImage from '../../assets/rectangle.png';
import logo from '../../assets/logo.webp';

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

  return (
    <div className="bg-gray-50">
      <section className="relative h-72 md:h-80 w-full">
        <img
          src={bannerImage}
          alt="Banner Penghargaan"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-white text-4xl md:text-5xl font-extrabold relative pb-4">
            Penghargaan
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-blue-500 rounded-full"></span>
          </h1>
          <p className="mt-4 text-gray-200 text-base md:text-lg max-w-xl">
            Bukti komitmen kami terhadap inovasi, keberlanjutan, dan keselamatan.
          </p>
        </div>
        <img
          src={logo}
          alt="Logo"
          className="h-10 absolute top-8 right-8 lg:right-16"
        />
      </section>
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 py-16">
        <nav className="text-sm text-gray-500 mb-10">
          <Link to="/" className="hover:text-blue-600">Beranda</Link> <span>/</span>{' '}
          <span className="text-gray-700 font-semibold">Penghargaan</span>
        </nav>
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
