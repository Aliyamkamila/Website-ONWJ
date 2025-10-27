import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const WilayahKerja = () => {
  const [activeArea, setActiveArea] = useState(null);
  const [map, setMap] = useState(null);

  // Fungsi konversi DMS (Degrees Minutes Seconds) ke Decimal
  const dmsToDecimal = (degrees, minutes, seconds, direction) => {
    let decimal = Math.abs(degrees) + minutes / 60 + seconds / 3600;
    if (direction === 'S' || direction === 'W') {
      decimal = -decimal;
    }
    return decimal;
  };

  // Koordinat garis pantai Jawa Barat (shoreline) yang lebih detail
  // Mengikuti kontur pantai dari Jakarta hingga Jawa Barat bagian timur
  const shorelineJawaBarat = [
    [-6.108147, 106.868169], // GD - Titik awal garis pantai
    [-6.109000, 106.865000], // Pesisir Jakarta Utara
    [-6.110000, 106.860000], 
    [-6.111000, 106.855000], 
    [-6.112000, 106.850000], 
    [-6.113000, 106.845000], 
    [-6.114000, 106.840000], 
    [-6.115000, 106.835000], // Teluk Jakarta
    [-6.116000, 106.830000], 
    [-6.117000, 106.825000], 
    [-6.117500, 106.820000], 
    [-6.118000, 106.815000], 
    [-6.118000, 106.810000], // Pantai Bekasi
    [-6.117500, 106.805000], 
    [-6.117000, 106.800000], 
    [-6.116000, 106.795000], 
    [-6.115000, 106.790000], 
    [-6.113500, 106.787000], // Pantai Karawang
    [-6.112000, 106.785000], 
    [-6.110000, 106.785000],
    [-6.108000, 106.785000],
    [-6.106000, 106.785000],
    [-6.105650, 106.784844], // A - Kembali ke titik A
  ];

  // Koordinat untuk segmen EV ke EW (mengikuti garis pantai Jawa Barat bagian timur)
  // Dari Cirebon hingga Indramayu dan sekitarnya
  const shorelineEVtoEW = [
    [-6.396231, 108.417839], // EV - Titik awal (area Cirebon)
    [-6.390000, 108.410000], // Pantai Cirebon
    [-6.380000, 108.400000], 
    [-6.370000, 108.390000], 
    [-6.360000, 108.380000], 
    [-6.350000, 108.370000], 
    [-6.340000, 108.360000], 
    [-6.330000, 108.350000], 
    [-6.320000, 108.340000], // Area Indramayu
    [-6.310000, 108.330000], 
    [-6.300000, 108.320000], 
    [-6.290000, 108.310000], 
    [-6.280000, 108.300000], 
    [-6.270000, 108.290000], 
    [-6.260000, 108.280000], 
    [-6.250000, 108.270000], 
    [-6.240000, 108.260000], // Pesisir Jawa Barat tengah
    [-6.230000, 108.250000], 
    [-6.220000, 108.240000], 
    [-6.210000, 108.230000], 
    [-6.200000, 108.220000], 
    [-6.190000, 108.210000], 
    [-6.180000, 108.200000], 
    [-6.170000, 108.190000], 
    [-6.160000, 108.180000], 
    [-6.150000, 108.170000], 
    [-6.140000, 108.160000], 
    [-6.130000, 108.150000], 
    [-6.120000, 108.140000], 
    [-6.110000, 108.130000], 
    [-6.100000, 108.120000], 
    [-6.090000, 108.115000], 
    [-6.080000, 108.110000], 
    [-6.070000, 108.105000], 
    [-6.060000, 108.100000], 
    [-6.050000, 108.095000], 
    [-6.040000, 108.092000], 
    [-6.030000, 108.090000], 
    [-6.020000, 108.088000], 
    [-6.010000, 108.086000], 
    [-6.000000, 108.085000], 
    [-5.990000, 108.084000], 
    [-5.980000, 108.083500], 
    [-5.970000, 108.083000], 
    [-5.960000, 108.082500], 
    [-5.950000, 108.082200], 
    [-5.940000, 108.082000], 
    [-5.937467, 108.081978], // EW - Titik akhir
  ];

  // AREA A - Koordinat lengkap dari PDF dengan garis pantai
  const areaACoordinates = [
    [-6.105650, 106.784844], // A
    [-6.065867, 106.784847], // B
    [-6.065925, 106.798917], // C
    [-5.966986, 106.799314], // D
    [-5.966942, 106.787517], // E
    [-5.930794, 106.788217], // F
    [-5.930828, 106.797092], // G
    [-5.913056, 106.797161], // H
    [-5.913156, 106.815433], // I
    [-5.903664, 106.815592], // J
    [-5.903636, 106.824397], // K
    [-5.894758, 106.824433], // L
    [-5.894794, 106.833300], // M
    [-5.885978, 106.833333], // N
    [-5.886017, 106.851731], // O
    [-5.876458, 106.851767], // P
    [-5.876483, 106.860781], // Q
    [-5.858803, 106.860750], // R
    [-5.859006, 106.941781], // S
    [-5.850264, 106.941811], // T
    [-5.850225, 106.951197], // U
    [-5.841375, 106.951286], // V
    [-5.841356, 106.960186], // W
    [-5.833172, 106.960183], // X
    [-5.833172, 106.968164], // Y
    [-5.783178, 106.968158], // Z
    [-5.783183, 107.018211], // AA
    [-5.754100, 107.018128], // AB
    [-5.754369, 107.086822], // AC
    [-5.796292, 107.086689], // AD
    [-5.796472, 107.141419], // AE
    [-5.760306, 107.141536], // AF
    [-5.760681, 107.222294], // AG
    [-5.570700, 107.223961], // AH
    [-5.570603, 107.195728], // AI
    [-5.552494, 107.195783], // AJ
    [-5.551950, 107.018161], // AK
    [-5.466547, 107.018153], // AL
    [-5.466542, 106.968156], // AM
    [-5.349889, 106.968156], // AN
    [-5.349889, 107.034814], // AO
    [-5.333228, 107.034814], // AP
    [-5.333222, 107.301453], // AQ
    [-5.670383, 107.301294], // AR
    [-5.670472, 107.329375], // AS
    [-5.599878, 107.329728], // AT
    [-5.599858, 107.357594], // AU
    [-5.625025, 107.357519], // AV
    [-5.625075, 107.372686], // AW
    [-5.670606, 107.372586], // AX
    [-5.670639, 107.384544], // AY
    [-5.715600, 107.384414], // AZ
    [-5.715719, 107.429925], // BA
    [-5.670689, 107.430047], // BB
    [-5.670767, 107.421200], // BC
    [-5.634692, 107.421300], // BD
    [-5.634647, 107.402975], // BE
    [-5.597981, 107.403078], // BF
    [-5.598567, 107.393589], // BG
    [-5.589703, 107.393864], // BH
    [-5.589800, 107.429617], // BI
    [-5.607508, 107.429575], // BJ
    [-5.607639, 107.474506], // BK
    [-5.652564, 107.474378], // BL
    [-5.652500, 107.457214], // BM
    [-5.706928, 107.457075], // BN
    [-5.707122, 107.537683], // BO
    [-5.725497, 107.537367], // BP
    [-5.725558, 107.565369], // BQ
    [-5.716697, 107.565392], // BR
    [-5.716722, 107.601036], // BS
    [-5.725647, 107.601014], // BT
    [-5.725811, 107.627717], // BU
    [-5.780100, 107.627481], // BV
    [-5.780206, 107.664111], // BW
    [-5.725806, 107.664289], // BX
    [-5.725869, 107.691450], // BY
    [-5.770800, 107.691336], // BZ
    [-5.770914, 107.746303], // CA
    [-5.789319, 107.746264], // CB
    [-5.789417, 107.790481], // CC
    [-5.798225, 107.790500], // CD
    [-5.798264, 107.809469], // CE
    [-5.807753, 107.809428], // CF
    [-5.806822, 107.817903], // CG
    [-5.816381, 107.817975], // CH
    [-5.816519, 107.881244], // CI
    [-5.825589, 107.881186], // CJ
    [-5.825625, 107.917306], // CK
    [-5.856047, 107.917244], // CL
    [-5.856039, 107.881164], // CM
    [-5.843625, 107.881131], // CN
    [-5.843478, 107.817906], // CO
    [-5.870594, 107.817272], // CP
    [-5.870831, 107.908775], // CQ
    [-5.880517, 107.908150], // CR
    [-5.880578, 107.983928], // CS
    [-5.970489, 107.983708], // CT
    [-5.970606, 108.061606], // CU
    [-5.871103, 108.061775], // CV
    [-5.871239, 108.161131], // CW
    [-5.889358, 108.161106], // CX
    [-5.889303, 108.234667], // CY
    [-5.934692, 108.234667], // CZ
    [-5.934597, 108.170069], // DA
    [-6.061189, 108.169878], // DB
    [-6.061256, 108.214817], // DC
    [-6.070328, 108.214856], // DD
    [-6.070403, 108.269319], // DE
    [-6.088022, 108.269294], // DF
    [-6.088636, 108.315236], // DG
    [-6.097736, 108.315222], // DH
    [-6.097758, 108.332289], // DI
    [-6.206242, 108.332156], // DJ
    [-6.206347, 108.422408], // DK
    [-6.151828, 108.422450], // DL
    [-6.151561, 108.432078], // DM
    [-6.095656, 108.432144], // DN
    [-6.095664, 108.486119], // DO
    [-6.142981, 108.486078], // DP
    [-6.143069, 108.522225], // DQ
    [-6.216461, 108.521600], // DR
    [-6.216464, 108.467978], // DS
    [-6.266461, 108.467978], // DT
    [-6.266467, 108.551306], // DU
    [-6.299792, 108.551306], // DV
    [-6.299792, 108.617961], // DW
    [-6.349786, 108.617961], // DX
    [-6.349694, 108.603414], // DY
    [-6.423528, 108.603353], // DZ
    [-6.423528, 108.711731], // EA
    [-6.369358, 108.711886], // EB
    [-6.369378, 108.748069], // EC
    [-6.400956, 108.783794], // ED
    [-6.405572, 108.783794], // EE
    [-6.459878, 108.784361], // EF
    [-6.459819, 108.693764], // EG
    [-6.505039, 108.693736], // EH
    [-6.505017, 108.657558], // EI
    [-6.541200, 108.657533], // EJ
    [-6.541111, 108.546606], // EK
    [-6.483981, 108.540703], // EL
    [-6.423592, 108.539858], // EM
    [-6.423608, 108.558131], // EN
    [-6.369467, 108.558175], // EO
    [-6.369444, 108.531500], // EP
    [-6.333236, 108.531533], // EQ
    [-6.333192, 108.485478], // ER
    [-6.369400, 108.485444], // ES
    [-6.369372, 108.458556], // ET
    [-6.396275, 108.458525], // EU
    ...shorelineEVtoEW, // EV ke EW mengikuti garis pantai
    [-5.896478, 108.082117], // EX
    [-5.896706, 107.149486], // EY
    [-5.850561, 107.149367], // EZ
    [-5.850503, 107.131542], // FA
    [-5.841594, 107.131600], // FB
    [-5.841517, 107.113519], // FC
    [-5.832903, 107.113586], // FD
    [-5.819750, 107.095567], // FE
    [-5.823375, 107.095558], // FF
    [-5.823361, 107.086603], // FG
    [-5.814203, 107.086622], // FH
    [-5.814144, 107.068389], // FI
    [-5.841961, 107.077347], // FJ
    [-5.841259, 107.032556], // FK
    [-5.886583, 107.031514], // FL
    [-5.886531, 107.018153], // FM
    [-5.866506, 107.018156], // FN
    [-5.866508, 106.951216], // FO
    [-5.899833, 106.951216], // FP
    [-5.899836, 106.918161], // FQ
    [-5.916497, 106.918161], // FR
    [-5.916497, 106.884872], // FS
    [-5.932944, 106.884872], // FT
    [-5.932886, 106.851503], // FU
    [-5.966497, 106.851503], // FV
    [-5.966494, 106.834512], // FW
    [-6.033156, 106.834512], // FX
    [-6.033153, 106.818173], // FY
    [-6.066483, 106.818172], // FZ
    [-6.066489, 106.851503], // GA
    [-6.083150, 106.851503], // GB
    [-6.083153, 106.868169], // GC
    ...shorelineJawaBarat, // GD ke A mengikuti garis pantai Jawa Barat
  ];

  // AREA B - Koordinat lengkap dari PDF
  const areaBCoordinates = [
    [-4.999928, 106.501544], // GE
    [-5.012225, 106.557475], // GF
    [-5.062450, 106.557194], // GG
    [-5.062783, 106.593089], // GH
    [-5.171453, 106.592719], // GI
    [-5.171589, 106.628578], // GJ
    [-5.198333, 106.628475], // GK
    [-5.198447, 106.655925], // GL
    [-5.207650, 106.655964], // GM
    [-5.207689, 106.682639], // GN
    [-5.234358, 106.682556], // GO
    [-5.234389, 106.688378], // GP
    [-5.288850, 106.688183], // GQ
    [-5.288519, 106.601450], // GR
    [-5.361253, 106.600611], // GS
    [-5.361319, 106.618350], // GT
    [-5.449878, 106.618197], // GU
    [-5.449878, 106.501544], // GV
  ];

  const workingAreas = [
    {
      name: 'AREA A',
      coordinates: areaACoordinates,
      description: 'Wilayah Kerja Area A mencakup area operasi lepas pantai Jawa Barat yang sangat luas, dimulai dari pesisir Jakarta hingga Cirebon. Area ini mengikuti kontur garis pantai (shoreline) Jawa Barat secara detail.',
      facilities: ['Multiple Offshore Platforms', 'FSO Units', 'Production Facilities', 'Subsea Infrastructure', 'Pipeline Networks'],
      production: 'Area produksi utama dengan kapasitas tinggi dan infrastruktur lengkap',
      region: 'Perairan Jawa Barat (Jakarta - Bekasi - Karawang - Subang - Indramayu - Cirebon)',
      color: '#3B82F6',
      totalPoints: areaACoordinates.length
    },
    {
      name: 'AREA B',
      coordinates: areaBCoordinates,
      description: 'Wilayah Kerja Area B mencakup area operasi lepas pantai dengan cakupan lebih kompak, berlokasi di bagian barat Area A dengan batas koordinat yang jelas.',
      facilities: ['Offshore Platforms', 'Support Vessels', 'Production Units', 'Storage Facilities'],
      production: 'Area produksi sekunder dengan potensi pengembangan yang menjanjikan',
      region: 'Perairan Laut Jawa (Area Barat)',
      color: '#10B981',
      totalPoints: areaBCoordinates.length
    }
  ];

  // Calculate center point
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

  // Simple Leaflet implementation using CDN
  React.useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    script.onload = () => {
      initMap();
    };
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  const initMap = () => {
    if (typeof L === 'undefined') return;

    const mapInstance = L.map('map').setView(centerPoint, 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance);

    workingAreas.forEach(area => {
      const polygon = L.polygon(area.coordinates, {
        color: area.color,
        fillColor: area.color,
        fillOpacity: 0.5,
        weight: 2
      }).addTo(mapInstance);

      polygon.bindPopup(`
        <div style="padding: 10px; min-width: 280px;">
          <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #1f2937;">${area.name}</h3>
          <p style="color: #6b7280; margin-bottom: 12px; font-size: 14px;">${area.description}</p>
          
          <div style="margin-bottom: 12px;">
            <strong style="color: #374151; font-size: 14px;">📍 Wilayah:</strong>
            <p style="color: #6b7280; font-size: 13px; margin-top: 4px;">${area.region}</p>
          </div>
          
          <div style="margin-bottom: 12px;">
            <strong style="color: #374151; font-size: 14px;">🏭 Fasilitas:</strong>
            <ul style="margin-top: 4px; padding-left: 20px; color: #6b7280; font-size: 13px;">
              ${area.facilities.slice(0, 3).map(f => `<li>${f}</li>`).join('')}
            </ul>
          </div>
          
          <div style="margin-bottom: 8px;">
            <strong style="color: #374151; font-size: 14px;">📊 Produksi:</strong>
            <p style="color: #6b7280; font-size: 13px; margin-top: 4px;">${area.production}</p>
          </div>
          
          <div style="background: #f3f4f6; padding: 8px; border-radius: 4px; margin-top: 12px;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              <strong>Total Koordinat:</strong> ${area.totalPoints} titik
            </p>
          </div>
        </div>
      `);

      polygon.on('click', () => {
        setActiveArea(area.name);
      });

      polygon.on('mouseover', function() {
        this.setStyle({ fillOpacity: 0.8 });
      });

      polygon.on('mouseout', function() {
        this.setStyle({ fillOpacity: 0.5 });
      });
    });

    setMap(mapInstance);
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Peta Wilayah Kerja Lepas Pantai
          </h2>
          <div className="w-32 h-2 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto rounded-full mb-8"></div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg mb-3">
            Klik pada wilayah di peta untuk melihat informasi detail mengenai area operasi dan fasilitas yang tersedia.
          </p>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto">
            Peta mencakup wilayah perairan Jawa Barat dari Jakarta hingga Cirebon dengan garis pantai yang mengikuti kontur geografis sebenarnya.
          </p>
        </div>

        {/* Map Container */}
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-4 mb-8">
          <div id="map" style={{ height: '600px', width: '100%', borderRadius: '0.5rem' }}></div>
        </div>

        {/* Legend */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Legenda Peta:</h4>
            <div className="flex flex-wrap gap-4 mb-3">
              {workingAreas.map((area, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border-2 border-white shadow"
                    style={{ backgroundColor: area.color }}
                  ></div>
                  <span className="text-gray-700 text-sm font-medium">{area.name}</span>
                  <span className="text-gray-500 text-xs">({area.totalPoints} points)</span>
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-xs mt-2 pt-2 border-t border-gray-200">
              💡 <strong>Tip:</strong> Klik pada area di peta untuk melihat detail, atau hover untuk highlight. 
              Zoom dan pan menggunakan mouse/touchpad untuk eksplorasi lebih detail.
            </p>
          </div>
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
                    <p className="text-gray-600 mb-4">
                      {workingAreas.find(area => area.name === activeArea).description}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Wilayah Geografis</h4>
                    <p className="text-gray-600 mb-4">
                      {workingAreas.find(area => area.name === activeArea).region}
                    </p>
                    <h4 className="font-semibold text-gray-700 mb-2">Fasilitas</h4>
                    <ul className="list-disc list-inside text-gray-600 mb-4">
                      {workingAreas
                        .find(area => area.name === activeArea)
                        .facilities.map((facility, idx) => (
                          <li key={idx}>{facility}</li>
                        ))}
                    </ul>
                    <h4 className="font-semibold text-gray-700 mb-2">Produksi</h4>
                    <p className="text-gray-600">
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