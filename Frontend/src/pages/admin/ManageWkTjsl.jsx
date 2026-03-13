import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaMapMarkerAlt, FaUsers, FaCheck, FaNewspaper, FaSearch, FaFilter, FaArrowLeft, FaCog, FaList, FaSave } from 'react-icons/fa';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';
import MapClickSelector from '../../components/MapClickSelector';
import PetaImage from '../wk/Peta.png';

const ManageWkTjsl = () => {
  const [areas, setAreas] = useState([]);
  const [filteredAreas, setFilteredAreas] = useState([]);
  const [beritaList, setBeritaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterActive, setFilterActive] = useState('');
  const [filterCategory, setFilterCategory] = useState(''); // Filter kategori baru

  // ========== KATEGORI MANAGEMENT STATE ==========
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    area_id:  '',
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
    is_active:  true,
    related_news_id:  '',
    category_name: '', // Tambahkan field kategori
  });

  const [programInput, setProgramInput] = useState('');

  // ========== LOAD CATEGORIES FROM LOCALSTORAGE ==========
  useEffect(() => {
    const savedCategories = localStorage.getItem('tjsl_categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      // Default categories jika belum ada
      const defaultCategories = [
        'Pemberdayaan Masyarakat',
        'Pendidikan',
        'Kesehatan',
        'Lingkungan',
        'Infrastruktur',
        'Ekonomi Kreatif'
      ];
      setCategories(defaultCategories);
      localStorage.setItem('tjsl_categories', JSON.stringify(defaultCategories));
    }
  }, []);

  // ========== SAVE CATEGORIES TO LOCALSTORAGE ==========
  const saveCategoriesToStorage = (newCategories) => {
    localStorage.setItem('tjsl_categories', JSON.stringify(newCategories));
    setCategories(newCategories);
  };

  // ========== ADD CATEGORY ==========
  const handleAddCategory = () => {
    if (! categoryInput.trim()) {
      toast.error('Nama kategori tidak boleh kosong! ');
      return;
    }

    if (editingCategory !== null) {
      // Edit mode
      const updatedCategories = [... categories];
      updatedCategories[editingCategory] = categoryInput. trim();
      saveCategoriesToStorage(updatedCategories);
      toast.success('✅ Kategori berhasil diupdate!');
      setEditingCategory(null);
    } else {
      // Add mode
      if (categories.includes(categoryInput.trim())) {
        toast.error('Kategori sudah ada!');
        return;
      }
      const newCategories = [...categories, categoryInput.trim()];
      saveCategoriesToStorage(newCategories);
      toast.success('✅ Kategori berhasil ditambahkan!');
    }

    setCategoryInput('');
  };

  // ========== EDIT CATEGORY ==========
  const handleEditCategory = (index) => {
    setCategoryInput(categories[index]);
    setEditingCategory(index);
  };

  // ========== DELETE CATEGORY ==========
  const handleDeleteCategory = (index) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus kategori "${categories[index]}"?`)) {
      const newCategories = categories.filter((_, i) => i !== index);
      saveCategoriesToStorage(newCategories);
      toast.success('✅ Kategori berhasil dihapus!');
    }
  };

  // ========== CANCEL EDIT CATEGORY ==========
  const handleCancelEditCategory = () => {
    setCategoryInput('');
    setEditingCategory(null);
  };

  useEffect(() => {
    fetchAreas();
    fetchBeritaList();
  }, []);

  useEffect(() => {
    let result = [... areas];

    if (searchTerm) {
      result = result.filter(item =>
        item.area_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus) {
      result = result.filter(item => item.status === filterStatus);
    }

    if (filterActive === 'true') {
      result = result. filter(item => item.is_active === true);
    } else if (filterActive === 'false') {
      result = result.filter(item => item.is_active === false);
    }

    // Filter by category
    if (filterCategory) {
      result = result.filter(item => item.category_name === filterCategory);
    }

    setFilteredAreas(result);
  }, [searchTerm, filterStatus, filterActive, filterCategory, areas]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setFilterActive('');
    setFilterCategory('');
  };

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/admin/wilayah-kerja', {
        params: {
          category:  'TJSL',
          per_page: 999
        }
      });

      if (response.data.success) {
        const data = response.data.data || [];
        setAreas(data);
        setFilteredAreas(data);
        console.log('✅ TJSL areas loaded:', data. length);
      }
    } catch (error) {
      console.error('❌ Error fetching TJSL areas:', error);
      const errorMsg = error.response?.data?.message || 'Gagal memuat data program TJSL';
      toast. error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchBeritaList = async () => {
    try {
      const response = await axiosInstance.get('/admin/berita', {
        params: { per_page: 999, status: 'published' }
      });

      console.log('📰 Berita response:', response.data);

      if (response.data.success) {
        const beritaData = response.data. data || [];
        setBeritaList(beritaData);
        console.log('✅ Berita list loaded:', beritaData.length);
      }
    } catch (error) {
      console.error('❌ Error fetching berita list:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:  type === 'checkbox' ? checked : value
    }));
  };

  const handlePositionSelect = (coordinates) => {
    setFormData(prev => ({
      ...prev,
      position_x: coordinates.position_x || '',
      position_y: coordinates.position_y || ''
    }));
  };

  const addProgram = () => {
    if (programInput.trim()) {
      setFormData(prev => ({
        ...prev,
        programs: [... prev.programs, programInput.trim()]
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
    
    if (!formData.position_x || !formData.position_y) {
      toast.error('Silakan pilih posisi pada peta terlebih dahulu!');
      return;
    }

    if (! formData.category_name) {
      toast.error('Silakan pilih kategori program!');
      return;
    }

    setLoading(true);

    try {
      const dataWithCategory = {
        ...formData,
        category:  'TJSL'
      };

      if (! dataWithCategory.related_news_id || dataWithCategory.related_news_id === '') {
        delete dataWithCategory. related_news_id;
      } else {
        dataWithCategory. related_news_id = parseInt(dataWithCategory.related_news_id);
      }

      console.log('📤 Sending data:', dataWithCategory);

      const endpoint = editingArea
        ? `/admin/wilayah-kerja/${editingArea. id}`
        : '/admin/wilayah-kerja';

      const method = editingArea ? 'put' : 'post';

      const config = editingArea ? { params: { category: 'TJSL' } } : {};

      const response = await axiosInstance[method](endpoint, dataWithCategory, config);

      if (response.data.success) {
        toast.success(editingArea ? 'Program TJSL berhasil diperbarui!' : 'Program TJSL berhasil ditambahkan!');
        setShowForm(false);
        resetForm();
        fetchAreas();
      }
    } catch (error) {
      console.error('❌ Error saving TJSL area:', error);
      console.error('❌ Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 'Gagal menyimpan data program TJSL';
      toast.error(errorMessage);

      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach(err => {
          toast.error(Array.isArray(err) ? err[0] : err);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (area) => {
    setEditingArea(area);
    setFormData({
      area_id: area. area_id,
      name: area.name,
      position_x: parseFloat(area.position_x),
      position_y: parseFloat(area.position_y),
      color: area.color,
      description: area.description,
      programs: area.programs || [],
      status: area.status,
      beneficiaries: area.beneficiaries || '',
      budget: area.budget || '',
      duration: area. duration || '',
      impact: area.impact || '',
      order: area.order || 0,
      is_active: area.is_active,
      related_news_id: area.related_news_id || '',
      category_name: area.category_name || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus program TJSL ini?')) {
      return;
    }

    try {
      const response = await axiosInstance.delete(
        `/admin/wilayah-kerja/${id}? category=TJSL`
      );

      if (response.data.success) {
        toast.success('Program TJSL berhasil dihapus!');
        fetchAreas();
      }
    } catch (error) {
      console.error('❌ Error deleting TJSL area:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus program TJSL');
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
      related_news_id: '',
      category_name:  '',
    });
    setProgramInput('');
  };

  const handleCancel = () => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan?  Data yang belum disimpan akan hilang. ')) {
      setShowForm(false);
      resetForm();
    }
  };

  const stats = {
    total:  areas.length,
    aktif: areas.filter(a => a.status === 'Aktif').length,
    nonAktif: areas.filter(a => a.status === 'Non-Aktif').length,
    tampil: areas.filter(a => a.is_active).length,
  };

  return (
    <div>
      {showForm && (
        <button
          onClick={() => {
            setShowForm(false);
            resetForm();
          }}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-semibold transition-all mb-6"
        >
          <FaArrowLeft />
          Kembali
        </button>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Wilayah Kerja TJSL</h1>
          <p className="text-gray-600 mt-1">Manajemen program tanggung jawab sosial dan lingkungan</p>
        </div>
        {! showForm && (
          <div className="flex gap-3">
            {/* Tombol Kelola Kategori */}
            <button
              onClick={() => setShowCategoryModal(true)}
              className="flex items-center gap-2 bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-purple-700 transition-all transform hover:-translate-y-0.5"
            >
              <FaList />
              Kelola Kategori
            </button>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
            >
              <FaPlus />
              Tambah Program TJSL Baru
            </button>
          </div>
        )}
      </div>

      {! showForm && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaMapMarkerAlt className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.total}</div>
            <div className="text-sm text-blue-100">Total Program TJSL</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaCheck className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.aktif}</div>
            <div className="text-sm text-green-100">Program Aktif</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaTimes className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.nonAktif}</div>
            <div className="text-sm text-red-100">Non-Aktif</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.tampil}</div>
            <div className="text-sm text-purple-100">Status Tampil</div>
          </div>
        </div>
      )}

      {!showForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Pencarian & Filter</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari ID area, nama program..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target. value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target. value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target. value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus: ring-blue-500 focus: border-transparent transition-all"
            >
              <option value="">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Non-Aktif">Non-Aktif</option>
            </select>

            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target. value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus: ring-blue-500 focus: border-transparent transition-all"
            >
              <option value="">Semua Tampilan</option>
              <option value="true">Tampil di Website</option>
              <option value="false">Tidak Tampil</option>
            </select>
          </div>

          {(searchTerm || filterStatus || filterActive || filterCategory) && (
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Menampilkan <span className="font-semibold text-blue-600">{filteredAreas.length}</span> dari {areas.length} program
              </p>
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover: text-red-700 font-semibold flex items-center gap-2"
              >
                <FaTimes />
                Hapus Filter
              </button>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {editingArea ? 'Edit Program TJSL' : 'Tambah Program TJSL Baru'}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Lengkapi formulir program TJSL untuk wilayah kerja
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
            {/* Basic Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaMapMarkerAlt className="w-4 h-4 text-blue-600" />
                </div>
                Informasi Dasar
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Contoh:  KEPULAUAN_SERIBU"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nama program TJSL"
                  />
                </div>

                {/* ========== KATEGORI DROPDOWN ========== */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kategori Program <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category_name"
                    value={formData.category_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categories. map((cat, index) => (
                      <option key={index} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Kategori dapat dikelola melalui tombol "Kelola Kategori"
                  </p>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus: ring-blue-500 focus: border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus: ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
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
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="#0EA5E9"
                      pattern="^#[0-9A-Fa-f]{6}$"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Map Position Selector */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaMapMarkerAlt className="w-4 h-4 text-purple-600" />
                </div>
                Pilih Posisi pada Peta <span className="text-red-500">*</span>
              </h3>
              
              <MapClickSelector
                imageSrc={PetaImage}
                onPositionSelect={handlePositionSelect}
                initialX={formData.position_x}
                initialY={formData.position_y}
                markerColor={formData.color}
              />

              <div className="grid grid-cols-2 gap-4 mt-4">
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
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                    placeholder="Pilih pada peta"
                  />
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
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                    placeholder="Pilih pada peta"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Deskripsi Program
              </h3>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Deskripsi lengkap program TJSL..."
              />
            </div>

            {/* Program Data */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FaUsers className="w-4 h-4 text-orange-600" />
                </div>
                Data Program
              </h3>
              <div className="grid grid-cols-1 md: grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Penerima Manfaat
                  </label>
                  <input
                    type="text"
                    name="beneficiaries"
                    value={formData.beneficiaries}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    value={formData. budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Contoh:  Rp 2.8 Miliar"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus: ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus: ring-blue-500 focus: border-transparent"
                    placeholder="Contoh: Peningkatan 35% pendapatan"
                  />
                </div>
              </div>
            </div>

            {/* Programs List */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                Program & Kegiatan
              </h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={programInput}
                  onChange={(e) => setProgramInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProgram())}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nama program/kegiatan (tekan Enter)"
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

            {/* Related News */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FaNewspaper className="w-4 h-4 text-yellow-600" />
                </div>
                Berita Terkait
              </h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pilih Berita Terkait (Opsional)
                </label>
                <select
                  name="related_news_id"
                  value={formData.related_news_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border-2 border-green-200">
              <label className="flex items-start gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-6 h-6 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500 mt-1"
                />
                <div>
                  <span className="text-sm font-bold text-gray-900 block mb-1">
                    Tampilkan di Website (Status Aktif)
                  </span>
                  <span className="text-xs text-gray-600">
                    Program akan muncul di peta interaktif TJSL pada halaman publik
                  </span>
                </div>
              </label>
            </div>

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
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ?  'Menyimpan.. .' : editingArea ? 'Update Program TJSL' : 'Simpan Program TJSL'}
              </button>
            </div>
          </form>
        </div>
      )}

      {! showForm && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    ID Area & Nama
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Penerima Manfaat
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Posisi
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Aktif
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                      </div>
                      <p className="mt-4 text-gray-600">Memuat data... </p>
                    </td>
                  </tr>
                ) : filteredAreas.length === 0 ?  (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center">
                      <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <FaMapMarkerAlt className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium mb-2">
                        {searchTerm || filterStatus || filterActive || filterCategory
                          ? 'Tidak ada program yang sesuai dengan filter'
                          : 'Belum ada program TJSL'}
                      </p>
                      <p className="text-gray-400 text-sm mb-4">
                        {searchTerm || filterStatus || filterActive || filterCategory
                          ?  'Coba ubah kriteria pencarian atau filter'
                          : 'Mulai tambahkan program TJSL pertama'}
                      </p>
                      {!(searchTerm || filterStatus || filterActive || filterCategory) && (
                        <button
                          onClick={() => setShowForm(true)}
                          className="text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          Tambah Program Pertama
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredAreas.map((area) => (
                    <tr key={area.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: area.color }}
                          />
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{area. area_id}</div>
                            <div className="text-sm text-gray-500">{area.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {area.category_name ?  (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            {area.category_name}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
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
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                        <div>X:  {parseFloat(area.position_x).toFixed(2)}%</div>
                        <div>Y: {parseFloat(area.position_y).toFixed(2)}%</div>
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
                            className="text-blue-600 hover:text-blue-900 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                            title="Edit"
                          >
                            <FaEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(area. id)}
                            className="text-red-600 hover:text-red-900 transition-colors p-2 hover:bg-red-50 rounded-lg"
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

      {/* ========== MODAL KELOLA KATEGORI ========== */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10 rounded-t-2xl">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FaList className="text-purple-600" />
                Kelola Kategori TJSL
              </h3>
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  handleCancelEditCategory();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Content Modal */}
            <div className="p-6">
              {/* Input Kategori */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {editingCategory !== null ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target. value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Nama kategori (contoh: Pemberdayaan Masyarakat)"
                  />
                  {editingCategory !== null && (
                    <button
                      type="button"
                      onClick={handleCancelEditCategory}
                      className="px-4 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Batal
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover: bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <FaSave />
                    {editingCategory !== null ? 'Update' : 'Tambah'}
                  </button>
                </div>
              </div>

              {/* List Kategori */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Daftar Kategori ({categories.length})
                </h4>
                {categories.length === 0 ?  (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FaList className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Belum ada kategori</p>
                    <p className="text-gray-400 text-sm">Tambahkan kategori pertama untuk program TJSL</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {categories.map((cat, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                          editingCategory === index
                            ? 'bg-purple-50 border-purple-300'
                            : 'bg-gray-50 border-gray-200 hover:border-purple-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-purple-600 font-bold text-sm">{index + 1}</span>
                          </div>
                          <span className="font-medium text-gray-900">{cat}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditCategory(index)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FaEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <FaTrash className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Modal */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end rounded-b-2xl">
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  handleCancelEditCategory();
                }}
                className="px-6 py-2 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageWkTjsl;