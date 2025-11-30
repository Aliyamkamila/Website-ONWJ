import React from 'react';
import companyImage from '../../assets/contoh2.png';

/**
 * PProfile Component - REDESIGN TOTAL
 * 
 * Konsep: "Company Snapshot" 
 * - Hero-style dengan gambar besar
 * - Stats overlay untuk visual impact
 * - Storytelling approach
 */
const PProfile = () => {
  const highlights = [
    { value: "2016", label: "Didirikan", suffix: "" },
    { value: "1.000", label: "Karyawan", suffix: "+" },
    { value: "6", label: "Provinsi", suffix: "" },
    { value: "500", label: "Kapasitas", suffix: "MW" },
  ];

  return (
    <section className="relative" aria-labelledby="profile-title">
      {/* Main Content Area */}
      <div className="section-container py-grid-12 lg:py-grid-16">
        
        {/* Two Column Layout - Text + Image */}
        <div className="grid lg:grid-cols-12 gap-grid-8 lg:gap-grid-12 items-center">
          
          {/* Left: Text Content */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <span className="text-label-md text-primary-600 uppercase tracking-wider">
              Siapa Kami
            </span>
            
            <h2 
              id="profile-title" 
              className="text-display-lg lg:text-display-xl font-bold text-secondary-900 mt-grid-3 mb-grid-6"
            >
              Membangun Masa Depan Energi Indonesia
            </h2>
            
            <p className="text-body-lg text-secondary-600 leading-relaxed mb-grid-6">
              Sebagai pengelola Partisipasi Indonesia 10% Daerah, kami berkomitmen 
              mengoptimalkan nilai tambah bagi masyarakat dan mendukung pembangunan 
              berkelanjutan di wilayah operasi.
            </p>
            
            <p className="text-body-md text-secondary-500 leading-relaxed mb-grid-8">
              Berdiri sejak 2016, kami telah berkembang menjadi salah satu 
              perusahaan terdepan dalam pengelolaan aset energi dengan jangkauan 
              operasional di 6 provinsi strategis di Indonesia.
            </p>

            {/* CTA */}
            <a 
              href="#sejarah" 
              className="inline-flex items-center gap-grid-2 
                         text-primary-600 hover:text-primary-700
                         font-semibold text-body-md
                         group transition-colors duration-base"
            >
              Lihat Perjalanan Kami
              <svg 
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-base" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Right: Image with Stats Overlay */}
          <div className="lg:col-span-7 order-1 lg:order-2 relative">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={companyImage}
                alt="Operasional perusahaan"
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
              />
              
              {/* Gradient Overlay */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-secondary-900/80 via-transparent to-transparent"
                aria-hidden="true"
              />
              
              {/* Stats Bar - Overlay di bawah gambar */}
              <div className="absolute bottom-0 left-0 right-0 p-grid-6">
                <div className="grid grid-cols-4 gap-grid-4">
                  {highlights.map((item, index) => (
                    <div 
                      key={index} 
                      className="text-center"
                    >
                      <p className="text-display-md lg:text-display-lg font-bold text-white">
                        {item.value}
                        <span className="text-primary-400">{item.suffix}</span>
                      </p>
                      <p className="text-body-xs text-secondary-300 mt-grid-1">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative Badge */}
            <div 
              className="absolute -top-4 -right-4 lg:-top-6 lg:-right-6
                         w-24 h-24 lg:w-32 lg:h-32
                         bg-primary-600 rounded-full
                         flex flex-col items-center justify-center
                         text-white shadow-lg"
            >
              <span className="text-display-sm lg:text-display-md font-bold">8+</span>
              <span className="text-body-xs text-primary-100">Tahun</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PProfile;