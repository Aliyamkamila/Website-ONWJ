  // src/pages/TJSLPage.jsx
  import React, { useState, useEffect, useRef } from 'react';
  import { Link } from 'react-router-dom';

  // Import aset yang kita butuhkan
  import platformImage from '../assets/contoh1.png';
  import programImage from '../assets/rectangle.png'; // Gambar untuk program
  import carouselImg1 from '../assets/contoh2.png';
  import carouselImg2 from '../assets/contoh3.png';
  import carouselImg3 from '../assets/contoh4.png';
  import { FaHome } from 'react-icons/fa';

  // --- IMPORT BARU ---
  // Kita panggil komponen Berita dari landing page
  import Berita from './landingpage/berita'; 

  // --- KOMPONEN-KOMPONEN HALAMAN TJSL ---

  // 1. Hero Banner (diadaptasi dari phero.jsx)
  const TJSLHero = () => (
    <div className="relative h-[60vh] overflow-hidden">
      <div className="absolute inset-0">
        <img src={platformImage} alt="Platform" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
      </div>
      <div className="relative container mx-auto px-8 lg:px-16 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <div className="flex items-center gap-2 mb-4 text-sm">
            <Link to="/" className="text-gray-300 hover:text-white flex items-center gap-1">
              <FaHome /> Home
            </Link>
            <span>/</span>
            <span className="text-blue-400">TJSL</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Tanggung Jawab Sosial & Lingkungan (TJSL)
          </h1>
          <p className="text-lg text-gray-200">
            Komitmen kami untuk tumbuh bersama masyarakat dan menjaga kelestarian lingkungan.
          </p>
        </div>
      </div>
    </div>
  );

  // 2. Profil & Quick Facts (diadaptasi dari pprofile.jsx)
  const TJSLProfile = () => {
    const quickFacts = [
      { title: "Program Pemberdayaan", value: "50+", bgColor: "bg-blue-50", icon: <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
      { title: "Penerima Manfaat", value: "10,000+", bgColor: "bg-green-50", icon: <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
      { title: "Pohon Ditanam", value: "25,000+", bgColor: "bg-purple-50", icon: <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg> },
      { title: "Beasiswa Pendidikan", value: "1,500+", bgColor: "bg-orange-50", icon: <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.747 0-3.332.477-4.5 1.253" /></svg> },
    ];
    return (
      <div className="container mx-auto px-8 lg:px-16 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Fokus Utama TJSL Kami</h2>
          <p className="text-gray-600 leading-relaxed">
            Kami percaya bahwa kesuksesan bisnis harus sejalan dengan kesejahteraan masyarakat dan kelestarian lingkungan. Program TJSL kami berfokus pada empat pilar utama untuk menciptakan dampak positif yang berkelanjutan.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickFacts.map((fact, index) => (
            <div key={index} className={`${fact.bgColor} p-6 rounded-xl hover:scale-105 transition-transform duration-300`}>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/90 rounded-lg">{fact.icon}</div>
                <div>
                  <h4 className="font-medium text-gray-700">{fact.title}</h4>
                  <p className="text-2xl font-bold text-gray-900">{fact.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 3. Slider Program Unggulan (diadaptasi dari psejarah.jsx)
  const ProgramUnggulan = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    
    const slideData = [
      { title: 'Program Pendidikan', content: 'Memberikan beasiswa dan merenovasi sekolah untuk masa depan generasi penerus yang lebih cerah.', image: carouselImg1 },
      { title: 'Program Lingkungan', content: 'Melakukan penanaman mangrove dan konservasi terumbu karang di wilayah pesisir.', image: carouselImg2 },
      { title: 'Program Kesehatan', content: 'Menyediakan layanan kesehatan gratis dan perbaikan fasilitas sanitasi untuk masyarakat sekitar.', image: carouselImg3 },
    ];

    useEffect(() => {
      const timer = setTimeout(() => {
        setActiveSlide((prev) => (prev + 1) % slideData.length);
      }, 5000);
      return () => clearTimeout(timer);
    }, [activeSlide]);

    return (
      <section className="relative py-20 overflow-hidden bg-white">
        <div className="container mx-auto px-8 lg:px-16">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            Program Unggulan Kami
          </h2>
          <div className="relative h-[450px]">
            {slideData.map((item, index) => (
              <div
                key={index}
                className={`absolute inset-0 w-full transition-opacity duration-1000 ease-in-out ${index === activeSlide ? 'opacity-100' : 'opacity-0'}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h3 className="text-3xl font-bold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.content}</p>
                  </div>
                  <div className="relative">
                    <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-3 mt-8">
              {slideData.map((_, index) => (
                  <button
                      key={index}
                      onClick={() => setActiveSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${activeSlide === index ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'}`}
                  />
              ))}
          </div>
        </div>
      </section>
    );
  };

  // 4. Prinsip TJSL (diadaptasi dari pvisimisi.jsx)
  const TJSLPrinsip = () => {
    const data = {
      pilar1: { title: "Pendidikan", content: "Mencerdaskan kehidupan bangsa melalui program beasiswa dan infrastruktur.", color: "bg-blue-50" },
      pilar2: { title: "Kesehatan", content: "Meningkatkan kualitas hidup masyarakat melalui layanan kesehatan.", color: "bg-green-50" },
      pilar3: { title: "Lingkungan", content: "Menjaga kelestarian alam melalui program konservasi.", color: "bg-purple-50" },
    };
    return (
      <div className="container mx-auto px-8 lg:px-16 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Pilar Utama TJSL
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {Object.values(data).map((item, index) => (
            <div key={index} className={`${item.color} p-8 rounded-2xl transition-transform hover:scale-105 duration-300`}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };


  // --- GABUNGAN SEMUA KOMPONEN ---
  const TJSLPage = () => {
    return (
      <div className="min-h-screen bg-white">
        <TJSLHero />
        <TJSLProfile />
        <ProgramUnggulan />
        <TJSLPrinsip />
        <Berita />
        
      </div>
    );
  };

  export default TJSLPage;