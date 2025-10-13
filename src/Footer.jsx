// src/Footer.jsx
import React from 'react';
import logo from './assets/logo.webp';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400">
      <div className="container mx-auto px-8 lg:px-16">
        <div className="py-16">
            <div className='max-w-xs'>
                <img src={logo} alt="Logo ONWJ" className="h-10 mb-6" />
                <p className="text-sm">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
                <div className="flex space-x-6 mt-6 text-sm">
                    <a href="#" className="hover:text-white transition-colors">FB</a>
                    <a href="#" className="hover:text-white transition-colors">IG</a>
                    <a href="#" className="hover:text-white transition-colors">LI</a>
                </div>
            </div>
        </div>
        <div className="border-t border-gray-700 py-6">
          <p className="text-center text-sm">
            © 2024 PT Migas Hulu Jabar ONWJ, all rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;