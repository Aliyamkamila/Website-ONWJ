import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import beritaImage from '../../assets/rectangle.jpg';
import { beritaApi } from '../../services/BeritaService';
import { FaSpinner } from 'react-icons/fa';

// ============================================
// CUSTOM HOOK
// ============================================
const useScrollAnimation = (ref, delay = 0) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            element.classList.add('opacity-100', 'translate-y-0');
            element.classList.remove('opacity-0', 'translate-y-8');
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [ref, delay]);
};

// ============================================
// COMPONENTS
// ============================================
const NewsCard = ({ title, image, date, category, slug, delay }) => {
  const cardRef = useRef(null);
  useScrollAnimation(cardRef, delay);

  // Format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Link to={`/artikel/${slug}`}>
      <article 
        ref={cardRef}
        className="group cursor-pointer opacity-0 translate-y-8 transition-all duration-700"
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-4 shadow-md">
          <img 
            src={image || beritaImage} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.target.src = beritaImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
        </div>
        
        {/* Content */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 font-heading font-bold text-xs uppercase tracking-wide rounded-full">
              {category}
            </span>
            <span className="text-sm text-secondary-500">{formatDate(date)}</span>
          </div>
          <h3 className="font-heading text-lg font-bold text-secondary-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 leading-snug">
            {title}
          </h3>
        </div>
      </article>
    </Link>
  );
};

const FeaturedNews = ({ featuredNews }) => {
  const featuredRef = useRef(null);
  useScrollAnimation(featuredRef);

  if (!featuredNews) return null;

  // Format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div 
      ref={featuredRef}
      className="section-container mb-16 sm:mb-20 opacity-0 translate-y-8 transition-all duration-700"
    >
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        
        {/* Image */}
        <div className="w-full lg:w-1/2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl group">
            <img
              src={featuredNews.full_image_url || beritaImage}
              alt={featuredNews.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="eager"
              onError={(e) => {
                e.target.src = beritaImage;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"/>
          </div>
        </div>

        {/* Content */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-secondary-500 font-medium">{featuredNews.category}</p>
              <p className="text-primary-600 font-heading font-bold">{formatDate(featuredNews.date)}</p>
            </div>
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-secondary-900 leading-tight">
            {featuredNews.title}
          </h2>

          <p className="text-base sm:text-lg text-secondary-600 leading-relaxed line-clamp-3">
            {featuredNews.short_description || featuredNews.content?.substring(0, 200) + '...'}
          </p>

          <Link to={`/artikel/${featuredNews.slug}`} className="link-arrow inline-flex">
            <span>Baca Selengkapnya</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

const NewsGrid = ({ newsItems, loading }) => {
  const newsGridRef = useRef(null);
  useScrollAnimation(newsGridRef);

  return (
    <div 
      ref={newsGridRef}
      className="section-container opacity-0 translate-y-8 transition-all duration-700"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
        <div>
          <span className="section-label">Update Terkini</span>
        </div>
        <Link to="/media-informasi" className="link-arrow">
          <span>Lihat Semua</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      )}

      {/* Grid */}
      {!loading && newsItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {newsItems.map((item, index) => (
            <NewsCard 
              key={item.id} 
              title={item.title}
              image={item.full_image_url}
              date={item.date}
              category={item.category}
              slug={item.slug}
              delay={index * 150} 
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && newsItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary-500">Belum ada berita tersedia</p>
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN
// ============================================
const Berita = () => {
  const [featuredNews, setFeaturedNews] = useState(null);
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchBerita = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching berita for homepage...');

      // ✅ STEP 1: Fetch berita pinned untuk Featured
      const pinnedResponse = await beritaApi.forHomepage();
      console.log('📥 Pinned Response:', pinnedResponse);

      let pinnedData = [];
      if (pinnedResponse.data?.success && pinnedResponse.data?.data) {
        pinnedData = pinnedResponse.data.data;
      } else if (pinnedResponse.data?.data) {
        pinnedData = pinnedResponse.data.data;
      } else if (Array.isArray(pinnedResponse.data)) {
        pinnedData = pinnedResponse.data;
      }

      console.log('📌 Pinned Data:', pinnedData);

      // Set Featured News
      if (pinnedData.length > 0) {
        setFeaturedNews(pinnedData[0]);
        console.log('⭐ Featured:', pinnedData[0].title);
      }

      // ✅ STEP 2: Fetch latest berita untuk Grid
      console.log('🔄 Fetching latest berita...');
      const latestResponse = await beritaApi.getAll({
        per_page: 10,
        status: 'published'
      });
      console.log('📥 Latest Response:', latestResponse);

      let latestData = [];
      if (latestResponse.data?.success && latestResponse.data?.data) {
        latestData = latestResponse.data.data;
      } else if (latestResponse.data?.data) {
        latestData = latestResponse.data.data;
      } else if (Array.isArray(latestResponse.data)) {
        latestData = latestResponse.data;
      }

      console.log('📊 Latest Data:', latestData);
      console.log('📊 Latest Count:', latestData.length);

      // ✅ Filter: Jangan tampilkan Featured di Grid
      const featuredId = pinnedData[0]?.id;
      const filteredLatest = latestData.filter(item => item.id !== featuredId);

      console.log('🔍 Filtered Latest:', filteredLatest);
      console.log('🔍 Filtered Count:', filteredLatest.length);

      // Ambil 4 berita pertama
      const gridItems = filteredLatest.slice(0, 4);
      setNewsItems(gridItems);

      console.log('✅ Final Grid Items:', gridItems);
      console.log('✅ Grid Count:', gridItems.length);

    } catch (error) {
      console.error('❌ Error fetching berita:', error);
      console.error('Error response:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  fetchBerita();
}, []);

  // ✅ ADDED: Debug log untuk render
  console.log('🎨 Rendering Berita component:', {
    loading,
    hasFeatured: !!featuredNews,
    newsCount: newsItems.length
  });

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      {loading && (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="w-8 h-8 text-primary-600 animate-spin" />
          <p className="ml-3 text-gray-500">Memuat berita...</p>
        </div>
      )}
      
      {!loading && featuredNews && <FeaturedNews featuredNews={featuredNews} />}
      {!loading && <NewsGrid newsItems={newsItems} loading={loading} />}
      
      {!loading && !featuredNews && newsItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Belum ada berita yang di-pin ke homepage</p>
        </div>
      )}
    </section>
  );
};

export default Berita;  