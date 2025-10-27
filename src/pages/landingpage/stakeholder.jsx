import React from 'react';
import LogoLoop from './logoloop';
import stakeholderLogo from '../../assets/logo.webp';

const Stakeholder = () => {
  const stakeholderLogos = [
    { src: stakeholderLogo, alt: 'ONWJ', href: '#', title: 'ONWJ' },
    { src: stakeholderLogo, alt: 'ONWJ', href: '#', title: 'ONWJ' },
    { src: stakeholderLogo, alt: 'ONWJ', href: '#', title: 'ONWJ' },
    { src: stakeholderLogo, alt: 'ONWJ', href: '#', title: 'ONWJ' },
    { src: stakeholderLogo, alt: 'ONWJ', href: '#', title: 'ONWJ' },
  ];

  return (
    <section className="bg-white py-12 md:py-16"> {/* Adjusted padding */}
      <div className="section-container">
        <div className="text-center mb-12">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-3">Mitra Kami</p>
          <h2 className="text-display-sm text-gray-900 mb-4">
            Stakeholder & Partner
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kami bekerja sama dengan berbagai institusi terkemuka untuk menciptakan nilai tambah bagi semua pihak.
          </p>
        </div>

        <div className="h-[100px] w-full overflow-hidden">
          <LogoLoop
            logos={stakeholderLogos}
            speed={25}
            direction="left"
            logoHeight={70}
            gap={40}
            pauseOnHover
            scaleOnHover
            fadeOut
            fadeOutColor="#ffffff"
            ariaLabel="Our stakeholders"
          />
        </div>
      </div>
    </section>
  );
};

export default Stakeholder;