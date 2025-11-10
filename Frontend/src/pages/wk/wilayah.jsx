import React, { useState, useMemo } from 'react';
import './wilayahkerja.css';
import Peta from './Peta.png';

/**
 * Wilayah (pengeboran only) - PNG image-based map with clickable areas
 *
 * - Uses PNG image as the map background
 * - Clickable areas positioned over the image
 * - Opens modal with drilling details on click
 * - Lightweight: no Leaflet dependency
 */

const samplePengeboran = () => ([
  {
    id: 'BRAVO',
    name: 'BRAVO',
    position: { x: 50.82, y: 61.47 },
    color: '#EF4444',
    description: 'Area pengeboran BRAVO. Lokasi strategis untuk eksplorasi dan produksi hidrokarbon di Wilayah Kerja ONWJ.',
    facilities: ['Platform BRAVO', 'Wellheads', 'Production Facilities', 'Control Room', 'Pipeline System'],
    production: '5,200 BOPD',
    status: 'Operasional',
    wells: 12,
    depth: '3,450 m',
  },
  {
    id: 'UNIFORM',
    name: 'UNIFORM',
    // Position: 2918,2547 on 4959x3509 image
    // x = (2918/4959)*100 = 58.83%
    // y = (2547/3509)*100 = 72.58%
    position: { x: 58.83, y: 72.58 },
    color: '#10B981',
    description: 'Area pengeboran UNIFORM. Fasilitas modern dengan teknologi terkini untuk optimalisasi produksi di Wilayah Kerja ONWJ.',
    facilities: ['Platform UNIFORM', 'Wellheads', 'Production Facilities', 'Control Room', 'Pipeline System'],
    production: '4,800 BOPD',
    status: 'Operasional',
    wells: 10,
    depth: '3,200 m',
  },
  {
    id: 'ECHO',
    name: 'ECHO',
    // Position: 3093,2017 on 4959x3509 image
    // x = (3093/4959)*100 = 62.36%
    // y = (2017/3509)*100 = 57.47%
    position: { x: 62.36, y: 57.47 },
    color: '#F59E0B',
    description: 'Area pengeboran ECHO. Lokasi produksi dengan potensi hidrokarbon tinggi di Wilayah Kerja ONWJ.',
    facilities: ['Platform ECHO', 'Wellheads', 'Production Facilities', 'Control Room', 'Pipeline System'],
    production: '6,100 BOPD',
    status: 'Operasional',
    wells: 14,
    depth: '3,650 m',
  },
  {
    id: 'FOXTROT',
    name: 'FOXTROT',
    // Position: 3448,2338 on 4959x3509 image
    // x = (3448/4959)*100 = 69.52%
    // y = (2338/3509)*100 = 66.62%
    position: { x: 69.52, y: 66.62 },
    color: '#8B5CF6',
    description: 'Area pengeboran FOXTROT. Fasilitas produksi terintegrasi dengan sistem monitoring canggih di Wilayah Kerja ONWJ.',
    facilities: ['Platform FOXTROT', 'Wellheads', 'Production Facilities', 'Control Room', 'Pipeline System'],
    production: '5,500 BOPD',
    status: 'Operasional',
    wells: 11,
    depth: '3,380 m',
  },
  {
    id: 'GG',
    name: 'GG',
    // Position: 1706,1511 on 4959x3509 image
    // x = (1706/4959)*100 = 34.41%
    // y = (1511/3509)*100 = 43.06%
    position: { x: 34.41, y: 43.06 },
    color: '#EC4899',
    description: 'Area pengeboran GG. Lokasi eksplorasi dan produksi dengan infrastruktur lengkap di Wilayah Kerja ONWJ.',
    facilities: ['Platform GG', 'Wellheads', 'Production Facilities', 'Control Room', 'Pipeline System'],
    production: '4,300 BOPD',
    status: 'Operasional',
    wells: 9,
    depth: '3,100 m',
  },
  {
    id: 'LIMA',
    name: 'LIMA',
    // Position: 2143,2027 on 4959x3509 image
    // x = (2143/4959)*100 = 43.22%
    // y = (2027/3509)*100 = 57.76%
    position: { x: 43.22, y: 57.76 },
    color: '#06B6D4',
    description: 'Area pengeboran LIMA. Fasilitas strategis dengan kapasitas produksi optimal di Wilayah Kerja ONWJ.',
    facilities: ['Platform LIMA', 'Wellheads', 'Production Facilities', 'Control Room', 'Pipeline System'],
    production: '5,700 BOPD',
    status: 'Operasional',
    wells: 13,
    depth: '3,520 m',
  },
  {
    id: 'KL',
    name: 'KL',
    // Position: 2121,2316 on 4959x3509 image
    // x = (2121/4959)*100 = 42.77%
    // y = (2316/3509)*100 = 65.99%
    position: { x: 42.77, y: 65.99 },
    color: '#84CC16',
    description: 'Area pengeboran KL. Lokasi produksi dengan teknologi ramah lingkungan di Wilayah Kerja ONWJ.',
    facilities: ['Platform KL', 'Wellheads', 'Production Facilities', 'Control Room', 'Pipeline System'],
    production: '4,900 BOPD',
    status: 'Operasional',
    wells: 10,
    depth: '3,280 m',
  },
  {
    id: 'MB',
    name: 'MB',
    // Position: 1771,1895 on 4959x3509 image
    // x = (1771/4959)*100 = 35.71%
    // y = (1895/3509)*100 = 54.00%
    position: { x: 35.71, y: 54.00 },
    color: '#F97316',
    description: 'Area pengeboran MB. Fasilitas produksi dengan sistem keamanan tinggi di Wilayah Kerja ONWJ.',
    facilities: ['Platform MB', 'Wellheads', 'Production Facilities', 'Control Room', 'Pipeline System'],
    production: '5,300 BOPD',
    status: 'Operasional',
    wells: 11,
    depth: '3,410 m',
  },
  {
    id: 'ZULU',
    name: 'ZULU',
    // Position: 340,820 on 4959x3509 image
    // x = (340/4959)*100 = 6.86%
    // y = (820/3509)*100 = 23.37%
    position: { x: 6.86, y: 23.37 },
    color: '#6366F1',
    description: 'Area pengeboran ZULU. Lokasi eksplorasi baru dengan potensi cadangan besar di Wilayah Kerja ONWJ.',
    facilities: ['Platform ZULU', 'Wellheads', 'Production Facilities', 'Control Room', 'Pipeline System'],
    production: '3,800 BOPD',
    status: 'Operasional',
    wells: 8,
    depth: '2,950 m',
  },
  {
    id: 'PAPA',
    name: 'PAPA',
    // Position: 1250,1823 on 4959x3509 image
    // x = (1250/4959)*100 = 25.21%
    // y = (1823/3509)*100 = 51.95%
    position: { x: 25.21, y: 51.95 },
    color: '#14B8A6',
    description: 'Area pengeboran PAPA. Fasilitas terintegrasi dengan sistem distribusi modern di Wilayah Kerja ONWJ.',
    facilities: ['Platform PAPA', 'Wellheads', 'Production Facilities', 'Control Room', 'Pipeline System'],
    production: '4,600 BOPD',
    status: 'Operasional',
    wells: 10,
    depth: '3,180 m',
  },
]);

