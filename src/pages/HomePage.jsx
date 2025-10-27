// src/pages/HomePage.jsx
import React from 'react';
import Hero from './landingpage/hero';
import Profile from './landingpage/profile';
import Bisnis from './landingpage/Bisnis';
import Berita from './landingpage/berita';
import Stakeholder from './landingpage/stakeholder';
import Penghargaan from './landingpage/penghargaan/penghargaan';
import Footer from '../Footer';

const HomePage = () => {
  return (
    <>
      <Hero />
      <div className='relative bg-white'>
        <Profile />
        <Stakeholder />
        <Bisnis />
        <Penghargaan />
        <Berita />
        <Footer />
      </div>
    </>
  );
};

export default HomePage;