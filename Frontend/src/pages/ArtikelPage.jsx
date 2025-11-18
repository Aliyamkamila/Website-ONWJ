import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle, FaArrowLeft, FaUsers, FaClock } from 'react-icons/fa';
import programService from '../services/programService';
import toast from 'react-hot-toast';
import bannerImage from '../assets/hero-bg.png';
import programImage from '../assets/rectangle.png';

const ArtikelPage = () => {
    const { slug } = useParams();
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recentPrograms, setRecentPrograms] = useState([]);

    useEffect(() => {
        fetchProgramDetail();
        fetchRecentPrograms();
    }, [slug]);

    const fetchProgramDetail = async () => {
        try {
            setLoading(true);
            const response = await programService.getProgramBySlug(slug);
            
            if (response.success) {
                setProgram(response.data);
            }
        } catch (error) {
            console.error('Error fetching program detail:', error);
            toast.error('Failed to load program details');
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentPrograms = async () => {
        try {
            const response = await programService.getRecentPrograms(3);
            if (response.success) {
                setRecentPrograms(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching recent programs:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!program) {
        return (
            <div className="container mx-auto px-8 py-16 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Program Not Found</h1>
                <Link to="/program-berkelanjutan" className="text-blue-600 hover:text-blue-700">
                    Back to Programs
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Banner */}
            <section className="relative h-64 w-full">
                <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50" />
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-8 lg:px-16 py-12">
                <Link 
                    to="/program-berkelanjutan" 
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
                >
                    <FaArrowLeft /> Back to Programs
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Article */}
                    <article className="lg:col-span-2 bg-white rounded-xl shadow-sm p-8">
                        {/* Header */}
                        <div className="mb-6">
                            <span className="inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
                                {program.category}
                            </span>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                {program.name}
                            </h1>
                            
                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
                                <div className="flex items-center gap-2">
                                    <FaCalendarAlt className="text-blue-600" />
                                    <span>{program.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-blue-600" />
                                    <span>{program.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        program.status === 'Aktif' 
                                            ? 'bg-green-100 text-green-800' 
                                            : program.status === 'Selesai'
                                            ? 'bg-gray-100 text-gray-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {program.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Featured Image */}
                        {program.image && (
                            <div className="mb-8 rounded-lg overflow-hidden">
                                <img 
                                    src={program.image} 
                                    alt={program.name}
                                    className="w-full h-96 object-cover"
                                    onError={(e) => {
                                        e.target.src = programImage;
                                    }}
                                />
                            </div>
                        )}

                        {/* Description */}
                        <div className="prose max-w-none mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tentang Program</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {program.description}
                            </p>
                        </div>

                        {/* Facilities */}
                        {program.facilities && program.facilities.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    Fasilitas & Kegiatan
                                </h2>
                                <ul className="space-y-3">
                                    {program.facilities.map((facility, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                                            <span className="text-gray-700">{facility}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Program Details */}
                        <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Detail Program</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <FaClock className="text-blue-600 w-5 h-5" />
                                    <div>
                                        <p className="text-sm text-gray-600">Tahun Pelaksanaan</p>
                                        <p className="font-semibold text-gray-900">{program.year}</p>
                                    </div>
                                </div>
                                
                                {program.target && (
                                    <div className="flex items-center gap-3">
                                        <FaUsers className="text-blue-600 w-5 h-5" />
                                        <div>
                                            <p className="text-sm text-gray-600">Target Penerima</p>
                                            <p className="font-semibold text-gray-900">{program.target}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <FaMapMarkerAlt className="text-blue-600 w-5 h-5" />
                                    <div>
                                        <p className="text-sm text-gray-600">Koordinat</p>
                                        <p className="font-semibold text-gray-900">
                                            {program.latitude}, {program.longitude}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        {/* Recent Programs */}
                        {recentPrograms.length > 0 && (
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">
                                    Program Terkini
                                </h3>
                                <div className="space-y-5">
                                    {recentPrograms.map((prog) => (
                                        <Link 
                                            key={prog.id} 
                                            to={`/artikel/${prog.slug}`}
                                            className="flex items-start gap-4 group"
                                        >
                                            <img 
                                                src={prog.image || programImage} 
                                                alt={prog.title}
                                                className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                                                onError={(e) => {
                                                    e.target.src = programImage;
                                                }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                    {prog.title}
                                                </h4>
                                                <p className="text-xs text-gray-400 mt-1">{prog.date}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Call to Action */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl shadow-sm text-white">
                            <h3 className="text-xl font-bold mb-2">Tertarik dengan Program Kami?</h3>
                            <p className="text-blue-100 mb-4 text-sm">
                                Hubungi kami untuk informasi lebih lanjut mengenai program TJSL
                            </p>
                            <Link 
                                to="/kontak" 
                                className="inline-block bg-white text-blue-600 font-semibold px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                Hubungi Kami
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default ArtikelPage;