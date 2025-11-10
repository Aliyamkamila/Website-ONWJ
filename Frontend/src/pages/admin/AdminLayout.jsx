// src/pages/admin/AdminLayout.jsx
import React from 'react';
import { Link, Outlet, NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.webp';
import { FaTachometerAlt, FaNewspaper, FaAward, FaSignOutAlt } from 'react-icons/fa';

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Nanti di sini kita hapus token
        alert('Logout berhasil!');
        navigate('/admin/login');
    };

    const navLinkClasses = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`;

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <Link to="/admin/dashboard" className="flex items-center gap-3">
                        <img src={logo} alt="Logo" className="w-10 h-auto" />
                        <span className="text-lg font-bold text-gray-800">Admin Panel</span>
                    </Link>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                    <NavLink to="/admin/dashboard" className={navLinkClasses} end>
                        <FaTachometerAlt />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/admin/manage-berita" className={navLinkClasses}>
                        <FaNewspaper />
                        <span>Kelola Berita</span>
                    </NavLink>
                    <NavLink to="/admin/manage-penghargaan" className={navLinkClasses}>
                        <FaAward />
                        <span>Kelola Penghargaan</span>
                    </NavLink>
                    {/* Tambahkan link kelola lain di sini */}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8 overflow-auto">
                <Outlet /> {/* Ini adalah tempat halaman (DashboardPage, ManageBerita, etc.) akan muncul */}
            </main>
        </div>
    );
};

export default AdminLayout;