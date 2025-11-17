import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaImage, FaTimes, FaQuoteLeft } from 'react-icons/fa';

// Data Dummy - nanti diganti dengan API
const dummyTestimonials = [
    { 
        id: 1,
        name: 'Ibu Siti Aminah',
        location: 'Muara Gembong, Bekasi',
        program: 'Program Mangrove',
        testimonial: 'Berkat program penanaman mangrove, pantai kami tidak lagi terkena abrasi. Anak-anak bisa bermain dengan aman di pesisir.',
        avatar: null,
        status: 'Published',
        createdAt: '2025-01-10'
    },
    { 
        id: 2,
        name: 'Bapak Joko Widodo',
        location: 'Kalibaru, Jakarta Utara',
        program: 'Program Pendidikan',
        testimonial: 'Anak saya mendapat beasiswa dari program ini. Sekarang dia bisa melanjutkan sekolah hingga SMA. Terima kasih MHJ ONWJ!',
        avatar: null,
        status: 'Published',
        createdAt: '2025-01-08'
    },
    { 
        id: 3,
        name: 'Ibu Dewi Sartika',
        location: 'Sungai Buntu, Karawang',
        program: 'Program Kesehatan',
        testimonial: 'Klinik lapangan yang disediakan sangat membantu warga. Kami tidak perlu jauh-jauh ke kota untuk berobat.',
        avatar: null,
        status: 'Draft',
        createdAt: '2025-01-05'
    },
];

