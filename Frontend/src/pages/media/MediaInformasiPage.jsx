import React, { useState, useMemo, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom'; 
import PageHero from '../../components/PageHero';
import bannerImage from '../../assets/hero-bg.png'; 
import articleImage from '../../assets/rectangle.png'; 
import logo from '../../assets/logo.webp';
import { FaHome, FaYoutube, FaInstagram, FaSpinner, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; 
import instagramService from '../../services/instagramService';
import toast from 'react-hot-toast';

// Data berita artikel (dari website/internal)
const beritaArtikel = [
    { id: 1, slug: 'social-impact-assessment-and-community-involvement', category: 'Sosial', date: 'October 14, 2025', title: 'Komitmen Kami dalam Penilaian Dampak Sosial', description: 'Program penilaian dampak sosial untuk masyarakat sekitar.', image: articleImage },
    { id: 2, slug: 'new-tree-planting-initiative-for-greener-future', category: 'Lingkungan', date: 'October 12, 2025', title: 'Inisiatif Penanaman Pohon untuk Masa Depan', description: 'Program penanaman pohon untuk lingkungan yang lebih hijau.', image: articleImage },
    { id: 3, slug: 'artikel-ketiga-yang-baru', category: 'Energi', date: 'October 10, 2025', title: 'Pengembangan Energi Terbarukan di Wilayah Operasi', description: 'Inovasi dalam pengembangan energi terbarukan.', image: articleImage },
    { id: 4, slug: 'teknologi-migas-terkini', category: 'Teknologi', date: 'October 8, 2025', title: 'Teknologi Migas Terkini untuk Efisiensi Produksi', description: 'Penerapan teknologi modern dalam industri migas.', image: articleImage },
    { id: 5, slug: 'program-csr-pemberdayaan-masyarakat', category: 'Sosial', date: 'October 5, 2025', title: 'Program CSR: Pemberdayaan Masyarakat Pesisir', description: 'Memberdayakan masyarakat pesisir melalui program CSR.', image: articleImage },
    { id: 6, slug: 'inovasi-pengeboran-lepas-pantai', category: 'Teknologi', date: 'October 3, 2025', title: 'Inovasi Pengeboran Lepas Pantai', description: 'Teknologi terbaru dalam pengeboran lepas pantai.', image: articleImage },
    { id: 7, slug: 'konservasi-laut-dan-ekosistem', category: 'Lingkungan', date: 'September 30, 2025', title: 'Konservasi Laut dan Ekosistem Pesisir', description: 'Upaya pelestarian ekosistem laut dan pesisir.', image: articleImage },
    { id: 8, slug: 'kemitraan-dengan-umkm-lokal', category: 'Sosial', date: 'September 28, 2025', title: 'Kemitraan dengan UMKM Lokal', description: 'Mendukung pertumbuhan UMKM di sekitar wilayah operasi.', image: articleImage },
    { id: 9, slug: 'eksplorasi-energi-bersih', category: 'Energi', date: 'September 25, 2025', title: 'Eksplorasi Energi Bersih dan Berkelanjutan', description: 'Komitmen dalam pengembangan energi bersih.', image: articleImage },
    { id: 10, slug: 'pelatihan-keterampilan-masyarakat', category: 'Sosial', date: 'September 22, 2025', title: 'Pelatihan Keterampilan untuk Masyarakat', description: 'Program pelatihan untuk meningkatkan keterampilan masyarakat.', image: articleImage },
    { id: 11, slug: 'pengurangan-emisi-karbon', category: 'Lingkungan', date: 'September 20, 2025', title: 'Upaya Pengurangan Emisi Karbon', description: 'Strategi pengurangan emisi dalam operasi perusahaan.', image: articleImage },
    { id: 12, slug: 'digital-transformation-oil-gas', category: 'Teknologi', date: 'September 18, 2025', title: 'Transformasi Digital di Industri Migas', description: 'Implementasi teknologi digital dalam operasi.', image: articleImage },
];

const videoData = [
    { id: 1, title: "Profil Perusahaan PT Migas Hulu Jabar ONWJ", embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Mengenal lebih dekat visi, misi, dan operasi PT Migas Hulu Jabar." },
    { id: 2, title: "Inovasi Teknologi Pengeboran Lepas Pantai", embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Lihat bagaimana kami menerapkan teknologi terkini untuk memastikan keamanan dan efisiensi." },
    { id: 3, title: "Program TJSL: Pemberdayaan Masyarakat Pesisir", embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Kisah sukses program TJSL kami bersama para nelayan dan masyarakat pesisir." },
];

const featuredVideo = videoData[0]; 
const galleryVideos = videoData.slice(1); 

const MediaHero = () => (
  <PageHero
    title="Media & Informasi"
    description="Kumpulan berita, rilis media, dan galeri video terbaru dari aktivitas perusahaan kami."
    backgroundImage={bannerImage}
    heightClass="h-[45vh] min-h-[320px] max-h-[420px]"
    breadcrumbs={[
      { label: 'Beranda', to: '/' },
      { label: 'Media & Informasi' },
    ]}
  />
);

const SubNav = () => {
    const activeStyle = "font-semibold text-blue-600 border-b-2 border-blue-600 py-4";
    const inactiveStyle = "font-medium text-gray-500 hover:text-blue-600 border-b-2 border-transparent py-4 transition-colors";

    return (
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
            <nav className="container mx-auto px-8 lg:px-16 flex space-x-8">
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

const FeaturedVideo = ({ item }) => (
    <section className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="aspect-video rounded-lg overflow-hidden shadow-md">
                <iframe
                    src={item.embedUrl}
                    title={item.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                ></iframe>
            </div>
            <div className="space-y-4">
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Featured Video</p>
                <h2 className="text-3xl font-bold text-gray-900">{item.title}</h2>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
        </div>
    </section>
);

// Komponen Filter & Search
const BeritaFilter = ({ categories, selected, onSelect, onSearch, searchTerm }) => (
    <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => onSelect(cat)}
                        className={`px-4 py-2 rounded-full font-medium transition-colors ${
                            selected === cat 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="relative w-full md:w-72">
                <input
                    type="text"
                    placeholder="Cari berita..."
                    value={searchTerm}
                    onChange={onSearch}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>
    </div>
);

// Card untuk Berita Artikel
const ArtikelCard = ({ item }) => (
    <article className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col">
        <div className="h-48 overflow-hidden relative">
            <Link to={`/artikel/${item.slug}`}>
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            </Link>
        </div>
        <div className="p-5 flex flex-col flex-grow">
            <p className="text-sm mb-2">
                <span className="font-semibold text-blue-600">{item.category}</span>
                <time dateTime={item.date} className="text-gray-400 ml-3">{item.date}</time>
            </p>
            <h2 className="text-lg font-bold text-gray-800 mb-2 leading-tight flex-grow">
                <Link to={`/artikel/${item.slug}`} className="hover:text-blue-600 transition-colors line-clamp-2">
                    {item.title}
                </Link>
            </h2>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{item.description}</p>
            <Link to={`/artikel/${item.slug}`} className="font-semibold text-blue-600 flex items-center group self-start mt-auto text-sm">
                Baca Selengkapnya <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
        </div>
    </article>
);

// Card untuk Instagram Post (dari API)
const InstagramCard = ({ item }) => (
    <article className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col">
        <div className="h-48 overflow-hidden relative">
            <a href={item.instagram_url} target="_blank" rel="noopener noreferrer">
                <img 
                    src={item.image_url || articleImage} 
                    alt={item.caption} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    loading="lazy" 
                />
            </a>
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full">
                <FaInstagram className="text-pink-600 h-5 w-5" />
            </div>
        </div>
        <div className="p-5 flex flex-col flex-grow">
            <p className="text-sm mb-2 text-gray-500">
                <time dateTime={item.posted_at}>
                    {new Date(item.posted_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })}
                </time>
            </p>
            <h3 className="text-lg font-bold text-gray-800 mb-4 leading-tight flex-grow line-clamp-2">
                {item.caption || 'Post Instagram'}
            </h3>
            <a 
                href={item.instagram_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-pink-600 flex items-center gap-2 group self-start mt-auto text-sm hover:text-pink-700 transition-colors"
            >
                <FaInstagram className="h-4 w-4" />
                <span>Lihat di Instagram</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </a>
        </div>
    </article>
);

const VideoCard = ({ item }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
        <div className="aspect-video">
            <iframe
                src={item.embedUrl}
                title={item.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
            ></iframe>
        </div>
        <div className="p-5 flex-grow">
            <h3 className="font-bold text-gray-800 line-clamp-2">{item.title}</h3>
        </div>
    </div>
);

// ✅ PAGINATION COMPONENT - IMPROVED & PERFECT
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    // Function untuk generate page numbers dengan ellipsis
    const getPageNumbers = () => {
        const delta = 2; // Jumlah page di kiri & kanan current page
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            }
        }

        range.forEach((i) => {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        });

        return rangeWithDots;
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav className="flex justify-center items-center gap-2 py-8" aria-label="Pagination">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center justify-center w-10 h-10 rounded-lg font-semibold transition-all ${
                    currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-blue-600 hover:text-white border border-gray-300 hover:border-blue-600 shadow-sm'
                }`}
                aria-label="Previous page"
            >
                <FaChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            {pageNumbers.map((pageNum, index) => {
                if (pageNum === '...') {
                    return (
                        <span
                            key={`ellipsis-${index}`}
                            className="flex items-center justify-center w-10 h-10 text-gray-500 font-bold"
                        >
                            ...
                        </span>
                    );
                }

                return (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`flex items-center justify-center w-10 h-10 rounded-lg font-semibold transition-all ${
                            pageNum === currentPage
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300 hover:border-blue-400 shadow-sm'
                        }`}
                        aria-label={`Go to page ${pageNum}`}
                        aria-current={pageNum === currentPage ? 'page' : undefined}
                    >
                        {pageNum}
                    </button>
                );
            })}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center w-10 h-10 rounded-lg font-semibold transition-all ${
                    currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-blue-600 hover:text-white border border-gray-300 hover:border-blue-600 shadow-sm'
                }`}
                aria-label="Next page"
            >
                <FaChevronRight className="w-4 h-4" />
            </button>
        </nav>
    );
};

// Custom Hook untuk filter dan pagination
const useBeritaFilter = (articles) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 6;

    const categories = ['All', ...new Set(articles.map(a => a.category))];

    const filteredArticles = useMemo(() => {
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
    
    const paginatedArticles = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredArticles.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredArticles, currentPage, itemsPerPage]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); 
    };

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1); 
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

const MediaInformasiPage = () => {
    // State untuk Instagram Posts dari API
    const [instagramPosts, setInstagramPosts] = useState([]);
    const [instagramLoading, setInstagramLoading] = useState(true);

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
    } = useBeritaFilter(beritaArtikel);

    // Fetch Instagram Posts dari API
    useEffect(() => {
        const fetchInstagramPosts = async () => {
            try {
                setInstagramLoading(true);
                const response = await instagramService.getPublicPosts();
                
                if (response.success && response.data) {
                    // Filter hanya yang show_in_media = true dan status = published
                    const publishedPosts = response.data.filter(
                        post => post.show_in_media && post.status === 'published'
                    );
                    setInstagramPosts(publishedPosts);
                }
            } catch (error) {
                console.error('Error fetching Instagram posts:', error);
                // Tidak perlu toast error, biarkan section kosong saja
            } finally {
                setInstagramLoading(false);
            }
        };

        fetchInstagramPosts();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen">
            <MediaHero />
            <SubNav />
            <div className="container mx-auto px-8 lg:px-16 py-16 space-y-16">
                <FeaturedVideo item={featuredVideo} />
                
                {/* Section 1: Berita & Artikel (dengan Filter & Pagination) */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Berita & Artikel</h2>
                            <p className="text-gray-600 mt-2">Informasi terkini seputar kegiatan dan perkembangan perusahaan</p>
                        </div>
                    </div>
                    
                    {/* Filter & Search */}
                    <BeritaFilter 
                        categories={categories}
                        selected={selectedCategory}
                        onSelect={handleSelectCategory}
                        searchTerm={searchTerm}
                        onSearch={handleSearch}
                    />
                    
                    {/* Grid Berita Artikel */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                        {paginatedArticles.map((item) => (
                            <ArtikelCard key={item.id} item={item} />
                        ))}
                    </div>
                    
                    {/* Empty State */}
                    {paginatedArticles.length === 0 && (
                        <p className="text-center text-gray-500 text-lg py-12">
                            Tidak ada berita yang ditemukan.
                        </p>
                    )}
                    
                    {/* Pagination */}
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </section>

                {/* Section 2: Instagram Feed (Dari API Backend) */}
                {instagramLoading || instagramPosts.length > 0 ? (
                    <section className="bg-gradient-to-br from-pink-50 to-purple-50 -mx-8 lg:-mx-16 px-8 lg:px-16 py-16">
                        <div className="container mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                        <FaInstagram className="text-pink-600 h-8 w-8" />
                                        Update dari Instagram
                                    </h2>
                                    <p className="text-gray-600 mt-2">Ikuti kegiatan terbaru kami di media sosial</p>
                                </div>
                                <a 
                                    href="https://instagram.com/yourcompany" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-full hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <FaInstagram className="h-5 w-5" />
                                    Follow Kami
                                </a>
                            </div>
                            
                            {/* Loading State */}
                            {instagramLoading && (
                                <div className="flex justify-center items-center py-16">
                                    <FaSpinner className="w-12 h-12 text-pink-600 animate-spin" />
                                </div>
                            )}

                            {/* Grid Instagram Posts */}
                            {!instagramLoading && instagramPosts.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {instagramPosts.slice(0, 6).map((item) => (
                                        <InstagramCard key={item.id} item={item} />
                                    ))}
                                </div>
                            )}

                            {/* Empty State */}
                            {!instagramLoading && instagramPosts.length === 0 && (
                                <div className="text-center py-12">
                                    <FaInstagram className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">
                                        Belum ada update dari Instagram
                                    </p>
                                </div>
                            )}

                            {/* Mobile Follow Button */}
                            {!instagramLoading && instagramPosts.length > 0 && (
                                <div className="mt-8 flex justify-center md:hidden">
                                    <a 
                                        href="https://instagram.com/yourcompany" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-full hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg"
                                    >
                                        <FaInstagram className="h-5 w-5" />
                                        Follow Kami di Instagram
                                    </a>
                                </div>
                            )}
                        </div>
                    </section>
                ) : null}

                {/* Section 3: Video Gallery */}
                <section>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Galeri Video</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {galleryVideos.map((item) => <VideoCard key={item.id} item={item} />)}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MediaInformasiPage;