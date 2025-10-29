// src/pages/wk/deskripsiwk.jsx
import React from 'react';
import WorkAreaImage from '../../assets/wilayah/area-map.webp';
// Ganti ikon emoji dengan react-icons agar profesional
import { FaIndustry, FaBolt, FaWater } from 'react-icons/fa'; 

const DeskripsiWK = () => {
  const workAreas = [
    {
      title: 'Wilayah Operasi ONWJ',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Wilayah kerja ONWJ mencakup area seluas lebih dari 8.300 kilometer persegi yang meliputi kawasan lepas pantai di utara Jawa Barat.',
      points: [
        'Kawasan Lepas Pantai Utara Jawa Barat',
        'Area Operasi meliputi 4 Kabupaten/Kota',
        'Kedalaman perairan 2-40 meter',
        'Total area kerja 8.300 km²'
      ]
    }
  ];

  const keyFeatures = [
    { icon: <FaIndustry className="w-8 h-8 text-blue-600" />, title: 'Fasilitas Produksi', description: 'Memiliki berbagai fasilitas produksi strategis di sepanjang wilayah operasi' },
    { icon: <FaBolt className="w-8 h-8 text-orange-500" />, title: 'Kapasitas Produksi', description: 'Mampu memproduksi minyak dan gas dengan kapasitas yang signifikan' },
    { icon: <FaWater className="w-8 h-8 text-teal-500" />, title: 'Offshore Operations', description: 'Operasi lepas pantai dengan teknologi modern dan standar keamanan tinggi' }
  ];

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-8 lg:px-16">
        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              {workAreas.map((area, index) => (
                <div key={index}>
                  <h3 className="text-3xl font-semibold text-gray-800 mb-4">
                    {area.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {area.description}
                  </p>
                  <ul className="space-y-3">
                    {area.points.map((point, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="relative">
              <img
                src={WorkAreaImage}
                alt="Wilayah Kerja Overview"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {keyFeatures.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeskripsiWK;