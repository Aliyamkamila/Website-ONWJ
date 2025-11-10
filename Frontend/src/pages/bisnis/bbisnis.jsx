import React from 'react';
import ONWJ from '../../assets/bisnis/LOGO-HD.webp';
/* import PertaminaLogo from '../../assets/bisnis/pertamina.webp'; */
/* import MHJLogo from '../../assets/bisnis/mhj-logo.webp';
import JakproLogo from '../../assets/bisnis/jakpro-logo.webp';
import PetrogasLogo from '../../assets/bisnis/petrogas-logo.webp';
import BWILogo from '../../assets/bisnis/bwi-logo.webp';
import SubangLogo from '../../assets/bisnis/subang-logo.webp';
import BBWMLogo from '../../assets/bisnis/bbwm-logo.webp'; */

const Bbisnis = () => {
  const businessFlow = [
    {
      name: 'PERTAMINA PHE ONWJ',
      logo: 'PertaminaLogo'
    },
    {
      name: 'MIGAS HULU JABAR ONWJ',
      logo: ONWJ
    }
  ];

  const businessPoints = [
    {
      title: 'Menjalankan fungsi Korporasi mengelola',
      subtitle: 'PI 10%',
      icon: '🏢'
    },
    {
      title: 'Dividen',
      subtitle: 'CSR',
      icon: '💹'
    }
  ];

  const shareholders = [
    {
      name: 'MIGAS UTAMA JABAR',
      logo: '../../assets/migas-utama-jabar-logo.png',
      percentage: 62.13
    },
    {
      name: 'JAKPRO',
      logo: '../../assets/jakpro-logo.png',
      percentage: 20.29
    },
    {
      name: 'BUMD PETROGAS PERSADA KARAWANG',
      logo: '../../assets/petrogas-logo.png',
      percentage: 8.24
    },
    {
      name: 'PT. SUBANG SEJAHTERA',
      logo: '../../assets/subang-sejahtera-logo.png',
      percentage: 2.93
    },
    {
      name: 'BWI',
      logo: '../../assets/bwi-logo.png',
      percentage: 4.71
    },
    {
      name: 'BBWM',
      logo: '../../assets/bbwm-logo.png',
      percentage: 1.70
    }
  ];

  const stakeholderGroups = [
    {
      title: 'Pemerintah Provinsi Jawa Barat',
      departments: [
        'Dinas Energi dan Sumber Daya Mineral',
        'Dinas Lingkungan Hidup Jawa Barat',
        'Dinas Penanaman Modal dan Perizinan Terpadu',
        'Dinas terkait Satu Pintu Jawa Barat'
      ]
    },
    {
      title: 'Pemerintah Provinsi DKI Jakarta',
      departments: ['Dinas terkait lainnya']
    },
    {
      title: 'Pemerintah Kabupaten',
      departments: ['Bekasi', 'Subang', 'Karawang', 'Indramayu']
    }
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Bisnis Kami 
          </h2>
          <div className="w-32 h-2 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Business Flow - Updated Design */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="flex flex-col items-center space-y-6">
            {businessFlow.map((item, index) => (
              <div key={index} className="w-full">
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <img 
                    src={item.logo} 
                    alt={item.name}
                    className="h-16 mx-auto mb-3"
                  />
                  <p className="text-center font-semibold text-gray-800">{item.name}</p>
                </div>
                {index < businessFlow.length - 1 && (
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 mx-auto my-2 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Business Points */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="flex flex-wrap justify-center items-center gap-8">
            {businessPoints.map((point, index) => (
              <div key={index} className="flex-1 min-w-[200px] bg-gray-50 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-3xl mb-3">{point.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800">{point.title}</h3>
                <p className="text-blue-600 mt-2">{point.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Shareholders Section */}
        <div className="mt-20 mb-20">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Alih Pengetahuan Share Holder
          </h3>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
              {shareholders.map((shareholder, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img
                    src={shareholder.logo}
                    alt={shareholder.name}
                    className="w-20 h-20 object-contain mb-3"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/80x80?text=' + shareholder.name;
                    }}
                  />
                  <p className="text-sm font-medium text-center text-gray-800">{shareholder.name}</p>
                  <p className="text-blue-600 font-bold">{shareholder.percentage}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stakeholder Section */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Alih Pengetahuan Stake Holder
          </h3>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {stakeholderGroups.map((group, index) => (
                <div key={index} className="bg-blue-50 rounded-lg p-6 shadow-md">
                  <h4 className="text-lg font-semibold text-blue-800 mb-4 text-center">
                    {group.title}
                  </h4>
                  <ul className="space-y-2">
                    {group.departments.map((dept, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {dept}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bbisnis;