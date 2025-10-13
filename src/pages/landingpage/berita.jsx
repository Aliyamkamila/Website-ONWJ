import React, { useEffect, useRef } from 'react';
import beritaImage from '../../assets/rectangle.png';

// Component Card Berita
const NewsCard = ({ title, image, date, category, instagramLink, delay }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        } else {
          // Reset animation when out of view
          entry.target.classList.remove('opacity-100', 'translate-y-0');
          entry.target.classList.add('opacity-0', 'translate-y-10');
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
  }, []);

  return (
    <div 
      ref={cardRef}
      className="group cursor-pointer opacity-0 translate-y-10 transition-all duration-500 ease-out"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="rounded-2xl overflow-hidden mb-4 transform transition-all duration-500 ease-out group-hover:shadow-xl">
        <div className="relative aspect-[5/3]">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
        </div>
      </div>
      <div className="space-y-2 px-1">
        <div className="flex items-center gap-3">
          <span className="text-sm text-blue-600 font-medium">{category}</span>
          <span className="text-sm text-gray-400">{date}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {title}
        </h3>
      </div>
    </div>
  );
};

const Berita = () => {
  const featuredRef = useRef(null);
  const newsGridRef = useRef(null);

  // Data berita
  const newsItems = [
    {
      id: 1,
      title: "Inovasi Terbaru dalam Eksplorasi Energi Terbarukan di Indonesia",
      image: beritaImage,
      date: "10 Oct 2025",
      category: "Energi",
      instagramLink: "#"
    },
    {
      id: 2,
      title: "Pengembangan Teknologi Migas Ramah Lingkungan",
      image: beritaImage,
      date: "10 Oct 2025",
      category: "Teknologi",
      instagramLink: "#"
    },
    {
      id: 3,
      title: "Kerjasama Internasional dalam Pengembangan Energi Bersih",
      image: beritaImage,
      date: "10 Oct 2025",
      category: "Kerjasama",
      instagramLink: "#"
    },
    {
      id: 4,
      title: "Implementasi Smart Technology dalam Industri Migas",
      image: beritaImage,
      date: "10 Oct 2025",
      category: "Inovasi",
      instagramLink: "#"
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
      } else {
        entry.target.classList.remove('opacity-100', 'translate-y-0');
        entry.target.classList.add('opacity-0', 'translate-y-10');
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
    <section className="py-16 bg-gray-50">
      {/* Featured News */}
      <div 
        ref={featuredRef}
        className="container mx-auto px-8 lg:px-16 mb-20 opacity-0 translate-y-10 transition-all duration-500 ease-out"
      >
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Side - Image */}
          <div className="lg:w-1/2">
            <div className="rounded-3xl overflow-hidden transform transition-all duration-500 hover:shadow-xl">
              <div className="relative aspect-[4/3]">
                <img
                  src={beritaImage}
                  alt="Featured News"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"/>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="lg:w-1/2 space-y-6 px-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"/>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Featured Story</p>
                <p className="text-blue-600 font-medium">10 October 2025</p>
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              Terobosan Teknologi Migas untuk Masa Depan Berkelanjutan
            </h1>

            <p className="text-base text-gray-600 leading-relaxed">
              Inovasi terbaru dalam industri migas menunjukkan perkembangan signifikan 
              dalam upaya mencapai keseimbangan antara produktivitas dan kelestarian 
              lingkungan.
            </p>

            <button className="group inline-flex items-center gap-3 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              <span>Baca Selengkapnya</span>
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
        </div>
      </div>

      {/* Latest News Section */}
      <div 
        ref={newsGridRef}
        className="container mx-auto px-8 lg:px-16 opacity-0 translate-y-10 transition-all duration-500 ease-out"
      >
        <div className="flex justify-between items-end mb-10">
          <div>
            <h4 className="text-blue-600 font-medium mb-2">Update Terkini</h4>
            <h2 className="text-2xl font-bold text-gray-900">Berita Terbaru</h2>
          </div>
          <button className="group inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors">
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
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Berita;