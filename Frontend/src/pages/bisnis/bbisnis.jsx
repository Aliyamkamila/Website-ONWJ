import React from 'react';
import ONWJ from '../../assets/bisnis/LOGO-HD.webp';

const Bbisnis = () => {
  const businessFlow = [
    {
      name: 'PERTAMINA PHE ONWJ',
      logo: ONWJ,
      description: 'Operator Lapangan'
    },
    {
      name: 'MIGAS HULU JABAR ONWJ',
      logo: ONWJ,
      description: 'Pengelola Participating Interest'
    }
  ];

  const businessPoints = [
    {
      title: 'Menjalankan fungsi Korporasi',
      subtitle: 'Mengelola PI 10%',
      icon: '🏢',
      color: 'from-primary-500 to-primary-600'
    },
    {
      title: 'Dividen & Tanggung Jawab Sosial',
      subtitle: 'CSR Program',
      icon: '💹',
      color: 'from-accent-500 to-accent-600'
    }
  ];

  const shareholders = [
    { name: 'MIGAS UTAMA JABAR', percentage: 62.13, color: 'bg-primary-500' },
    { name: 'JAKPRO', percentage: 20.29, color: 'bg-primary-600' },
    { name: 'BUMD PETROGAS PERSADA KARAWANG', percentage: 8.24, color: 'bg-accent-500' },
    { name: 'PT.SUBANG SEJAHTERA', percentage: 2.93, color: 'bg-accent-600' },
    { name: 'BWI', percentage: 4.71, color: 'bg-warm-500' },
    { name: 'BBWM', percentage: 1.70, color: 'bg-warm-600' }
  ];

  const stakeholderGroups = [
    {
      title: 'Pemerintah Provinsi Jawa Barat',
      icon: '🏛️',
      color: 'from-primary-50 to-primary-100',
      departments: [
        'Dinas Energi dan Sumber Daya Mineral',
        'Dinas Lingkungan Hidup Jawa Barat',
        'Dinas Penanaman Modal dan Perizinan Terpadu',
        'Dinas terkait Satu Pintu Jawa Barat'
      ]
    },
    {
      title: 'Pemerintah Provinsi DKI Jakarta',
      icon: '🌆',
      color: 'from-accent-50 to-accent-100',
      departments: ['Dinas terkait lainnya']
    },
    {
      title: 'Pemerintah Kabupaten',
      icon: '🏘️',
      color: 'from-warm-50 to-warm-100',
      departments: ['Bekasi', 'Subang', 'Karawang', 'Indramayu']
    }
  ];

  return (
    <div className="bg-white py-grid-20 sm:py-grid-24 lg:py-grid-32">
      <div className="section-container">
        
        {/* ===== SECTION HEADER ===== */}
        <header className="section-header-center" id="bisnis-flow">
          <span className="section-label">Alur Bisnis</span>
          <h2 className="section-title">Ekosistem Bisnis Kami</h2>
          <p className="section-description">
            Kolaborasi strategis dalam pengelolaan aset energi untuk pertumbuhan berkelanjutan
          </p>
        </header>

        {/* ===== BUSINESS FLOW ===== */}
        <div className="max-w-3xl mx-auto mb-grid-20 sm:mb-grid-24">
          <div className="flex flex-col items-center space-y-0">
            {businessFlow.map((item, index) => (
              <React.Fragment key={index}>
                <div className="w-full group">
                  <div className="card-hover bg-white border border-secondary-200 p-grid-6 sm:p-grid-8 transition-all duration-base hover:border-primary-300 hover:shadow-primary-500/10">
                    <div className="flex flex-col sm:flex-row items-center gap-grid-4 sm:gap-grid-6">
                      {/* Logo Container */}
                      <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl flex items-center justify-center p-grid-3 transition-transform duration-base group-hover:scale-105">
                        <img 
                          src={item.logo} 
                          alt={item.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      
                      {/* Text Content */}
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-heading font-bold text-body-xl sm:text-display-xs text-secondary-900 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-body-sm sm:text-body-md text-secondary-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connector Arrow */}
                {index < businessFlow.length - 1 && (
                  <div className="relative py-grid-4 flex flex-col items-center">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full" />
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-primary-600" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ===== BUSINESS POINTS ===== */}
        <div className="max-w-4xl mx-auto mb-grid-20 sm:mb-grid-24">
          <div className="grid sm:grid-cols-2 gap-grid-6 sm:gap-grid-8">
            {businessPoints.map((point, index) => (
              <div 
                key={index} 
                className="card-hover group relative overflow-hidden"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${point.color} opacity-5 group-hover:opacity-10 transition-opacity duration-base`} />
                
                <div className="relative p-grid-6 sm:p-grid-8 text-center">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl shadow-md mb-grid-4 text-4xl sm:text-5xl transition-transform duration-base group-hover:scale-110 group-hover:shadow-lg">
                    {point.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-heading font-semibold text-body-xl sm:text-display-xs text-secondary-900 mb-2">
                    {point.title}
                  </h3>
                  
                  {/* Subtitle */}
                  <p className="text-body-md sm:text-body-lg text-primary-600 font-semibold">
                    {point.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== SHAREHOLDERS ===== */}
        <div className="mb-grid-20 sm:mb-grid-24">
          <header className="section-header-center">
            <span className="section-label">Komposisi Kepemilikan</span>
            <h2 className="section-title">Alih Pengetahuan Shareholder</h2>
          </header>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-grid-4 sm:gap-grid-6">
              {shareholders.map((shareholder, index) => (
                <div 
                  key={index} 
                  className="card-hover group text-center p-grid-4 sm:p-grid-5"
                >
                  {/* Percentage Circle */}
                  <div className="relative inline-block mb-grid-3">
                    <svg className="w-20 h-20 sm:w-24 sm:h-24 transform -rotate-90">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="38%"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-secondary-100"
                      />
                      <circle
                        cx="50%"
                        cy="50%"
                        r="38%"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeDasharray={`${shareholder.percentage * 2.4} 240`}
                        className={`${shareholder.color.replace('bg-', 'text-')} transition-all duration-slower group-hover:stroke-[8]`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-heading font-bold text-body-lg sm:text-display-xs text-secondary-900">
                        {shareholder.percentage}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Name */}
                  <h4 className="font-body font-medium text-body-xs sm:text-body-sm text-secondary-700 leading-tight">
                    {shareholder.name}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== STAKEHOLDERS ===== */}
        <div>
          <header className="section-header-center">
            <span className="section-label">Mitra Pemerintah</span>
            <h2 className="section-title">Alih Pengetahuan Stakeholder</h2>
          </header>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-grid-6 sm:gap-grid-8">
              {stakeholderGroups.map((group, index) => (
                <div 
                  key={index} 
                  className="card-hover group relative overflow-hidden"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${group.color} group-hover:opacity-80 transition-opacity duration-base`} />
                  
                  <div className="relative p-grid-6 sm:p-grid-8">
                    {/* Icon + Title */}
                    <div className="flex items-start gap-grid-3 mb-grid-5">
                      <span className="text-3xl sm:text-4xl">{group.icon}</span>
                      <h3 className="flex-1 font-heading font-bold text-body-lg sm:text-display-xs text-secondary-900 leading-tight">
                        {group.title}
                      </h3>
                    </div>
                    
                    {/* Departments List */}
                    <ul className="space-y-grid-2.5">
                      {group.departments.map((dept, idx) => (
                        <li 
                          key={idx} 
                          className="flex items-start gap-grid-2 text-body-sm sm:text-body-md text-secondary-700"
                        >
                          <span className="shrink-0 w-1.5 h-1.5 bg-primary-600 rounded-full mt-1.5" />
                          <span className="leading-snug">{dept}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
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