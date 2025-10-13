// src/Layout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './pages/landingpage/header.jsx'; // Path header sudah benar
import Footer from './Footer'; // Kita akan buat komponen Footer

const Layout = () => {
  const location = useLocation();
  // Hanya tampilkan Header di halaman utama
  const showHeader = location.pathname === '/';

  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden">
      {showHeader && <Header />}
      <main>
        <Outlet /> {/* Di sini konten halaman akan berganti-ganti */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;