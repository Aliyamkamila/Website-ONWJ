// src/pages/BeritaTJSLPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa'; // Pastikan sudah 'npm install react-icons'

// Import Aset
import bannerImage from '../assets/hero-bg.png'; // Ganti dengan gambar banner berita
import logo from '../assets/logo.webp';
import articleImage from '../assets/rectangle.png'; // Gambar untuk slider/kartu
import carouselImg1 from '../assets/contoh2.png';
import carouselImg2 from '../assets/contoh3.png';
import carouselImg3 from '../assets/contoh4.png';

// --- DATA DUMMY (Sama seperti yang kamu buat) ---
const articlesData = [
    { id: 1, slug: 'social-impact-assessment-and-community-involvement', category: 'Community Development', date: 'January 15, 2025', title: 'Social Impact Assessment and Community Involvement', description: 'We are committed to drive positive impact...', image: articleImage },
    { id: 2, slug: 'new-tree-planting-initiative-for-greener-future', category: 'Environment', date: 'December 22, 2024', title: 'New Tree Planting Initiative for a Greener Future', description: 'A new initiative focused on environmental sustainability...', image: articleImage },
    { id: 3, slug: 'artikel-ketiga-yang-baru', category: 'Environment', date: 'December 22, 2024', title: 'Artikel Ketiga yang Baru', description: 'Deskripsi artikel ketiga...', image: articleImage },
    { id: 4, slug: 'artikel-keempat-yang-baru', category: 'Community Development', date: 'January 15, 2025', title: 'Artikel Keempat yang Baru', description: 'Deskripsi artikel keempat...', image: articleImage },
    { id: 5, slug: 'artikel-kelima', category: 'Environment', date: 'November 10, 2024', title: 'Artikel Kelima', description: 'Deskripsi artikel kelima...', image: articleImage },
    { id: 6, slug: 'artikel-keenam', category: 'Community Development', date: 'October 5, 2024', title: 'Artikel Keenam', description: 'Deskripsi artikel keenam...', image: articleImage },
    // ... sisa data ...
];

// --- SUB-KOMPONEN HALAMAN (Diadaptasi dari 'Tentang Kami') ---

// 1. Hero Banner (Adaptasi dari phero.jsx)
const BeritaHero = () => (
    <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
            <img src={bannerImage} alt="Banner Berita" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        <div className="relative container mx-auto px-8 lg:px-16 h-full flex items-center">
            <div className="max-w-3xl text-white">
                <div className="flex items-center gap-2 mb-4 text-sm">
                    <Link to="/" className="text-gray-300 hover:text-white flex items-center gap-1">
                        <FaHome /> Home
                    </Link>
                    <span>/</span>
                    <span className="font-semibold text-white">Berita TJSL</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Berita TJSL</h1>
                <p className="text-lg text-gray-200 leading-relaxed">
                    Ikuti perkembangan terbaru mengenai program Tanggung Jawab Sosial dan Lingkungan kami.
                </p>
            </div>
        </div>
    </div>
);

// 2. Filter & Kategori (Adaptasi dari pprofile.jsx, tapi diganti)
const BeritaFilter = ({ categories, selected, onSelect, onSearch, searchTerm }) => (
    <div className="container mx-auto px-8 lg:px-16 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Kategori */}
            <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => onSelect(cat)}
                        className={`px-4 py-2 rounded-full font-medium transition-colors ${selected === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            {/* Search Bar */}
            <div className="relative w-full md:w-72">
                <input
                    type="text"
                    placeholder="Cari berita..."
                    value={searchTerm}
                    onChange={onSearch}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
        </div>
    </div>
);

// 3. Daftar Artikel (Adaptasi dari psejarah.jsx / pvisimisi.jsx - kita ganti jadi grid kartu)
const ArticleGrid = ({ articles }) => (
    <div className="container mx-auto px-8 lg:px-16 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
                <ArticleCard key={article.id} article={article} />
            ))}
        </div>
        {articles.length === 0 && (
            <p className="text-center text-gray-500 text-lg">Tidak ada berita yang ditemukan.</p>
        )}
    </div>
);

// Komponen Kartu Artikel (bisa dipisah ke file sendiri jika mau)
const ArticleCard = ({ article }) => (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
        <div className="h-48 overflow-hidden">
            <Link to={`/artikel/${article.slug}`}>
                <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            </Link>
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <p className="text-sm mb-2">
                <span className="font-semibold text-blue-600">{article.category}</span>
                <time dateTime={article.date} className="text-gray-400 ml-3">{article.date}</time>
            </p>
            <h2 className="text-xl font-bold text-gray-800 mb-2 leading-tight flex-grow">
                <Link to={`/artikel/${article.slug}`} className="hover:text-blue-600 transition-colors">
                    {article.title}
                </Link>
            </h2>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{article.description}</p>
            <Link to={`/artikel/${article.slug}`} className="font-semibold text-blue-600 flex items-center group self-start mt-auto" aria-label={`Read more about ${article.title}`}>
                Read More <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
        </div>
    </div>
);

// 4. Pagination (Opsional tapi penting)
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
        <nav className="flex justify-center items-center space-x-2 pb-20" aria-label="Pagination">
             <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 hover:bg-gray-100 text-gray-700 rounded-md transition-colors disabled:opacity-50"
             >‹</button>
            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-10 h-10 rounded-md font-bold transition-colors ${page === currentPage ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                    {page}
                </button>
            ))}
             <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 hover:bg-gray-100 text-gray-700 rounded-md transition-colors disabled:opacity-50"
             >›</button>
        </nav>
    );
};


// --- CUSTOM HOOK UNTUK LOGIKA ---
const useBeritaFilter = (articles) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 9; // 9 kartu per halaman (3x3 grid)

    const categories = ['All', ...new Set(articles.map(a => a.category))];

    const filteredArticles = React.useMemo(() => {
        return articles
            .filter(article => 
                selectedCategory === 'All' || article.category === selectedCategory
            )
            .filter(article => 
                article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [articles, selectedCategory, searchTerm]);

    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
    
    const paginatedArticles = React.useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredArticles.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredArticles, currentPage, itemsPerPage]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset ke halaman 1 saat search
    };

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1); // Reset ke halaman 1 saat filter
    };

    return {
        paginatedArticles,
        currentPage,
        totalPages,
        setCurrentPage,
        categories,
        selectedCategory,
        handleSelectCategory,
        searchTerm,
        handleSearch
    };
};


// --- MAIN PAGE COMPONENT ---
const BeritaTJSLPage = () => {
  const {
      paginatedArticles,
      currentPage,
      totalPages,
      setCurrentPage,
      categories,
      selectedCategory,
      handleSelectCategory,
      searchTerm,
      handleSearch
  } = useBeritaFilter(articlesData);

  return (
    <div className="bg-gray-50 min-h-screen">
      <BeritaHero />
      <BeritaFilter 
          categories={categories}
          selected={selectedCategory}
          onSelect={handleSelectCategory}
          searchTerm={searchTerm}
          onSearch={handleSearch}
      />
      <ArticleGrid articles={paginatedArticles} />
      <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
      />
      {/* Kita hilangkan "Voices from the Community" di sini agar tidak duplikat dengan halaman TJSL */}
    </div>
  );
};

export default BeritaTJSLPage;