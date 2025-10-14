import React from 'react';
/* import MHJLogo from '../../assets/bisnis/mhj-logo.webp';
import JakproLogo from '../../assets/bisnis/jakpro-logo.webp';
import PetrogasLogo from '../../assets/bisnis/petrogas-logo.webp';
import BWILogo from '../../assets/bisnis/bwi-logo.webp';
import SubangLogo from '../../assets/bisnis/subang-logo.webp';
import BBWMLogo from '../../assets/bisnis/bbwm-logo.webp';
import ONWJLogo from '../../assets/bisnis/logo.webp'; */

const Stakeholder = () => {
  const shareholders = [
    {
      name: 'PT Migas Hulu Jabar (Persero)',
      percentage: 62.13,
      logo: '../../assets/migas-hulu-jabar-logo.png'
    },
    {
      name: 'PT Jakarta Propertindo (JAKPRO)',
      percentage: 20.29,
      logo: '../../assets/jakpro-logo.png'
    },
    {
      name: 'PD Petrogas Persada Karawang',
      percentage: 8.24,
      logo: '../../assets/petrogas-karawang-logo.png'
    },
    {
      name: 'PD. Bumi Wiralodra Indramayu',
      percentage: 4.71,
      logo: '../../assets/bwi-logo.png'
    },
    {
      name: 'PT. Subang Sejahtera',
      percentage: 2.93,
      logo: '../../assets/subang-sejahtera-logo.png'
    },
    {
      name: 'PT. Bina Bangun Wibawa Mukti',
      percentage: 1.70,
      logo: '../../assets/bbwm-logo.png'
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Pemegang Saham MUJ ONWJ
          </h2>
          <div className="w-32 h-2 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mb-8 rounded-full"></div>
          <img 
            src="../../assets/mhj-onwj-logo.png"
            alt="MHJ ONWJ Logo"
            className="h-20 mx-auto mb-12"
          />
        </div>

        {/* Shareholders Chart - New Design */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {shareholders.map((shareholder, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <img
                      src={shareholder.logo}
                      alt={shareholder.name}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{shareholder.name}</h3>
                    <div className="flex items-center mt-1">
                      <div className="h-2 w-24 bg-gray-200 rounded-full mr-2">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                          style={{ width: `${shareholder.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-blue-600 font-bold">
                        {shareholder.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Percentage Indicator - New Design */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl px-8 py-4 shadow-lg">
            <span className="text-lg font-semibold text-white">
              Total Kepemilikan Saham: 100%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stakeholder;