const ManageTestimonial = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        program: '',
        testimonial: '',
        avatar: null,
        avatarPreview: null,
        status: 'Published'
    });

    const programOptions = [
        'Program Mangrove',
        'Program Pendidikan',
        'Program Kesehatan',
        'Program UKM',
        'Program Ekowisata',
        'Program Lingkungan',
        'Program Sosial',
        'Lainnya'
    ];

    const statusOptions = ['Published', 'Draft'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('Ukuran file terlalu besar! Maksimal 2MB');
                return;
            }
            
            setFormData(prev => ({
                ...prev,
                avatar: file,
                avatarPreview: URL.createObjectURL(file)
            }));
        }
    };

    const removeAvatar = () => {
        if (formData.avatarPreview) {
            URL.revokeObjectURL(formData.avatarPreview);
        }
        setFormData(prev => ({
            ...prev,
            avatar: null,
            avatarPreview: null
        }));
    };

    const resetForm = () => {
        if (formData.avatarPreview) {
            URL.revokeObjectURL(formData.avatarPreview);
        }
        setFormData({
            name: '',
            location: '',
            program: '',
            testimonial: '',
            avatar: null,
            avatarPreview: null,
            status: 'Published'
        });
        setEditingId(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validasi
        if (!formData.name || !formData.location || !formData.program || !formData.testimonial) {
            alert('Mohon lengkapi semua field yang wajib diisi!');
            return;
        }

        if (formData.testimonial.length < 20) {
            alert('Testimonial terlalu pendek! Minimal 20 karakter.');
            return;
        }

        const dataToSubmit = {
            ...formData,
            id: editingId || Date.now(),
            createdAt: new Date().toISOString().split('T')[0]
        };

        console.log('Submitting:', dataToSubmit);
        
        if (editingId) {
            alert('Testimonial berhasil diupdate!');
        } else {
            alert('Testimonial berhasil ditambahkan!');
        }
        
        setShowForm(false);
        resetForm();
    };

    const handleEdit = (id) => {
        const testimonial = dummyTestimonials.find(t => t.id === id);
        if (testimonial) {
            setFormData({
                name: testimonial.name,
                location: testimonial.location,
                program: testimonial.program,
                testimonial: testimonial.testimonial,
                avatar: null,
                avatarPreview: testimonial.avatar || null,
                status: testimonial.status
            });
            setEditingId(id);
            setShowForm(true);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus testimonial ini?')) {
            console.log('Delete testimonial:', id);
            alert('Testimonial berhasil dihapus!');
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
                    <h1 className="text-3xl font-bold text-gray-900">Kelola Testimonial</h1>
                    <p className="text-gray-600 mt-1">Voices From The Community - Suara dari masyarakat</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        <FaPlus />
                        Tambah Testimonial Baru
                    </button>
                )}
            </div>

            {/* Form Input Testimonial */}
            {showForm && (
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {editingId ? 'Edit Testimonial' : 'Input Testimonial Baru'}
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
                            {/* Nama Pemberi Testimonial */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nama Pemberi Testimonial <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Contoh: Ibu Siti Aminah"
                                    required
                                />
                            </div>

                            {/* Lokasi/Desa */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Lokasi/Desa <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Contoh: Muara Gembong, Bekasi"
                                    required
                                />
                            </div>

                            {/* Program Terkait */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Program Terkait <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="program"
                                    value={formData.program}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                >
                                    <option value="">Pilih Program</option>
                                    {programOptions.map(prog => (
                                        <option key={prog} value={prog}>{prog}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Status <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                >
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                                <p className="text-sm text-gray-500 mt-1">
                                    Published = Ditampilkan di website | Draft = Disimpan saja
                                </p>
                            </div>
                        </div>

                        {/* Upload Avatar/Foto (Optional) */}
                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Upload Foto/Avatar (Opsional)
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                {!formData.avatarPreview ? (
                                    <div>
                                        <input
                                            type="file"
                                            id="avatar-upload"
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="avatar-upload"
                                            className="cursor-pointer flex flex-col items-center"
                                        >
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                <FaImage className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <span className="text-blue-600 font-semibold hover:text-blue-700 mb-1">
                                                Klik untuk upload foto
                                            </span>
                                            <span className="text-gray-500 text-sm">
                                                PNG, JPG (Max 2MB) - Opsional
                                            </span>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="relative inline-block">
                                        <img
                                            src={formData.avatarPreview}
                                            alt="Avatar Preview"
                                            className="w-32 h-32 rounded-full object-cover shadow-md mx-auto"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeAvatar}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg transition-colors"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Isi Testimonial */}
                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Isi Testimonial <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="testimonial"
                                value={formData.testimonial}
                                onChange={handleInputChange}
                                rows="6"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Tulis testimonial dari masyarakat tentang program TJSL..."
                                required
                            />
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-sm text-gray-500">
                                    💡 Tulis dengan bahasa yang jujur dan menyentuh hati
                                </p>
                                <p className="text-sm text-gray-500">
                                    {formData.testimonial.length} karakter
                                </p>
                            </div>
                        </div>

                        {/* Preview Box */}
                        {formData.testimonial && (
                            <div className="mt-6 bg-blue-50 p-6 rounded-lg border border-blue-200">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <FaQuoteLeft className="text-blue-600" />
                                    Preview Testimonial:
                                </h3>
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <p className="text-gray-700 italic mb-3">"{formData.testimonial}"</p>
                                    <p className="text-sm font-semibold text-gray-800">
                                        - {formData.name || 'Nama'}, {formData.location || 'Lokasi'}
                                    </p>
                                    {formData.program && (
                                        <p className="text-xs text-blue-600 mt-1">
                                            📍 {formData.program}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

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
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                            >
                                {editingId ? 'Update Testimonial' : 'Save Testimonial'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tabel List Testimonial */}
            {!showForm && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pemberi Testimonial
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Program
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Testimonial
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dummyTestimonials.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {item.avatar ? (
                                                    <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <span className="text-blue-600 font-semibold text-sm">
                                                            {item.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                    <div className="text-xs text-gray-500">{item.location}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                                {item.program}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 line-clamp-2 max-w-md">
                                                "{item.testimonial}"
                                            </p>
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
                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {new Date(item.createdAt).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
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
                    {dummyTestimonials.length === 0 && (
                        <div className="text-center py-12">
                            <FaQuoteLeft className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg mb-2">Belum ada testimonial yang ditambahkan.</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                Tambah Testimonial Pertama
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageTestimonial;