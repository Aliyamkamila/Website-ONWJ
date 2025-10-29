import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './pages/landingpage/header.jsx';
import Footer from './Footer';

const Layout = () => {
  const location = useLocation();
  const showHeader = location.pathname === '/';

  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden">
      {showHeader && <Header />}
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;