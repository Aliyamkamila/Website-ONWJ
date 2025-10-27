import React, { useState } from 'react';
import CircularGallery from './circulargallery';
import penghargaan1 from '../../../assets/contoh1.png';
import penghargaan2 from '../../../assets/contoh2.png';
import penghargaan3 from '../../../assets/contoh3.png';
import penghargaan4 from '../../../assets/contoh4.png';
import penghargaan5 from '../../../assets/contoh4.png';

const Penghargaan = () => {
  const [isLoading, setIsLoading] = useState(true);

  const penghargaanItems = [
    {
      src: penghargaan1,
      title: 'Penghargaan Keselamatan'
    },
    {
      src: penghargaan2,
      title: 'Environmental Award'
    },
    {
      src: penghargaan3,
      title: 'Best Performance'
    },
    {
      src: penghargaan4,
      title: 'Innovation Award'
    },
    {
      src: penghargaan5,
      title: 'Safety Achievement'
    }
  ];

  return (
    <section className="bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Penghargaan Kami
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Berbagai penghargaan yang telah kami raih sebagai bukti komitmen kami.
          </p>
        </div>

        <div className="min-h-[500px] w-full relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
          <CircularGallery
            items={penghargaanItems}
            bend={0}
            textColor="#ffffff"
            borderRadius={0.00}
            font="bold 24px system-ui"
            scrollSpeed={0.8}
            scrollEase={0.02}
          />
        </div>
      </div>
    </section>
  );
};

export default Penghargaan;