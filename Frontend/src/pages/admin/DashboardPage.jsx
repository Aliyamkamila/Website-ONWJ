import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { adminApi } from '../../api/adminApi';
import { format } from 'date-fns';
import { FaUsers, FaUserShield, FaClock, FaCalendar } from 'react-icons/fa';

const DashboardPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalAdmins: 0,
        activeAdmins: 0,
        inactiveAdmins: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
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

    const statCards = [
        {
            title: 'Total Admins',
            value: stats.totalAdmins,
            icon: FaUsers,
            color: 'bg-blue-500',
            bgLight: 'bg-blue-100',
        },
        {
            title: 'Active Admins',
            value: stats.activeAdmins,
            icon: FaUserShield,
            color: 'bg-green-500',
            bgLight: 'bg-green-100',
        },
        {
            title: 'Inactive Admins',
            value: stats.inactiveAdmins,
            icon: FaClock,
            color: 'bg-yellow-500',
            bgLight: 'bg-yellow-100',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    Selamat Datang, {user?.name || 'Admin'}!
                </h1>
                <p className="text-gray-600 mt-2">
                    MHJ ONWJ Admin Panel - Kelola semua konten website Anda
                </p>
                {user?.last_login_at && (
                    <div className="flex items-center mt-3 text-sm text-gray-500">
                        <FaCalendar className="mr-2" />
                        Last login: {format(new Date(user.last_login_at), 'dd MMMM yyyy, HH:mm')}
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {loading ? (
                                        <span className="inline-block w-12 h-8 bg-gray-200 rounded animate-pulse"></span>
                                    ) : (
                                        stat.value
                                    )}
                                </p>
                            </div>
                            <div className={`${stat.color} p-4 rounded-full`}>
                                <stat.icon className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi Akun</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                        <p className="text-sm text-gray-600">Email Anda</p>
                        <p className="text-lg font-medium text-gray-900">{user?.email}</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                        <p className="text-sm text-gray-600">Status Akun</p>
                        <p className="text-lg font-medium text-green-600">Active</p>
                    </div>
                    {user?.phone && (
                        <div className="border-l-4 border-purple-500 pl-4">
                            <p className="text-sm text-gray-600">Telepon</p>
                            <p className="text-lg font-medium text-gray-900">{user.phone}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Menu Cepat</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a
                        href="/tukang-minyak-dan-gas/manage-berita"
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                    >
                        <p className="font-medium text-gray-900">Kelola Berita</p>
                    </a>
                    <a
                        href="/tukang-minyak-dan-gas/manage-program"
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                    >
                        <p className="font-medium text-gray-900">Kelola Program</p>
                    </a>
                    <a
                        href="/tukang-minyak-dan-gas/manage-umkm"
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                    >
                        <p className="font-medium text-gray-900">Kelola UMKM</p>
                    </a>
                    <a
                        href="/tukang-minyak-dan-gas/manage-penghargaan"
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                    >
                        <p className="font-medium text-gray-900">Kelola Penghargaan</p>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;