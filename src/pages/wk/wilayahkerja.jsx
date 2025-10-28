import React, { useState, useEffect } from 'react';
import './wilayahkerja.css';

const WilayahKerja = () => {
  const [activeArea, setActiveArea] = useState(null);
  const [map, setMap] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // AREA A - Data dari shapefile
  const areaACoordinates = [
    [-6.105650, 106.784844],
    [-6.065867, 106.784847],
    [-6.065925, 106.798917],
    [-5.966986, 106.799314],
    [-5.966942, 106.787517],
    [-5.930794, 106.788217],
    [-5.930828, 106.797092],
    [-5.913056, 106.797161],
    [-5.913156, 106.815433],
    [-5.903664, 106.815592],
    [-5.903636, 106.824397],
    [-5.894758, 106.824433],
    [-5.894794, 106.833300],
    [-5.885978, 106.833333],
    [-5.886017, 106.851731],
    [-5.876458, 106.851767],
    [-5.876483, 106.860781],
    [-5.858803, 106.860750],
    [-5.859006, 106.941781],
    [-5.850264, 106.941811],
    [-5.850225, 106.951197],
    [-5.841375, 106.951286],
    [-5.841356, 106.960186],
    [-5.833172, 106.960183],
    [-5.833172, 106.968164],
    [-5.783178, 106.968158],
    [-5.783183, 107.018211],
    [-5.754100, 107.018128],
    [-5.754369, 107.086822],
    [-5.796292, 107.086689],
    [-5.796472, 107.141419],
    [-5.760306, 107.141536],
    [-5.760681, 107.222294],
    [-5.570700, 107.223961],
    [-5.570603, 107.195728],
    [-5.552494, 107.195783],
    [-5.551950, 107.018161],
    [-5.466547, 107.018153],
    [-5.466542, 106.968156],
    [-5.349889, 106.968156],
    [-5.349889, 107.034814],
    [-5.333228, 107.034814],
    [-5.333222, 107.301453],
    [-5.670383, 107.301294],
    [-5.670472, 107.329375],
    [-5.599878, 107.329728],
    [-5.599858, 107.357594],
    [-5.625025, 107.357519],
    [-5.625075, 107.372686],
    [-5.670606, 107.372586],
    [-5.670639, 107.384544],
    [-5.715600, 107.384414],
    [-5.715719, 107.429925],
    [-5.670689, 107.430047],
    [-5.670767, 107.421200],
    [-5.634692, 107.421300],
    [-5.634647, 107.402975],
    [-5.597981, 107.403078],
    [-5.598567, 107.393589],
    [-5.589703, 107.393864],
    [-5.589800, 107.429617],
    [-5.607508, 107.429575],
    [-5.607639, 107.474506],
    [-5.652564, 107.474378],
    [-5.652500, 107.457214],
    [-5.706928, 107.457075],
    [-5.707122, 107.537683],
    [-5.725497, 107.537367],
    [-5.725558, 107.565369],
    [-5.716697, 107.565392],
    [-5.716722, 107.601036],
    [-5.725647, 107.601014],
    [-5.725811, 107.627717],
    [-5.780100, 107.627481],
    [-5.780206, 107.664111],
    [-5.725806, 107.664289],
    [-5.725869, 107.691450],
    [-5.770800, 107.691336],
    [-5.770914, 107.746303],
    [-5.789319, 107.746264],
    [-5.789417, 107.790481],
    [-5.798225, 107.790500],
    [-5.798264, 107.809469],
    [-5.807753, 107.809428],
    [-5.806822, 107.817903],
    [-5.816381, 107.817975],
    [-5.816519, 107.881244],
    [-5.825589, 107.881186],
    [-5.825625, 107.917306],
    [-5.856047, 107.917244],
    [-5.856039, 107.881164],
    [-5.843625, 107.881131],
    [-5.843478, 107.817906],
    [-5.870594, 107.817272],
    [-5.870831, 107.908775],
    [-5.880517, 107.908150],
    [-5.880578, 107.983928],
    [-5.970489, 107.983708],
    [-5.970606, 108.061606],
    [-5.871103, 108.061775],
    [-5.871239, 108.161131],
    [-5.889358, 108.161106],
    [-5.889303, 108.234667],
    [-5.934692, 108.234667],
    [-5.934597, 108.170069],
    [-6.061189, 108.169878],
    [-6.061256, 108.214817],
    [-6.070328, 108.214856],
    [-6.070403, 108.269319],
    [-6.088022, 108.269294],
    [-6.088636, 108.315236],
    [-6.097736, 108.315222],
    [-6.097758, 108.332289],
    [-6.206242, 108.332156],
    [-6.206347, 108.422408],
    [-6.151828, 108.422450],
    [-6.151561, 108.432078],
    [-6.095656, 108.432144],
    [-6.095664, 108.486119],
    [-6.142981, 108.486078],
    [-6.143069, 108.522225],
    [-6.216461, 108.521600],
    [-6.216464, 108.467978],
    [-6.266461, 108.467978],
    [-6.266467, 108.551306],
    [-6.299792, 108.551306],
    [-6.299792, 108.617961],
    [-6.349786, 108.617961],
    [-6.349694, 108.603414],
    [-6.423528, 108.603353],
    [-6.423528, 108.711731],
    [-6.369358, 108.711886],
    [-6.369378, 108.748069],
    [-6.400956, 108.783794],
    [-6.405572, 108.783794],
    [-6.459878, 108.784361],
    [-6.459819, 108.693764],
    [-6.505039, 108.693736],
    [-6.505017, 108.657558],
    [-6.541200, 108.657533],
    [-6.541111, 108.546606],
    [-6.483981, 108.540703],
    [-6.423592, 108.539858],
    [-6.423608, 108.558131],
    [-6.369467, 108.558175],
    [-6.369444, 108.531500],
    [-6.333236, 108.531533],
    [-6.333192, 108.485478],
    [-6.369400, 108.485444],
    [-6.369372, 108.458556],
    [-6.396275, 108.458525],
    [-6.396231, 108.417839],
    [-5.937467, 108.081978],
    [-5.896706, 107.149486],
    [-5.850561, 107.149367],
    [-5.850503, 107.131542],
    [-5.841594, 107.131600],
    [-5.841517, 107.113519],
    [-5.832903, 107.113586],
    [-5.819750, 107.095567],
    [-5.823375, 107.095558],
    [-5.823361, 107.086603],
    [-5.814203, 107.086622],
    [-5.814144, 107.068389],
    [-5.841961, 107.077347],
    [-5.841259, 107.032556],
    [-5.886583, 107.031514],
    [-5.886531, 107.018153],
    [-5.866506, 107.018156],
    [-5.866508, 106.951216],
    [-5.899833, 106.951216],
    [-5.899836, 106.918161],
    [-5.916497, 106.918161],
    [-5.916497, 106.884872],
    [-5.932944, 106.884872],
    [-5.932886, 106.851503],
    [-5.966497, 106.851503],
    [-5.966494, 106.834512],
    [-6.033156, 106.834512],
    [-6.033153, 106.818173],
    [-6.066483, 106.818172],
    [-6.066489, 106.851503],
    [-6.083150, 106.851503],
    [-6.083153, 106.868169],
    [-6.108147, 106.868169],
    [-6.105650, 106.784844],
  ];

  // AREA B - Data dari shapefile
  const areaBCoordinates = [
    [-4.999928, 106.501544],
    [-5.012225, 106.557475],
    [-5.062450, 106.557194],
    [-5.062783, 106.593089],
    [-5.171453, 106.592719],
    [-5.171589, 106.628578],
    [-5.198333, 106.628475],
    [-5.198447, 106.655925],
    [-5.207650, 106.655964],
    [-5.207689, 106.682639],
    [-5.234358, 106.682556],
    [-5.234389, 106.688378],
    [-5.288850, 106.688183],
    [-5.288519, 106.601450],
    [-5.361253, 106.600611],
    [-5.361319, 106.618350],
    [-5.449878, 106.618197],
    [-5.449878, 106.501544],
    [-4.999928, 106.501544],
  ];

  const workingAreas = [
    {
      name: 'AREA A',
      coordinates: areaACoordinates,
      description: 'Wilayah Kerja Area A berdasarkan shapefile resmi BATAS_AREA_KERJA dengan proyeksi WGS 1984. Area ini mencakup wilayah operasi lepas pantai yang sangat luas dari Jakarta hingga Cirebon.',
      facilities: [
        'Multiple Offshore Platforms',
        'FSO (Floating Storage Offloading)',
        'Production & Processing Facilities',
        'Subsea Pipeline Infrastructure',
        'Well Head Platforms',
        'Accommodation & Support Facilities'
      ],
      production: 'Area produksi utama dengan kapasitas tinggi dan infrastruktur terintegrasi',
      region: 'Laut Jawa - Pesisir Jawa Barat (Jakarta - Bekasi - Karawang - Subang - Indramayu - Cirebon)',
      color: '#FFEB3B',
      borderColor: '#F59E0B',
      totalPoints: areaACoordinates.length,
      layer: '_BATAS',
      linetype: 'DASHED2',
      entity: 'LWPolyline'
    },
    {
      name: 'AREA B',
      coordinates: areaBCoordinates,
      description: 'Wilayah Kerja Area B berdasarkan shapefile resmi dengan koordinat presisi tinggi. Berlokasi di sebelah barat laut Area A dengan potensi pengembangan yang menjanjikan.',
      facilities: [
        'Offshore Production Platforms',
        'Support Vessels & Equipment',
        'Production Units',
        'Storage & Distribution Facilities',
        'Pipeline Networks'
      ],
      production: 'Area pengembangan dengan fokus eksplorasi dan optimalisasi produksi',
      region: 'Laut Jawa - Area Barat Laut',
      color: '#10B981',
      borderColor: '#059669',
      totalPoints: areaBCoordinates.length,
      layer: '_BATAS',
      linetype: 'DASHED2',
      entity: 'LWPolyline'
    }
  ];

  const calculateCenter = () => {
    let totalLat = 0;
    let totalLng = 0;
    let count = 0;

    workingAreas.forEach(area => {
      area.coordinates.forEach(coord => {
        totalLat += coord[0];
        totalLng += coord[1];
        count++;
      });
    });

    return [totalLat / count, totalLng / count];
  };

  const centerPoint = calculateCenter();

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    script.onload = () => {
      initMap();
    };
    document.body.appendChild(script);

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const initMap = () => {
    if (typeof L === 'undefined') return;

    const mapInstance = L.map('map', {
      center: centerPoint,
      zoom: 8,
      zoomControl: true,
      scrollWheelZoom: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
      minZoom: 6
    }).addTo(mapInstance);

    L.control.scale({
      imperial: false,
      metric: true,
      position: 'bottomleft'
    }).addTo(mapInstance);

    workingAreas.forEach((area) => {
      const polygon = L.polygon(area.coordinates, {
        color: area.borderColor,
        fillColor: area.color,
        fillOpacity: 0.65,
        weight: 3,
        dashArray: '10, 5',
        opacity: 1
      }).addTo(mapInstance);

      polygon.on('click', () => {
        setActiveArea(area);
        setShowModal(true);
      });

      polygon.on('mouseover', function() {
        this.setStyle({ 
          fillOpacity: 0.85,
          weight: 4
        });
      });

      polygon.on('mouseout', function() {
        this.setStyle({ 
          fillOpacity: 0.65,
          weight: 3
        });
      });
    });

    setMap(mapInstance);
  };

  const closeModal = () => {
    setShowModal(false);
    setActiveArea(null);
  };

  // Close modal when clicking outside
  const handleModalBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      closeModal();
    }
  };

  return (
    <div className="wilayahkerja-section">
      <div className="wilayahkerja-container">
        {/* Header Section */}
        <div className="wilayahkerja-header">
          <h2 className="wilayahkerja-title">Peta Wilayah Kerja Lepas Pantai</h2>
          <div className="wilayahkerja-title-underline"></div>
        </div>

        {/* Map Container */}
        <div className="map-wrapper">
          <div id="map" className="map-container"></div>
        </div>

        {/* Legend */}
        <div className="legend-wrapper">
          <h4 className="legend-title">📊 Legenda & Informasi Teknis</h4>
          <div className="legend-items">
            {workingAreas.map((area, index) => (
              <div key={index} className="legend-item">
                <div 
                  className="legend-color-box"
                  style={{ 
                    backgroundColor: area.color,
                    border: `2px solid ${area.borderColor}`
                  }}
                ></div>
                <div>
                  <div className="legend-item-name">{area.name}</div>
                  <div className="legend-item-points">
                    {area.totalPoints} points • {area.linetype} • {area.entity}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="legend-tip">
            <strong>📐 Coordinate Reference System:</strong> WGS 84 (EPSG:4326) | 
            <strong> Datum:</strong> WGS_1984 | 
            <strong> Spheroid:</strong> WGS_1984 (6378137.0) | 
            <strong> Unit:</strong> Decimal Degrees | 
            <strong> Source:</strong> BATAS_AREA_KERJA.shp
          </div>
        </div>

        {/* Modal Pop-up */}
        {showModal && activeArea && (
          <div className="modal-backdrop" onClick={handleModalBackdropClick}>
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header">
                <div className="modal-header-left">
                  <div 
                    className="modal-color-indicator"
                    style={{ backgroundColor: activeArea.color, border: `2px solid ${activeArea.borderColor}` }}
                  ></div>
                  <h3 className="modal-title">📍 Detail Wilayah: {activeArea.name}</h3>
                </div>
                <button className="modal-close-btn" onClick={closeModal} aria-label="Close modal">
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="modal-body">
                <div className="modal-grid">
                  {/* Left Column */}
                  <div className="modal-column">
                    <div className="modal-section">
                      <h4 className="modal-section-title">📋 Deskripsi Lengkap</h4>
                      <p className="modal-text">{activeArea.description}</p>
                    </div>

                    <div className="modal-section">
                      <h4 className="modal-section-title">📐 Data Teknis</h4>
                      <div className="modal-data-grid">
                        <div className="modal-data-item">
                          <span className="modal-data-label">Entity Type:</span>
                          <span className="modal-data-value">{activeArea.entity}</span>
                        </div>
                        <div className="modal-data-item">
                          <span className="modal-data-label">Layer:</span>
                          <span className="modal-data-value">{activeArea.layer}</span>
                        </div>
                        <div className="modal-data-item">
                          <span className="modal-data-label">Line Type:</span>
                          <span className="modal-data-value">{activeArea.linetype}</span>
                        </div>
                        <div className="modal-data-item">
                          <span className="modal-data-label">Total Koordinat:</span>
                          <span className="modal-data-value">{activeArea.totalPoints} titik</span>
                        </div>
                      </div>
                    </div>

                    <div className="modal-section">
                      <h4 className="modal-section-title">📍 Wilayah Geografis</h4>
                      <p className="modal-text">{activeArea.region}</p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="modal-column">
                    <div className="modal-section">
                      <h4 className="modal-section-title">🏭 Fasilitas & Infrastruktur</h4>
                      <ul className="modal-list">
                        {activeArea.facilities.map((facility, idx) => (
                          <li key={idx} className="modal-list-item">{facility}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="modal-section">
                      <h4 className="modal-section-title">📊 Informasi Produksi</h4>
                      <p className="modal-text">{activeArea.production}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WilayahKerja;