// src/pages/UmkmPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaStore, FaBookOpen, FaPhone, FaWhatsapp } from 'react-icons/fa';

// --- Aset Placeholder ---
import bannerImage from '../assets/hero-bg.png';
import featuredImage from '../assets/contoh1.png';
import productImage from '../assets/rectangle.png';

// --- SUB-KOMPONEN HALAMAN ---

// 1. Hero Banner
const UmkmHero = () => (
    <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
            <img src={bannerImage} alt="Banner UMKM" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        <div className="relative container mx-auto px-8 lg:px-16 h-full flex items-center">
            <div className="max-w-3xl text-white">
                <div className="flex items-center gap-2 mb-4 text-sm">
                    <Link to="/" className="text-gray-300 hover:text-white flex items-center gap-1">
                        <FaHome /> Home
                    </Link>
                    <span>/</span>
                    <Link to="/tjsl" className="text-gray-300 hover:text-white">TJSL</Link>
                    <span>/</span>
                    <span className="font-semibold text-white">UMKM Binaan</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">UMKM Binaan</h1>
                <p className="text-lg text-gray-200 leading-relaxed">
                    Etalase produk dan cerita sukses dari para mitra binaan UMKM kami yang berdaya dan mandiri.
                </p>
            </div>
        </div>
    </div>
);

