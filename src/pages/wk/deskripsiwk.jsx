import React from 'react';
import WorkAreaImage from '../../assets/wilayah/area-map.webp';

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
    {
      icon: '🏢',
      title: 'Fasilitas Produksi',
      description: 'Memiliki berbagai fasilitas produksi strategis di sepanjang wilayah operasi'
    },
    {
      icon: '⚡',
      title: 'Kapasitas Produksi',
      description: 'Mampu memproduksi minyak dan gas dengan kapasitas yang signifikan'
    },
    {
      icon: '🌊',
      title: 'Offshore Operations',
      description: 'Operasi lepas pantai dengan teknologi modern dan standar keamanan tinggi'
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Wilayah Kerja
          </h2>
          <div className="w-32 h-2 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              {workAreas.map((area, index) => (
                <div key={index}>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    {area.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {area.description}
                  </p>
                  <ul className="space-y-3">
                    {area.points.map((point, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
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
              <div className="absolute inset-0 bg-blue-500 opacity-10 rounded-lg"></div>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {keyFeatures.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
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