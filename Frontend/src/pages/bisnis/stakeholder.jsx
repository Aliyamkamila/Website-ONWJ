import React from 'react';
import ONWJLogo from '../../assets/bisnis/LOGO-HD.webp';

const Stakeholder = () => {
  const shareholders = [
    {
      name: 'PT Migas Hulu Jabar (Persero)',
      percentage: 62.13,
      logo: ONWJLogo,
      role: 'Pemegang Saham Mayoritas'
    },
    {
      name: 'PT Jakarta Propertindo (JAKPRO)',
      percentage: 20.29,
      logo: ONWJLogo,
      role: 'Pemegang Saham Strategis'
    },
    {
      name: 'PD Petrogas Persada Karawang',
      percentage: 8.24,
      logo: ONWJLogo,
      role: 'BUMD Karawang'
    },
    {
      name: 'PD Bumi Wiralodra Indramayu',
      percentage: 4.71,
      logo: ONWJLogo,
      role: 'BUMD Indramayu'
    },
    {
      name: 'PT Subang Sejahtera',
      percentage: 2.93,
      logo: ONWJLogo,
      role: 'BUMD Subang'
    },
    {
      name: 'PT Bina Bangun Wibawa Mukti',
      percentage: 1.70,
      logo: ONWJLogo,
      role: 'BUMD Bekasi'
    }
  ];

  const getBarColor = (index) => {
    const colors = [
      'from-primary-500 to-primary-600',
      'from-primary-600 to-primary-700',
      'from-accent-500 to-accent-600',
      'from-accent-600 to-accent-700',
      'from-warm-500 to-warm-600',
      'from-warm-600 to-warm-400'
    ];
    return colors[index % colors.length];
  };

  return (
    <section className="bg-gradient-to-b from-secondary-50 via-white to-secondary-50 py-grid-20 sm:py-grid-24 lg:py-grid-32">
      <div className="section-container">
        
        {/* ===== SECTION HEADER ===== */}
        <header className="section-header-center">
          <span className="section-label">Struktur Kepemilikan</span>
          <h2 className="section-title">Pemegang Saham MUJ ONWJ</h2>
          
          {/* Logo */}
          <div className="mt-grid-8 inline-block p-grid-6 bg-white rounded-2xl shadow-lg">
            <img 
              src={ONWJLogo}
              alt="MHJ ONWJ Logo"
              className="h-16 sm:h-20 mx-auto object-contain"
            />
          </div>
        </header>

        {/* ===== SHAREHOLDERS GRID ===== */}
        <div className="max-w-6xl mx-auto mb-grid-12">
          <div className="grid sm:grid-cols-2 gap-grid-6 sm:gap-grid-8">
            {shareholders.map((shareholder, index) => (
              <div 
                key={index} 
                className="card-hover group bg-white border border-secondary-200 hover:border-primary-300 p-grid-6 sm:p-grid-8"
              >
                <div className="flex items-start gap-grid-5">
                  {/* Logo Container */}
                  <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl flex items-center justify-center p-grid-3 transition-transform duration-base group-hover:scale-105 group-hover:shadow-md">
                    <img
                      src={shareholder.logo}
                      alt={shareholder.name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    {/* Name */}
                    <h3 className="font-heading font-bold text-body-md sm:text-body-lg text-secondary-900 mb-1 leading-tight">
                      {shareholder.name}
                    </h3>
                    
                    {/* Role */}
                    <p className="text-body-xs sm:text-body-sm text-secondary-600 mb-grid-3">
                      {shareholder.role}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-body-xs sm:text-body-sm font-medium text-secondary-700">
                          Kepemilikan Saham
                        </span>
                        <span className={`text-body-lg sm:text-display-xs font-heading font-bold bg-gradient-to-r ${getBarColor(index)} bg-clip-text text-transparent`}>
                          {shareholder.percentage}%
                        </span>
                      </div>
                      
                      <div className="h-2.5 bg-secondary-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${getBarColor(index)} rounded-full transition-all duration-slower ease-smart`}
                          style={{ width: `${shareholder.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== TOTAL INDICATOR ===== */}
        <div className="text-center">
          <div className="inline-flex items-center gap-grid-4 bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl px-grid-8 py-grid-5 shadow-xl shadow-primary-500/20 hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-base hover:-translate-y-1">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
            <span className="text-body-lg sm:text-display-xs font-heading font-bold text-white">
              Total Kepemilikan Saham: 100%
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Stakeholder;