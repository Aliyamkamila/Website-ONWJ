// src/main.jsx
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
import MediaInformasiPage from './pages/media/MediaInformasiPage';
import PenghargaanPage from './pages/media/PenghargaanPage';
import AllProgramsPage from './pages/AllProgramsPage';
import LaporanTahunanPage from './pages/media/LaporanTahunanPage';
import KontakPage from './pages/KontakPage';

const router = createBrowserRouter([ // <-- Buka createBrowserRouter
  {
    path: '/',
    element: (
      <>
        <ScrollRestoration />
        <Layout />
      </>
    ),
    children: [ // <-- Buka children array
      { index: true, element: <HomePage /> },
      { path: 'tjsl', element: <TJSLPage /> },
      { path: 'program-berkelanjutan', element: <AllProgramsPage /> },
      { path: 'tentang', element: <Tentang /> },
      { path: 'kelola', element: <TataKelola /> },
      { path: 'manajemen', element: <Manajemen /> },
      { path: 'bisnis', element: <Mainbisnis /> },
      { path: 'wilayahkerja', element: <Mainwk /> },
      { path: 'berita-tjsl', element: <BeritaTJSLPage /> },
      { path: 'artikel/:slug', element: <ArtikelPage /> },
      { path: 'media-informasi', element: <MediaInformasiPage /> },
      { path: 'penghargaan', element: <PenghargaanPage /> },
      { path: 'laporan-tahunan', element: <LaporanTahunanPage /> },
      { path: 'kontak', element: <KontakPage /> },
    ], // <-- TUTUP children array
  }, // <-- TUTUP root route object
]); // <-- TUTUP createBrowserRouter (setelah array)

// --- createRoot dipindah ke sini, SETELAH router didefinisikan ---
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);