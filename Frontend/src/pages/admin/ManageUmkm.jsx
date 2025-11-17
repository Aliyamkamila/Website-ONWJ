import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaImage, FaTimes, FaStore, FaStar } from 'react-icons/fa';

// Data Dummy - nanti diganti dengan API
const dummyUmkm = [
    { 
        id: 1,
        name: 'Kopi Mangrove Segara',
        category: 'Kuliner',
        owner: 'Ibu Siti',
        location: 'Muara Gembong, Bekasi',
        description: 'Kopi olahan dari biji kopi lokal dengan sentuhan aroma mangrove khas pesisir. Dikemas higienis dan ramah lingkungan.',
        testimonial: 'Dulu saya cuma bisa jual 10 bungkus, setelah dapat pelatihan pengemasan dari MUJ ONWJ, sekarang bisa kirim ke luar kota. Omzet naik 300%!',
        shopLink: 'https://tokopedia.com/kopi-mangrove',
        contactNumber: '0812-3456-7890',
        status: 'Aktif',
        yearStarted: 2024,
        achievement: 'Omzet naik 300%, ekspor ke 5 kota',
        isFeatured: true,
        imageUrl: null
    },
    { 
        id: 2,
        name: 'Kerajinan Enceng Gondok',
        category: 'Kerajinan',
        owner: 'Bapak Joko',
        location: 'Kalibaru, Jakarta Utara',
        description: 'Produk kerajinan tangan dari enceng gondok yang ramah lingkungan. Berbagai macam tas, tempat pensil, dan aksesori rumah.',
        testimonial: '',
        shopLink: 'https://shopee.co.id/kerajinan-gondok',
        contactNumber: '0813-9876-5432',
        status: 'Aktif',
        yearStarted: 2023,
        achievement: '50 produk terjual/bulan',
        isFeatured: false,
        imageUrl: null
    },
];

