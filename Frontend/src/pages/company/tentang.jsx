import React from 'react';
import PHero from './phero';
import PProfile from './pprofile';
import PSejarah from './psejarah';
import PVisiMisi from './pvisimisi';

const Tentang = () => {
  return (
    <div className="min-h-screen bg-white">
      <PHero />
      <PProfile />
      <PSejarah />
      <PVisiMisi />
    </div>
  );
};

export default Tentang;