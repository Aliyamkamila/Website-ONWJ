// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, ScrollRestoration } from 'react-router-dom';
import './index.css';

// ==== HALAMAN PUBLIK ====
import Layout from './Layout';
import Header from './pages/landingpage/header';
import HomePage from './pages/HomePage';
import TJSLPage from './pages/TJSLPage';
import BeritaTJSLPage from './pages/BeritaTJSLPage';
import ArtikelPage from './pages/ArtikelPage';
import AllProgramsPage from './pages/AllProgramsPage';
import Tentang from './pages/company/tentang';
import TataKelola from './pages/kelola/tatakelola';
import MediaInformasiPage from './pages/media/MediaInformasiPage';
import PenghargaanPage from './pages/media/PenghargaanPage';
import LaporanTahunanPage from './pages/media/LaporanTahunanPage';
import Mainbisnis from './pages/bisnis/mainbisnis';
import Mmanajemen from './pages/manajemen/mmanajemen';
import Mainwk from './pages/wk/mainwk';
import Wilayah from './pages/wk/wilayah';
import UmkmPage from './pages/UmkmPage';
import KontakPage from './pages/KontakPage';
import Profile from './pages/landingpage/profile';

// ==== HALAMAN ADMIN ====
import LoginPage from './pages/admin/LoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ManageBerita from './pages/admin/ManageBerita';

// ==== DEFINISI RUTE ====
const router = createBrowserRouter([
  {
    // --- RUTE PENGUNJUNG UMUM ---
    path: '/',
    element: (
      <>
        <Header />
        <ScrollRestoration />
        <Layout />
      </>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'tjsl', element: <TJSLPage /> },
      { path: 'berita-tjsl', element: <BeritaTJSLPage /> },
      { path: 'artikel/:slug', element: <ArtikelPage /> },
      { path: 'program-berkelanjutan', element: <AllProgramsPage /> },
      { path: 'tentang', element: <Tentang /> },
      { path: 'kelola', element: <TataKelola /> },
      { path: 'media-informasi', element: <MediaInformasiPage /> },
      { path: 'penghargaan', element: <PenghargaanPage /> },
      { path: 'laporan-tahunan', element: <LaporanTahunanPage /> },
      { path: 'bisnis', element: <Mainbisnis /> },
      { path: 'manajemen', element: <Mmanajemen /> },
      { path: 'wilayah-kerja', element: <Mainwk /> },
      { path: 'wilayah', element: <Wilayah /> },
      { path: 'umkm-binaan', element: <UmkmPage /> },
      { path: 'kontak', element: <KontakPage /> },
      { path: 'profile', element: <Profile /> },
    ],
  },

  {
    // --- RUTE ADMIN (SETELAH LOGIN) ---
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'manage-berita', element: <ManageBerita /> },
      // { path: 'manage-penghargaan', element: <ManagePenghargaan /> },
    ],
  },

  {
    // --- RUTE LOGIN ADMIN (TANPA LAYOUT ADMIN) ---
    path: '/admin/login',
    element: <LoginPage />,
  },
]);

// ==== RENDER APLIKASI ====
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
