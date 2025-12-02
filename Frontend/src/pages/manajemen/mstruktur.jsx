import React from 'react';

const Struktur = () => {
  return (
    <section className="py-12 bg-white">
      <div className="section-container">
        
        {/* Compact Section Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-heading font-bold text-secondary-900 mb-2">
            Struktur Organisasi
          </h2>
          <div className="w-12 h-0.5 bg-primary-600 mx-auto"></div>
        </div>
        
        {/* Compact Org Chart */}
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center space-y-5">
            
            {/* CEO - Compact */}
            <div className="w-full max-w-xs">
              <div className="bg-primary-600 text-white px-5 py-3 rounded text-center border border-primary-700">
                <p className="font-heading font-bold text-sm">Direktur Utama</p>
              </div>
            </div>
            
            {/* Compact Connector */}
            <div className="w-px h-6 bg-secondary-300"></div>
            
            {/* C-Level - Compact */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['Direktur Operasional', 'Direktur Keuangan', 'Direktur Teknik'].map((title, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-4">
                  <div className="w-full bg-primary-500 text-white px-4 py-2.5 rounded text-center border border-primary-600">
                    <p className="font-heading font-semibold text-xs">{title}</p>
                  </div>
                  <div className="w-px h-5 bg-secondary-300 hidden sm:block"></div>
                </div>
              ))}
            </div>
            
            {/* Departments - Compact */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                ['Divisi Operasional', 'Divisi Logistik'],
                ['Divisi Keuangan', 'Divisi Akuntansi'],
                ['Divisi Teknik', 'Divisi R&D']
              ].map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-2.5">
                  {group.map((dept, deptIdx) => (
                    <div 
                      key={deptIdx}
                      className="bg-white border border-primary-200 px-4 py-2.5 rounded text-center transition-colors hover:border-primary-600 hover:bg-primary-50"
                    >
                      <p className="font-heading font-medium text-xs text-secondary-900">{dept}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Struktur;