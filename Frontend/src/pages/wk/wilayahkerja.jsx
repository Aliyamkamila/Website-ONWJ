import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ BARU
import axios from 'axios';
import './wilayahkerja.css';
import Peta from './Peta.png';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const Wilayah = () => {
  const navigate = useNavigate(); // ✅ BARU
  const [active, setActive] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch data from API
  useEffect(() => {
    const fetchAreas = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/v1/wilayah-kerja`);
        if (response.data.success) {
          // Transform data to match component structure
          const transformedData = response.data.data.map(area => ({
            id: area.area_id,
            name: area.name,
            category: area.category,
            position: { x: parseFloat(area.position_x), y: parseFloat(area.position_y) },
            color: area.color,
            description: area.description,
            facilities: area.facilities || [],
            programs: area.programs || [],
            production: area.production || '',
            status: area.status,
            wells: area.wells || 0,
            depth: area.depth || '',
            pressure: area.pressure || '',
            temperature: area.temperature || '',
            beneficiaries: area.beneficiaries || '',
            budget: area.budget || '',
            duration: area.duration || '',
            impact: area.impact || '',
            related_news_id: area.related_news_id || null, // ✅ BARU
            related_news_slug: area.related_news_slug || null, // ✅ BARU
            related_news_title: area.related_news_title || null, // ✅ BARU
          }));
          setAllData(transformedData);
        }
      } catch (error) {
        console.error('Error fetching wilayah kerja:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);
  
  const pengeboranData = useMemo(() => allData.filter(d => d.category === 'TEKKOM'), [allData]);
  const tjslData = useMemo(() => allData.filter(d => d.category === 'TJSL'), [allData]);
  
  const filteredData = useMemo(() => {
    if (activeTab === 'tekkom') return pengeboranData;
    if (activeTab === 'tjsl') return tjslData;
    return allData;
  }, [activeTab, pengeboranData, tjslData, allData]);

  const openModal = (item) => setActive(item);
  const closeModal = () => setActive(null);

  // ✅ BARU: Handler untuk navigasi ke berita
  const handleViewNews = (newsSlug) => {
    if (newsSlug) {
      navigate(`/artikel/${newsSlug}`);
      closeModal();
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat data wilayah kerja...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4 lg:px-16">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-xl mb-3">🗺️ Peta Wilayah Kerja ONWJ 2025</h3>
          <p className="text-sm text-gray-600 mb-4">
            Klik pada marker untuk melihat detail area. Filter berdasarkan kategori menggunakan tombol di bawah.
          </p>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setActiveTab('all')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: activeTab === 'all' ? '2px solid #2563eb' : '2px solid #e5e7eb',
                backgroundColor: activeTab === 'all' ? '#eff6ff' : 'white',
                color: activeTab === 'all' ? '#2563eb' : '#6b7280',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🗺️ Semua Area ({allData.length})
            </button>
            <button
              onClick={() => setActiveTab('tekkom')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: activeTab === 'tekkom' ? '2px solid #2563eb' : '2px solid #e5e7eb',
                backgroundColor: activeTab === 'tekkom' ? '#eff6ff' : 'white',
                color: activeTab === 'tekkom' ? '#2563eb' : '#6b7280',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🛢️ Area Pengeboran ({pengeboranData.length})
            </button>
            <button
              onClick={() => setActiveTab('tjsl')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: activeTab === 'tjsl' ? '2px solid #2563eb' : '2px solid #e5e7eb',
                backgroundColor: activeTab === 'tjsl' ? '#eff6ff' : 'white',
                color: activeTab === 'tjsl' ? '#2563eb' : '#6b7280',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              🤝 Program TJSL ({tjslData.length})
            </button>
          </div>

          {/* Map Container */}
          <div style={{ 
            width: '100%', 
            position: 'relative',
            backgroundColor: '#f1f5f9',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
          }}>
            {/* Background Image */}
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
            {filteredData.map((area) => (
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
                aria-label={`Area ${area.name}`}
              >
                {/* Map Pin Icon */}
                <svg
                  width={hoveredId === area.id ? '42' : '32'}
                  height={hoveredId === area.id ? '42' : '32'}
                  viewBox="0 0 24 24"
                  fill={area.color}
                  style={{
                    filter: hoveredId === area.id 
                      ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))' 
                      : 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                    transition: 'all 0.2s ease',
                    animation: hoveredId === area.id ? 'pulse 1.5s infinite' : 'none'
                  }}
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>

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
            
            {/* TEKKOM Legend */}
            {(activeTab === 'all' || activeTab === 'tekkom') && pengeboranData.length > 0 && (
              <div className="mb-4">
                <h5 className="text-xs font-semibold text-gray-600 mb-2">🛢️ Area Pengeboran (TEKKOM)</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {pengeboranData.map((area) => (
                    <div key={area.id} className="flex items-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={area.color} style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}>
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      <span className="text-xs font-medium text-gray-700">{area.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TJSL Legend */}
            {(activeTab === 'all' || activeTab === 'tjsl') && tjslData.length > 0 && (
              <div>
                <h5 className="text-xs font-semibold text-gray-600 mb-2">🤝 Program TJSL</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {tjslData.map((area) => (
                    <div key={area.id} className="flex items-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={area.color} style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}>
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      <span className="text-xs font-medium text-gray-700">{area.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-3">
              💡 <strong>Tip:</strong> Hover pada marker untuk melihat nama area. Klik marker untuk melihat detail lengkap.
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
                <svg width="32" height="32" viewBox="0 0 24 24" fill={active.color} style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))' }}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <h3 className="modal-title" style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>
                  {active.category === 'TEKKOM' ? '🛢️ Area Pengeboran' : '🤝 Program TJSL'}: {active.name}
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
              {active.category === 'TEKKOM' ? (
                // TEKKOM Modal Content
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
                      {active.wells && (
                        <div>
                          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Jumlah Sumur:</div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{active.wells} sumur</div>
                        </div>
                      )}
                      {active.depth && (
                        <div>
                          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Kedalaman:</div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{active.depth}</div>
                        </div>
                      )}
                      {active.pressure && (
                        <div>
                          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Tekanan:</div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#dc2626' }}>{active.pressure}</div>
                        </div>
                      )}
                      {active.temperature && (
                        <div>
                          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Temperatur:</div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#ea580c' }}>{active.temperature}</div>
                        </div>
                      )}
                      {active.production && (
                        <div style={{ gridColumn: '1 / -1' }}>
                          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Produksi:</div>
                          <div style={{ fontSize: '16px', fontWeight: '700', color: '#2563eb' }}>{active.production}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <h4 className="modal-section-title" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                      🏭 Fasilitas & Infrastruktur
                    </h4>
                    {active.facilities && active.facilities.length > 0 ? (
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
              ) : (
                // ✅ TJSL Modal Content - UPDATED
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  {/* Left Column */}
                  <div>
                    <h4 className="modal-section-title" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                      📋 Deskripsi Program
                    </h4>
                    <p className="modal-text" style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '20px' }}>
                      {active.description}
                    </p>

                    <h4 className="modal-section-title" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                      📊 Informasi Program
                    </h4>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr', 
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
                        <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Status Program:</div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: active.status === 'Aktif' ? '#059669' : '#f59e0b' }}>
                          {active.status}
                        </div>
                      </div>
                      {active.duration && (
                        <div>
                          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Durasi Program:</div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{active.duration}</div>
                        </div>
                      )}
                      {active.beneficiaries && (
                        <div>
                          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Penerima Manfaat:</div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#7c3aed' }}>{active.beneficiaries}</div>
                        </div>
                      )}
                      {active.budget && (
                        <div>
                          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Anggaran Program:</div>
                          <div style={{ fontSize: '16px', fontWeight: '700', color: '#2563eb' }}>{active.budget}</div>
                        </div>
                      )}
                      {active.impact && (
                        <div>
                          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Dampak Utama:</div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#059669' }}>{active.impact}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <h4 className="modal-section-title" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                      🎯 Program & Kegiatan
                    </h4>
                    {active.programs && active.programs.length > 0 ? (
                      <ul style={{ 
                        listStyle: 'none', 
                        padding: 0,
                        margin: 0,
                        marginBottom: '20px'
                      }}>
                        {active.programs.map((p, i) => (
                          <li key={i} style={{
                            padding: '10px 12px',
                            backgroundColor: '#f9fafb',
                            marginBottom: '8px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            color: '#374151',
                            borderLeft: `3px solid ${active.color}`
                          }}>
                            ✓ {p}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="modal-text">Tidak ada data program.</p>
                    )}

                    {/* ✅ UPDATED: Buttons dengan Berita Terkait */}
                    <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexDirection: 'column' }}>
                      {/* Button Berita Terkait - Show jika ada related_news_slug */}
                      {active.related_news_slug ? (
                        <button
                          style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#059669',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 2px 4px rgba(5,150,105,0.3)'
                          }}
                          onClick={() => handleViewNews(active.related_news_slug)}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#047857'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#059669'}
                        >
                          📰 Lihat Berita Terkait
                        </button>
                      ) : (
                        <div style={{
                          padding: '12px 16px',
                          borderRadius: '8px',
                          backgroundColor: '#f3f4f6',
                          color: '#9ca3af',
                          fontSize: '14px',
                          fontWeight: '600',
                          textAlign: 'center',
                          border: '2px dashed #e5e7eb'
                        }}>
                          📰 Belum ada berita terkait
                        </div>
                      )}
                      
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
                        onClick={() => alert(`Membuka dokumentasi program ${active.name}`)}
                        onMouseEnter={(e) => e.target.style.borderColor = '#059669'}
                        onMouseLeave={(e) => e.target.style.borderColor = '#e5e7eb'}
                      >
                        📸 Galeri Dokumentasi
                      </button>
                    </div>
                  </div>
                </div>
              )}
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