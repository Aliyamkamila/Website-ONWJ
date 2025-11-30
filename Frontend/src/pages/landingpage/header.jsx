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

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.scrollY;
    const heroSection = document.getElementById('hero-section');
    const heroHeight = heroSection ? heroSection.offsetHeight : 600;
    
    setIsScrolled(currentScrollPos > 20);
    setIsInHero(currentScrollPos < heroHeight - 100);

    if (currentScrollPos < 10) {
      setIsVisible(true);
    } else if (currentScrollPos < prevScrollPos) {
      setIsVisible(true);
    } else if (currentScrollPos > prevScrollPos && currentScrollPos > 100) {
      setIsVisible(false);
      setMediaDropdownOpen(false);
    }

    setPrevScrollPos(currentScrollPos);
  }, [prevScrollPos]);

  useEffect(() => {
    let rafId = null;
    let lastScrollTime = 0;
    const throttleDelay = 50;

    const scrollListener = () => {
      const now = Date.now();
      if (now - lastScrollTime < throttleDelay) return;
      
      lastScrollTime = now;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    handleScroll();
    window.addEventListener('scroll', scrollListener, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', scrollListener);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [handleScroll]);

  useEffect(() => {
    setIsOpen(false);
    setMediaDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const closeMobileMenu = () => setIsOpen(false);
  const isActivePath = (path) => location.pathname === path;

  // Dynamic styles based on hero position
  const getTextColor = () => isInHero && !isScrolled ? 'text-white' : 'text-secondary-700';
  const getHoverTextColor = () => isInHero && !isScrolled ? 'hover:text-white/80' : 'hover:text-primary-600';
  
  const getHeaderStyle = () => {
    if (isInHero && !isScrolled) {
      return 'bg-white/10 backdrop-blur-lg border-white/20';
    }
    return 'bg-white/95 backdrop-blur-md border-secondary-200 shadow-md';
  };

  // Navigation items
  const navItems = [
    { path: '/', label: 'Beranda' },
    { path: '/tentang', label: 'Tentang Kami' },
    { path: '/bisnis', label: 'Bisnis Kami' },
  ];

  const mediaItems = [
    { path: '/media-informasi', label: 'Media & Berita' },
    { path: '/penghargaan', label: 'Penghargaan' },
    { path: '/laporan-tahunan', label: 'Laporan Tahunan' },
  ];

  const NavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`
        relative font-heading font-semibold text-body-md tracking-wide
        transition-smooth will-change-transform
        ${isActivePath(to) 
          ? (isInHero && !isScrolled ?  'text-white' : 'text-primary-600')
          : `${getTextColor()} ${getHoverTextColor()}`
        }
        after:content-[''] after:absolute after:bottom-0 after:left-0 
        after:w-0 after:h-0.5 after:transition-smooth
        hover:after:w-full
        ${isActivePath(to) ?  'after:w-full' : ''}
        ${isInHero && !isScrolled ? 'after:bg-white' : 'after:bg-primary-600'}
      `}
    >
      {children}
    </Link>
  );

  return (
    <>
      {/* Header */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 border-b
          transition-smooth-slow will-change-transform
          ${getHeaderStyle()}
          ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        `}
      >
        <div className="section-container">
          <div className="flex justify-between items-center" style={{ height: '5rem' }}>
            
            {/* Logo */}
            <div className="flex-shrink-0 z-50">
              <Link 
                to="/" 
                onClick={closeMobileMenu}
                className="block transition-smooth hover:scale-105 will-change-transform"
              >
                <img 
                  className={`w-auto transition-smooth ${
                    isInHero && ! isScrolled ? 'brightness-0 invert h-11' : 'h-10'
                  }`}
                  src={logo} 
                  alt="Migas Logo"
                  loading="eager"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-grid-10">
              {navItems.map((item) => (
                <NavLink key={item.path} to={item.path}>
                  {item.label}
                </NavLink>
              ))}

              {/* Dropdown Menu */}
              <div
                className="relative group"
                onMouseEnter={() => setMediaDropdownOpen(true)}
                onMouseLeave={() => setMediaDropdownOpen(false)}
              >
                <button 
                  className={`
                    flex items-center gap-grid-2 font-heading font-semibold text-body-md tracking-wide
                    transition-smooth
                    ${mediaItems.some(item => isActivePath(item.path))
                      ? (isInHero && !isScrolled ? 'text-white' : 'text-primary-600')
                      : `${getTextColor()} ${getHoverTextColor()}`
                    }
                  `}
                  aria-expanded={isMediaDropdownOpen}
                >
                  <span>Media & Informasi</span>
                  <svg 
                    className={`w-4 h-4 transition-smooth ${isMediaDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Content */}
                <div
                  className={`
                    absolute top-full left-1/2 -translate-x-1/2 pt-grid-3
                    transition-smooth
                    ${isMediaDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
                  `}
                >
                  <div className="w-64 bg-white border border-secondary-100 rounded-xl shadow-lg overflow-hidden">
                    <div className="py-grid-2">
                      {mediaItems.map((item) => (
                        <Link 
                          key={item.path}
                          to={item.path} 
                          className={`
                            block px-grid-5 py-grid-3 font-heading text-body-md font-semibold
                            transition-fast border-l-4 border-transparent
                            ${isActivePath(item.path)
                              ? 'text-primary-600 bg-primary-50 border-l-primary-600'
                              : 'text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 hover:border-l-primary-600'
                            }
                          `}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <NavLink to="/kontak">Kontak</NavLink>
            </nav>

            {/* Search & Mobile Menu Button */}
            <div className="flex items-center gap-grid-4">
              {/* Search Button */}
              <button 
                className={`
                  hidden lg:flex items-center justify-center
                  w-10 h-10 rounded-full transition-smooth
                  ${isInHero && !isScrolled
                    ? 'text-white hover:bg-white/20'
                    : 'text-secondary-600 hover:text-primary-600 hover:bg-secondary-100'
                  }
                `}
                aria-label="Search"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className={`
                  lg:hidden flex items-center justify-center
                  w-10 h-10 rounded-lg transition-smooth z-50
                  ${isInHero && !isScrolled
                    ? 'text-white hover:bg-white/20'
                    : 'text-secondary-700 hover:text-primary-600 hover:bg-secondary-100'
                  }
                `}
                aria-expanded={isOpen}
                aria-label="Toggle menu"
              >
                <div className="w-6 h-5 relative flex flex-col justify-center items-center">
                  <span className={`w-6 h-0.5 bg-current rounded-full transition-smooth absolute ${isOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}`} />
                  <span className={`w-6 h-0.5 bg-current rounded-full transition-smooth ${isOpen ? 'opacity-0 scale-0' : 'opacity-100'}`} />
                  <span className={`w-6 h-0.5 bg-current rounded-full transition-smooth absolute ${isOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div
        className={`
          fixed inset-0 bg-secondary-900/60 backdrop-blur-sm z-40
          lg:hidden transition-smooth
          ${isOpen ?  'opacity-100 visible' : 'opacity-0 invisible'}
        `}
        onClick={closeMobileMenu}
      />

      {/* Mobile Navigation Panel */}
      <div
        className={`
          fixed top-0 right-0 bottom-0 w-80 max-w-[85vw]
          bg-white shadow-2xl z-40 lg:hidden overflow-y-auto custom-scrollbar
          transition-smart
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="pt-24 pb-grid-8 px-grid-6">
          <nav className="space-y-grid-1">
            {/* Main Nav Items */}
            {[...navItems, { path: '/kontak', label: 'Kontak' }].map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                onClick={closeMobileMenu} 
                className={`
                  block px-grid-4 py-grid-3 rounded-xl font-heading font-semibold text-body-lg
                  transition-smooth
                  ${isActivePath(item.path) 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-secondary-700 hover:text-primary-600 hover:bg-secondary-50'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Dropdown */}
            <div className="pt-grid-2">
              <button
                onClick={() => setMediaDropdownOpen(!isMediaDropdownOpen)}
                className="w-full flex items-center justify-between px-grid-4 py-grid-3 rounded-xl font-heading font-semibold text-body-lg text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 transition-smooth"
              >
                <span>Media & Informasi</span>
                <svg 
                  className={`w-5 h-5 transition-smooth ${isMediaDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className={`overflow-hidden transition-smooth ${isMediaDropdownOpen ? 'max-h-48 opacity-100 mt-grid-1' : 'max-h-0 opacity-0'}`}>
                <div className="ml-grid-4 space-y-grid-1 border-l-2 border-secondary-200 pl-grid-4">
                  {mediaItems.map((item) => (
                    <Link 
                      key={item.path}
                      to={item.path} 
                      onClick={closeMobileMenu} 
                      className={`
                        block px-grid-4 py-grid-2.5 rounded-lg font-heading text-body-md font-semibold
                        transition-smooth
                        ${isActivePath(item.path) 
                          ? 'text-primary-600 bg-primary-50' 
                          : 'text-secondary-600 hover:text-primary-600 hover:bg-secondary-50'
                        }
                      `}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Mobile Search */}
          <div className="mt-grid-6 pt-grid-6 border-t border-secondary-200">
            <button className="w-full flex items-center gap-grid-3 px-grid-4 py-grid-3 rounded-xl text-secondary-600 bg-secondary-50 hover:bg-secondary-100 transition-smooth font-heading font-medium text-body-md">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Cari...</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;