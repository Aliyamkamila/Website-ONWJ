import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/LOGO-HD.webp';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMediaDropdownOpen, setMediaDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInHero, setIsInHero] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const location = useLocation();

  // Optimized scroll handler with throttle
  const handleScroll = useCallback(() => {
    const currentScrollPos = window.scrollY;
    const heroSection = document.getElementById('hero-section');
    const heroHeight = heroSection ? heroSection.offsetHeight : 600;
    
    // Check if scrolled past threshold
    setIsScrolled(currentScrollPos > 20);
    
    // Check if still in hero section
    setIsInHero(currentScrollPos < heroHeight - 100);

    // Show/hide header based on scroll direction
    if (currentScrollPos < 10) {
      // Always show at the very top
      setIsVisible(true);
    } else if (currentScrollPos < prevScrollPos) {
      // Scrolling up
      setIsVisible(true);
    } else if (currentScrollPos > prevScrollPos && currentScrollPos > 100) {
      // Scrolling down and past 100px
      setIsVisible(false);
      setMediaDropdownOpen(false); // Close dropdown when hiding
    }

    setPrevScrollPos(currentScrollPos);
  }, [prevScrollPos]);

  useEffect(() => {
    let rafId = null;
    let lastScrollTime = 0;
    const throttleDelay = 50; // ms

    const scrollListener = () => {
      const now = Date.now();
      if (now - lastScrollTime < throttleDelay) {
        return;
      }
      
      lastScrollTime = now;
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      rafId = requestAnimationFrame(() => {
        handleScroll();
      });
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', scrollListener, { passive: true });
    return () => {
      window.removeEventListener('scroll', scrollListener);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [handleScroll]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setMediaDropdownOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const closeMobileMenu = () => setIsOpen(false);

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  // Dynamic text color based on hero position
  const getTextColor = () => {
    if (isInHero && !isScrolled) {
      return 'text-white';
    }
    return 'text-gray-700';
  };

  const getHoverTextColor = () => {
    if (isInHero && !isScrolled) {
      return 'hover:text-white/80';
    }
    return 'hover:text-primary-600';
  };

  // Dynamic background style
  const getHeaderStyle = () => {
    if (isInHero && !isScrolled) {
      // In hero: blur background
      return 'bg-white/10 backdrop-blur-md border-white/20';
    } else {
      // Outside hero: solid white background
      return 'bg-white/95 backdrop-blur-sm border-gray-200 shadow-sm';
    }
  };

  const NavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`
        relative font-medium text-sm tracking-wide
        transition-all duration-300 ease-out
        ${isActivePath(to) 
          ? (isInHero && !isScrolled ? 'text-white' : 'text-primary-600')
          : `${getTextColor()} ${getHoverTextColor()}`
        }
        after:content-[''] after:absolute after:bottom-0 after:left-0 
        after:w-0 after:h-0.5 
        after:transition-all after:duration-300 after:ease-out
        hover:after:w-full
        ${isActivePath(to) ? 'after:w-full' : ''}
        ${isInHero && !isScrolled ? 'after:bg-white' : 'after:bg-primary-600'}
      `}
    >
      {children}
    </Link>
  );

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 
          border-b
          transition-all duration-500 ease-out
          ${getHeaderStyle()}
          ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 z-50">
              <Link 
                to="/" 
                onClick={closeMobileMenu}
                className="block transition-transform duration-300 hover:scale-105"
              >
                <img 
                  className={`h-10 w-auto transition-all duration-300 ${
                    isInHero && !isScrolled ? 'brightness-0 invert' : ''
                  }`}
                  src={logo} 
                  alt="Migas Logo"
                  loading="eager"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-10">
              <NavLink to="/">Beranda</NavLink>
              <NavLink to="/tentang">Tentang Kami</NavLink>
              <NavLink to="/bisnis">Bisnis Kami</NavLink>

              {/* Dropdown Menu - Fixed hover issue */}
              <div
                className="relative group"
                onMouseEnter={() => setMediaDropdownOpen(true)}
                onMouseLeave={() => setMediaDropdownOpen(false)}
              >
                <button 
                  className={`
                    flex items-center gap-2 font-medium text-sm tracking-wide
                    transition-all duration-300 ease-out
                    ${isActivePath('/media-informasi') || 
                      isActivePath('/penghargaan') || 
                      isActivePath('/laporan-tahunan')
                      ? (isInHero && !isScrolled ? 'text-white' : 'text-primary-600')
                      : `${getTextColor()} ${getHoverTextColor()}`
                    }
                  `}
                  aria-expanded={isMediaDropdownOpen}
                  aria-haspopup="true"
                >
                  <span>Media & Informasi</span>
                  <svg 
                    className={`
                      w-4 h-4 transition-transform duration-300 ease-out
                      ${isMediaDropdownOpen ? 'rotate-180' : 'rotate-0'}
                    `}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Content - Extended hover area */}
                <div
                  className={`
                    absolute top-full left-1/2 -translate-x-1/2 pt-3
                    transition-all duration-300 ease-out
                    ${isMediaDropdownOpen 
                      ? 'opacity-100 visible' 
                      : 'opacity-0 invisible pointer-events-none'
                    }
                  `}
                >
                  <div className="w-60 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                    <div className="py-2">
                      <Link 
                        to="/media-informasi" 
                        className={`
                          block px-5 py-3 text-sm font-medium
                          transition-all duration-200 ease-out
                          border-l-4 border-transparent
                          ${isActivePath('/media-informasi')
                            ? 'text-primary-600 bg-primary-50 border-l-primary-600'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50 hover:border-l-primary-600'
                          }
                        `}
                      >
                        Media & Berita
                      </Link>
                      <Link 
                        to="/penghargaan" 
                        className={`
                          block px-5 py-3 text-sm font-medium
                          transition-all duration-200 ease-out
                          border-l-4 border-transparent
                          ${isActivePath('/penghargaan')
                            ? 'text-primary-600 bg-primary-50 border-l-primary-600'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50 hover:border-l-primary-600'
                          }
                        `}
                      >
                        Penghargaan
                      </Link>
                      <Link 
                        to="/laporan-tahunan" 
                        className={`
                          block px-5 py-3 text-sm font-medium
                          transition-all duration-200 ease-out
                          border-l-4 border-transparent
                          ${isActivePath('/laporan-tahunan')
                            ? 'text-primary-600 bg-primary-50 border-l-primary-600'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50 hover:border-l-primary-600'
                          }
                        `}
                      >
                        Laporan Tahunan
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <NavLink to="/kontak">Kontak</NavLink>
            </nav>

            {/* Search & Mobile Menu Button */}
            <div className="flex items-center gap-4">
              {/* Search Button */}
              <button 
                className={`
                  hidden lg:flex items-center justify-center
                  w-10 h-10 rounded-full
                  transition-all duration-300 ease-out
                  ${isInHero && !isScrolled
                    ? 'text-white hover:bg-white/20'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                  }
                `}
                aria-label="Search"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={`
                  lg:hidden flex items-center justify-center
                  w-10 h-10 rounded-lg
                  transition-all duration-300 ease-out
                  z-50
                  ${isInHero && !isScrolled
                    ? 'text-white hover:bg-white/20'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-100'
                  }
                `}
                aria-expanded={isOpen}
                aria-label="Toggle menu"
              >
                <div className="w-6 h-5 relative flex flex-col justify-center items-center">
                  <span 
                    className={`
                      w-6 h-0.5 bg-current rounded-full
                      transition-all duration-300 ease-out absolute
                      ${isOpen ? 'rotate-45 translate-y-0' : 'rotate-0 -translate-y-2'}
                    `}
                  />
                  <span 
                    className={`
                      w-6 h-0.5 bg-current rounded-full
                      transition-all duration-300 ease-out
                      ${isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
                    `}
                  />
                  <span 
                    className={`
                      w-6 h-0.5 bg-current rounded-full
                      transition-all duration-300 ease-out absolute
                      ${isOpen ? '-rotate-45 translate-y-0' : 'rotate-0 translate-y-2'}
                    `}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div
        className={`
          fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40
          lg:hidden transition-all duration-300 ease-out
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
        onClick={closeMobileMenu}
      />

      {/* Mobile Navigation Panel */}
      <div
        className={`
          fixed top-0 right-0 bottom-0 w-80 max-w-[85vw]
          bg-white shadow-2xl z-40
          lg:hidden overflow-y-auto
          transition-transform duration-500 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="pt-24 pb-8 px-6">
          <nav className="space-y-1">
            <Link 
              to="/" 
              onClick={closeMobileMenu} 
              className={`
                block px-4 py-3 rounded-xl font-medium text-base
                transition-all duration-200 ease-out
                ${isActivePath('/') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }
              `}
            >
              Beranda
            </Link>
            <Link 
              to="/tentang" 
              onClick={closeMobileMenu} 
              className={`
                block px-4 py-3 rounded-xl font-medium text-base
                transition-all duration-200 ease-out
                ${isActivePath('/tentang') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }
              `}
            >
              Tentang Kami
            </Link>
            <Link 
              to="/bisnis" 
              onClick={closeMobileMenu} 
              className={`
                block px-4 py-3 rounded-xl font-medium text-base
                transition-all duration-200 ease-out
                ${isActivePath('/bisnis') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }
              `}
            >
              Bisnis Kami
            </Link>
            
            {/* Mobile Dropdown Section */}
            <div className="pt-2">
              <button
                onClick={() => setMediaDropdownOpen(!isMediaDropdownOpen)}
                className="
                  w-full flex items-center justify-between
                  px-4 py-3 rounded-xl font-medium text-base text-left
                  text-gray-700 hover:text-primary-600 hover:bg-gray-50
                  transition-all duration-200 ease-out
                "
              >
                <span>Media & Informasi</span>
                <svg 
                  className={`
                    w-5 h-5 transition-transform duration-300 ease-out
                    ${isMediaDropdownOpen ? 'rotate-180' : 'rotate-0'}
                  `}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div
                className={`
                  overflow-hidden transition-all duration-300 ease-out
                  ${isMediaDropdownOpen ? 'max-h-48 opacity-100 mt-1' : 'max-h-0 opacity-0'}
                `}
              >
                <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-4">
                  <Link 
                    to="/media-informasi" 
                    onClick={closeMobileMenu} 
                    className={`
                      block px-4 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-200 ease-out
                      ${isActivePath('/media-informasi') 
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    Media & Berita
                  </Link>
                  <Link 
                    to="/penghargaan" 
                    onClick={closeMobileMenu} 
                    className={`
                      block px-4 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-200 ease-out
                      ${isActivePath('/penghargaan') 
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    Penghargaan
                  </Link>
                  <Link 
                    to="/laporan-tahunan" 
                    onClick={closeMobileMenu} 
                    className={`
                      block px-4 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-200 ease-out
                      ${isActivePath('/laporan-tahunan') 
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                      }
                    `}
                  >
                    Laporan Tahunan
                  </Link>
                </div>
              </div>
            </div>

            <Link 
              to="/kontak" 
              onClick={closeMobileMenu} 
              className={`
                block px-4 py-3 rounded-xl font-medium text-base
                transition-all duration-200 ease-out
                ${isActivePath('/kontak') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }
              `}
            >
              Kontak
            </Link>
          </nav>

          {/* Mobile Search */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button 
              className="
                w-full flex items-center gap-3 px-4 py-3 rounded-xl
                text-gray-600 bg-gray-50 hover:bg-gray-100
                transition-all duration-200 ease-out
              "
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="font-medium text-sm">Cari...</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;