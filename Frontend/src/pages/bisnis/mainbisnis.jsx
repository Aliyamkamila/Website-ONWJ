import React from 'react';
import BHero from './bhero';
import Bbisnis from './bbisnis';
import Stakeholder from './stakeholder';

const Mainbisnis = () => {
  return (
    <div className="min-h-screen bg-white">
      <BHero />
      <Bbisnis />
      <Stakeholder />
    </div>
  );
};

export default Mainbisnis;