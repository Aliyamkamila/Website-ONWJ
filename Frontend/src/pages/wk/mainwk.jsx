import React from 'react';
import WHero from './whero';
import DeskripsiWK from './deskripsiwk';
import WilayahKerja from './wilayahkerja';

const Mainwk = () => {
  return (
    <div className="min-h-screen bg-white">
      <WHero />
      <DeskripsiWK />
      <WilayahKerja />
    </div>
  );
};

export default Mainwk;