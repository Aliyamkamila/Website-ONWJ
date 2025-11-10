// src/pages/KontakPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import bannerImage from '../assets/hero-bg.png'; // Ganti dengan gambar banner yang sesuai

// --- SUB-KOMPONEN ---

// 1. Hero Banner (Konsisten dengan halaman lain)
const KontakHero = () => (
    <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
            <img src={bannerImage} alt="Banner Kontak" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        </div>
        <div className="relative container mx-auto px-8 lg:px-16 h-full flex items-center">
            <div className="max-w-3xl text-white">
                <div className="flex items-center gap-2 mb-4 text-sm">
                    <Link to="/" className="text-gray-300 hover:text-white flex items-center gap-1">
                        <FaHome /> Home
                    </Link>
                    <span>/</span>
                    <span className="font-semibold text-white">Kontak</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Kontak Kami</h1>
                <p className="text-lg text-gray-200 leading-relaxed">
                    Kami senang terhubung dengan Anda. Hubungi kami untuk pertanyaan, kemitraan, atau informasi lebih lanjut.
                </p>
            </div>
        </div>
    </div>
);

// 2. Info Kontak & Peta
const KontakInfo = () => (
    <section className="bg-white py-20">
        <div className="container mx-auto px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Kolom Kiri: Info Detail */}
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Hubungi Kami</h2>
                    <p className="text-gray-600 leading-relaxed mb-6">
                        Silakan hubungi kami melalui detail di bawah ini atau isi formulir di samping. Tim kami akan segera merespons Anda.
                    </p>
                </div>
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                            <FaMapMarkerAlt className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Alamat Kantor</h3>
                            <p className="text-gray-600">Jl. Jakarta No. 40, Kebonwaru, Batununggal, Kota Bandung, Jawa Barat 40272</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                            <FaEnvelope className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                            <p className="text-gray-600">corsec@muj-onwj.com</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                            <FaPhone className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Telepon</h3>
                            <p className="text-gray-600">(022) 1234 5678</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Kolom Kanan: Peta */}
            <div className="rounded-xl overflow-hidden shadow-lg h-96 lg:h-full">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.669866164213!2d107.63222307579174!3d-6.930107967817454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e80e1a12004d%3A0x609e533d7b003a27!2sPT%20Migas%20Hulu%20Jabar%20ONWJ!5e0!3m2!1sen!2sid!4v1730391216091!5m2!1sen!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div>
    </section>
);

// 3. Form Kontak
const KontakForm = () => (
    <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-8 lg:px-16 max-w-4xl">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">Kirim Pesan</h2>
                <p className="text-gray-600 mt-4">Ada pertanyaan atau masukan? Isi form di bawah ini.</p>
            </div>
            <form className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
                        <input type="text" id="name" name="name" required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Alamat Email *</label>
                        <input type="email" id="email" name="email" required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subjek</label>
                    <input type="text" id="subject" name="subject" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Pesan Anda *</label>
                    <textarea id="message" name="message" rows="5" required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
                <div className="text-center">
                    <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-lg transform hover:-translate-y-1">
                        Kirim Pesan
                    </button>
                </div>
            </form>
        </div>
    </section>
);

// --- MAIN PAGE COMPONENT ---
const KontakPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <KontakHero />
      <KontakInfo />
      <KontakForm />
    </div>
  );
};

export default KontakPage;