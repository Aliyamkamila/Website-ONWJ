import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaFilePdf, FaDownload, FaEye, FaUpload } from 'react-icons/fa';

const ManageLaporan = () => {
  const [laporanList, setLaporanList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterType, setFilterType] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    year: new Date().getFullYear(),
    description: '',
    file: null,
    file_size: 0,
    cover_image: null,
    published_date: '',
    is_active: true,
  });

  const reportTypes = [
    'Laporan Tahunan',
    'Laporan Keuangan',
    'Laporan Keberlanjutan',
    'Laporan K3L',
    'Laporan TJSL',
    'Laporan Operasional',
    'Lainnya',
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (PDF only)
      if (file.type !== 'application/pdf') {
        alert('❌ File harus berupa PDF!');
        e.target.value = '';
        return;
      }
      
      // Validate file size (max 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        alert('❌ Ukuran file maksimal 50MB!');
        e.target.value = '';
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        file: file,
        file_size: file.size
      }));
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('❌ File harus berupa gambar (JPG, PNG, WebP)!');
        e.target.value = '';
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('❌ Ukuran gambar maksimal 5MB!');
        e.target.value = '';
        return;
      }
      
      setFormData(prev => ({ ...prev, cover_image: file }));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate PDF file
    if (!editingItem && !formData.file) {
      alert('❌ File PDF wajib diupload!');
      return;
    }
    
    if (editingItem) {
      // Update existing
      setLaporanList(prev => prev.map(item => 
        item.id === editingItem.id 
          ? {
              ...formData,
              id: item.id,
              file: formData.file || item.file,
              cover_image: formData.cover_image || item.cover_image,
              updated_at: new Date().toISOString(),
            }
          : item
      ));
      alert('✅ Laporan berhasil diupdate!');
    } else {
      // Add new
      const newItem = {
        ...formData,
        id: Date.now(),
        created_at: new Date().toISOString(),
        downloads: 0,
      };
      setLaporanList(prev => [newItem, ...prev]);
      alert('✅ Laporan berhasil ditambahkan!');
    }
    
    resetForm();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      type: item.type,
      year: item.year,
      description: item.description,
      file: item.file,
      file_size: item.file_size,
      cover_image: item.cover_image,
      published_date: item.published_date,
      is_active: item.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      setLaporanList(prev => prev.filter(item => item.id !== id));
      alert('✅ Laporan berhasil dihapus!');
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      type: '',
      year: new Date().getFullYear(),
      description: '',
      file: null,
      file_size: 0,
      cover_image: null,
      published_date: '',
      is_active: true,
    });
    setShowForm(false);
  };

  const handleCancel = () => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan? Data yang belum disimpan akan hilang.')) {
      resetForm();
    }
  };

  // Filter data
  const filteredData = laporanList.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchYear = filterYear ? item.year.toString() === filterYear : true;
    const matchType = filterType ? item.type === filterType : true;
    return matchSearch && matchYear && matchType;
  });

  // Get unique years for filter
  const years = [...new Set(laporanList.map(item => item.year))].sort((a, b) => b - a);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Laporan Tahunan</h1>
          <p className="text-gray-600 mt-1">Manajemen laporan tahunan dan dokumen perusahaan</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            <FaPlus />
            Tambah Laporan Baru
          </button>
        )}
      </div>

      {/* Stats Cards */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-2">Total Laporan</div>
            <div className="text-3xl font-bold text-blue-600">{laporanList.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-2">Laporan Aktif</div>
            <div className="text-3xl font-bold text-green-600">
              {laporanList.filter(item => item.is_active).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-2">Total Download</div>
            <div className="text-3xl font-bold text-purple-600">
              {laporanList.reduce((acc, item) => acc + (item.downloads || 0), 0)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-2">Tahun Ini</div>
            <div className="text-3xl font-bold text-orange-600">
              {laporanList.filter(item => item.year === new Date().getFullYear()).length}
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      {!showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="🔍 Cari judul laporan atau jenis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Semua Tahun</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Semua Jenis</option>
              {reportTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Form Input */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingItem ? 'Edit Laporan' : 'Tambah Laporan Baru'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                📋 Informasi Laporan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Judul Laporan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Contoh: Laporan Tahunan PT MHJ ONWJ 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jenis Laporan <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Pilih Jenis Laporan</option>
                    {reportTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tahun <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                    min="1900"
                    max="2100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tanggal Publikasi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="published_date"
                    value={formData.published_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deskripsi Singkat <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Deskripsi singkat tentang laporan ini..."
                  />
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                📄 Upload File PDF
              </h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  File PDF Laporan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    required={!editingItem}
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer hover:border-blue-400"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <FaUpload className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Format: PDF. Maksimal 50MB. Pastikan file dapat dibaca dengan baik.
                </p>
                {formData.file && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border-2 border-green-200 flex items-center gap-3">
                    <FaFilePdf className="w-8 h-8 text-red-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {formData.file.name || 'File PDF sudah ada'}
                      </p>
                      <p className="text-xs text-gray-600">
                        Ukuran: {formatFileSize(formData.file_size || formData.file.size)}
                      </p>
                    </div>
                    <span className="text-green-600 font-bold text-xl">✓</span>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Image Upload */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                🖼️ Cover/Thumbnail (Opsional)
              </h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gambar Cover
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Format: JPG, PNG, WebP. Maksimal 5MB. Rasio 16:9 atau A4 portrait recommended.
                </p>
                {formData.cover_image && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      ✓ Cover terpilih: {formData.cover_image.name || 'Cover sudah ada'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer p-4 bg-green-50 rounded-lg border-2 border-green-200 hover:bg-green-100 transition-all">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-900 block">
                    Aktifkan Laporan
                  </span>
                  <span className="text-xs text-gray-600">
                    Laporan akan tampil di halaman Media Informasi → Laporan Tahunan
                  </span>
                </div>
              </label>
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
                {editingItem ? 'Update Laporan' : 'Simpan Laporan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table List */}
      {!showForm && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Laporan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jenis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tahun
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ukuran File
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      {laporanList.length === 0 ? (
                        <div className="flex flex-col items-center gap-3">
                          <FaFilePdf className="w-12 h-12 text-gray-300" />
                          <p>Belum ada laporan tahunan</p>
                          <button
                            onClick={() => setShowForm(true)}
                            className="text-blue-600 font-semibold hover:text-blue-700"
                          >
                            Upload Laporan Pertama
                          </button>
                        </div>
                      ) : (
                        'Tidak ada data yang sesuai dengan pencarian'
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FaFilePdf className="w-6 h-6 text-red-600 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                            <div className="text-xs text-gray-500">{item.published_date}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {item.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatFileSize(item.file_size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {item.is_active ? (
                          <span className="text-green-600 text-2xl">✓</span>
                        ) : (
                          <span className="text-red-600 text-2xl">✗</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(item)}
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLaporan;