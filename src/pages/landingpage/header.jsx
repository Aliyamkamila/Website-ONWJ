// src/pages/landingpage/header.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.webp';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mediaDropdownOpen, setMediaDropdownOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(
        (prevScrollPos > currentScrollPos && currentScrollPos > 100) ||
        currentScrollPos < 100
      );
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out transform ${
        visible ? 'translate-y-0' : '-translate-y-full'
      } ${prevScrollPos > 100 ? 'bg-white/10 backdrop-blur-sm' : 'bg-transparent'}`}
    >
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img className="h-10 w-auto" src={logo} alt="Migas Logo" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-white hover:text-blue-200 font-medium transition-colors">
              Beranda
            </Link>
            <Link to="/tentang" className="text-white hover:text-blue-200 font-medium transition-colors">
              Tentang Kami
            </Link>
            <Link to="/bisnis" className="text-white hover:text-blue-200 font-medium transition-colors">
              Bisnis Kami
            </Link>

            {/* Dropdown Media & Informasi */}
            <div
              className="relative"
              onMouseEnter={() => setMediaDropdownOpen(true)}
              onMouseLeave={() => setMediaDropdownOpen(false)}
            >
              <button className="text-white hover:text-blue-200 font-medium transition-colors flex items-center">
                Media & Informasi
                <svg
                  className={`w-4 h-4 ml-1 transition-transform ${
                    mediaDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mediaDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-md shadow-lg py-2">
                  <Link to="/media-informasi" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    Media & Informasi
                  </Link>
                  <Link to="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    Penghargaan
                  </Link>
                  <Link to="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    Company Profile
                  </Link>
                  <Link to="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    Laporan Tahunan
                  </Link>
                </div>
              )}
            </div>

            <Link to="/kontak" className="text-white hover:text-blue-200 font-medium transition-colors">
              Kontak
            </Link>
          </nav>

          {/* Search Icon */}
          <div className="hidden md:flex items-center">
            <button className="text-white hover:text-blue-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-blue-200 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-black/80">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 text-white hover:text-blue-200 font-medium">
                Beranda
              </Link>
              <Link to="/tentang" className="block px-3 py-2 text-white hover:text-blue-200 font-medium">
                Tentang Kami
              </Link>
              <Link to="/bisnis" className="block px-3 py-2 text-white hover:text-blue-200 font-medium">
                Bisnis Kami
              </Link>
              <Link to="/media-informasi" className="block px-3 py-2 text-white hover:text-blue-200 font-medium">
                Media & Informasi
              </Link>
              <Link to="/kontak" className="block px-3 py-2 text-white hover:text-blue-200 font-medium">
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
