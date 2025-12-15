import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, ScrollRestoration } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
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
import GalleryPage from './pages/GalleryPage'; // ← BARU: Import GalleryPage

// ==== WILAYAH KERJA ====
import Mainwk from './pages/wk/mainwk';

// ==== HALAMAN ADMIN ====
import LoginPage from './pages/admin/LoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';

// Divisi TJSL
import ManageBerita from './pages/admin/ManageBerita';
import ManageProgram from './pages/admin/ManageProgram';
import ManageUmkm from './pages/admin/ManageUmkm';
import ManageTestimonial from './pages/admin/ManageTestimonial';
import ManageAngkaStatistikTJSL from './pages/admin/ManageAngkaStatistikTJSL';
import UnifiedImportExport from './pages/admin/UnifiedImportExport';
import ManageGallery from "./pages/admin/Gallery/ManageGallery";

// Sekretaris Perusahaan
import ManagePenghargaan from './pages/admin/ManagePenghargaan';
import ManageLaporan from './pages/admin/ManageLaporan';
import ManageStatistikLanding from './pages/admin/ManageStatistikLanding';

// Keuangan
import ManageKeuangan from './pages/admin/ManageKeuangan';

// Wilayah Kerja
import ManageWkTekkom from './pages/admin/ManageWkTekkom';
import ManageWkTjsl from './pages/admin/ManageWkTjsl';

// Tekkom
import ManageHargaTekkom from './pages/admin/ManageMinyak';
import ManageProduksiTekkom from './pages/admin/ManageProduksi';

// Contacts
import ManageContacts from './pages/admin/ManageContacts';

// Settings (baru)
import ManageSettings from './pages/admin/ManageSettings';

// ==== ROUTER ====
const router = createBrowserRouter([
  {
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
      { path: 'gallery', element: <GalleryPage /> }, // ← BARU: Public Gallery Route
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
    path: '/tukang-minyak-dan-gas/login',
    element: <LoginPage />,
  },

  {
    path: '/tukang-minyak-dan-gas',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },

      // TJSL
      { path: 'manage-berita', element: <ManageBerita /> },
      { path: 'manage-program', element: <ManageProgram /> },
      { path: 'manage-umkm', element: <ManageUmkm /> },
      { path: 'manage-testimonial', element: <ManageTestimonial /> },
      { path: 'manage-angka-statistik-tjsl', element: <ManageAngkaStatistikTJSL /> },
      { path: 'unified-import-export', element: <UnifiedImportExport /> },
      { path: 'manage-gallery', element: <ManageGallery /> }, // ← BARU: Admin Gallery Route

      // Sekper
      { path: 'manage-penghargaan', element: <ManagePenghargaan /> },
      { path: 'manage-laporan', element: <ManageLaporan /> },
      { path: 'manage-statistik-landing', element: <ManageStatistikLanding /> },

      // Keuangan
      { path: 'manage-keuangan', element: <ManageKeuangan /> },

      // Wilayah Kerja
      { path: 'manage-wk-tekkom', element: <ManageWkTekkom /> },
      { path: 'manage-wk-tjsl', element: <ManageWkTjsl /> },

      // Tekkom
      { path: 'manage-harga-tekkom', element: <ManageHargaTekkom /> },
      { path: 'manage-produksi-tekkom', element: <ManageProduksiTekkom /> },

      // Contacts
      { path: 'manage-contacts', element: <ManageContacts /> },

      // Settings (baru)
      { path: 'manage-settings', element: <ManageSettings /> },
    ],
  },
]);

// ==== RENDER APP ====
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SettingsProvider>
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
      </SettingsProvider>
    </AuthProvider>
  </StrictMode>
);