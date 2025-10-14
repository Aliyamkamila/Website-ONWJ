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
      { path: 'tentang', element: <Tentang /> },
      { path: 'kelola', element: <TataKelola /> },
      {
        path: 'berita-tjsl',
        element: <BeritaTJSLPage />,
      },
      {
        path: 'artikel/:slug',
        element: <ArtikelPage />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);