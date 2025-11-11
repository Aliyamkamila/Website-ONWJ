// src/pages/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, Outlet, NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.webp';
import { 
    FaTachometerAlt, FaNewspaper, FaAward, FaSignOutAlt, 
    FaChevronDown, FaUsers, FaBroadcastTower, FaWallet 
} from 'react-icons/fa';

// Komponen untuk satu link di sidebar
const SidebarLink = ({ to, icon, label }) => {
    const navLinkClasses = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`;
    return (
        <NavLink to={to} className={navLinkClasses} end>
            {icon}
            <span>{label}</span>
        </NavLink>
    );
};

// Komponen untuk dropdown divisi
const SidebarDropdown = ({ title, icon, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <span className="font-medium">{title}</span>
                </div>
                <FaChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="mt-2 pl-8 space-y-2">
                    {children}
                </div>
            )}
        </div>
    );
};

const AdminLayout = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        alert('Logout berhasil!');
        navigate('/admin/login');
    };

    const subLinkClasses = ({ isActive }) =>
        `block px-3 py-2 rounded-md text-sm transition-colors ${
            isActive
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
        }`;

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-200 shadow-sm flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <Link to="/admin/dashboard" className="flex items-center gap-3">
                        <img src={logo} alt="Logo" className="w-10 h-auto" />
                        <span className="text-lg font-bold text-gray-800">Admin Panel</span>
                    </Link>
                </div>
                
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <SidebarLink to="/admin/dashboard" icon={<FaTachometerAlt />} label="Dashboard" />
                    
                    <hr className="my-4" />
                    
                    {/* Dropdown Divisi TJSL */}
                    <SidebarDropdown title="Divisi TJSL" icon={<FaUsers />}>
                        <NavLink to="/admin/manage-berita" className={subLinkClasses}>
                            Kelola Berita
                        </NavLink>
                        <NavLink to="/admin/manage-program" className={subLinkClasses}>
                            Kelola Program
                        </NavLink>
                        <NavLink to="/admin/manage-umkm" className={subLinkClasses}>
                            Kelola UMKM Binaan
                        </NavLink>
                    </SidebarDropdown>

                    {/* Dropdown Divisi Tekom */}
                    <SidebarDropdown title="Divisi Tekom" icon={<FaBroadcastTower />}>
                        <NavLink to="/admin/manage-penghargaan" className={subLinkClasses}>
                            Kelola Penghargaan
                        </NavLink>
                        <NavLink to="/admin/manage-laporan" className={subLinkClasses}>
                            Kelola Laporan
                        </NavLink>
                    </SidebarDropdown>

                    {/* Dropdown Divisi Keuangan */}
                    <SidebarDropdown title="Divisi Keuangan" icon={<FaWallet />}>
                        <NavLink to="/admin/manage-keuangan" className={subLinkClasses}>
                            Lihat Anggaran
                        </NavLink>
                    </SidebarDropdown>
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
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;