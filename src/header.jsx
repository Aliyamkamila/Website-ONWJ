import React, { useState, useEffect } from 'react';
import logo from './assets/logo.webp';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Menentukan arah scroll dan visibility header
      setVisible(
        (prevScrollPos > currentScrollPos && currentScrollPos > 100) || // Scroll up
        currentScrollPos < 100 // Di atas halaman
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
        <div className="flex justify-between items-center h-20"> {/* Fixed height */}
          {/* Logo */}
          <div className="flex-shrink-0">
            <img className="h-10 w-auto" src={logo} alt="Migas Logo" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#beranda" className="text-white hover:text-blue-200 font-medium transition-colors">
              Beranda
            </a>
            <a href="#tentang-kami" className="text-white hover:text-blue-200 font-medium transition-colors">
              Tentang Kami
            </a>
            <a href="#bisnis-kami" className="text-white hover:text-blue-200 font-medium transition-colors">
              Bisnis Kami
            </a>
            <a href="#media" className="text-white hover:text-blue-200 font-medium transition-colors">
              Media & Informasi
            </a>
            <a href="#kontak" className="text-white hover:text-blue-200 font-medium transition-colors">
              Kontak
            </a>
          </nav>

          {/* Search Icon */}
          <div className="hidden md:flex items-center">
            <button className="text-white hover:text-blue-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-blue-200 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-black/80">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#beranda" className="block px-3 py-2 text-white hover:text-blue-200 font-medium">
                Beranda
              </a>
              <a href="#tentang-kami" className="block px-3 py-2 text-white hover:text-blue-200 font-medium">
                Tentang Kami
              </a>
              <a href="#bisnis-kami" className="block px-3 py-2 text-white hover:text-blue-200 font-medium">
                Bisnis Kami
              </a>
              <a href="#media" className="block px-3 py-2 text-white hover:text-blue-200 font-medium">
                Media & Informasi
              </a>
              <a href="#kontak" className="block px-3 py-2 text-white hover:text-blue-200 font-medium">
                Kontak
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;