import React, { useState } from 'react';
import { motion } from 'framer-motion';
import officeImage from '../../assets/contoh3.png'; // Sesuaikan dengan path gambar

const AccordionItem = ({ title, content, isOpen, onClick }) => (
  <div className="border-b border-gray-200">
    <button
      className="w-full py-6 flex justify-between items-center text-left"
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <svg
        className={`w-6 h-6 transform transition-transform duration-300 ${
          isOpen ? 'rotate-180' : ''
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{
        height: isOpen ? 'auto' : 0,
        opacity: isOpen ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="pb-6 text-gray-600">{content}</div>
    </motion.div>
  </div>
);

const TataKelola = () => {
  const [openSection, setOpenSection] = useState(0);

  const governanceData = [
    {
      title: "PEDOMAN KERJA DEWAN KOMISARIS DAN DIREKSI",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      title: "KODE ETIK",
      content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      title: "KEBIJAKAN K3LL",
      content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={officeImage}
            alt="Office"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
        </div>
        <div className="relative container mx-auto px-8 lg:px-16 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-6">Kebijakan Tata Kelola Perusahaan</h1>
            <p className="text-xl text-gray-200">
              Komitmen kami dalam menjalankan praktik tata kelola perusahaan yang baik
              untuk mencapai pertumbuhan berkelanjutan.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-8 lg:px-16 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Main Text */}
          <div className="space-y-8">
            <div className="prose max-w-none">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                TUJUAN DAN KOMITMEN PENERAPAN TATA KELOLA PERUSAHAAN
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Pedoman Tata Kelola Perusahaan (code of Corporate Governance) disahkan pada tanggal 30 Juni 2020
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Memahami pentingnya Tata Kelola Perusahaan yang baik (Good Corporate Governance/GCG), 
                PT Migas Hulu Jabar ONWJ berkomitmen untuk terus meningkatkan kualitas penerapan GCG 
                secara konsisten dan berkesinambungan yang sejalan dengan nilai-nilai yang dianut Perseroan.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Penerapan prinsip-prinsip GCG yang bermutu akan mendukung peningkatan kinerja Perseroan 
                melalui terciptanya proses pengambilan keputusan yang lebih baik, peningkatan efisiensi 
                operasional, serta peningkatan pelayanan kepada pemangku kepentingan Perseroan.
              </p>
            </div>

            {/* Governance Principles */}
            <div className="grid grid-cols-2 gap-6 mt-12">
              {["Transparansi", "Akuntabilitas", "Responsibilitas", "Independensi"].map((principle) => (
                <div key={principle} className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{principle}</h3>
                  <p className="text-gray-600 text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Accordion */}
          <div className="bg-gray-50 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Dokumen Terkait</h3>
            <div className="space-y-2">
              {governanceData.map((item, index) => (
                <AccordionItem
                  key={index}
                  title={item.title}
                  content={item.content}
                  isOpen={openSection === index}
                  onClick={() => setOpenSection(openSection === index ? -1 : index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TataKelola;