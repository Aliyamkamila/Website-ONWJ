import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { adminApi } from '../../api/adminApi';
import { format } from 'date-fns';
import { 
    FaUsers, 
    FaUserShield, 
    FaClock, 
    FaCalendar, 
    FaNewspaper, 
    FaHandHoldingHeart, 
    FaStore, 
    FaTrophy,
    FaMapMarkerAlt,
    FaQuoteLeft,
    FaFilePdf
} from 'react-icons/fa';

const DashboardPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalAdmins: 0,
        activeAdmins: 0,
        inactiveAdmins: 0,
    });
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        fetchStats();
        
        // Update waktu setiap detik
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const fetchStats = async () => {
        try {
            const response = await adminApi.getAdmins({ per_page: 999 });
            const admins = response.data.data || [];
            
            setStats({
                totalAdmins: admins.length,
                activeAdmins: admins.filter(a => a.status === 'active').length,
                inactiveAdmins: admins.filter(a => a.status === 'inactive').length,
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    const statCards = [
        {
            title: 'Total Admins',
            value: stats.totalAdmins,
            icon: FaUsers,
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Active Admins',
            value: stats.activeAdmins,
            icon: FaUserShield,
            color: 'from-green-500 to-green-600',
        },
        {
            title: 'Inactive Admins',
            value: stats.inactiveAdmins,
            icon: FaClock,
            color: 'from-yellow-500 to-yellow-600',
        },
    ];

    const quickLinks = [
        {
            title: 'Kelola Berita',
            description: 'Manajemen berita dan artikel',
            icon: FaNewspaper,
            url: '/tukang-minyak-dan-gas/manage-berita',
            color: 'blue'
        },
        {
            title: 'Kelola Program TJSL',
            description: 'Program tanggung jawab sosial',
            icon: FaHandHoldingHeart,
            url: '/tukang-minyak-dan-gas/manage-program',
            color: 'green'
        },
        {
            title: 'Kelola UMKM',
            description: 'UMKM mitra binaan',
            icon: FaStore,
            url: '/tukang-minyak-dan-gas/manage-umkm',
            color: 'purple'
        },
        {
            title: 'Kelola Penghargaan',
            description: 'Daftar penghargaan perusahaan',
            icon: FaTrophy,
            url: '/tukang-minyak-dan-gas/manage-penghargaan',
            color: 'yellow'
        },
        {
            title: 'Kelola Testimonial',
            description: 'Suara dari masyarakat',
            icon: FaQuoteLeft,
            url: '/tukang-minyak-dan-gas/manage-testimonial',
            color: 'pink'
        },
        {
            title: 'Kelola Laporan',
            description: 'Laporan tahunan perusahaan',
            icon: FaFilePdf,
            url: '/tukang-minyak-dan-gas/manage-laporan',
            color: 'red'
        },
        {
            title: 'Kelola WK TJSL',
            description: 'Wilayah kerja TJSL',
            icon: FaMapMarkerAlt,
            url: '/tukang-minyak-dan-gas/manage-wk-tjsl',
            color: 'indigo'
        },
        {
            title: 'Kelola WK TEKKOM',
            description: 'Wilayah kerja TEKKOM',
            icon: FaMapMarkerAlt,
            url: '/tukang-minyak-dan-gas/manage-wk-tekkom',
            color: 'orange'
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header dengan Live Clock */}
            <div className="flex justify-between items-start gap-6">
                <div className="bg-white rounded-xl shadow-md p-6 flex-1">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {getGreeting()}, {user?.name || 'Admin'}!
                    </h1>
                    <p className="text-gray-600 mt-2">
                        MHJ ONWJ Admin Panel - Kelola semua konten website Anda
                    </p>
                    {user?.last_login_at && (
                        <div className="flex items-center mt-4 text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-2 w-fit">
                            <FaCalendar className="mr-2" />
                            Last login: {format(new Date(user.last_login_at), 'dd MMMM yyyy, HH:mm')}
                        </div>
                    )}
                </div>

                {/* Live Clock Card */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white min-w-[280px]">
                    <div className="flex items-center gap-2 mb-3">
                        <FaClock className="w-5 h-5" />
                        <p className="text-sm font-semibold text-blue-100">Current Time</p>
                    </div>
                    <p className="text-4xl font-bold mb-2">
                        {format(currentTime, 'HH:mm:ss')}
                    </p>
                    <p className="text-sm text-blue-100">
                        {format(currentTime, 'EEEE, dd MMMM yyyy')}
                    </p>
                </div>
            </div>

            {/* Stats Cards (Style sama kayak halaman lain) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                            {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                            {loading ? (
                                <span className="inline-block w-12 h-8 bg-gray-200 rounded animate-pulse"></span>
                            ) : (
                                stat.value
                            )}
                        </p>
                    </div>
                ))}
            </div>

            {/* Informasi Akun */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi Akun</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                        <p className="text-sm text-gray-600">Email Anda</p>
                        <p className="text-lg font-medium text-gray-900">{user?.email}</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                        <p className="text-sm text-gray-600">Status Akun</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <p className="text-lg font-medium text-green-600">Active</p>
                        </div>
                    </div>
                    {user?.phone && (
                        <div className="border-l-4 border-purple-500 pl-4">
                            <p className="text-sm text-gray-600">Telepon</p>
                            <p className="text-lg font-medium text-gray-900">{user.phone}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Links (Style sama kayak halaman lain) */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Menu Cepat</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.url}
                            className="group p-5 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                        >
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-${link.color}-100 text-${link.color}-600 mb-3 group-hover:scale-110 transition-transform`}>
                                <link.icon className="w-6 h-6" />
                            </div>
                            <p className="font-semibold text-gray-900 mb-1">{link.title}</p>
                            <p className="text-xs text-gray-600">{link.description}</p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;