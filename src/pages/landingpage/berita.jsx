import React, { useEffect, useRef } from 'react';
import beritaImage from '../../assets/rectangle.png';

const NewsCard = ({ title, image, date, category, delay }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [delay]);

  return (
    <div 
      ref={cardRef}
      className="group cursor-pointer opacity-0 translate-y-10 transition-smooth-slow"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="rounded-xl overflow-hidden mb-4 shadow-md group-hover:shadow-lg transition-smooth-slow">
        <div className="relative aspect-[16/10]">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transform transition-smooth-slow group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
        </div>
      </div>
      <div className="space-y-2 px-1">
        <div className="flex items-center gap-3">
          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 text-xs font-semibold rounded-full">
            {category}
          </span>
          <span className="text-sm text-gray-400">{date}</span>
        </div>
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
          {title}
        </h3>
      </div>
    </div>
  );
};

const Berita = () => {
  const featuredRef = useRef(null);
  const newsGridRef = useRef(null);

  const newsItems = [
    {
      id: 1,
      title: "Inovasi Terbaru dalam Eksplorasi Energi Terbarukan di Indonesia",
      image: beritaImage,
      date: "10 Oct 2025",
      category: "Energi",
    },
    {
      id: 2,
      title: "Pengembangan Teknologi Migas Ramah Lingkungan",
      image: beritaImage,
      date: "10 Oct 2025",
      category: "Teknologi",
    },
    {
      id: 3,
      title: "Kerjasama Internasional dalam Pengembangan Energi Bersih",
      image: beritaImage,
      date: "10 Oct 2025",
      category: "Kerjasama",
    },
    {
      id: 4,
      title: "Implementasi Smart Technology dalam Industri Migas",
      image: beritaImage,
      date: "10 Oct 2025",
      category: "Inovasi",
    }
  ];

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px'
    };

    const observerCallback = ([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        entry.target.classList.remove('opacity-0', 'translate-y-10');
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (featuredRef.current) {
      observer.observe(featuredRef.current);
    }
    if (newsGridRef.current) {
      observer.observe(newsGridRef.current);
    }

    return () => {
      if (featuredRef.current) {
        observer.unobserve(featuredRef.current);
      }
      if (newsGridRef.current) {
        observer.unobserve(newsGridRef.current);
      }
    };
  }, []);

  return (
    <section className="py-16 md:py-20 bg-gray-50"> {/* Adjusted padding for better proportion */}
      {/* Featured News */}
      <div 
        ref={featuredRef}
        className="section-container mb-16 md:mb-20 opacity-0 translate-y-10 transition-smooth-slow"
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Side - Image */}
          <div className="lg:w-[50%]">
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-smooth-slow">
              <div className="relative aspect-[4/3]">
                <img
                  src={beritaImage}
                  alt="Featured News"
                  className="w-full h-full object-cover transition-smooth-slow hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"/>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="lg:w-[50%] space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"/>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Berita Utama</p>
                <p className="text-primary-600 font-semibold">10 Oktober 2025</p>
              </div>
            </div>

            <h2 className="text-display-sm text-gray-900 leading-tight">
              Terobosan Teknologi Migas untuk Masa Depan Berkelanjutan
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed">
              Inovasi terbaru dalam industri migas menunjukkan perkembangan signifikan 
              dalam upaya mencapai keseimbangan antara produktivitas dan kelestarian 
              lingkungan.
            </p>

            <button className="group inline-flex items-center gap-3 text-primary-600 font-semibold hover:text-primary-700 transition-smooth">
              <span>Baca Selengkapnya</span>
              <svg 
                className="w-5 h-5 transform transition-transform group-hover:translate-x-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Latest News Section */}
      <div 
        ref={newsGridRef}
        className="section-container opacity-0 translate-y-10 transition-smooth-slow"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2">Update Terkini</p>
            <h3 className="text-display-md text-gray-900">Berita Terbaru</h3>
          </div>
          <button className="group inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-smooth whitespace-nowrap">
            <span>Lihat Semua</span>
            <svg 
              className="w-5 h-5 transform transition-transform group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {newsItems.map((item, index) => (
            <NewsCard
              key={item.id}
              {...item}
              delay={index * 150} // Increased delay for smoother stagger
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Berita;