import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaTrophy, FaCalendar, FaAward } from 'react-icons/fa';

const ManagePenghargaan = () => {
  const [penghargaan, setPenghargaan] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    pemberi: '',
    year: new Date().getFullYear(),
    date: '',
    description: '',
    image: null,
    show_in_landing: false,
    show_in_media_informasi: true,
  });

  const categories = [
    'Lingkungan',
    'K3 (Kesehatan & Keselamatan Kerja)',
    'CSR & TJSL',
    'Inovasi & Teknologi',
    'Manajemen Terbaik',
    'Keuangan',
    'Lainnya',
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB');
        return;
      }
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar');
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingItem) {
      // Update existing
      setPenghargaan(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...formData, id: item.id, image: formData.image || item.image }
          : item
      ));
      alert('✅ Penghargaan berhasil diupdate!');
    } else {
      // Add new
      const newItem = {
        ...formData,
        id: Date.now(),
        created_at: new Date().toISOString(),
      };
      setPenghargaan(prev => [newItem, ...prev]);
      alert('✅ Penghargaan berhasil ditambahkan!');
    }
    
    resetForm();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      pemberi: item.pemberi,
      year: item.year,
      date: item.date,
      description: item.description,
      image: item.image,
      show_in_landing: item.show_in_landing,
      show_in_media_informasi: item.show_in_media_informasi,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus penghargaan ini?')) {
      setPenghargaan(prev => prev.filter(item => item.id !== id));
      alert('✅ Penghargaan berhasil dihapus!');
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: '',
      pemberi: '',
      year: new Date().getFullYear(),
      date: '',
      description: '',
      image: null,
      show_in_landing: false,
      show_in_media_informasi: true,
    });
    setShowForm(false);
  };

  const handleCancel = () => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan? Data yang belum disimpan akan hilang.')) {
      resetForm();
    }
  };

  // Filter data
  const filteredData = penghargaan.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       item.pemberi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchYear = filterYear ? item.year.toString() === filterYear : true;
    return matchSearch && matchYear;
  });

  // Get unique years for filter
  const years = [...new Set(penghargaan.map(item => item.year))].sort((a, b) => b - a);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Penghargaan</h1>
          <p className="text-gray-600 mt-1">Manajemen penghargaan yang diterima perusahaan</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            <FaPlus />
            Tambah Penghargaan Baru
          </button>
        )}
      </div>

      {/* Stats Cards */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-2">Total Penghargaan</div>
            <div className="text-3xl font-bold text-blue-600">{penghargaan.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-2">Tampil di Landing</div>
            <div className="text-3xl font-bold text-green-600">
              {penghargaan.filter(item => item.show_in_landing).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-2">Media Informasi</div>
            <div className="text-3xl font-bold text-purple-600">
              {penghargaan.filter(item => item.show_in_media_informasi).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-2">Tahun Ini</div>
            <div className="text-3xl font-bold text-orange-600">
              {penghargaan.filter(item => item.year === new Date().getFullYear()).length}
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      {!showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="🔍 Cari penghargaan, kategori, atau pemberi..."
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
          </div>
        </div>
      )}

      {/* Form Input */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingItem ? 'Edit Penghargaan' : 'Tambah Penghargaan Baru'}
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
                🏆 Informasi Penghargaan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Penghargaan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Contoh: Penghargaan PROPER Emas 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pemberi Penghargaan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pemberi"
                    value={formData.pemberi}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Contoh: Kementerian Lingkungan Hidup"
                  />
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

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tanggal Penerimaan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deskripsi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Deskripsi singkat tentang penghargaan..."
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                📸 Gambar/Foto Penghargaan
              </h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Gambar <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Format: JPG, PNG, WebP. Maksimal 2MB. Rasio 16:9 atau 4:3 recommended.
                </p>
                {formData.image && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      ✓ File terpilih: {formData.image.name || 'Gambar sudah ada'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Display Options */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                👁️ Opsi Tampilan
              </h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer p-4 bg-green-50 rounded-lg border-2 border-green-200 hover:bg-green-100 transition-all">
                  <input
                    type="checkbox"
                    name="show_in_landing"
                    checked={formData.show_in_landing}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-900 block">
                      Tampilkan di Landing Page
                    </span>
                    <span className="text-xs text-gray-600">
                      Penghargaan akan muncul di section "Penghargaan Kami" pada halaman utama
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-4 bg-purple-50 rounded-lg border-2 border-purple-200 hover:bg-purple-100 transition-all">
                  <input
                    type="checkbox"
                    name="show_in_media_informasi"
                    checked={formData.show_in_media_informasi}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-900 block">
                      Tampilkan di Media Informasi
                    </span>
                    <span className="text-xs text-gray-600">
                      Penghargaan akan muncul di halaman Media Informasi → Penghargaan
                    </span>
                  </div>
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
                {editingItem ? 'Update Penghargaan' : 'Simpan Penghargaan'}
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
                    Penghargaan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pemberi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tahun
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tampilan
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
                      {penghargaan.length === 0 ? (
                        <div className="flex flex-col items-center gap-3">
                          <FaTrophy className="w-12 h-12 text-gray-300" />
                          <p>Belum ada data penghargaan</p>
                          <button
                            onClick={() => setShowForm(true)}
                            className="text-blue-600 font-semibold hover:text-blue-700"
                          >
                            Tambah Penghargaan Pertama
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
                          <FaTrophy className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                            <div className="text-xs text-gray-500">{item.date}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.pemberi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {item.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          {item.show_in_landing && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-semibold" title="Landing Page">
                              LP
                            </span>
                          )}
                          {item.show_in_media_informasi && (
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded font-semibold" title="Media Informasi">
                              MI
                            </span>
                          )}
                        </div>
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

export default ManagePenghargaan;