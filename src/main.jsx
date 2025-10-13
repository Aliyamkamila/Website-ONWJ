// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  ScrollRestoration,
} from 'react-router-dom';
import './index.css';

import Layout from './Layout';
import HomePage from './pages/HomePage';
import TJSLPage from './pages/TJSLPage'; 
import Tentang from './pages/company/tentang';
import TataKelola from './pages/kelola/tatakelola';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <ScrollRestoration /> {/* biar scroll balik ke atas pas ganti halaman */}
        <Layout />
      </>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'tjsl',
        element: <TJSLPage />,
      },
      {
        path: 'tentang',
        element: <Tentang />,
      },
      {
        path: 'kelola',
        element: <TataKelola />,
      },
    ],
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
