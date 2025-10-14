import React from 'react';

const Struktur = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Struktur Organisasi
        </h2>
        
        <div className="max-w-5xl mx-auto">
          {/* Main structure container */}
          <div className="flex flex-col items-center">
            {/* CEO Level */}
            <div className="bg-blue-600 text-white p-4 rounded-lg shadow-lg w-64 text-center mb-8">
              <h3 className="font-bold">Direktur Utama</h3>
            </div>
            
            {/* Lines */}
            <div className="w-px h-8 bg-gray-400"></div>
            
            {/* C-Level Executives */}
            <div className="grid grid-cols-3 gap-8 mb-8">
              <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg w-48 text-center">
                <h3 className="font-bold">Direktur Operasional</h3>
              </div>
              <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg w-48 text-center">
                <h3 className="font-bold">Direktur Keuangan</h3>
              </div>
              <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg w-48 text-center">
                <h3 className="font-bold">Direktur Teknik</h3>
              </div>
            </div>
            
            {/* Lines */}
            <div className="grid grid-cols-3 gap-8 w-full max-w-3xl mb-8">
              <div className="flex justify-center">
                <div className="w-px h-8 bg-gray-400"></div>
              </div>
              <div className="flex justify-center">
                <div className="w-px h-8 bg-gray-400"></div>
              </div>
              <div className="flex justify-center">
                <div className="w-px h-8 bg-gray-400"></div>
              </div>
            </div>
            
            {/* Department Level */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
              <div className="space-y-4">
                <div className="bg-blue-400 text-white p-3 rounded-lg shadow-lg text-center">
                  <h4 className="font-semibold">Divisi Operasional</h4>
                </div>
                <div className="bg-blue-400 text-white p-3 rounded-lg shadow-lg text-center">
                  <h4 className="font-semibold">Divisi Logistik</h4>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-400 text-white p-3 rounded-lg shadow-lg text-center">
                  <h4 className="font-semibold">Divisi Keuangan</h4>
                </div>
                <div className="bg-blue-400 text-white p-3 rounded-lg shadow-lg text-center">
                  <h4 className="font-semibold">Divisi Akuntansi</h4>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-400 text-white p-3 rounded-lg shadow-lg text-center">
                  <h4 className="font-semibold">Divisi Teknik</h4>
                </div>
                <div className="bg-blue-400 text-white p-3 rounded-lg shadow-lg text-center">
                  <h4 className="font-semibold">Divisi R&D</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Struktur;