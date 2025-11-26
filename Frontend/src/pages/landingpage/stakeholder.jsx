import React from 'react';
import PemegangSaham1 from '../../assets/PemegangSaham/MUJ.webp';
import PemegangSaham2 from '../../assets/PemegangSaham/Jakpro.png';
import PemegangSaham3 from '../../assets/PemegangSaham/Petrogas.png';
import PemegangSaham4 from '../../assets/PemegangSaham/PTbumi.png';
import PemegangSaham5 from '../../assets/PemegangSaham/subang.png';
import PemegangSaham6 from '../../assets/PemegangSaham/bbwm.png';

const Stakeholder = () => {
  const stakeholderLogos = [
    { 
      src: PemegangSaham1, 
      alt: 'MUJ', 
      href: 'https://www.muj.co.id', // Ganti dengan URL yang sesuai
      title: 'MUJ' 
    },
    { 
      src: PemegangSaham2, 
      alt: 'Jakpro', 
      href: 'https://www.jakpro.co.id', // Ganti dengan URL yang sesuai
      title: 'Jakpro' 
    },
    { 
      src: PemegangSaham3, 
      alt: 'Petrogas', 
      href: 'https://www.petrogas.co.id', // Ganti dengan URL yang sesuai
      title: 'Petrogas' 
    },
    { 
      src: PemegangSaham4, 
      alt: 'PT Bumi', 
      href: 'https://www.ptbumi.co.id', // Ganti dengan URL yang sesuai
      title: 'PT Bumi' 
    },
    { 
      src: PemegangSaham5, 
      alt: 'Subang', 
      href: 'https://www.subang.co.id', // Ganti dengan URL yang sesuai
      title: 'Subang' 
    },
    { 
      src: PemegangSaham6, 
      alt: 'BBWM', 
      href: 'https://www.bbwm.co.id', // Ganti dengan URL yang sesuai
      title: 'BBWM' 
    },
  ];

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="section-container">
        <div className="text-center mb-12">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3">
            Mitra Kami
          </p>
          <h2 className="text-display-sm text-gray-900 mb-4">
            Pemegang Saham
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kami bekerja sama dengan berbagai institusi terkemuka untuk menciptakan nilai tambah bagi semua pihak.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 px-4">
          {stakeholderLogos.map((logo, index) => (
            <a
              key={index}
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              title={logo.title}
              className="flex items-center justify-center transition-all duration-300 hover:scale-110 hover:opacity-80 hover:grayscale-0"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-10 md:h-15 w-auto object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stakeholder;