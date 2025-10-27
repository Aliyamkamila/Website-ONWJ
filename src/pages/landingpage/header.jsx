import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.webp';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMediaDropdownOpen, setMediaDropdownOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [bgOpacity, setBgOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const scrollOpacity = Math.min(currentScrollPos / 200, 1);
      
      setVisible(
        (prevScrollPos > currentScrollPos && currentScrollPos > 100) ||
        currentScrollPos < 100
      );
      setBgOpacity(scrollOpacity);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const closeMobileMenu = () => setIsOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{
        backgroundColor: `rgba(255, 255, 255, ${bgOpacity * 0.95})`,
        backdropFilter: `blur(${bgOpacity * 12}px)`,
        boxShadow: bgOpacity > 0.1 ? '0 4px 20px rgba(0, 0, 0, 0.08)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              onClick={closeMobileMenu}
              className="transition-smooth"
            >
              <img className="h-10 w-auto" src={logo} alt="Migas Logo" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-smooth"
            >
              Beranda
            </Link>
            <Link 
              to="/tentang" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-smooth"
            >
              Tentang Kami
            </Link>
            <Link 
              to="/bisnis" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-smooth"
            >
              Bisnis Kami
            </Link>

            {/* Dropdown Menu */}
            <div
              className="relative"
              onMouseEnter={() => setMediaDropdownOpen(true)}
              onMouseLeave={() => setMediaDropdownOpen(false)}
            >
              <button className="text-gray-700 hover:text-primary-600 font-medium transition-smooth flex items-center group">
                Media & Informasi
                <svg 
                  className={`w-4 h-4 ml-2 transition-smooth group-hover:text-primary-600 ${
                    isMediaDropdownOpen ? 'rotate-180' : ''
                  }`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isMediaDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-white rounded-xl shadow-xl py-2 border border-gray-100 animate-slide-down">
                  <Link 
                    to="/media-informasi" 
                    className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-smooth"
                  >
                    Media & Berita
                  </Link>
                  <Link 
                    to="/penghargaan" 
                    className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-smooth"
                  >
                    Penghargaan
                  </Link>
                  <Link 
                    to="/laporan-tahunan" 
                    className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-smooth"
                  >
                    Laporan Tahunan
                  </Link>
                </div>
              )}
            </div>

            <Link 
              to="/kontak" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-smooth"
            >
              Kontak
            </Link>
          </nav>

          {/* Search & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button className="hidden md:block text-gray-600 hover:text-primary-600 transition-smooth">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="md:hidden text-gray-700 hover:text-primary-600 transition-smooth"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 animate-slide-down">
            <div className="px-4 py-4 space-y-3">
              <Link 
                to="/" 
                onClick={closeMobileMenu} 
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-smooth"
              >
                Beranda
              </Link>
              <Link 
                to="/tentang" 
                onClick={closeMobileMenu} 
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-smooth"
              >
                Tentang Kami
              </Link>
              <Link 
                to="/bisnis" 
                onClick={closeMobileMenu} 
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-smooth"
              >
                Bisnis Kami
              </Link>
              <Link 
                to="/media-informasi" 
                onClick={closeMobileMenu} 
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-smooth"
              >
                Media & Informasi
              </Link>
              <Link 
                to="/penghargaan" 
                onClick={closeMobileMenu} 
                className="block px-3 py-2 pl-6 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-normal transition-smooth"
              >
                └─ Penghargaan
              </Link>
              <Link 
                to="/laporan-tahunan" 
                onClick={closeMobileMenu} 
                className="block px-3 py-2 pl-6 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-normal transition-smooth"
              >
                └─ Laporan Tahunan
              </Link>
              <Link 
                to="/kontak" 
                onClick={closeMobileMenu} 
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-smooth"
              >
                Kontak
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;