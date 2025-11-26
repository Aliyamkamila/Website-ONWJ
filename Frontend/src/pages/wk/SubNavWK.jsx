import { NavLink } from 'react-router-dom';

const SubNavWK = () => {
  const activeStyle = "font-semibold text-blue-600 border-b-2 border-blue-600 py-4";
  const inactiveStyle = "font-medium text-gray-500 hover:text-blue-600 border-b-2 border-transparent py-4 transition-colors";

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
      <nav className="container mx-auto px-8 lg:px-16 flex space-x-8">
        <NavLink 
          to="/wilayah-kerja" 
          end
          className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
        >
          Wilayah Kerja
        </NavLink>
        <NavLink 
          to="/wilayah-kerja/harga-minyak" 
          className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
        >
          Harga Minyak
        </NavLink>
        <NavLink 
          to="/wilayah-kerja/produksi" 
          className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
        >
          Data Produksi
        </NavLink>
      </nav>
    </div>
  );
};

export default SubNavWK;