// 2. Featured Story Section
const FeaturedUmkm = ({ item }) => {
    if (!item) return null;
    
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-8 lg:px-16">
                <div className="flex flex-col lg:flex-row items-center gap-12 bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl shadow-lg border border-blue-100">
                    <div className="lg:w-1/2">
                        <div className="rounded-2xl overflow-hidden shadow-xl">
                            <img 
                                src={item.imageUrl || featuredImage} 
                                alt={item.name} 
                                className="w-full h-full object-cover aspect-[4/3]" 
                            />
                        </div>
                    </div>
                    <div className="lg:w-1/2 space-y-6">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                                ⭐ Cerita Sukses Unggulan
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                {item.category}
                            </span>
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900">{item.name}</h2>
                        
                        {item.testimonial && (
                            <blockquote className="text-lg italic text-gray-700 border-l-4 border-blue-500 pl-4 bg-white p-4 rounded-r-lg shadow-sm">
                                "{item.testimonial}"
                                <cite className="block not-italic text-base font-semibold text-gray-800 mt-3">
                                    - {item.owner}, {item.location}
                                </cite>
                            </blockquote>
                        )}

                        {item.achievement && (
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm font-semibold text-gray-700 mb-1">📈 Pencapaian:</p>
                                <p className="text-gray-600">{item.achievement}</p>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-3">
                            {item.shopLink && (
                                <a 
                                    href={item.shopLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-2 bg-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-green-600 transition-colors"
                                >
                                    <FaStore /> Kunjungi Toko
                                </a>
                            )}
                            {item.contactNumber && (
                                <a 
                                    href={`https://wa.me/${item.contactNumber.replace(/\D/g, '')}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
                                >
                                    <FaWhatsapp /> Hubungi via WhatsApp
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// 3. Kartu Galeri UMKM
const UmkmCard = ({ item }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
        <div className="h-48 overflow-hidden relative">
            <img 
                src={item.imageUrl || productImage} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                loading="lazy" 
            />
            {item.status && (
                <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'Aktif' 
                            ? 'bg-green-500 text-white' 
                            : item.status === 'Lulus Binaan'
                            ? 'bg-purple-500 text-white'
                            : 'bg-yellow-500 text-white'
                    }`}>
                        {item.status}
                    </span>
                </div>
            )}
        </div>
        <div className="p-5 flex flex-col flex-grow">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full self-start">
                {item.category}
            </span>
            <h3 className="text-lg font-bold text-gray-800 mt-3 mb-1 line-clamp-2">
                {item.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {item.description}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {item.location}
            </div>
            
            <div className="mt-auto flex flex-col gap-2">
                {item.shopLink && (
                    <a 
                        href={item.shopLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center justify-center gap-2 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                        <FaStore /> Kunjungi Toko
                    </a>
                )}
                {item.contactNumber && (
                    <a 
                        href={`https://wa.me/${item.contactNumber.replace(/\D/g, '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center justify-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                        <FaWhatsapp /> WhatsApp
                    </a>
                )}
                {!item.shopLink && !item.contactNumber && (
                    <div className="text-center py-2 text-gray-500 text-sm">
                        Informasi kontak tersedia
                    </div>
                )}
            </div>
        </div>
    </div>
);

// 4. Filter Categories
const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
        <button
            onClick={() => onCategoryChange('Semua')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeCategory === 'Semua'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
        >
            Semua ({categories.all})
        </button>
        {Object.entries(categories).map(([cat, count]) => {
            if (cat === 'all') return null;
            return (
                <button
                    key={cat}
                    onClick={() => onCategoryChange(cat)}
                    className={`px-6 py-2 rounded-full font-medium transition-colors ${
                        activeCategory === cat
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                    {cat} ({count})
                </button>
            );
        })}
    </div>
);

// --- MAIN PAGE COMPONENT ---
const UmkmPage = () => {
    const [umkmData, setUmkmData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Semua');

    // Fetch data dari API
    useEffect(() => {
        const fetchUmkmData = async () => {
            try {
                setLoading(true);
                
                // TODO: Ganti dengan endpoint API yang sebenarnya
                // const response = await fetch('/api/umkm');
                // const data = await response.json();
                
                // SEMENTARA: Gunakan data dummy untuk testing
                const dummyData = [
                    { 
                        id: 1,
                        name: 'Kopi Mangrove Segara',
                        category: 'Kuliner',
                        owner: 'Ibu Siti',
                        location: 'Muara Gembong, Bekasi',
                        description: 'Kopi olahan dari biji kopi lokal dengan sentuhan aroma mangrove khas pesisir. Dikemas higienis dan ramah lingkungan.',
                        testimonial: 'Dulu saya cuma bisa jual 10 bungkus, setelah dapat pelatihan pengemasan dari MUJ ONWJ, sekarang bisa kirim ke luar kota. Omzet naik 300%!',
                        shopLink: 'https://tokopedia.com/kopi-mangrove',
                        contactNumber: '6281234567890',
                        status: 'Aktif',
                        yearStarted: 2024,
                        achievement: 'Omzet naik 300%, ekspor ke 5 kota',
                        isFeatured: true,
                        imageUrl: null
                    },
                    { 
                        id: 2,
                        name: 'Kerajinan Enceng Gondok',
                        category: 'Kerajinan',
                        owner: 'Bapak Joko',
                        location: 'Kalibaru, Jakarta Utara',
                        description: 'Produk kerajinan tangan dari enceng gondok yang ramah lingkungan. Berbagai macam tas, tempat pensil, dan aksesori rumah.',
                        testimonial: '',
                        shopLink: 'https://shopee.co.id/kerajinan-gondok',
                        contactNumber: '6281398765432',
                        status: 'Aktif',
                        yearStarted: 2023,
                        achievement: '50 produk terjual/bulan',
                        isFeatured: false,
                        imageUrl: null
                    },
                    { 
                        id: 3,
                        name: 'Madu Hutan Asli Subang',
                        category: 'Agribisnis',
                        owner: 'Ibu Aminah',
                        location: 'Mayangan, Subang',
                        description: 'Madu murni dari hutan Subang, dipanen langsung dari sarang lebah liar. Kualitas terjamin dan organik.',
                        testimonial: '',
                        shopLink: '',
                        contactNumber: '6281222333444',
                        status: 'Aktif',
                        yearStarted: 2023,
                        achievement: '100 botol/bulan',
                        isFeatured: false,
                        imageUrl: null
                    },
                    { 
                        id: 4,
                        name: 'Olahan Ikan Balongan',
                        category: 'Kuliner',
                        owner: 'Bapak Udin',
                        location: 'Balongan, Indramayu',
                        description: 'Berbagai olahan ikan segar khas Balongan. Ikan asin, kerupuk ikan, dan produk laut berkualitas.',
                        testimonial: '',
                        shopLink: 'https://shopee.co.id/olahan-ikan',
                        contactNumber: '',
                        status: 'Aktif',
                        yearStarted: 2024,
                        achievement: 'Distribusi ke 10 toko',
                        isFeatured: false,
                        imageUrl: null
                    },
                    { 
                        id: 5,
                        name: 'Batik Pesisir',
                        category: 'Fashion',
                        owner: 'Ibu Dewi',
                        location: 'Sungai Buntu, Karawang',
                        description: 'Batik tulis khas pesisir dengan motif tradisional dan modern. Kualitas premium dengan pewarna alami.',
                        testimonial: '',
                        shopLink: '',
                        contactNumber: '6281555666777',
                        status: 'Lulus Binaan',
                        yearStarted: 2022,
                        achievement: 'Pameran di Jakarta Fashion Week',
                        isFeatured: false,
                        imageUrl: null
                    },
                ];

                // Simulasi delay API
                await new Promise(resolve => setTimeout(resolve, 500));
                
                setUmkmData(dummyData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching UMKM data:', error);
                setLoading(false);
                alert('Gagal memuat data UMKM. Silakan refresh halaman.');
            }
        };

        fetchUmkmData();
    }, []);

    // Get featured UMKM
    const featuredUmkm = umkmData.find(item => item.isFeatured);

    // Filter UMKM by category
    const filteredUmkm = activeCategory === 'Semua' 
        ? umkmData.filter(item => !item.isFeatured) // Exclude featured from gallery
        : umkmData.filter(item => !item.isFeatured && item.category === activeCategory);

    // Count categories
    const categoryCounts = umkmData.reduce((acc, item) => {
        if (!item.isFeatured) { // Don't count featured in gallery
            acc.all = (acc.all || 0) + 1;
            acc[item.category] = (acc[item.category] || 0) + 1;
        }
        return acc;
    }, {});

    return (
        <div className="bg-gray-50 min-h-screen">
            <UmkmHero />
            
            {/* Featured UMKM */}
            {!loading && featuredUmkm && <FeaturedUmkm item={featuredUmkm} />}

            {/* Gallery Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-8 lg:px-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
                        Galeri UMKM Binaan
                    </h2>
                    <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                        Berbagai produk berkualitas dari UMKM binaan yang telah kami dampingi untuk berkembang dan mandiri
                    </p>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-12">
                            <div className="animate-pulse">
                                <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-8"></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="bg-white rounded-xl p-4">
                                            <div className="h-48 bg-gray-200 rounded mb-4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Category Filter */}
                    {!loading && Object.keys(categoryCounts).length > 1 && (
                        <CategoryFilter 
                            categories={categoryCounts}
                            activeCategory={activeCategory}
                            onCategoryChange={setActiveCategory}
                        />
                    )}

                    {/* UMKM Cards Grid */}
                    {!loading && filteredUmkm.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {filteredUmkm.map((item) => (
                                <UmkmCard key={item.id} item={item} />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && filteredUmkm.length === 0 && (
                        <div className="text-center py-12">
                            <FaStore className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">
                                {activeCategory === 'Semua' 
                                    ? 'Belum ada UMKM binaan yang ditambahkan.' 
                                    : `Belum ada UMKM di kategori ${activeCategory}.`}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default UmkmPage;