import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Tooltip,
  LayersControl,
  LayerGroup,
  ScaleControl,
  useMap,
  CircleMarker,
  Polyline
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import './wilayahkerja.css';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = DefaultIcon;

function MarkerCluster({ markers = [], onMarkerClick = () => {}, zoomLevel = 8 }) {
  const map = useMap();
  const clusterRef = useRef(null);

  useEffect(() => {
    if (!map) return;
    const mcg = L.markerClusterGroup({ chunkedLoading: true });
    clusterRef.current = mcg;
    markers.forEach((item, idx) => {
      const m = L.marker(item.position, { title: item.name, riseOnHover: true });
      m.on('click', () => onMarkerClick({ ...item, type: 'tjsl' }));
      m.bindTooltip(String(idx + 1), {
        direction: 'top',
        offset: [0, -10],
        permanent: zoomLevel >= 10,
        opacity: 1
      });

      mcg.addLayer(m);
    });

    map.addLayer(mcg);

    return () => {
      if (map && mcg) {
        map.removeLayer(mcg);
      }
    };
  }, [map, JSON.stringify(markers), zoomLevel]);
  return null;
}

const WilayahKerja = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('semua');
  const [zoomLevel, setZoomLevel] = useState(8);
  const mapRef = useRef(null);

  const flowLineCoordinates = useMemo(() => ([
    [-5.355123, 106.600162],
    [-5.361711, 106.591125],
    [-5.821120, 107.032625],
    [-5.827708, 107.023589],
    [-5.823055, 106.991481],
    [-5.842273, 107.177863],
    [-5.910981, 107.301039],
    [-5.917569, 107.292003],
    [-5.908607, 107.052618],
    [-5.915194, 107.517144],
    [-6.032211, 107.526713],
    [-6.121081, 107.857525],
    [-6.079227, 107.716877],
    [-5.975795, 107.759091],
    [-5.948672, 107.919132],
    [-5.954138, 107.909904],
    [-6.004002, 108.116644],
    [-6.110974, 108.126987],
  ]), []);

  // Generate data produksi dummy untuk setiap titik flow
  const generateProductionData = (pointIndex) => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return months.map((month, idx) => ({
      month,
      oil: Math.floor(Math.random() * 3000) + 1500 + (pointIndex * 100), // BOPD
      gas: Math.floor(Math.random() * 8000) + 3000 + (pointIndex * 200), // MMSCFD
    }));
  };

  // Data untuk setiap titik flow
  const flowPointsData = useMemo(() => 
    flowLineCoordinates.map((coord, index) => ({
      id: `FLOW-${index + 1}`,
      name: `Flow Point ${index + 1}`,
      position: coord,
      type: 'flow',
      description: `Titik flow ${index + 1} pada jalur pipeline utama. Merupakan bagian dari sistem distribusi minyak dan gas dari platform produksi ke fasilitas pemrosesan.`,
      facilities: [
        'Pipeline Connection',
        'Flow Meter',
        'Pressure Monitoring',
        'Safety Valve System',
        'Control Station'
      ],
      production: generateProductionData(index),
      coordinates: `${coord[0].toFixed(6)}°, ${coord[1].toFixed(6)}°`,
      status: 'Operational',
      pressure: `${(Math.random() * 500 + 1000).toFixed(2)} PSI`,
      temperature: `${(Math.random() * 30 + 50).toFixed(1)}°C`,
      flowRate: `${(Math.random() * 5000 + 3000).toFixed(0)} BBL/Day`
    }))
  , [flowLineCoordinates]);

  const pengeboranData = useMemo(() => ([
    
  ]), []);

  const tjslData = useMemo(() => ([
    { name: 'Program Ekowisata (Kepulauan Seribu)', position: [-5.55, 106.55], description: 'Pengembangan wisata ramah lingkungan dan edukasi laut.' },
    { name: 'Program Pendidikan (Kalibaru)', position: [-6.1026, 106.9192], description: 'Bantuan renovasi sekolah dan beasiswa.', facilities: ['Renovasi ruang kelas','Beasiswa siswa berprestasi']},
    { name: 'Program Mangrove (Muara Gembong)', position: [-5.9972, 107.0394], description: 'Penanaman 5.000 bibit mangrove.', facilities: ['Penanaman bibit','Edukasi lingkungan'], region: 'Muara Gembong'},
    { name: 'Program Kesehatan (Sungai Buntu)', position: [-6.0563, 107.4026], description: 'Pusat layanan kesehatan air bersih.', facilities: ['Klinik lapangan','Penyuluhan kesehatan'], region: 'Sungai Buntu'},
    { name: 'Program UKM (Mayangan)', position: [-6.2177, 107.7800], description: 'Pelatihan dan modal usaha untuk UKM lokal.', facilities: ['Pelatihan bisnis','Modal usaha mikro'], region: 'Mayangan'},
    { name: 'Program Lingkungan (Balongan)', position: [-6.3971, 108.3682], description: 'Konservasi terumbu karang.', facilities: ['Restorasi terumbu','Monitoring biodiversitas'], region: 'Balongan'},
    { name: 'Program Sosial (Jawa Barat)', position: [-6.9147, 107.6098], description: 'Program pemberdayaan masyarakat dan pelatihan keterampilan di wilayah Jawa Barat.', facilities: ['Pelatihan']},
  ]), []);

  const center = [-6.2, 107.5];

  const openModal = (itemData) => {
    setActiveItem(itemData);
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setActiveItem(null);
  };

  const handleMapCreated = (mapInstance) => {
    mapRef.current = mapInstance;
    setZoomLevel(mapInstance.getZoom());
    mapInstance.on('zoomend', () => setZoomLevel(mapInstance.getZoom()));
  };

  useEffect(() => {
    if (!mapRef.current) return;
    if (filter === 'pengeboran') {
      const allCoords = [...pengeboranData.flatMap(a => a.coordinates), ...flowLineCoordinates];
      if (allCoords.length) {
        mapRef.current.fitBounds(allCoords, { padding: [40, 40] });
      }
    } else if (filter === 'tjsl') {
      const allPoints = tjslData.map(p => p.position);
      if (allPoints.length) {
        mapRef.current.fitBounds(allPoints, { padding: [40, 40] });
      }
    } else {
      mapRef.current.setView(center, 8);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4 lg:px-16">
        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <button onClick={() => setFilter('semua')} className={`px-4 py-2 rounded-full ${filter === 'semua' ? 'bg-blue-600 text-white' : 'bg-white'}`}>Tampilkan Semua</button>
          <button onClick={() => setFilter('pengeboran')} className={`px-4 py-2 rounded-full ${filter === 'pengeboran' ? 'bg-blue-600 text-white' : 'bg-white'}`}>Peta Pengeboran</button>
          <button onClick={() => setFilter('tjsl')} className={`px-4 py-2 rounded-full ${filter === 'tjsl' ? 'bg-blue-600 text-white' : 'bg-white'}`}>Peta TJSL</button>
        </div>

        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-2 border border-gray-200">
          <MapContainer
            center={center}
            zoom={8}
            style={{ height: '620px', width: '100%' }}
            whenCreated={handleMapCreated}
            minZoom={6}
            maxZoom={16}
            maxBounds={[[-12, 95], [6, 141]]}
            className="rounded-lg"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />

            <ScaleControl position="bottomleft" />

            <LayersControl position="topright">
              {/* Pengeboran polygons */}
              <LayersControl.Overlay name="Pengeboran" checked={filter !== 'tjsl'}>
                <LayerGroup>
                  {(filter === 'semua' || filter === 'pengeboran') && pengeboranData.map(area => (
                    <Polygon
                      key={area.name}
                      positions={area.coordinates}
                      pathOptions={{
                        fillColor: area.color || '#EF4444',
                        fillOpacity: 0.45,
                        weight: 2,
                        color: area.color || '#ffffff',
                      }}
                      eventHandlers={{
                        click: () => openModal({ ...area, type: 'pengeboran' })
                      }}
                    />
                  ))}
                </LayerGroup>
              </LayersControl.Overlay>

              {/* Flow Points - Circle Markers */}
              <LayersControl.Overlay name="Flow Points" checked={filter !== 'tjsl'}>
                <LayerGroup>
                  {(filter === 'semua' || filter === 'pengeboran') && flowPointsData.map((point, idx) => (
                    <CircleMarker
                      key={point.id}
                      center={point.position}
                      radius={8}
                      pathOptions={{
                        fillColor: '#3B82F6',
                        fillOpacity: 0.9,
                        color: '#FFFFFF',
                        weight: 2,
                        opacity: 1
                      }}
                      eventHandlers={{
                        click: () => openModal(point),
                        mouseover: (e) => {
                          e.target.setStyle({
                            radius: 12,
                            fillOpacity: 1,
                            weight: 3
                          });
                        },
                        mouseout: (e) => {
                          e.target.setStyle({
                            radius: 8,
                            fillOpacity: 0.9,
                            weight: 2
                          });
                        }
                      }}
                    >
                      <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={zoomLevel >= 11}>
                        {idx + 1}
                      </Tooltip>
                    </CircleMarker>
                  ))}
                </LayerGroup>
              </LayersControl.Overlay>

              {/* TJSL markers */}
              <LayersControl.Overlay name="TJSL" checked={filter !== 'pengeboran'}>
                <LayerGroup>
                  {(filter === 'semua' || filter === 'tjsl') && (
                    <MarkerCluster markers={tjslData} onMarkerClick={openModal} zoomLevel={zoomLevel} />
                  )}
                </LayerGroup>
              </LayersControl.Overlay>
            </LayersControl>
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="max-w-6xl mx-auto mt-4 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-lg mb-3">📊 Legenda Peta</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Flow Points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && activeItem && (
        <div className="modal-backdrop" onClick={(e) => { if (e.target.classList.contains('modal-backdrop')) closeModal(); }}>
          <div className="modal-content">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                  width: 14, 
                  height: 14, 
                  borderRadius: activeItem.type === 'flow' ? '50%' : 4, 
                  backgroundColor: activeItem.type === 'flow' ? '#3B82F6' : (activeItem.color || '#FFEB3B') 
                }} />
                <h3 className="modal-title">
                  {activeItem.type === 'flow' ? '🔵' : '📍'} Detail: {activeItem.name}
                </h3>
              </div>
              <button className="modal-close-btn" onClick={closeModal}>✕</button>
            </div>

            <div className="modal-body">
              {activeItem.type === 'flow' ? (
                // Modal untuk Flow Point dengan data produksi
                <div>
                  <div className="modal-section mb-4">
                    <h4 className="modal-section-title">📋 Informasi Flow Point</h4>
                    <p className="modal-text mb-3">{activeItem.description}</p>
                    <div className="modal-data-grid">
                      <div className="modal-data-item">
                        <div className="modal-data-label">ID:</div>
                        <div className="modal-data-value">{activeItem.id}</div>
                      </div>
                      <div className="modal-data-item">
                        <div className="modal-data-label">Koordinat:</div>
                        <div className="modal-data-value">{activeItem.coordinates}</div>
                      </div>
                      <div className="modal-data-item">
                        <div className="modal-data-label">Status:</div>
                        <div className="modal-data-value text-green-600">{activeItem.status}</div>
                      </div>
                      <div className="modal-data-item">
                        <div className="modal-data-label">Tekanan:</div>
                        <div className="modal-data-value">{activeItem.pressure}</div>
                      </div>
                      <div className="modal-data-item">
                        <div className="modal-data-label">Temperatur:</div>
                        <div className="modal-data-value">{activeItem.temperature}</div>
                      </div>
                      <div className="modal-data-item">
                        <div className="modal-data-label">Flow Rate:</div>
                        <div className="modal-data-value">{activeItem.flowRate}</div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-section mb-4">
                    <h4 className="modal-section-title">⚙️ Fasilitas</h4>
                    <ul className="modal-list">
                      {activeItem.facilities.map((f, i) => (
                        <li key={i} className="modal-list-item">{f}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="modal-section">
                    <h4 className="modal-section-title">📈 Data Produksi Tahun 2025</h4>
                    <div className="overflow-x-auto">
                      <table className="production-table w-full">
                        <thead>
                          <tr className="bg-blue-50">
                            <th className="px-4 py-2 text-left border">Bulan</th>
                            <th className="px-4 py-2 text-right border">Minyak (BOPD)</th>
                            <th className="px-4 py-2 text-right border">Gas (MMSCFD)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeItem.production.map((data, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-4 py-2 border">{data.month}</td>
                              <td className="px-4 py-2 text-right border font-mono">{data.oil.toLocaleString()}</td>
                              <td className="px-4 py-2 text-right border font-mono">{data.gas.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-blue-100 font-bold">
                            <td className="px-4 py-2 border">Total Tahunan</td>
                            <td className="px-4 py-2 text-right border font-mono">
                              {activeItem.production.reduce((sum, d) => sum + d.oil, 0).toLocaleString()}
                            </td>
                            <td className="px-4 py-2 text-right border font-mono">
                              {activeItem.production.reduce((sum, d) => sum + d.gas, 0).toLocaleString()}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 italic">
                      * Data produksi adalah simulasi untuk keperluan demonstrasi
                    </p>
                  </div>
                </div>
              ) : (
                // Modal untuk area pengeboran dan TJSL (existing)
                <div className="modal-grid">
                  <div className="modal-column">
                    <div className="modal-section">
                      <h4 className="modal-section-title">📋 Deskripsi</h4>
                      <p className="modal-text">{activeItem.description}</p>
                    </div>

                    <div className="modal-section">
                      <h4 className="modal-section-title">📐 Data Teknis</h4>
                      <div className="modal-data-grid">
                        <div className="modal-data-item">
                          <div className="modal-data-label">Entity Type:</div>
                          <div className="modal-data-value">{activeItem.entity || (activeItem.type === 'tjsl' ? 'Point' : 'Polygon')}</div>
                        </div>
                        <div className="modal-data-item">
                          <div className="modal-data-label">Layer:</div>
                          <div className="modal-data-value">{activeItem.layer || (activeItem.type === 'tjsl' ? '_TJSL' : '_BATAS')}</div>
                        </div>
                        <div className="modal-data-item">
                          <div className="modal-data-label">Line Type:</div>
                          <div className="modal-data-value">{activeItem.linetype || (activeItem.type === 'tjsl' ? 'POINT' : 'DASHED2')}</div>
                        </div>
                        <div className="modal-data-item">
                          <div className="modal-data-label">Total Koordinat:</div>
                          <div className="modal-data-value">{activeItem.totalPoints ?? (activeItem.coordinates ? activeItem.coordinates.length : 1)} titik</div>
                        </div>
                      </div>
                    </div>

                    <div className="modal-section">
                      <h4 className="modal-section-title">📍 Wilayah Geografis</h4>
                      <p className="modal-text">{activeItem.region || (activeItem.position ? activeItem.position.join(', ') : '—')}</p>
                    </div>
                  </div>

                  <div className="modal-column">
                    <div className="modal-section">
                      <h4 className="modal-section-title">{activeItem.type === 'pengeboran' ? '🏭 Fasilitas & Infrastruktur' : '💙 Program & Fasilitas'}</h4>
                      {activeItem.facilities && activeItem.facilities.length ? (
                        <ul className="modal-list">
                          {activeItem.facilities.map((f, i) => <li key={i} className="modal-list-item">{f}</li>)}
                        </ul>
                      ) : (
                        <p className="modal-text">Informasi fasilitas tidak tersedia.</p>
                      )}
                    </div>

                    <div className="modal-section">
                      <h4 className="modal-section-title">📊 Produksi / Target</h4>
                      <p className="modal-text">{activeItem.production || 'Tidak tersedia'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WilayahKerja;