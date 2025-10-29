// src/pages/TJSLPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Import aset yang kita butuhkan
import platformImage from '../assets/contoh1.png';
import programImage from '../assets/rectangle.png'; // Gambar untuk program & berita
import carouselImg1 from '../assets/contoh2.png';
import carouselImg2 from '../assets/contoh3.png';
import carouselImg3 from '../assets/contoh4.png';
import logo from '../assets/logo.webp';
import { FaHome } from 'react-icons/fa';

// --- DATA DUMMY ---
// Data untuk Quick Facts
const quickFactsData = [
  { title: "Program Pemberdayaan", value: "50+", bgColor: "bg-blue-50", icon: <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { title: "Penerima Manfaat", value: "10,000+", bgColor: "bg-green-50", icon: <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
  { title: "Pohon Ditanam", value: "25,000+", bgColor: "bg-purple-50", icon: <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg> },
  { title: "Beasiswa Pendidikan", value: "1,500+", bgColor: "bg-orange-50", icon: <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.747 0-3.332.477-4.5 1.253" /></svg> },
];

// Data untuk Slider Program Unggulan
const slideData = [
    { title: 'Program Pendidikan', content: 'Memberikan beasiswa dan merenovasi sekolah untuk masa depan generasi penerus yang lebih cerah.', image: carouselImg1, link: '#' },
    { title: 'Program Lingkungan', content: 'Melakukan penanaman mangrove dan konservasi terumbu karang di wilayah pesisir.', image: carouselImg2, link: '#' },
    { title: 'Program Kesehatan', content: 'Menyediakan layanan kesehatan gratis dan perbaikan fasilitas sanitasi untuk masyarakat sekitar.', image: carouselImg3, link: '#' },
];

// Data untuk Berita Terkait TJSL
const newsItems = [
    { id: 1, slug: 'social-impact-assessment-and-community-involvement', category: 'TJSL Update', date: '15 Jan 2025', title: 'Hasil Penilaian Dampak Sosial Terbaru Dirilis', description: 'Laporan komprehensif mengenai dampak operasi kami terhadap komunitas lokal kini tersedia...', image: programImage },
    { id: 2, slug: 'new-tree-planting-initiative-for-greener-future', category: 'Lingkungan', date: '22 Des 2024', title: 'Penanaman Ribuan Pohon di Area Pesisir Utara', description: 'Sebagai bagian dari komitmen lingkungan, kami menanam lebih dari 5.000 bibit mangrove...', image: programImage },
    { id: 3, slug: 'artikel-ketiga-yang-baru', category: 'Pendidikan', date: '10 Nov 2024', title: 'Program Beasiswa Mencapai Target Penerima Baru', description: 'Tahun ini, program beasiswa kami berhasil menjangkau 1.500 siswa berprestasi...', image: programImage },
    { id: 4, slug: 'artikel-keempat-yang-baru', category: 'Kesehatan', date: '05 Okt 2024', title: 'Peresmian Fasilitas Sanitasi Air Bersih di Desa Mitra', description: 'Fasilitas baru ini diharapkan dapat meningkatkan kualitas kesehatan masyarakat sekitar...', image: programImage },
    { id: 5, slug: 'artikel-keempat-yang-baru', category: 'Kesehatan', date: '05 Okt 2024', title: 'Peresmian Fasilitas Sanitasi Air Bersih di Desa Mitra', description: 'Fasilitas baru ini diharapkan dapat meningkatkan kualitas kesehatan masyarakat sekitar...', image: programImage },
  ];

// --- DATA BARU UNTUK TESTIMONI ---
const testimonials = [
    { id: 1, name: 'Budi Santoso', text: 'Program beasiswa ini sangat membantu anak saya untuk terus bersekolah. Terima kasih!', avatar: 'https://via.placeholder.com/48?text=BS' },
    { id: 2, name: 'Siti Aminah', text: 'Penanaman mangrove membuat pantai kami lebih aman dari abrasi. Luar biasa!', avatar: 'https://via.placeholder.com/48?text=SA' },
    { id: 3, name: 'Joko Susilo', text: 'Akses air bersih sekarang jauh lebih mudah berkat program sanitasi. Warga sangat bersyukur.', avatar: 'https://via.placeholder.com/48?text=JS' },
];


// --- SUB-KOMPONEN ---

// Komponen Hero Banner
const TJSLHero = () => (
  <div className="relative h-[60vh] overflow-hidden">
    <div className="absolute inset-0">
      <img src={platformImage} alt="Platform" className="w-full h-full object-cover"/>
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"/>
    </div>
    <div className="relative container mx-auto px-8 lg:px-16 h-full flex items-center">
      <div className="max-w-3xl text-white">
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Link to="/" className="text-gray-300 hover:text-white flex items-center gap-1"><FaHome /> Home</Link>
          <span>/</span><span className="font-semibold text-white">TJSL</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Tanggung Jawab Sosial & Lingkungan</h1>
        <p className="text-lg text-gray-200 leading-relaxed">Komitmen PT Migas Hulu Jabar ONWJ untuk tumbuh bersama masyarakat dan menjaga kelestarian lingkungan demi masa depan yang berkelanjutan.</p>
      </div>
    </div>
  </div>
);

// Komponen Profil & Quick Facts
const TJSLProfile = ({ quickFacts }) => (
  <div className="container mx-auto px-8 lg:px-16 py-20 bg-white">
    <div className="max-w-4xl mx-auto text-center mb-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Fokus Utama TJSL Kami</h2>
      <p className="text-gray-600 leading-relaxed">Kami percaya bahwa kesuksesan bisnis harus sejalan dengan kesejahteraan masyarakat dan kelestarian lingkungan...</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {quickFacts.map((fact, index) => (
        <div key={index} className={`${fact.bgColor} p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white shadow-sm rounded-lg">{fact.icon}</div>
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

// Komponen Slider Program Unggulan
const ProgramUnggulan = ({ slides }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => { const timer = setTimeout(() => {setActiveSlide((prev) => (prev + 1) % slides.length)}, 7000); return () => clearTimeout(timer); }, [activeSlide, slides.length]);

  return (
    <section className="relative py-20 overflow-hidden bg-gray-50">
      <div className="container mx-auto px-8 lg:px-16">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Program Unggulan Kami</h2>
        <div className="relative h-[450px]">
          {slides.map((item, index) => (
            <div key={index} className={`absolute inset-0 w-full transition-opacity duration-1000 ease-in-out ${index === activeSlide ? 'opacity-100' : 'opacity-0'}`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.content}</p>
                  <Link to={item.link} className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition">Pelajari Lebih Lanjut</Link>
                </div>
                <div className="relative h-full hidden lg:block"><div className="absolute inset-0 rounded-3xl overflow-hidden shadow-xl"><img src={item.image} alt={item.title} className="w-full h-full object-cover"/></div></div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-3 mt-8">{slides.map((_, index) => ( <button key={index} onClick={() => setActiveSlide(index)} className={`w-3 h-3 rounded-full transition-colors ${activeSlide === index ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'}`}/> ))}</div>
      </div>
    </section>
  );
};

// Komponen Kartu Berita (Mirip landing page)
const NewsCard = ({ news, delay }) => {
    const cardRef = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) entry.target.classList.add('opacity-100', 'translate-y-0');
        }, { threshold: 0.1 });
        if (cardRef.current) observer.observe(cardRef.current);
        return () => { if (cardRef.current) observer.unobserve(cardRef.current) };
    }, []);

    return (
      <div ref={cardRef} className="group cursor-pointer opacity-0 translate-y-10 transition-all duration-500 ease-out" style={{ transitionDelay: `${delay}ms` }}>
        <div className="rounded-2xl overflow-hidden mb-4 transform transition-all duration-300 group-hover:shadow-xl hover:-translate-y-1">
          <Link to={`/artikel/${news.slug}`}>
            <div className="relative aspect-[5/3] overflow-hidden">
                <img src={news.image} alt={news.title} className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
            </div>
          </Link>
        </div>
        <div className="space-y-2 px-1">
          <div className="flex items-center gap-3">
            <span className="text-sm text-blue-600 font-medium">{news.category}</span>
            <span className="text-sm text-gray-400">{news.date}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            <Link to={`/artikel/${news.slug}`}>{news.title}</Link>
          </h3>
        </div>
      </div>
    );
};

// Komponen Section Berita (Termasuk Featured Story)
const TJSLBeritaSection = ({ featuredNews, latestNews }) => (
    <section className="bg-gray-100 py-24">
        <div className="container mx-auto px-8 lg:px-16">
          {featuredNews && (
            <div className="mb-20">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="lg:w-1/2"><div className="rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"><Link to={`/artikel/${featuredNews.slug}`}><div className="relative aspect-[4/3]"><img src={featuredNews.image} alt="Featured News" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"/></div></Link></div></div>
                    <div className="lg:w-1/2 space-y-6 px-4">
                        <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center"><svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"/></svg></div><div><p className="text-sm text-gray-500">Featured Story</p><p className="text-blue-600 font-medium">{featuredNews.date}</p></div></div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight"><Link to={`/artikel/${featuredNews.slug}`} className="hover:text-blue-700 transition-colors">{featuredNews.title}</Link></h2>
                        <p className="text-base text-gray-600 leading-relaxed">{featuredNews.description}</p>
                        <Link to={`/artikel/${featuredNews.slug}`} className="group inline-flex items-center gap-3 text-blue-600 font-semibold hover:text-blue-700 transition-colors"><span>Baca Selengkapnya</span><svg className="w-5 h-5 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg></Link>
                    </div>
                </div>
            </div>
          )}
          <div className="flex justify-between items-end mb-10">
            <div><h4 className="text-blue-600 font-medium mb-1 text-sm uppercase tracking-wider">Update Terkini</h4><h2 className="text-3xl font-bold text-gray-900">Berita Terbaru</h2></div>
            <Link to="/berita-tjsl" className="group inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors text-sm">
                <span>Lihat Semua</span><svg className="w-5 h-5 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestNews.map((item, index) => (<NewsCard key={item.id} news={item} delay={index * 100} />))}
          </div>
        </div>
    </section>
);

// --- KOMPONEN BARU: TESTIMONI ---
const TestimonialCard = ({ testimonial }) => (
    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100 transform transition-transform hover:scale-105">
        <blockquote className="text-gray-600 italic text-lg mb-6 relative">
            <span className="text-blue-500 text-4xl absolute -top-4 -left-4">“</span>
            "{testimonial.text}"
        </blockquote>
        <div className="flex items-center gap-4">
            <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full" />
            <cite className="font-bold text-gray-800 not-italic">- {testimonial.name}</cite>
        </div>
    </div>
);

const TJSLVoicesSection = ({ testimonials }) => (
    <section className="bg-blue-50 py-24" aria-labelledby="testimonials-heading">
        <div className="container mx-auto px-8 lg:px-16">
            <h2 id="testimonials-heading" className="text-4xl font-bold text-center mb-16 text-gray-900">
                Voices From The Community
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                    <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))}
            </div>
        </div>
    </section>
);


const TJSLPage = () => {
  // Ambil berita pertama sebagai featured, sisanya sebagai latest
  const featuredNews = newsItems.length > 0 ? newsItems[0] : null;
  const latestNews = newsItems.slice(1); // Ambil semua kecuali yang pertama

  return (
    <div className="min-h-screen bg-white">
      <TJSLHero />
      <TJSLProfile quickFacts={quickFactsData} />
      <ProgramUnggulan slides={slideData} />
      <TJSLBeritaSection featuredNews={featuredNews} latestNews={latestNews} />
      <TJSLVoicesSection testimonials={testimonials} />
    </div>
  );
};
  
export default TJSLPage;