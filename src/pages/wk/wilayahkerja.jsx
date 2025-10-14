import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const WilayahKerja = () => {
  const [activeArea, setActiveArea] = useState(null);

  // Koordinat polygon untuk setiap wilayah (contoh koordinat)
  const workingAreas = [
    {
      name: 'Bekasi',
      coordinates: [
        [-6.2, 107.0],
        [-6.2, 107.2],
        [-6.4, 107.2],
        [-6.4, 107.0],
      ],
      description: 'Wilayah operasi Bekasi mencakup area lepas pantai dengan kedalaman 2-30 meter.',
      facilities: ['Platform Alpha', 'Platform Beta', 'FSO 1'],
      production: 'Minyak: 5000 BOPD, Gas: 50 MMSCFD'
    },
    {
      name: 'Karawang',
      coordinates: [
        [-6.0, 107.2],
        [-6.0, 107.4],
        [-6.2, 107.4],
        [-6.2, 107.2],
      ],
      description: 'Area Karawang merupakan salah satu wilayah produksi utama.',
      facilities: ['Platform Charlie', 'Platform Delta', 'FSO 2'],
      production: 'Minyak: 7000 BOPD, Gas: 70 MMSCFD'
    },
    // Tambahkan wilayah lain sesuai kebutuhan
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Peta Wilayah Kerja
          </h2>
          <div className="w-32 h-2 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full mb-8"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Klik pada wilayah di peta untuk melihat informasi detail mengenai area operasi dan fasilitas yang tersedia.
          </p>
        </div>

        {/* Map Container */}
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-4">
          <MapContainer
            center={[-6.2, 107.2]} // Sesuaikan dengan koordinat tengah wilayah
            zoom={9}
            style={{ height: '600px', width: '100%' }}
            className="rounded-lg"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {workingAreas.map((area, index) => (
              <Polygon
                key={index}
                positions={area.coordinates}
                pathOptions={{
                  fillColor: activeArea === area.name ? '#3B82F6' : '#60A5FA',
                  fillOpacity: 0.7,
                  weight: 2,
                  color: 'white',
                }}
                eventHandlers={{
                  click: () => setActiveArea(area.name),
                  mouseover: (e) => {
                    e.target.setStyle({ fillOpacity: 0.9 });
                  },
                  mouseout: (e) => {
                    e.target.setStyle({ fillOpacity: 0.7 });
                  },
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {area.name}
                    </h3>
                    <p className="text-gray-600 mb-2">{area.description}</p>
                    <div className="mb-2">
                      <strong className="text-gray-700">Fasilitas:</strong>
                      <ul className="list-disc list-inside text-gray-600">
                        {area.facilities.map((facility, idx) => (
                          <li key={idx}>{facility}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong className="text-gray-700">Produksi:</strong>
                      <p className="text-gray-600">{area.production}</p>
                    </div>
                  </div>
                </Popup>
              </Polygon>
            ))}
          </MapContainer>
        </div>

        {/* Area Information Panel */}
        {activeArea && (
          <div className="max-w-6xl mx-auto mt-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Detail Wilayah: {activeArea}
              </h3>
              {workingAreas.find(area => area.name === activeArea) && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Deskripsi</h4>
                    <p className="text-gray-600">
                      {workingAreas.find(area => area.name === activeArea).description}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Fasilitas & Produksi</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {workingAreas
                        .find(area => area.name === activeArea)
                        .facilities.map((facility, idx) => (
                          <li key={idx}>{facility}</li>
                        ))}
                    </ul>
                    <p className="text-gray-600 mt-2">
                      {workingAreas.find(area => area.name === activeArea).production}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WilayahKerja;