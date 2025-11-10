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
    // Position calculated from image-map coords: 2520,2157 on 4959x3509 image
    // x = (2520/4959)*100 = 50.82%
    // y = (2157/3509)*100 = 61.47%
    position: { x: 50.82, y: 61.47 },
    color: '#EF4444',
    description: 'Area pengeboran BRAVO. Lokasi strategis untuk eksplorasi dan produksi hidrokarbon di Wilayah Kerja ONWJ.',
    facilities: ['Platform BRAVO', 'Wellheads', 'Production Facilities', 'Control Room', 'Pipeline System'],
    production: '5,200 BOPD',
    status: 'Operasional',
    wells: 12,
    depth: '3,450 m',
  }
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
                {/* Marker Circle */}
                <div style={{
                  width: hoveredId === area.id ? '48px' : '36px',
                  height: hoveredId === area.id ? '48px' : '36px',
                  borderRadius: '50%',
                  backgroundColor: area.color,
                  border: '3px solid white',
                  boxShadow: hoveredId === area.id 
                    ? '0 8px 16px rgba(0,0,0,0.3), 0 0 0 4px rgba(59,130,246,0.3)' 
                    : '0 4px 8px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  animation: hoveredId === area.id ? 'pulse 1.5s infinite' : 'none'
                }}>
                  <span style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: hoveredId === area.id ? '16px' : '14px',
                    textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                  }}>
                    {area.wells || '?'}
                  </span>
                </div>

                {/* Tooltip Label */}
                {hoveredId === area.id && (
                  <div style={{
                    position: 'absolute',
                    top: '-45px',
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
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: area.color,
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }} />
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
                  width: '20px', 
                  height: '20px', 
                  borderRadius: '50%', 
                  backgroundColor: active.color,
                  border: '3px solid white',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }} />
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
            box-shadow: 0 8px 16px rgba(0,0,0,0.3), 0 0 0 0 rgba(59,130,246,0.7);
          }
          50% {
            box-shadow: 0 8px 16px rgba(0,0,0,0.3), 0 0 0 8px rgba(59,130,246,0);
          }
        }
      `}</style>
    </div>
  );
};

export default Wilayah;