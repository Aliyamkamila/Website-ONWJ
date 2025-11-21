import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaImage, FaTimes, FaQuoteLeft, FaSearch, FaFilter, FaUser, FaMapMarkerAlt, FaCheck } from 'react-icons/fa';

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
    
    // ✅ Search & Filter States (NEW)
    const [searchTerm, setSearchTerm] = useState('');
    const [filterProgram, setFilterProgram] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filteredTestimonials, setFilteredTestimonials] = useState(dummyTestimonials);
    
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

    // ✅ Search & Filter Logic (NEW)
    React.useEffect(() => {
        let result = [...dummyTestimonials];

        // Search by name, location, or testimonial text
        if (searchTerm) {
            result = result.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.testimonial.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by program
        if (filterProgram) {
            result = result.filter(item => item.program === filterProgram);
        }

        // Filter by status
        if (filterStatus) {
            result = result.filter(item => item.status === filterStatus);
        }

        setFilteredTestimonials(result);
    }, [searchTerm, filterProgram, filterStatus]);

    // ✅ Clear Filters (NEW)
    const clearFilters = () => {
        setSearchTerm('');
        setFilterProgram('');
        setFilterStatus('');
    };

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

    // ✅ Stats Calculation (NEW)
    const stats = {
        total: dummyTestimonials.length,
        published: dummyTestimonials.filter(t => t.status === 'Published').length,
        draft: dummyTestimonials.filter(t => t.status === 'Draft').length,
        thisMonth: dummyTestimonials.filter(t => {
            const date = new Date(t.createdAt);
            const now = new Date();
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).length,
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
                        className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
                    >
                        <FaPlus />
                        Tambah Testimonial Baru
                    </button>
                )}
            </div>

            {/* ✅ Stats Cards (NEW) */}
            {!showForm && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                <FaQuoteLeft className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.total}</div>
                        <div className="text-sm text-blue-100">Total Testimonial</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                <FaCheck className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.published}</div>
                        <div className="text-sm text-green-100">Published</div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.draft}</div>
                        <div className="text-sm text-yellow-100">Draft</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.thisMonth}</div>
                        <div className="text-sm text-purple-100">Bulan Ini</div>
                    </div>
                </div>
            )}

            {/* ✅ Search & Filter Section (NEW) */}
            {!showForm && (
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <FaFilter className="text-gray-500" />
                        <h3 className="text-lg font-semibold text-gray-900">Pencarian & Filter</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari nama, lokasi, testimonial..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Filter Program */}
                        <select
                            value={filterProgram}
                            onChange={(e) => setFilterProgram(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">Semua Program</option>
                            {programOptions.map(prog => (
                                <option key={prog} value={prog}>{prog}</option>
                            ))}
                        </select>

                        {/* Filter Status */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">Semua Status</option>
                            {statusOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    {/* Clear Filter & Result Counter */}
                    {(searchTerm || filterProgram || filterStatus) && (
                        <div className="mt-4 flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                                Menampilkan <span className="font-semibold text-blue-600">{filteredTestimonials.length}</span> dari {dummyTestimonials.length} testimonial
                            </p>
                            <button
                                onClick={clearFilters}
                                className="text-sm text-red-600 hover:text-red-700 font-semibold flex items-center gap-2"
                            >
                                <FaTimes />
                                Hapus Filter
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Form Input Testimonial */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8 animate-fade-in">
                    <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingId ? 'Edit Testimonial' : 'Tambah Testimonial Baru'}
                            </h2>
                            <p className="text-gray-600 text-sm mt-1">
                                Lengkapi formulir testimonial dari masyarakat
                            </p>
                        </div>
                        <button
                            onClick={handleCancel}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Section 1: Personal Info */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FaUser className="w-4 h-4 text-blue-600" />
                                </div>
                                Informasi Pemberi Testimonial
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <FaUser className="w-4 h-4 text-gray-500" />
                                            Nama Lengkap <span className="text-red-500">*</span>
                                        </div>
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

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <FaMapMarkerAlt className="w-4 h-4 text-gray-500" />
                                            Lokasi / Desa <span className="text-red-500">*</span>
                                        </div>
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

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Status Publikasi <span className="text-red-500">*</span>
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
                                        Published = Ditampilkan di website
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Avatar Upload */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <FaImage className="w-4 h-4 text-purple-600" />
                                </div>
                                Foto / Avatar (Opsional)
                            </h3>
                            
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-all bg-gray-50">
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
                                            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-4">
                                                <FaImage className="w-8 h-8 text-purple-600" />
                                            </div>
                                            <span className="text-blue-600 font-semibold hover:text-blue-700 mb-2 text-lg">
                                                Klik untuk upload foto
                                            </span>
                                            <span className="text-gray-500 text-sm">
                                                Format: PNG, JPG (Maksimal 2MB) - Opsional
                                            </span>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="relative inline-block">
                                        <img
                                            src={formData.avatarPreview}
                                            alt="Avatar Preview"
                                            className="w-32 h-32 rounded-full object-cover shadow-lg mx-auto"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeAvatar}
                                            className="absolute -top-3 -right-3 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 shadow-xl transition-all transform hover:scale-110"
                                        >
                                            <FaTimes className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Section 3: Testimonial Content */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <FaQuoteLeft className="w-4 h-4 text-green-600" />
                                </div>
                                Isi Testimonial
                            </h3>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Testimonial <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="testimonial"
                                    value={formData.testimonial}
                                    onChange={handleInputChange}
                                    rows="6"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Tulis testimonial dari masyarakat tentang dampak program TJSL..."
                                    required
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-sm text-gray-500">
                                        Tulis dengan bahasa yang jujur dan menyentuh hati
                                    </p>
                                    <p className="text-sm font-medium text-gray-600">
                                        {formData.testimonial.length} karakter
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Preview Box */}
                        {formData.testimonial && (
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                    <FaQuoteLeft className="text-blue-600" />
                                    Preview Testimonial
                                </h3>
                                <div className="bg-white p-6 rounded-xl shadow-md">
                                    <p className="text-gray-700 italic mb-4 leading-relaxed">"{formData.testimonial}"</p>
                                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                                        {formData.avatarPreview && (
                                            <img src={formData.avatarPreview} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                                        )}
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">
                                                {formData.name || 'Nama Pemberi Testimonial'}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {formData.location || 'Lokasi'}
                                            </p>
                                            {formData.program && (
                                                <p className="text-xs text-blue-600 mt-1 font-semibold">
                                                    {formData.program}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg transform hover:-translate-y-0.5"
                            >
                                {editingId ? 'Update Testimonial' : 'Simpan Testimonial'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ✅ Table List Testimonial - Using filteredTestimonials (NEW) */}
            {!showForm && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Pemberi Testimonial
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Program
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Testimonial
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredTestimonials.map((item) => (
                                    <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {item.avatar ? (
                                                    <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full object-cover shadow-md" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                                        <span className="text-blue-600 font-bold text-lg">
                                                            {item.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                        <FaMapMarkerAlt className="w-3 h-3" />
                                                        {item.location}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                                {item.program}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 line-clamp-2 max-w-md italic">
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
                                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
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
                                                    className="text-blue-600 hover:text-blue-900 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-600 hover:text-red-900 transition-colors p-2 hover:bg-red-50 rounded-lg"
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
                    
                    {/* ✅ Empty State - Context Aware (NEW) */}
                    {filteredTestimonials.length === 0 && (
                        <div className="text-center py-16 bg-gray-50">
                            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <FaQuoteLeft className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-lg font-medium mb-2">
                                {searchTerm || filterProgram || filterStatus
                                    ? 'Tidak ada testimonial yang sesuai dengan filter'
                                    : 'Belum ada testimonial'}
                            </p>
                            <p className="text-gray-400 text-sm mb-4">
                                {searchTerm || filterProgram || filterStatus
                                    ? 'Coba ubah kriteria pencarian atau filter'
                                    : 'Mulai tambahkan testimonial pertama dari masyarakat'}
                            </p>
                            {!(searchTerm || filterProgram || filterStatus) && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="text-blue-600 hover:text-blue-700 font-semibold"
                                >
                                    Tambah Testimonial Pertama
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageTestimonial;