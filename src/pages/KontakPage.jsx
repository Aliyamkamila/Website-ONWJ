// src/pages/KontakPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

// --- Import Aset (Ganti dengan gambar banner yang sesuai) ---
import bannerImage from '../assets/contoh3.png'; // Ganti jika perlu

// --- SUB-KOMPONEN ---

// 1. Hero Banner
const KontakHero = () => (
    <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
            <img src={bannerImage} alt="Banner Kontak" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
        </div>
        <div className="relative container mx-auto px-8 lg:px-16 h-full flex items-center">
            <div className="max-w-2xl text-white">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 mb-4 text-sm">
                    <Link to="/" className="text-gray-300 hover:text-white flex items-center gap-1">
                        <FaHome /> Home
                    </Link>
                    <span>/</span>
                    <span className="font-semibold text-white">Karir & Kontak</span> {/* Sesuaikan judul jika perlu */}
                </div>
                {/* Judul Utama */}
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Peluang Karir & Pertanyaan</h1>
                 <p className="text-lg text-gray-200">
                    Terhubung dengan kami untuk informasi lebih lanjut atau peluang karir.
                </p>
            </div>
        </div>
    </div>
);

// --- MAIN PAGE COMPONENT ---
const KontakPage = () => {
    // State untuk form (jika ingin menambahkan fungsi submit nanti)
    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
    });
    // Handler untuk perubahan input form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };
    // Handler untuk submit form (sementara hanya console log)
    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Tambahkan validasi reCAPTCHA di sini
        console.log('Form submitted:', formData);
        alert('Pesan Anda telah diterima (simulasi).');
        // Reset form
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
    };

    return (
        <div className="bg-white min-h-screen">
            <KontakHero />

            {/* Konten Utama */}
            <div className="container mx-auto px-8 lg:px-16 py-16 md:py-24">

                {/* --- Bagian Lowongan Kerja --- */}
                <section className="mb-16 md:mb-20 text-center">
                     <h2 className="text-3xl font-bold text-gray-800 mb-4">Peluang Karir</h2>
                     <p className="text-gray-600 max-w-2xl mx-auto">
                        Saat ini tidak ada lowongan kerja yang tersedia. Terima kasih telah berkunjung di website kami.
                     </p>
                     {/* Jika ada lowongan, bisa diganti dengan daftar atau link */}
                </section>

                <hr className="border-gray-200 my-16 md:my-20" />

                {/* --- Bagian Hubungi Kami & Form --- */}
                <section>
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Hubungi Kami atau Isi Form</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">

                        {/* --- Kolom Kiri: Informasi Kontak --- */}
                        <div className="space-y-8">
                            {/* Lokasi Kami */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-blue-600" /> Lokasi Kami
                                </h3>
                                <div className="space-y-4 text-gray-600">
                                    <div>
                                        <p className="font-medium text-gray-700">KANTOR PUSAT:</p>
                                        <p>Jl. Jakarta Nomor 40, RT.05/RW.04, Kebonwaru, Kec. Batununggal, Kota Bandung, Jawa Barat 40272</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700">KANTOR PERWAKILAN:</p>
                                        <p>Bakrie Tower Lantai 7<br />Jl. Epicentrum Utama Raya No.2<br />Rasuna Epicentrum<br />Kel. Karet Kuningan, Kec. Setiabudi<br />Kota Jakarta Selatan,<br />DKI Jakarta 12940</p>
                                    </div>
                                </div>
                            </div>

                            {/* Email Kami */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <FaEnvelope className="text-blue-600" /> Email Kami
                                </h3>
                                <div className="space-y-1 text-gray-600">
                                    <a href="mailto:humas@migashulujabarronwj.co.id" className="hover:text-blue-700 transition-colors block">humas@migashulujabarronwj.co.id</a>
                                    <a href="mailto:sekretariat@mujabarronwj.co.id" className="hover:text-blue-700 transition-colors block">sekretariat@mujabarronwj.co.id</a>
                                </div>
                            </div>

                             {/* Kontak Kami */}
                             <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <FaPhoneAlt className="text-blue-600" /> Kontak Kami
                                </h3>
                                <div className="space-y-1 text-gray-600">
                                    <p>Kantor Pusat: (022) 2053 8178</p>
                                    <p>Kantor Perwakilan: (021) 2995 1632</p>
                                </div>
                            </div>
                        </div>

                        {/* --- Kolom Kanan: Formulir --- */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                    <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                    <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            {/* Message */}
                             <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Comment or Message *</label>
                                <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                            </div>

                            {/* reCAPTCHA Placeholder */}
                            <div className="p-4 border border-gray-200 rounded-md bg-gray-50 text-center text-gray-500">
                                {/* Ganti ini dengan implementasi reCAPTCHA sesungguhnya */}
                                [ Placeholder untuk reCAPTCHA "I am human" ]
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default KontakPage;