const Wilayah = () => {
  const [active, setActive] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const pengeboranData = useMemo(samplePengeboran, []);

  const openModal = (item) => setActive(item);
  const closeModal = () => setActive(null);

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4 lg:px-16">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-xl mb-3">🗺️ Peta Wilayah Kerja - Area Pengeboran</h3>
          <p className="text-sm text-gray-600 mb-4">
            Klik pada titik pengeboran untuk melihat detail fasilitas dan produksi.
          </p>

          {/* Map Container */}
          <div style={{ 
            width: '100%', 
            position: 'relative',
            backgroundColor: '#f1f5f9',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
          }}>
            {/* Background Image - 4959x3509 */}
            <img 
              src={Peta} 
              alt="Peta Wilayah Kerja ONWJ 2025"
              style={{ 
                width: '100%', 
                height: 'auto',
                display: 'block',
                userSelect: 'none'
              }}
              draggable={false}
            />

            {/* Clickable Areas Overlay */}
            {pengeboranData.map((area) => (
              <div
                key={area.id}
                onClick={() => openModal(area)}
                onMouseEnter={() => setHoveredId(area.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  position: 'absolute',
                  left: `${area.position.x}%`,
                  top: `${area.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: hoveredId === area.id ? 20 : 10,
                  transition: 'all 0.2s ease'
                }}
                aria-label={`Area pengeboran ${area.name}`}
              >
                {/* Map Pin Marker */}
                <div style={{
                  fontSize: hoveredId === area.id ? '48px' : '36px',
                  lineHeight: '1',
                  filter: hoveredId === area.id 
                    ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))' 
                    : 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                  transition: 'all 0.2s ease',
                  animation: hoveredId === area.id ? 'pulse 1.5s infinite' : 'none',
                  color: area.color
                }}>
                  📍
                </div>

                {/* Badge with well count */}
                <div style={{
                  position: 'absolute',
                  top: hoveredId === area.id ? '-8px' : '-6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: area.color,
                  color: 'white',
                  borderRadius: '50%',
                  width: hoveredId === area.id ? '24px' : '20px',
                  height: hoveredId === area.id ? '24px' : '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: hoveredId === area.id ? '11px' : '10px',
                  fontWeight: 'bold',
                  border: '2px solid white',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  transition: 'all 0.2s ease'
                }}>
                  {area.wells}
                </div>

                {/* Tooltip Label */}
                {hoveredId === area.id && (
                  <div style={{
                    position: 'absolute',
                    top: '-60px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    pointerEvents: 'none'
                  }}>
                    {area.name}
                    <div style={{
                      position: 'absolute',
                      bottom: '-4px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '5px solid transparent',
                      borderRight: '5px solid transparent',
                      borderTop: '5px solid rgba(17, 24, 39, 0.95)'
                    }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-sm mb-3 text-gray-700">📊 Legenda</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {pengeboranData.map((area) => (
                <div key={area.id} className="flex items-center gap-2">
                  <div style={{
                    fontSize: '20px',
                    color: area.color,
                    lineHeight: '1',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))'
                  }}>
                    📍
                  </div>
                  <span className="text-xs font-medium text-gray-700">{area.name}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              💡 <strong>Angka pada marker</strong> menunjukkan jumlah sumur di area tersebut. Hover untuk melihat nama area.
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {active && (
        <div
          className="modal-backdrop"
          onClick={(e) => { if (e.target.classList.contains('modal-backdrop')) closeModal(); }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(17,24,39,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 60,
            backdropFilter: 'blur(4px)'
          }}
        >
          <div className="modal-content" style={{ 
            width: 'min(920px,95%)', 
            maxHeight: '90vh', 
            overflowY: 'auto',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)'
          }}>
            <div className="modal-header" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '20px 24px',
              borderBottom: '2px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ 
                  fontSize: '28px',
                  color: active.color,
                  lineHeight: '1',
                  filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))'
                }}>
                  📍
                </div>
                <h3 className="modal-title" style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>
                  🛢️ Area Pengeboran: {active.name}
                </h3>
              </div>
              <button 
                className="modal-close-btn" 
                onClick={closeModal}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  fontSize: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#ef4444';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.color = '#6b7280';
                }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Left Column */}
                <div>
                  <h4 className="modal-section-title" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                    📋 Deskripsi
                  </h4>
                  <p className="modal-text" style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '20px' }}>
                    {active.description}
                  </p>

                  <h4 className="modal-section-title" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                    📐 Data Teknis
                  </h4>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '12px',
                    backgroundColor: '#f9fafb',
                    padding: '16px',
                    borderRadius: '8px'
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>ID Area:</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{active.id}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Status:</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: active.status === 'Operasional' ? '#059669' : '#f59e0b' }}>
                        {active.status}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Jumlah Sumur:</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{active.wells} sumur</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Kedalaman Rata-rata:</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{active.depth}</div>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Produksi:</div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#2563eb' }}>{active.production}</div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <h4 className="modal-section-title" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                    🏭 Fasilitas & Infrastruktur
                  </h4>
                  {active.facilities && active.facilities.length ? (
                    <ul style={{ 
                      listStyle: 'none', 
                      padding: 0,
                      margin: 0,
                      marginBottom: '20px'
                    }}>
                      {active.facilities.map((f, i) => (
                        <li key={i} style={{
                          padding: '10px 12px',
                          backgroundColor: '#f9fafb',
                          marginBottom: '8px',
                          borderRadius: '6px',
                          fontSize: '14px',
                          color: '#374151',
                          borderLeft: `3px solid ${active.color}`
                        }}>
                          ✓ {f}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="modal-text">Tidak ada data fasilitas.</p>
                  )}

                  <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexDirection: 'column' }}>
                    <button
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 4px rgba(37,99,235,0.3)'
                      }}
                      onClick={() => alert(`Membuka detail produksi untuk ${active.name}`)}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
                    >
                      📊 Lihat Detail Produksi
                    </button>
                    <button
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb',
                        backgroundColor: 'white',
                        color: '#374151',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onClick={() => alert(`Membuka rencana kerja untuk ${active.name}`)}
                      onMouseEnter={(e) => e.target.style.borderColor = '#2563eb'}
                      onMouseLeave={(e) => e.target.style.borderColor = '#e5e7eb'}
                    >
                      📋 Rencana Kerja 2025
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animation for pulse effect */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default Wilayah;