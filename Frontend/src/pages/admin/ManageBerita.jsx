import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaImage, FaTimes } from 'react-icons/fa';

// Data Dummy - nanti diganti dengan API
const dummyBerita = [
    { 
        id: 1, 
        title: 'Komitmen Kami dalam Penilaian Dampak Sosial', 
        category: 'Sosial',
        date: '2025-01-15', 
        author: 'Admin TJSL',
        status: 'Published',
        showInTJSL: true,
        showInMediaInformasi: true,
        showInDashboard: true,
        pinToHomepage: false
    },
    { 
        id: 2, 
        title: 'Inisiatif Penanaman Pohon untuk Masa Depan', 
        category: 'Lingkungan',
        date: '2025-01-12', 
        author: 'Admin Tekom',
        status: 'Draft',
        showInTJSL: true,
        showInMediaInformasi: false,
        showInDashboard: false,
        pinToHomepage: true
    },
];

const ManageBerita = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        category: '',
        author: '',
        image: null,
        imagePreview: null,
        shortDescription: '',
        content: '',
        status: 'draft',
        displayOption: '',
        autoLink: 'none',
        showInTJSL: false,
        showInMediaInformasi: true,
        showInDashboard: false,
        pinToHomepage: false
    });

    const categories = [
        'Sosial',
        'Lingkungan', 
        'Energi',
        'Teknologi',
        'CSR',
        'Kegiatan Internal'
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validasi ukuran file (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Ukuran file terlalu besar! Maksimal 5MB');
                return;
            }
            
            setFormData(prev => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file)
            }));
        }
    };

    const removeImage = () => {
        if (formData.imagePreview) {
            URL.revokeObjectURL(formData.imagePreview);
        }
        setFormData(prev => ({
            ...prev,
            image: null,
            imagePreview: null
        }));
    };

    const resetForm = () => {
        if (formData.imagePreview) {
            URL.revokeObjectURL(formData.imagePreview);
        }
        setFormData({
            title: '',
            date: '',
            category: '',
            author: '',
            image: null,
            imagePreview: null,
            shortDescription: '',
            content: '',
            status: 'draft',
            displayOption: '',
            autoLink: 'none',
            showInTJSL: false,
            showInMediaInformasi: true,
            showInDashboard: false,
            pinToHomepage: false
        });
        setEditingId(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validasi form
        if (!formData.title || !formData.date || !formData.category || !formData.content) {
            alert('Mohon lengkapi semua field yang wajib diisi!');
            return;
        }

        if (!formData.image && !editingId) {
            alert('Mohon upload foto berita!');
            return;
        }

        const dataToSubmit = {
            ...formData,
            id: editingId || Date.now(),
            status: formData.status
        };

        console.log('Submitting:', dataToSubmit);
        
        if (editingId) {
            alert('Berita berhasil diupdate!');
        } else {
            alert('Berita berhasil ditambahkan!');
        }
        
        setShowForm(false);
        resetForm();
    };

    const handlePreview = () => {
        if (!formData.title || !formData.content) {
            alert('Mohon isi minimal judul dan konten untuk preview!');
            return;
        }
        
        console.log('Preview data:', formData);
        alert('Preview akan ditampilkan di modal/halaman baru (fitur ini bisa dikembangkan)');
    };

    const handleEdit = (id) => {
        const berita = dummyBerita.find(b => b.id === id);
        if (berita) {
            setFormData({
                title: berita.title,
                date: berita.date,
                category: berita.category,
                author: berita.author,
                image: null,
                imagePreview: null,
                shortDescription: berita.description || '',
                content: berita.content || '',
                status: berita.status.toLowerCase(),
                displayOption: '',
                autoLink: 'none',
                showInTJSL: berita.showInTJSL,
                showInMediaInformasi: berita.showInMediaInformasi,
                showInDashboard: berita.showInDashboard,
                pinToHomepage: berita.pinToHomepage
            });
            setEditingId(id);
            setShowForm(true);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
            console.log('Delete berita:', id);
            alert('Berita berhasil dihapus!');
        }
    };

    const handleCancel = () => {
        if (window.confirm('Apakah Anda yakin ingin membatalkan? Data yang belum disimpan akan hilang.')) {
            setShowForm(false);
            resetForm();
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Kelola Berita</h1>
                    <p className="text-gray-600 mt-1">Manajemen berita dan artikel perusahaan</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        <FaPlus />
                        Tambah Berita Baru
                    </button>
                )}
            </div>

            {/* Form Input Berita */}
            {showForm && (
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {editingId ? 'Edit Berita' : 'Input Berita Baru'}
                        </h2>
                        <button
                            onClick={handleCancel}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Judul Berita */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Judul Berita <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Masukkan judul berita yang menarik..."
                                    required
                                />
                            </div>

                            {/* Tanggal */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tanggal <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>

                            {/* Kategori */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Kategori <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                >
                                    <option value="">Pilih Kategori</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Penulis/Sumber */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Penulis/Sumber
                                </label>
                                <input
                                    type="text"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Nama penulis atau sumber berita"
                                />
                            </div>
                        </div>

                        {/* Upload Foto */}
                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Upload Foto <span className="text-red-500">*</span>
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                                {!formData.imagePreview ? (
                                    <div>
                                        <input
                                            type="file"
                                            id="image-upload"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="cursor-pointer flex flex-col items-center"
                                        >
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                <FaImage className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <span className="text-blue-600 font-semibold hover:text-blue-700 mb-2">
                                                Klik untuk upload foto
                                            </span>
                                            <span className="text-gray-500 text-sm">
                                                PNG, JPG, atau WEBP (Max 5MB)
                                            </span>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="relative inline-block">
                                        <img
                                            src={formData.imagePreview}
                                            alt="Preview"
                                            className="max-h-64 rounded-lg shadow-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg transition-colors"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Deskripsi Singkat */}
                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Deskripsi Singkat <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Ringkasan berita (maksimal 200 karakter)"
                                maxLength="200"
                                required
                            />
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-sm text-gray-500">
                                    Ringkasan ini akan muncul di daftar berita
                                </p>
                                <p className="text-sm text-gray-500">
                                    {formData.shortDescription.length}/200 karakter
                                </p>
                            </div>
                        </div>

                        {/* Konten Berita */}
                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Konten Berita <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                rows="12"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm"
                                placeholder="Tulis konten berita lengkap di sini..."
                                required
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Tips: Gunakan paragraf pendek dan bahasa yang mudah dipahami
                            </p>
                        </div>

                        {/* Status */}
                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="draft">Draft (Belum Dipublikasi)</option>
                                <option value="published">Published (Tampilkan di Website)</option>
                            </select>
                        </div>

                        {/* Opsi Tampilan */}
                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Opsi Tampilan
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="display-medsos"
                                    name="displayOption"
                                    value="medsos"
                                    checked={formData.displayOption === 'medsos'}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="display-medsos" className="ml-3 text-gray-700">
                                    Tampilkan juga di bagian Instagram/Media Sosial
                                </label>
                            </div>
                        </div>

                        {/* Auto-Link Antar Data */}
                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Auto-Link Antar Data (Konten)
                            </label>
                            <select
                                name="autoLink"
                                value={formData.autoLink}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                                <option value="none">Tidak ada link</option>
                                <option value="program">Hubungkan dengan Program TJSL</option>
                                <option value="umkm">Hubungkan dengan UMKM Binaan</option>
                                <option value="penghargaan">Hubungkan dengan Penghargaan</option>
                            </select>
                            <p className="text-sm text-gray-500 mt-1">
                                Hubungkan konten ini dengan data yang sudah ada untuk kemudahan navigasi
                            </p>
                        </div>

                        {/* Multi-Output Checklist */}
                        <div className="mt-6 bg-blue-50 p-6 rounded-lg border border-blue-100">
                            <label className="block text-sm font-semibold text-gray-800 mb-4">
                                📍 Multi-Output Checklist
                            </label>
                            <p className="text-sm text-gray-600 mb-4">
                                Pilih di mana berita ini akan ditampilkan
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        id="show-tjsl"
                                        name="showInTJSL"
                                        checked={formData.showInTJSL}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                                    />
                                    <label htmlFor="show-tjsl" className="ml-3">
                                        <span className="text-gray-800 font-medium">Tampilkan di Berita TJSL</span>
                                        <p className="text-sm text-gray-600">Berita akan muncul di halaman /berita-tjsl</p>
                                    </label>
                                </div>
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        id="show-media"
                                        name="showInMediaInformasi"
                                        checked={formData.showInMediaInformasi}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                                    />
                                    <label htmlFor="show-media" className="ml-3">
                                        <span className="text-gray-800 font-medium">Tampilkan di Media & Informasi</span>
                                        <p className="text-sm text-gray-600">Berita akan muncul di halaman /media-informasi</p>
                                    </label>
                                </div>
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        id="show-dashboard"
                                        name="showInDashboard"
                                        checked={formData.showInDashboard}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                                    />
                                    <label htmlFor="show-dashboard" className="ml-3">
                                        <span className="text-gray-800 font-medium">Masukkan ke Statistik Dashboard</span>
                                        <p className="text-sm text-gray-600">Data berita akan dihitung dalam statistik TJSL</p>
                                    </label>
                                </div>
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        id="pin-homepage"
                                        name="pinToHomepage"
                                        checked={formData.pinToHomepage}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                                    />
                                    <label htmlFor="pin-homepage" className="ml-3">
                                        <span className="text-gray-800 font-medium">Pin di Homepage</span>
                                        <p className="text-sm text-gray-600">Berita akan muncul di section "Berita Terbaru" landing page</p>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handlePreview}
                                className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors"
                            >
                                Preview Before Save
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                            >
                                {editingId ? 'Update Berita' : 'Save Content'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tabel List Berita */}
            {!showForm && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Judul
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kategori
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ditampilkan Di
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dummyBerita.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 line-clamp-2">{item.title}</div>
                                            <div className="text-sm text-gray-500">{item.author}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {new Date(item.date).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                item.status === 'Published' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {item.showInTJSL && (
                                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-medium">
                                                        TJSL
                                                    </span>
                                                )}
                                                {item.showInMediaInformasi && (
                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                                                        Media
                                                    </span>
                                                )}
                                                {item.showInDashboard && (
                                                    <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded font-medium">
                                                        Dashboard
                                                    </span>
                                                )}
                                                {item.pinToHomepage && (
                                                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-medium">
                                                        📌 Homepage
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleEdit(item.id)}
                                                    className="text-blue-600 hover:text-blue-900 transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-600 hover:text-red-900 transition-colors"
                                                    title="Hapus"
                                                >
                                                    <FaTrash className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Empty State */}
                    {dummyBerita.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">Belum ada berita yang ditambahkan.</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                Tambah Berita Pertama
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageBerita;