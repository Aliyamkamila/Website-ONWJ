import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaMapMarkerAlt, FaCheck, FaOilCan, FaSearch, FaFilter, FaIndustry, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import MapClickSelector from '../../components/MapClickSelector';
import PetaImage from '../wk/Peta.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const ManageWkTekkom = () => {
  const [areas, setAreas] = useState([]);
  const [filteredAreas, setFilteredAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterActive, setFilterActive] = useState('');

  const [formData, setFormData] = useState({
    area_id:  '',
    name: '',
    position_x: '',
    position_y: '',
    color: '#EF4444',
    description: '',
    facilities: [],
    production: '',
    status: 'Operasional',
    wells: '',
    depth: '',
    pressure: '',
    temperature: '',
    order: 0,
    is_active: true,
  });

  const [facilityInput, setFacilityInput] = useState('');

  // ✅ Get Auth Token
  const getAuthToken = () => {
    return localStorage.getItem('token') || 
           sessionStorage.getItem('token') || 
           document.cookie. split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = [... areas];

    // Search
    if (searchTerm) {
      result = result.filter(item =>
        item.area_id. toLowerCase().includes(searchTerm. toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus) {
      result = result.filter(item => item.status === filterStatus);
    }

    // Filter by active
    if (filterActive === 'true') {
      result = result. filter(item => item.is_active === true);
    } else if (filterActive === 'false') {
      result = result.filter(item => item.is_active === false);
    }

    setFilteredAreas(result);
  }, [searchTerm, filterStatus, filterActive, areas]);

  // Clear Filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setFilterActive('');
  };

  // ✅ UPDATED:  Fetch TEKKOM areas
  const fetchAreas = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      
      const response = await axios.get(`${API_URL}/v1/admin/wilayah-kerja`, {
        params: {
          category: 'TEKKOM',  // ✅ Filter by TEKKOM
          per_page: 999
        },
        headers: {
          'Authorization': token ?  `Bearer ${token}` : ''
        }
      });

      if (response.data.success) {
        const data = response.data.data || [];
        setAreas(data);
        setFilteredAreas(data);
        console.log('✅ TEKKOM areas loaded:', data. length);
      }
    } catch (error) {
      console.error('❌ Error fetching TEKKOM areas:', error);
      const errorMsg = error.response?.data?.message || 'Gagal memuat data area TEKKOM';
      toast. error(errorMsg);
      
      // Check if unauthorized
      if (error.response?. status === 401) {
        toast.error('Session expired. Please login again.');
        // Redirect to login if needed
        // window.location.href = '/login';
      }
    } finally {
      setLoading(false);
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

  const addFacility = () => {
    if (facilityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        facilities: [...prev.facilities, facilityInput. trim()]
      }));
      setFacilityInput('');
    }
  };

  const removeFacility = (index) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index)
    }));
  };

  // ✅ UPDATED: Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.position_x || !formData.position_y) {
      toast.error('Silakan pilih posisi pada peta terlebih dahulu! ');
      return;
    }

    setLoading(true);

    try {
      const token = getAuthToken();
      
      if (! token) {
        toast.error('Unauthorized. Please login first.');
        return;
      }

      // ✅ Add category to formData
      const dataWithCategory = {
        ...formData,
        category: 'TEKKOM'
      };

      const endpoint = editingArea
        ? `${API_URL}/v1/admin/wilayah-kerja/${editingArea. id}? category=TEKKOM`
        : `${API_URL}/v1/admin/wilayah-kerja`;

      const method = editingArea ? 'put' : 'post';

      const response = await axios[method](endpoint, dataWithCategory, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data. success) {
        toast.success(editingArea ? 'Area TEKKOM berhasil diperbarui!' : 'Area TEKKOM berhasil ditambahkan!');
        setShowForm(false);
        resetForm();
        fetchAreas();
      }
    } catch (error) {
      console.error('❌ Error saving TEKKOM area:', error);
      const errorMessage = error.response?.data?.message || 'Gagal menyimpan data area TEKKOM';
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

  // ✅ UPDATED: Handle Edit
  const handleEdit = (area) => {
    setEditingArea(area);
    setFormData({
      area_id: area. area_id,
      name: area.name,
      position_x: parseFloat(area.position_x),
      position_y: parseFloat(area.position_y),
      color: area.color,
      description: area.description,
      facilities: area.facilities || [],
      production: area.production || '',
      status: area.status,
      wells: area.wells || '',
      depth: area.depth || '',
      pressure: area. pressure || '',
      temperature: area.temperature || '',
      order: area.order || 0,
      is_active: area.is_active,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ UPDATED: Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus area TEKKOM ini?')) {
      return;
    }

    try {
      const token = getAuthToken();
      
      if (! token) {
        toast.error('Unauthorized. Please login first.');
        return;
      }

      const response = await axios.delete(
        `${API_URL}/v1/admin/wilayah-kerja/${id}? category=TEKKOM`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Area TEKKOM berhasil dihapus!');
        fetchAreas();
      }
    } catch (error) {
      console.error('❌ Error deleting TEKKOM area:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus area TEKKOM');
    }
  };

  const resetForm = () => {
    setEditingArea(null);
    setFormData({
      area_id: '',
      name: '',
      position_x: '',
      position_y: '',
      color: '#EF4444',
      description: '',
      facilities:  [],
      production: '',
      status: 'Operasional',
      wells: '',
      depth: '',
      pressure: '',
      temperature: '',
      order: 0,
      is_active: true,
    });
    setFacilityInput('');
  };

  const handleCancel = () => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan?  Data yang belum disimpan akan hilang.')) {
      setShowForm(false);
      resetForm();
    }
  };

  // Stats Calculation
  const stats = {
    total:  areas.length,
    operasional: areas.filter(a => a.status === 'Operasional').length,
    nonOperasional: areas.filter(a => a.status === 'Non-Operasional').length,
    aktif: areas.filter(a => a.is_active).length,
  };

  return (
    <div>
      {/* Tombol Kembali - Hanya Muncul di Page Input */}
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

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Wilayah Kerja TEKKOM</h1>
          <p className="text-gray-600 mt-1">Manajemen area pengeboran dan produksi hidrokarbon</p>
        </div>
        {! showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
          >
            <FaPlus />
            Tambah Area TEKKOM
          </button>
        )}
      </div>

      {/* Stats Cards */}
      {! showForm && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaOilCan className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.total}</div>
            <div className="text-sm text-blue-100">Total Area TEKKOM</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaCheck className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.operasional}</div>
            <div className="text-sm text-green-100">Operasional</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaTimes className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.nonOperasional}</div>
            <div className="text-sm text-red-100">Non-Operasional</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaIndustry className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.aktif}</div>
            <div className="text-sm text-orange-100">Status Aktif</div>
          </div>
        </div>
      )}

      {/* Search & Filter Section */}
      {! showForm && (
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
                placeholder="Cari ID area, nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Semua Status</option>
              <option value="Operasional">Operasional</option>
              <option value="Non-Operasional">Non-Operasional</option>
            </select>

            {/* Filter Active */}
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Semua Tampilan</option>
              <option value="true">Tampil di Website</option>
              <option value="false">Tidak Tampil</option>
            </select>
          </div>

          {/* Clear Filter & Result Counter */}
          {(searchTerm || filterStatus || filterActive) && (
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Menampilkan <span className="font-semibold text-blue-600">{filteredAreas.length}</span> dari {areas.length} area
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

      {/* Form Input */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 animate-fade-in">
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {editingArea ? 'Edit Area TEKKOM' : 'Tambah Area TEKKOM'}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Lengkapi formulir area pengeboran dan produksi
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
            {/* Section 1: Basic Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaOilCan className="w-4 h-4 text-blue-600" />
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Contoh:  BRAVO, UNIFORM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Area <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nama area pengeboran"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData. status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="Operasional">Operasional</option>
                    <option value="Non-Operasional">Non-Operasional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Urutan Tampilan
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData. order}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="#EF4444"
                      pattern="^#[0-9A-Fa-f]{6}$"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Map Click Position Selector */}
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

              {/* Display Coordinates */}
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

            {/* Section 3: Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Deskripsi Area
              </h3>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Deskripsi lengkap area pengeboran..."
              />
            </div>

            {/* Section 4: Technical Data */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FaIndustry className="w-4 h-4 text-orange-600" />
                </div>
                Data Teknis
              </h3>
              <div className="grid grid-cols-1 md: grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Produksi
                  </label>
                  <input
                    type="text"
                    name="production"
                    value={formData. production}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Contoh: 5,200 BOPD"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jumlah Sumur
                  </label>
                  <input
                    type="number"
                    name="wells"
                    value={formData.wells}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="12"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kedalaman
                  </label>
                  <input
                    type="text"
                    name="depth"
                    value={formData. depth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Contoh: 3,450 m"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tekanan
                  </label>
                  <input
                    type="text"
                    name="pressure"
                    value={formData. pressure}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Contoh: 2,850 psi"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Temperatur
                  </label>
                  <input
                    type="text"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Contoh: 85°C"
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Facilities */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                Fasilitas & Infrastruktur
              </h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={facilityInput}
                  onChange={(e) => setFacilityInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFacility())}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus: ring-blue-500 focus: border-transparent transition-all"
                  placeholder="Nama fasilitas (tekan Enter)"
                />
                <button
                  type="button"
                  onClick={addFacility}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  + Tambah
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm flex items-center gap-2 font-medium"
                  >
                    {facility}
                    <button
                      type="button"
                      onClick={() => removeFacility(index)}
                      className="text-blue-600 hover:text-blue-900 font-bold"
                    >
                      ✕
                    </button>
                  </span>
                ))}
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
                    Status Aktif (Tampil di Website)
                  </span>
                  <span className="text-xs text-gray-600">
                    Area akan muncul di peta interaktif TEKKOM pada halaman publik
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
                {loading ?  'Menyimpan.. .' : editingArea ? 'Update Area TEKKOM' : 'Simpan Area TEKKOM'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table List */}
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
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Produksi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Sumur
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
                      <p className="mt-4 text-gray-600">Memuat data...</p>
                    </td>
                  </tr>
                ) : filteredAreas.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center">
                      <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <FaOilCan className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium mb-2">
                        {searchTerm || filterStatus || filterActive
                          ? 'Tidak ada area yang sesuai dengan filter'
                          : 'Belum ada area TEKKOM'}
                      </p>
                      <p className="text-gray-400 text-sm mb-4">
                        {searchTerm || filterStatus || filterActive
                          ? 'Coba ubah kriteria pencarian atau filter'
                          : 'Mulai tambahkan area TEKKOM pertama'}
                      </p>
                      {!(searchTerm || filterStatus || filterActive) && (
                        <button
                          onClick={() => setShowForm(true)}
                          className="text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          Tambah Area Pertama
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
                            style={{ backgroundColor:  area.color }}
                          />
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{area. area_id}</div>
                            <div className="text-sm text-gray-500">{area.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          area.status === 'Operasional'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {area.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                        {area.production || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {area.wells || '-'}
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
    </div>
  );
};

export default ManageWkTekkom;