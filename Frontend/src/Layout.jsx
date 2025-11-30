import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/tukang-minyak-dan-gas');

  return (
    <div className={`
      relative w-screen min-h-screen overflow-x-hidden
      ${! isAdminRoute ?  'font-body' : ''}
    `}>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;