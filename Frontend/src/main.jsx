import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, ScrollRestoration } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // ← HANYA 1x IMPORT
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';
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
import UmkmPage from './pages/UmkmPage';
import KontakPage from './pages/KontakPage';
import Profile from './pages/landingpage/profile';

// ==== WILAYAH KERJA ====
import Mainwk from './pages/wk/mainwk';

// ==== HALAMAN ADMIN ====
import LoginPage from './pages/admin/LoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';

// Admin - Divisi TJSL
import ManageBerita from './pages/admin/ManageBerita';
import ManageProgram from './pages/admin/ManageProgram';
import ManageUmkm from './pages/admin/ManageUmkm';
import ManageTestimonial from './pages/admin/ManageTestimonial';
import ManageAngkaStatistikTJSL from './pages/admin/ManageAngkaStatistikTJSL';
import UnifiedImportExport from './pages/admin/UnifiedImportExport';

// Admin - Sekretaris Perusahaan
import ManagePenghargaan from './pages/admin/ManagePenghargaan';
import ManageLaporan from './pages/admin/ManageLaporan';
import ManageStatistikLanding from './pages/admin/ManageStatistikLanding';

// Admin - Divisi Keuangan
import ManageKeuangan from './pages/admin/ManageKeuangan';

// Admin - Wilayah Kerja (TEKKOM & TJSL)
import ManageWkTekkom from './pages/admin/ManageWkTekkom';
import ManageWkTjsl from './pages/admin/ManageWkTjsl';

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
      { path: 'umkm-binaan', element: <UmkmPage /> },
      { path: 'kontak', element: <KontakPage /> },
      { path: 'profile', element: <Profile /> },
    ],
  },

  // ✅ WILAYAH KERJA - STANDALONE ROUTE (tidak nested dalam Layout)
  {
    path: '/wilayah-kerja/*',
    element: (
      <>
        <Header />
        <ScrollRestoration />
        <Mainwk />
      </>
    ),
  },

  {
    // --- LOGIN ADMIN ---
    path: '/tukang-minyak-dan-gas/login',
    element: <LoginPage />,
  },

  {
    // --- RUTE ADMIN (PROTECTED) ---
    path: '/tukang-minyak-dan-gas',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      
      // Divisi TJSL
      { path: 'manage-berita', element: <ManageBerita /> },
      { path: 'manage-program', element: <ManageProgram /> },
      { path: 'manage-umkm', element: <ManageUmkm /> },
      { path: 'manage-testimonial', element: <ManageTestimonial /> },
      { path: 'manage-angka-statistik-tjsl', element: <ManageAngkaStatistikTJSL /> },
      { path: 'unified-import-export', element: <UnifiedImportExport /> },
      
      // Sekretaris Perusahaan
      { path: 'manage-penghargaan', element: <ManagePenghargaan /> },
      { path: 'manage-laporan', element: <ManageLaporan /> },
      { path: 'manage-statistik-landing', element: <ManageStatistikLanding /> },
      
      // Divisi Keuangan
      { path: 'manage-keuangan', element: <ManageKeuangan /> },
      
      // Wilayah Kerja (TEKKOM & TJSL)
      { path: 'manage-wk-tekkom', element: <ManageWkTekkom /> },
      { path: 'manage-wk-tjsl', element: <ManageWkTjsl /> },
    ],
  },
]);

// ==== RENDER APLIKASI ====
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </AuthProvider>
  </StrictMode>
);