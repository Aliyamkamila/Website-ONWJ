import React from 'react';
import stakeholderLogo from './assets/logo.webp';

const Stakeholder = () => {
  const stakeholders = [
    { id: 1, name: 'ONWJ', logo: stakeholderLogo },
    { id: 2, name: 'ONWJ', logo: stakeholderLogo },
    { id: 3, name: 'ONWJ', logo: stakeholderLogo },
    { id: 4, name: 'ONWJ', logo: stakeholderLogo },
    { id: 5, name: 'ONWJ', logo: stakeholderLogo },
  ];

  return (
    <section className="bg-gray-50 h-[50vh] flex items-center overflow-hidden">
      <div className="container mx-auto px-8 lg:px-16 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Our Stakeholders
          </h2>
        </div>

        {/* Logo Slider */}
        <div className="relative w-full overflow-hidden">
          {/* Gradient Overlay - Left */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10" />
          
          {/* Gradient Overlay - Right */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10" />

          {/* Scrolling Track */}
          <div className="inline-flex animate-slide">
            {/* First set of logos */}
            <div className="flex gap-16 px-8 whitespace-nowrap">
              {stakeholders.map((item) => (
                <div key={item.id} className="inline-flex flex-col items-center space-y-4">
                  <div className="w-24 h-24 flex items-center justify-center">
                    <img 
                      src={item.logo} 
                      alt={item.name}
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                  <span className="text-gray-600 font-medium">{item.name}</span>
                </div>
              ))}
            </div>
            
            {/* Duplicated set for seamless scroll */}
            <div className="flex gap-16 px-8 whitespace-nowrap">
              {stakeholders.map((item) => (
                <div key={`${item.id}-2`} className="inline-flex flex-col items-center space-y-4">
                  <div className="w-24 h-24 flex items-center justify-center">
                    <img 
                      src={item.logo} 
                      alt={item.name}
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                  <span className="text-gray-600 font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stakeholder;