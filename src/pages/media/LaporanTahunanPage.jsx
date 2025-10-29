import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa'; 
import bannerImage from '../../assets/hero-bg.png';
import reportCover2022 from '../../assets/contoh1.png';
import reportCover2021 from '../../assets/contoh2.png';
import reportCover2020 from '../../assets/contoh3.png'; 
import reportCover2019 from '../../assets/contoh4.png'; 
import reportCover2018 from '../../assets/rectangle.png'; 
import reportCover2017 from '../../assets/contoh1.png'; 

const annualReportsData = [
  { year: 2022, title: 'Energi Untuk Bertumbuh dan Berdaya', image: reportCover2022, pdfLink: '#' },
  { year: 2021, title: 'Progresif & Kolaborasi', image: reportCover2021, pdfLink: '#' },
  { year: 2020, title: 'Tumbuh Bersama dengan Ketangguhan', image: reportCover2020, pdfLink: '#' },
  { year: 2019, title: 'Memperkuat Kolaborasi untuk Kontribusi Optimal', image: reportCover2019, pdfLink: '#' },
  { year: 2018, title: 'Mempercepat Sinergi, Menjadi Pelopor dan Meraih Juara', image: reportCover2018, pdfLink: '#' },
  { year: 2017, title: 'Energi Untuk Kemakmuran Daerah', image: reportCover2017, pdfLink: '#' },
];

const ReportHero = () => (
    <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
            <img src={bannerImage} alt="Banner Laporan Tahunan" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
        </div>
        <div className="relative container mx-auto px-8 lg:px-16 h-full flex items-center">
            <div className="max-w-2xl text-white">
                <div className="flex items-center gap-2 mb-4 text-sm">
                    <Link to="/" className="text-gray-300 hover:text-white flex items-center gap-1">
                        <FaHome /> Home
                    </Link>
                    <span>/</span>
                    <span className="font-semibold text-white">Laporan Tahunan</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Laporan Tahunan</h1>
                 <p className="text-lg text-gray-200">
                    Transparansi kinerja dan pencapaian kami dari tahun ke tahun.
                </p>
            </div>
        </div>
    </div>
);

const ReportCard = ({ report }) => (
    <div className="group bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
        <a href={report.pdfLink} target="_blank" rel="noopener noreferrer" className="block">
            <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                    src={report.image}
                    alt={`Laporan Tahunan ${report.year}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
            </div>
            <div className="p-5 text-center">
                 <p className="text-xs text-gray-400 mb-1">Laporan Tahunan {report.year}</p>
                 <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors leading-snug">
                    {report.title}
                 </h3>
            </div>
        </a>
    </div>
);

const LaporanTahunanPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <ReportHero />
      <div className="container mx-auto px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {annualReportsData.map((report) => (
            <ReportCard key={report.year} report={report} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LaporanTahunanPage;  