import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FaChevronLeft, FaChevronRight, FaSearchPlus, FaSearchMinus, FaTimes } from 'react-icons/fa';

// ✅ HAPUS IMPORT CSS (Udah di handle di index.css)
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';

// ✅ Set PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ fileUrl, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error) => {
    console.error('Error loading PDF:', error);
    setLoading(false);
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 2.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.6));
  };

  // ✅ Prevent context menu (right click)
  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col"
      onContextMenu={handleContextMenu}
    >
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 px-4 sm:px-6 py-4 flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-white font-bold text-base sm:text-lg">Laporan Tahunan</h3>
        
        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          {/* Zoom Controls */}
          <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-2 sm:px-3 py-2">
            <button
              onClick={zoomOut}
              className="text-white hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={scale <= 0.6}
              aria-label="Zoom out"
            >
              <FaSearchMinus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <span className="text-white text-xs sm:text-sm font-medium min-w-[2.5rem] sm:min-w-[3rem] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              className="text-white hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={scale >= 2.0}
              aria-label="Zoom in"
            >
              <FaSearchPlus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Page Controls */}
          {numPages && (
            <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-2 sm:px-3 py-2">
              <button
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
                className="text-white hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <span className="text-white text-xs sm:text-sm font-medium min-w-[3rem] sm:min-w-[4rem] text-center">
                {pageNumber} / {numPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
                className="text-white hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-white hover:text-red-400 transition-colors"
            aria-label="Close"
          >
            <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto bg-gray-800 flex items-center justify-center p-4 sm:p-6 pdf-viewer-container">
        <div className="bg-white shadow-2xl">
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex flex-col items-center justify-center py-20 px-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600 text-sm">Memuat PDF...</p>
              </div>
            }
            error={
              <div className="text-center py-20 px-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-red-600 mb-2">Gagal memuat PDF</p>
                <p className="text-sm text-gray-600">File tidak ditemukan atau format tidak valid</p>
                <button
                  onClick={onClose}
                  className="mt-4 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Tutup
                </button>
              </div>
            }
            onContextMenu={handleContextMenu}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false} // ✅ DISABLE TEXT SELECTION
              renderAnnotationLayer={false} // ✅ DISABLE ANNOTATIONS
              onContextMenu={handleContextMenu}
            />
          </Document>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-gray-900 border-t border-gray-700 px-4 sm:px-6 py-3 text-center">
        <p className="text-gray-400 text-xs sm:text-sm">
          ⚠️ Dokumen ini hanya dapat dilihat di website. Download dan print tidak diizinkan.
        </p>
      </div>
    </div>
  );
};

export default PDFViewer;