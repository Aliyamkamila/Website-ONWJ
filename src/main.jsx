// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, ScrollRestoration } from 'react-router-dom';
import './index.css';
import Layout from './Layout';
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
import Mainwk from "./pages/wk/mainwk";
import KontakPage from "./pages/KontakPage";
import UmkmPage from "./pages/UmkmPage";
import Header from './pages/landingpage/header';


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
      { path: 'tentang', element: <Tentang /> },
      { path: 'kelola', element: <TataKelola /> },
      { path: 'media-informasi', element: <MediaInformasiPage /> },
      { path: 'penghargaan', element: <PenghargaanPage /> },
      { path: 'laporan-tahunan', element: <LaporanTahunanPage /> },
      { path: 'bisnis', element: <Mainbisnis /> },
      { path: 'manajemen', element: <Mmanajemen /> },
      { path: 'wilayah-kerja', element: <Mainwk /> },
      {path: 'kontak', element: <KontakPage />,},
      {path: 'umkm-binaan', element: <UmkmPage />,},
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);