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
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-8 lg:px-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Our Stakeholders
          </h2>
        </div>

        <div className="h-[120px] w-full overflow-hidden">
          <LogoLoop
            logos={stakeholderLogos}
            speed={15} // Sesuaikan kecepatan
            direction="left"
            logoHeight={80}
            gap={32} // Kurangi gap untuk spacing yang lebih rapat
            pauseOnHover
            scaleOnHover
            fadeOut
            fadeOutColor="#f9fafb"
            ariaLabel="Our stakeholders"
          />
        </div>
      </div>
    </section>
  );
};

export default Stakeholder;