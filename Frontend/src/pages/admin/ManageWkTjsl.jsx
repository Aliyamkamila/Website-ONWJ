import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const ManageWkTjsl = () => {
  const [areas, setAreas] = useState([]);
  const [beritaList, setBeritaList] = useState([]); // ✅ BARU: List berita
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    area_id: '',
    name: '',
    position_x: '',
    position_y: '',
    color: '#0EA5E9',
    description: '',
    programs: [],
    status: 'Aktif',
    beneficiaries: '',
    budget: '',
    duration: '',
    impact: '',
    order: 0,
    is_active: true,
    related_news_id: '', // ✅ BARU: ID berita terkait
  });

  const [programInput, setProgramInput] = useState('');

  useEffect(() => {
    fetchAreas();
    fetchBeritaList(); // ✅ BARU: Fetch list berita
  }, [currentPage, searchTerm, filterStatus]);

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/v1/admin/wk-tjsl`, {
        params: {
          page: currentPage,
          search: searchTerm,
          status: filterStatus,
          per_page: 15,
        },
      });

      if (response.data.success) {
        setAreas(response.data.data);
        setTotalPages(response.data.meta.last_page);
        setTotalItems(response.data.meta.total);
      }
    } catch (error) {
      console.error('Error fetching TJSL areas:', error);
      toast.error('Gagal memuat data program TJSL');
    } finally {
      setLoading(false);
    }
  };

  // ✅ BARU: Fetch list berita untuk dropdown
  const fetchBeritaList = async () => {
    try {
      const response = await axios.get(`${API_URL}/v1/admin/berita`, {
        params: {
          per_page: 999, // Ambil semua berita
          status: 'published', // Hanya berita published
        },
      });

      if (response.data.success) {
        setBeritaList(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching berita list:', error);
      // Tidak perlu toast error karena ini optional
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addProgram = () => {
    if (programInput.trim()) {
      setFormData(prev => ({
        ...prev,
        programs: [...prev.programs, programInput.trim()]
      }));
      setProgramInput('');
    }
  };

  const removeProgram = (index) => {
    setFormData(prev => ({
      ...prev,
      programs: prev.programs.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = editingArea
        ? `${API_URL}/v1/admin/wk-tjsl/${editingArea.id}`
        : `${API_URL}/v1/admin/wk-tjsl`;

      const method = editingArea ? 'put' : 'post';

      const response = await axios[method](endpoint, formData);

      if (response.data.success) {
        toast.success(editingArea ? 'Program TJSL berhasil diperbarui!' : 'Program TJSL berhasil ditambahkan!');
        setShowForm(false);
        resetForm();
        fetchAreas();
      }
    } catch (error) {
      console.error('Error saving TJSL area:', error);
      const errorMessage = error.response?.data?.message || 'Gagal menyimpan data program TJSL';
      toast.error(errorMessage);

      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach(err => {
          toast.error(err[0]);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (area) => {
    setEditingArea(area);
    setFormData({
      area_id: area.area_id,
      name: area.name,
      position_x: area.position_x,
      position_y: area.position_y,
      color: area.color,
      description: area.description,
      programs: area.programs || [],
      status: area.status,
      beneficiaries: area.beneficiaries || '',
      budget: area.budget || '',
      duration: area.duration || '',
      impact: area.impact || '',
      order: area.order || 0,
      is_active: area.is_active,
      related_news_id: area.related_news_id || '', // ✅ BARU
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus program TJSL ini?')) {
      return;
    }

    try {
      const response = await axios.delete(`${API_URL}/v1/admin/wk-tjsl/${id}`);

      if (response.data.success) {
        toast.success('Program TJSL berhasil dihapus!');
        fetchAreas();
      }
    } catch (error) {
      console.error('Error deleting TJSL area:', error);
      toast.error('Gagal menghapus program TJSL');
    }
  };

  const resetForm = () => {
    setEditingArea(null);
    setFormData({
      area_id: '',
      name: '',
      position_x: '',
      position_y: '',
      color: '#0EA5E9',
      description: '',
      programs: [],
      status: 'Aktif',
      beneficiaries: '',
      budget: '',
      duration: '',
      impact: '',
      order: 0,
      is_active: true,
      related_news_id: '', // ✅ BARU
    });
    setProgramInput('');
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
          <h1 className="text-3xl font-bold text-gray-900">Kelola Wilayah Kerja TJSL</h1>
          <p className="text-gray-600 mt-1">Manajemen program tanggung jawab sosial dan lingkungan</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            <FaPlus />
            Tambah Program TJSL Baru
          </button>
        )}
      </div>

      {/* Stats Cards */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-2">Total Program TJSL</div>
            <div className="text-3xl font-bold text-blue-600">{totalItems}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-2">Program Aktif</div>
            <div className="text-3xl font-bold text-green-600">
              {areas.filter(a => a.status === 'Aktif').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-2">Program Non-Aktif</div>
            <div className="text-3xl font-bold text-red-600">
              {areas.filter(a => a.status === 'Non-Aktif').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-2">Status Tampil</div>
            <div className="text-3xl font-bold text-purple-600">
              {areas.filter(a => a.is_active).length}
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
              placeholder="🔍 Cari program TJSL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Non-Aktif">Non-Aktif</option>
            </select>
          </div>
        </div>
      )}

      {/* Form Input */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingArea ? 'Edit Program TJSL' : 'Input Program TJSL Baru'}
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
                📋 Informasi Dasar
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ID Area <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="area_id"
                    value={formData.area_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Contoh: KEPULAUAN_SERIBU"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Program <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nama program TJSL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Non-Aktif">Non-Aktif</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Urutan Tampilan
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Position & Color */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                📍 Posisi & Tampilan di Peta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Position X (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="position_x"
                    value={formData.position_x}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0.00"
                    min="0"
                    max="100"
                  />
                  <p className="text-sm text-gray-500 mt-1">Koordinat X pada peta (0-100)</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Position Y (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="position_y"
                    value={formData.position_y}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0.00"
                    min="0"
                    max="100"
                  />
                  <p className="text-sm text-gray-500 mt-1">Koordinat Y pada peta (0-100)</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Warna Marker <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      required
                      className="h-12 w-20 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="#0EA5E9"
                      pattern="^#[0-9A-Fa-f]{6}$"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Warna yang akan ditampilkan pada marker peta</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi Program <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Deskripsi lengkap program TJSL..."
              />
            </div>

            {/* Program Data */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                🤝 Data Program
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Penerima Manfaat
                  </label>
                  <input
                    type="text"
                    name="beneficiaries"
                    value={formData.beneficiaries}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Contoh: 850 Keluarga"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Anggaran
                  </label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Contoh: Rp 2.8 Miliar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Durasi Program
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Contoh: 2023-2025"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dampak Program
                  </label>
                  <input
                    type="text"
                    name="impact"
                    value={formData.impact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Contoh: Peningkatan 35% pendapatan"
                  />
                </div>
              </div>
            </div>

            {/* Programs List */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Program & Kegiatan
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={programInput}
                  onChange={(e) => setProgramInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProgram())}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Nama program/kegiatan (tekan Enter untuk menambah)"
                />
                <button
                  type="button"
                  onClick={addProgram}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  + Tambah
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.programs.map((program, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm flex items-center gap-2 font-medium"
                  >
                    {program}
                    <button
                      type="button"
                      onClick={() => removeProgram(index)}
                      className="text-purple-600 hover:text-purple-900 font-bold"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* ✅ BARU: Link Berita Terkait */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                📰 Berita Terkait
              </h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pilih Berita Terkait (Opsional)
                </label>
                <select
                  name="related_news_id"
                  value={formData.related_news_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">-- Tidak ada berita terkait --</option>
                  {beritaList.map((berita) => (
                    <option key={berita.id} value={berita.id}>
                      {berita.title} ({new Date(berita.date).toLocaleDateString('id-ID')})
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Berita ini akan ditampilkan di button "Lihat Berita Terkait" pada modal detail program
                </p>
              </div>
            </div>

            {/* Active Status */}
            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Tampilkan di website (Status Aktif)
                </span>
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
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Menyimpan...' : editingArea ? 'Update Program TJSL' : 'Save Program TJSL'}
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
                    ID Area & Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Penerima Manfaat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Berita Terkait
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktif
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : areas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      Tidak ada data program TJSL
                    </td>
                  </tr>
                ) : (
                  areas.map((area) => (
                    <tr key={area.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{area.area_id}</div>
                        <div className="text-sm text-gray-500">{area.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          area.status === 'Aktif'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {area.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {area.beneficiaries || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {area.related_news_id ? (
                          <span className="text-blue-600 font-medium">✓ Terlink</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {area.is_active ? (
                          <span className="text-green-600 text-2xl">✓</span>
                        ) : (
                          <span className="text-red-600 text-2xl">✗</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(area)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Edit"
                          >
                            <FaEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(area.id)}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Menampilkan {areas.length} dari {totalItems} data
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                >
                  ← Sebelumnya
                </button>
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-2 rounded-lg transition ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                >
                  Selanjutnya →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageWkTjsl;