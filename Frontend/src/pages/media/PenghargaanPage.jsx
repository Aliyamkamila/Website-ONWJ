import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaHome, FaTrophy } from 'react-icons/fa';
import bannerImage from '../../assets/hero-bg.png';
import awardImage from '../../assets/rectangle.png';
import penghargaanService from '../../services/penghargaanService';
import toast from 'react-hot-toast';

const AwardCard = ({ award, index, visible }) => {
  // Get image URL or fallback to default
  const imageUrl = award.image_url || awardImage;

  return (
    <div
      className={`bg-white border border-secondary-200 rounded-lg overflow-hidden transition-all duration-300 hover:border-primary-600 hover:shadow-md`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ?  'translateY(0)' : 'translateY(20px)',
        transitionDelay: `${index * 60}ms`,
      }}
    >
      {/* Image Section */}
      <div className="relative h-52 overflow-hidden bg-secondary-100">
        <img
          src={imageUrl}
          alt={award.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src = awardImage; // Fallback if image fails to load
          }}
        />
        
        {/* Year Badge */}
        <div className="absolute top-3 right-3 px-3 py-1.5 bg-white rounded-lg shadow-md">
          <p className="text-sm font-heading font-bold text-primary-600">{award.year}</p>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-5 border-t border-secondary-100">
        <div className="flex items-center gap-2 mb-2">
          <FaTrophy className="w-3.5 h-3.5 text-amber-500" />
          <p className="text-xs font-heading font-semibold text-secondary-500">
            {award.month} {award.year}
          </p>
        </div>

        <h3 className="text-base font-heading font-bold text-secondary-900 mb-3 leading-tight">
          {award.title}
        </h3>
        
        <p className="text-xs text-secondary-600">
          <span className="font-semibold">Diberikan oleh:</span> {award.given_by}
        </p>
      </div>
    </div>
  );
};

const SubNav = () => {
  const activeStyle = "font-heading font-semibold text-primary-600 border-b-2 border-primary-600 py-4 transition-colors duration-200";
  const inactiveStyle = "font-heading font-medium text-secondary-600 hover:text-primary-600 border-b-2 border-transparent py-4 transition-colors duration-200";

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-secondary-200">
      <nav className="section-container flex space-x-8">
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
  <div className="relative h-[60vh] overflow-hidden" id="hero-section">
    <div className="absolute inset-0">
      <img 
        src={bannerImage} 
        alt="Banner Penghargaan" 
        className="w-full h-full object-cover" 
      />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/70 to-secondary-900/50" />
    </div>
    
    <div className="relative section-container h-full flex items-center">
      <div className="max-w-3xl text-white">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-body-sm">
          <Link 
            to="/" 
            className="text-white/70 hover:text-white flex items-center gap-1 transition-colors duration-200"
          >
            <FaHome className="w-4 h-4" /> 
            <span>Home</span>
          </Link>
          <span className="text-white/50">/</span>
          <span className="font-semibold text-white">Penghargaan</span>
        </div>
        
        {/* Title */}
        <h1 className="text-display-lg lg:text-display-xl font-heading font-bold text-white leading-tight mb-4">
          Penghargaan Kami
        </h1>
        
        {/* Description */}
        <p className="text-body-lg text-white/90 leading-relaxed">
          Apresiasi dan pengakuan atas dedikasi kami dalam industri energi dan tanggung jawab sosial
        </p>
      </div>
    </div>
  </div>
);

const PenghargaanPage = () => {
  const [visible, setVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState('all');
  const [awardsData, setAwardsData] = useState([]);
  const [years, setYears] = useState(['all']);
  const [loading, setLoading] = useState(true);

  // Fetch penghargaan data from API
  useEffect(() => {
    fetchPenghargaan();
    fetchYears();
  }, []);

  const fetchPenghargaan = async () => {
    setLoading(true);
    try {
      const response = await penghargaanService.getAllPenghargaan();
      if (response.success) {
        setAwardsData(response.data);
      }
    } catch (error) {
      console.error('Error fetching penghargaan:', error);
      toast.error('Gagal memuat data penghargaan');
    } finally {
      setLoading(false);
    }
  };

  const fetchYears = async () => {
    try {
      const response = await penghargaanService.getYears();
      if (response.success && response.data.length > 0) {
        const yearsArray = ['all', ...response.data].sort((a, b) => {
          if (a === 'all') return -1;
          if (b === 'all') return 1;
          return b - a;
        });
        setYears(yearsArray);
      }
    } catch (error) {
      console.error('Error fetching years:', error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  // Filter awards by year
  const filteredAwards = selectedYear === 'all' 
    ? awardsData 
    : awardsData.filter(award => award.year === parseInt(selectedYear));

  return (
    <div className="min-h-screen bg-white">
      <MediaHero />
      <SubNav />
      
      <div className="section-container py-12">
        
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-heading font-bold text-secondary-900 mb-3">
            Koleksi Penghargaan
          </h2>
          <p className="text-sm text-secondary-600 mb-6">
            Pencapaian dan apresiasi yang kami terima dari berbagai institusi
          </p>

          {/* Year Filter */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-lg text-sm font-heading font-semibold transition-all duration-200 ${
                  selectedYear === year
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
              >
                {year === 'all' ? 'Semua Tahun' : year}
              </button>
            ))}
          </div>
        </div>

        {/* Awards Grid */}
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-secondary-600">Memuat data penghargaan...</p>
              </div>
            </div>
          ) : filteredAwards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAwards.map((award, index) => (
                <AwardCard key={award.id} award={award} index={index} visible={visible} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaTrophy className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
              <p className="text-secondary-600">
                {selectedYear === 'all' 
                  ? 'Belum ada data penghargaan' 
                  : `Tidak ada penghargaan untuk tahun ${selectedYear}`
                }
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PenghargaanPage;