// src/pages/HomePage.jsx
import React from 'react';
import Hero from './landingpage/hero';
import Profile from './landingpage/profile';
import Bisnis from './landingpage/Bisnis';
import Berita from './landingpage/berita';
import Stakeholder from './landingpage/stakeholder';

const HomePage = () => {
  return (
    <>
      <Hero />
      <div className='relative bg-white'>
        <Profile />
        <Bisnis />
        <Berita />
        <Stakeholder />
      </div>
    </>
  );
};

export default HomePage;