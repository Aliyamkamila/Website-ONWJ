import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaEye, FaFilePdf, FaSpinner, FaTimes } from 'react-icons/fa'; 
import PageHero from '../../components/PageHero';
import PDFViewer from '../../components/PDFViewer'; // ✅ IMPORT PDF VIEWER
import bannerImage from '../../assets/hero-bg.jpg';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const ReportHero = () => (
  <PageHero
    title="Laporan Tahunan"
    description="Transparansi kinerja dan pencapaian kami dari tahun ke tahun."
    backgroundImage={bannerImage}
    heightClass="h-[45vh] min-h-[320px] max-h-[420px]"
    breadcrumbs={[
      { label: 'Beranda', to: '/' },
      { label: 'Laporan Tahunan' },
    ]}
  />
);

const ReportCard = ({ report, onView }) => {
  return (
    <div className="group bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-secondary-200">
      <div className="aspect-[3/4] overflow-hidden bg-secondary-50 relative">
        <img
          src={report.full_cover_url || report.cover_image}
          alt={`Laporan Tahunan ${report.year}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src = bannerImage; // Fallback image
          }}
        />
        
        {/* ✅ HOVER OVERLAY - HANYA BUTTON "LIHAT" */}
        <div className="absolute inset-0 bg-secondary-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={() => onView(report)}
            className="px-6 py-3 bg-white text-secondary-900 rounded-lg font-semibold hover:bg-secondary-100 transition-colors flex items-center gap-2 shadow-lg"
          >
            <FaEye className="w-5 h-5" />
            Lihat Laporan
          </button>
        </div>

        {/* Year Badge */}
        <div className="absolute top-3 right-3 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-md">
          <p className="text-sm font-bold text-primary-600">{report.year}</p>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <FaFilePdf className="w-4 h-4 text-red-500" />
          <p className="text-xs text-secondary-500">PDF • {report.file_size || 'N/A'}</p>
        </div>
        <h3 className="font-bold text-secondary-900 group-hover:text-primary-600 transition-colors leading-snug mb-4 min-h-[3rem]">
          {report.title}
        </h3>
        
        {/* ✅ MOBILE: HANYA BUTTON "LIHAT" */}
        <button
          onClick={() => onView(report)}
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 lg:hidden"
        >
          <FaEye className="w-4 h-4" />
          Lihat Laporan
        </button>
      </div>
    </div>
  );
};

const LaporanTahunanPage = () => {
  const [annualReportsData, setAnnualReportsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPDF, setSelectedPDF] = useState(null); // ✅ State untuk PDF Viewer

  // ✅ FETCH DATA DARI API
  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/v1/laporan/published`);
        
        if (response.data.success) {
          setAnnualReportsData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching laporan:', error);
        toast.error('Gagal memuat laporan tahunan');
      } finally {
        setLoading(false);
      }
    };

    fetchLaporan();
  }, []);

  // ✅ HANDLE VIEW PDF (Buka di Modal, BUKAN Tab Baru!)
  const handleViewPDF = async (report) => {
    try {
      // Track view count
      await axios.post(`${API_URL}/v1/laporan/${report.id}/view`);
      
      // Open PDF in modal
      setSelectedPDF(report.full_file_url);
      
      toast.success('Laporan berhasil dibuka');
    } catch (error) {
      console.error('Error viewing laporan:', error);
      toast.error('Gagal membuka laporan');
    }
  };

  return (
    <div className="bg-secondary-50 min-h-screen">
      <ReportHero />
      
      <div className="container mx-auto px-8 lg:px-16 py-16">
        <div className="text-center mb-12">
          <h2 className="text-display-md font-heading font-bold text-secondary-900 mb-3">
            Koleksi Laporan Tahunan
          </h2>
          <p className="text-body-md text-secondary-600 max-w-2xl mx-auto mb-6">
            Akses laporan tahunan kami untuk mengetahui kinerja, pencapaian, dan komitmen perusahaan
          </p>
          
          {/* ✅ WARNING BOX */}
          <div className="max-w-3xl mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Penting:</strong> Laporan hanya dapat dilihat di website. Download dan print tidak diizinkan untuk menjaga keamanan dokumen.
            </p>
          </div>
        </div>

        {/* ✅ LOADING STATE */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="w-12 h-12 text-primary-600 animate-spin" />
          </div>
        ) : (
          <>
            {/* ✅ GRID LAPORAN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {annualReportsData.map((report) => (
                <ReportCard 
                  key={report.id} 
                  report={report} 
                  onView={handleViewPDF}
                />
              ))}
            </div>

            {/* ✅ EMPTY STATE */}
            {annualReportsData.length === 0 && (
              <div className="text-center py-20">
                <FaFilePdf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Belum ada laporan tahunan yang tersedia
                </p>
              </div>
            )}
          </>
        )}

        {/* ✅ INFO BOX */}
        <div className="mt-12 p-6 bg-white border border-secondary-200 rounded-xl text-center">
          <p className="text-body-sm text-secondary-600">
            <span className="font-semibold text-secondary-900">Catatan:</span> Laporan tahunan hanya dapat dibuka di platform ini. Fitur download dan print telah dinonaktifkan untuk menjaga keamanan dokumen.
          </p>
        </div>
      </div>

      {/* ✅ PDF VIEWER MODAL */}
      {selectedPDF && (
        <PDFViewer
          fileUrl={selectedPDF}
          onClose={() => setSelectedPDF(null)}
        />
      )}
    </div>
  );
};

export default LaporanTahunanPage;