const ManageUmkm = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        owner: '',
        location: '',
        description: '',
        testimonial: '',
        shopLink: '',
        contactNumber: '',
        status: 'Aktif',
        yearStarted: new Date().getFullYear(),
        achievement: '',
        isFeatured: false,
        image: null,
        imagePreview: null
    });

    const categories = [
        'Kuliner',
        'Kerajinan',
        'Agribisnis',
        'Fashion',
        'Jasa',
        'Lainnya'
    ];

    const statusOptions = ['Aktif', 'Lulus Binaan', 'Dalam Proses'];

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
            name: '',
            category: '',
            owner: '',
            location: '',
            description: '',
            testimonial: '',
            shopLink: '',
            contactNumber: '',
            status: 'Aktif',
            yearStarted: new Date().getFullYear(),
            achievement: '',
            isFeatured: false,
            image: null,
            imagePreview: null
        });
        setEditingId(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validasi
        if (!formData.name || !formData.category || !formData.owner || !formData.location || !formData.description) {
            alert('Mohon lengkapi semua field yang wajib diisi!');
            return;
        }

        if (!formData.image && !editingId) {
            alert('Mohon upload foto produk!');
            return;
        }

        // Validasi featured harus ada testimonial
        if (formData.isFeatured && !formData.testimonial.trim()) {
            alert('Untuk UMKM Featured, mohon isi Cerita Sukses/Testimonial!');
            return;
        }

        const dataToSubmit = {
            ...formData,
            id: editingId || Date.now()
        };

        console.log('Submitting:', dataToSubmit);
        
        if (editingId) {
            alert('UMKM berhasil diupdate!');
        } else {
            alert('UMKM berhasil ditambahkan!');
        }
        
        setShowForm(false);
        resetForm();
    };

    const handleEdit = (id) => {
        const umkm = dummyUmkm.find(u => u.id === id);
        if (umkm) {
            setFormData({
                name: umkm.name,
                category: umkm.category,
                owner: umkm.owner,
                location: umkm.location,
                description: umkm.description,
                testimonial: umkm.testimonial || '',
                shopLink: umkm.shopLink || '',
                contactNumber: umkm.contactNumber || '',
                status: umkm.status,
                yearStarted: umkm.yearStarted,
                achievement: umkm.achievement || '',
                isFeatured: umkm.isFeatured,
                image: null,
                imagePreview: umkm.imageUrl || null
            });
            setEditingId(id);
            setShowForm(true);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus UMKM ini?')) {
            console.log('Delete UMKM:', id);
            alert('UMKM berhasil dihapus!');
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
                    <h1 className="text-3xl font-bold text-gray-900">Kelola UMKM Binaan</h1>
                    <p className="text-gray-600 mt-1">Manajemen UMKM mitra binaan perusahaan</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        <FaPlus />
                        Tambah UMKM Baru
                    </button>
                )}
            </div>

            {/* Form Input UMKM */}
            {showForm && (
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {editingId ? 'Edit UMKM Binaan' : 'Input UMKM Binaan Baru'}
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
                            {/* Nama UMKM/Produk */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nama UMKM/Produk <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Contoh: Kopi Mangrove Segara"
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

                            {/* Nama Pemilik */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nama Pemilik <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="owner"
                                    value={formData.owner}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Contoh: Ibu Siti"
                                    required
                                />
                            </div>

                            {/* Lokasi/Wilayah */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Lokasi/Wilayah <span className="text-red-500">*</span>
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

                            {/* Status Binaan */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Status Binaan <span className="text-red-500">*</span>
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
                            </div>
                        </div>

                        {/* Deskripsi Singkat */}
                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Deskripsi Singkat Produk/Usaha <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Jelaskan tentang produk atau usaha UMKM ini..."
                                required
                            />
                        </div>

                        {/* Cerita Sukses/Testimonial */}
                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Cerita Sukses/Testimonial Pemilik
                                {formData.isFeatured && <span className="text-red-500">*</span>}
                            </label>
                            <textarea
                                name="testimonial"
                                value={formData.testimonial}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Contoh: Dulu saya cuma bisa jual 10 bungkus, setelah dapat pelatihan pengemasan dari MUJ ONWJ, sekarang bisa kirim ke luar kota. Omzet naik 300%!"
                                required={formData.isFeatured}
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                💡 {formData.isFeatured ? 'Wajib diisi untuk UMKM Featured' : 'Digunakan untuk menampilkan UMKM di section unggulan (jika dicentang)'}
                            </p>
                        </div>

                        {/* Upload Foto */}
                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Upload Foto Produk <span className="text-red-500">*</span>
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
                                                Klik untuk upload foto produk
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            {/* Link Toko Online */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Link Toko Online
                                </label>
                                <input
                                    type="url"
                                    name="shopLink"
                                    value={formData.shopLink}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="https://tokopedia.com/..."
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Tokopedia, Shopee, Instagram, atau marketplace lainnya
                                </p>
                            </div>

                            {/* Nomor Kontak/WhatsApp */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nomor Kontak/WhatsApp
                                </label>
                                <input
                                    type="tel"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="0812-xxxx-xxxx"
                                />
                            </div>

                            {/* Tahun Mulai Binaan */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tahun Mulai Binaan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="yearStarted"
                                    value={formData.yearStarted}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    min="2020"
                                    max="2030"
                                    required
                                />
                            </div>

                            {/* Omzet/Pencapaian */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Omzet/Pencapaian
                                </label>
                                <input
                                    type="text"
                                    name="achievement"
                                    value={formData.achievement}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Contoh: Omzet naik 300%"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Pencapaian atau perkembangan usaha
                                </p>
                            </div>
                        </div>

                        {/* Checkbox Featured */}
                        <div className="mt-6 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="isFeatured"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-1"
                                />
                                <label htmlFor="isFeatured" className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FaStar className="text-yellow-500" />
                                        <span className="font-semibold text-gray-800">Jadikan Featured UMKM</span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        UMKM ini akan ditampilkan di section unggulan (paling atas) dengan cerita sukses lengkap.
                                        Pastikan field "Cerita Sukses/Testimonial" sudah diisi dengan baik.
                                    </p>
                                </label>
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
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                            >
                                {editingId ? 'Update UMKM' : 'Save UMKM'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tabel List UMKM */}
            {!showForm && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        UMKM
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kategori
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pemilik & Lokasi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tahun
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Featured
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dummyUmkm.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                                        <FaStore className="text-gray-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                    <div className="text-sm text-gray-500 line-clamp-1">{item.description.substring(0, 40)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="font-medium text-gray-900">{item.owner}</div>
                                            <div className="text-xs">{item.location}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                item.status === 'Aktif' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : item.status === 'Lulus Binaan'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {item.yearStarted}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.isFeatured && (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                    <FaStar className="w-3 h-3" />
                                                    Featured
                                                </span>
                                            )}
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
                    {dummyUmkm.length === 0 && (
                        <div className="text-center py-12">
                            <FaStore className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg mb-2">Belum ada UMKM binaan yang ditambahkan.</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                Tambah UMKM Pertama
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageUmkm;