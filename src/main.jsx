import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, ScrollRestoration } from 'react-router-dom';
import './index.css';

import Layout from './Layout';
import HomePage from './pages/HomePage';
import TJSLPage from './pages/TJSLPage';
import Tentang from './pages/company/tentang';
import TataKelola from './pages/kelola/tatakelola';
import BeritaTJSLPage from './pages/BeritaTJSLPage';
import ArtikelPage from './pages/ArtikelPage';
import Manajemen from './pages/manajemen/mmanajemen';
import Mainbisnis from './pages/bisnis/mainbisnis';
import Mainwk from './pages/wk/mainwk';

// --- 1. Import halaman media & penghargaan ---
import MediaInformasiPage from './pages/media/MediaInformasiPage';
import PenghargaanPage from './pages/media/PenghargaanPage';

// --- 2. Import halaman Semua Program (AllProgramsPage) ---
import AllProgramsPage from './pages/AllProgramsPage'; // Pastikan file ini ada

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <ScrollRestoration />
        <Layout />
      </>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'tjsl', element: <TJSLPage /> },

      // ---> PASTIKAN RUTE INI ADA DAN BENAR <---
      {
        path: 'program-berkelanjutan', // Alamat URL-nya
        element: <AllProgramsPage />,  // Komponen yang ditampilkan
      },

      { path: 'tentang', element: <Tentang /> },
      { path: 'kelola', element: <TataKelola /> },
      { path: 'manajemen', element: <Manajemen /> },
      { path: 'bisnis', element: <Mainbisnis /> },
      { path: 'wilayahkerja', element: <Mainwk /> },
      { path: 'berita-tjsl', element: <BeritaTJSLPage /> },
      { path: 'artikel/:slug', element: <ArtikelPage /> },

      // --- 2. Tambahkan rute baru di sini ---
      { path: 'media-informasi', element: <MediaInformasiPage /> },
      { path: 'penghargaan', element: <PenghargaanPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);