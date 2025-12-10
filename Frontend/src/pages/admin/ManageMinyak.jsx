import { useState, useEffect } from 'react';
import { hargaMinyakService } from '../../services/HargaMinyakService';
import toast from 'react-hot-toast';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes, 
  FaSpinner,
  FaSearch,
  FaFileImport,
  FaChartLine,
  FaCalendarAlt,
  FaCheck,
  FaDownload,
  FaUpload
} from 'react-icons/fa';
import * as XLSX from 'xlsx';

const OIL_TYPES = [
  { key: 'brent', label: 'Brent Crude', color: '#3b82f6' },
  { key: 'duri', label: 'Duri Crude', color: '#f59e0b' },
  { key: 'arjuna', label: 'Arjuna Crude', color: '#10b981' },
  { key: 'kresna', label: 'Kresna Crude', color: '#8b5cf6' },
  { key: 'icp', label: 'ICP', color: '#ec4899' },
];

const PERIODE_OPTIONS = [
  { value: 'day', label: 'Harian' },
  { value: 'week', label: 'Mingguan' },
  { value: 'month', label: 'Bulanan' },
  { value: 'year', label: 'Tahunan' },
];

const ManageMinyak = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriode, setFilterPeriode] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1,
  });
  
  const [formData, setFormData] = useState({
    tanggal: '',
    brent: '',
    duri:  '',
    arjuna: '',
    kresna: '',
    icp: '',
    periode: 'day',
  });

  const [errors, setErrors] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch all data with pagination
  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        per_page: pagination.per_page,
        search: searchTerm || undefined,
        periode: filterPeriode || undefined,
        sort_by: 'tanggal',
        sort_order: 'desc',
      };

      const response = await hargaMinyakService.admin.getAll(params);
      
      if (response.data.success) {
        setData(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, [filterPeriode]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== undefined) {
        fetchData(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.tanggal) {
      newErrors.tanggal = 'Tanggal harus diisi';
    }
    
    OIL_TYPES.forEach(oil => {
      if (!formData[oil.key] || formData[oil.key] <= 0) {
        newErrors[oil.key] = `Harga ${oil.label} harus diisi dan lebih dari 0`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        await hargaMinyakService.admin.update(editingId, formData);
        toast.success('Data berhasil diperbarui');
      } else {
        await hargaMinyakService.admin.create(formData);
        toast.success('Data berhasil ditambahkan');
      }
      
      closeModal();
      fetchData(pagination.current_page);
    } catch (error) {
      console.error('Error saving data:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || 'Gagal menyimpan data');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      return;
    }

    setLoading(true);

    try {
      await hargaMinyakService.admin.delete(id);
      toast.success('Data berhasil dihapus');
      fetchData(pagination.current_page);
    } catch (error) {
      console.error('Error deleting data:', error);
      toast.error('Gagal menghapus data');
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error('Pilih data yang ingin dihapus');
      return;
    }

    if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} data?`)) {
      return;
    }

    setLoading(true);

    try {
      await hargaMinyakService.admin.bulkDelete(selectedIds);
      toast.success(`${selectedIds.length} data berhasil dihapus`);
      setSelectedIds([]);
      fetchData(pagination.current_page);
    } catch (error) {
      console.error('Error bulk deleting:', error);
      toast.error('Gagal menghapus data');
    } finally {
      setLoading(false);
    }
  };

  // Toggle select
  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map(item => item.id));
    }
  };

  // Open modal for create
  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      tanggal: '',
      brent: '',
      duri: '',
      arjuna: '',
      kresna: '',
      icp: '',
      periode: 'day',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  // Open modal for edit
  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      tanggal: item.tanggal,
      brent: item.brent,
      duri: item.duri,
      arjuna: item.arjuna,
      kresna: item.kresna,
      icp: item.icp,
      periode: item.periode,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      tanggal: '',
      brent: '',
      duri: '',
      arjuna: '',
      kresna: '',
      icp: '',
      periode: 'day',
    });
    setErrors({});
  };

  // Export to Excel
  const handleExport = () => {
    const exportData = data.map(item => ({
      'Tanggal': item.tanggal,
      'Periode':  PERIODE_OPTIONS.find(p => p.value === item.periode)?.label || item.periode,
      'Brent Crude': item.brent,
      'Duri Crude':  item.duri,
      'Arjuna Crude': item.arjuna,
      'Kresna Crude': item.kresna,
      'ICP': item.icp,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Harga Minyak');
    
    // Auto column width
    const maxWidth = exportData.reduce((w, r) => Math.max(w, Object.keys(r).length), 10);
    ws['!cols'] = Array(maxWidth).fill({ wch: 15 });

    XLSX.writeFile(wb, `harga-minyak-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Data berhasil diekspor');
  };

  // Import from Excel
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (! file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Transform data
        const importData = jsonData.map(row => ({
          tanggal:  row['Tanggal'],
          brent: parseFloat(row['Brent Crude']),
          duri: parseFloat(row['Duri Crude']),
          arjuna: parseFloat(row['Arjuna Crude']),
          kresna: parseFloat(row['Kresna Crude']),
          icp: parseFloat(row['ICP']),
          periode:  PERIODE_OPTIONS.find(p => p.label === row['Periode'])?.value || 'day',
        }));

        setLoading(true);
        const response = await hargaMinyakService.admin.bulkStore({ data: importData });
        
        if (response.data.success) {
          toast.success(response.data.message);
          fetchData(1);
        }
      } catch (error) {
        console.error('Error importing:', error);
        toast.error('Gagal mengimpor data');
      } finally {
        setLoading(false);
        e.target.value = '';
      }
    };

    reader.readAsBinaryString(file);
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchData(page);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <FaChartLine className="text-white w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage Data Harga Minyak</h1>
                <p className="text-gray-600 mt-1">Kelola data harga minyak dunia</p>
              </div>
            </div>
            
            <div className="flex gap-3 flex-wrap">
              <label className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg cursor-pointer">
                <FaUpload className="w-4 h-4" />
                <span>Import Excel</span>
                <input 
                  type="file" 
                  accept=".xlsx,.xls" 
                  onChange={handleImport}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleExport}
                className="px-4 py-3 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <FaDownload className="w-4 h-4" />
                <span>Export Excel</span>
              </button>

              <button
                onClick={openCreateModal}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <FaPlus className="w-4 h-4" />
                <span>Tambah Data</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md: grid-cols-2 gap-4 mt-6">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan tanggal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <select
              value={filterPeriode}
              onChange={(e) => setFilterPeriode(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">Semua Periode</option>
              {PERIODE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200">
              <p className="text-sm text-blue-600 font-semibold mb-1">Total Data</p>
              <p className="text-2xl font-bold text-blue-900">{pagination.total}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border-2 border-emerald-200">
              <p className="text-sm text-emerald-600 font-semibold mb-1">Halaman</p>
              <p className="text-2xl font-bold text-emerald-900">{pagination.current_page} / {pagination.last_page}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border-2 border-amber-200">
              <p className="text-sm text-amber-600 font-semibold mb-1">Periode</p>
              <p className="text-2xl font-bold text-amber-900">{filterPeriode || 'Semua'}</p>
            </div>
            <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-4 rounded-xl border-2 border-violet-200">
              <p className="text-sm text-violet-600 font-semibold mb-1">Terpilih</p>
              <p className="text-2xl font-bold text-violet-900">{selectedIds.length}</p>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center justify-between">
              <p className="text-red-900 font-semibold">
                {selectedIds.length} data terpilih
              </p>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <FaTrash className="w-4 h-4" />
                <span>Hapus Terpilih</span>
              </button>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak Ada Data</h3>
              <p className="text-gray-600 mb-6">Belum ada data harga minyak yang tersedia</p>
              <button
                onClick={openCreateModal}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2"
              >
                <FaPlus className="w-4 h-4" />
                <span>Tambah Data Pertama</span>
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedIds.length === data.length && data.length > 0}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Periode
                      </th>
                      {OIL_TYPES.map(oil => (
                        <th key={oil.key} className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                          {oil.label}
                        </th>
                      ))}
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.map((item, index) => (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(item.id)}
                            onChange={() => toggleSelect(item.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-400 w-4 h-4" />
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{item.tanggal}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            item.periode === 'day' ? 'bg-blue-100 text-blue-700' : 
                            item.periode === 'week' ? 'bg-emerald-100 text-emerald-700' : 
                            item.periode === 'month' ?  'bg-amber-100 text-amber-700' :
                            'bg-violet-100 text-violet-700'
                          }`}>
                            {PERIODE_OPTIONS.find(p => p.value === item.periode)?.label || item.periode}
                          </span>
                        </td>
                        {OIL_TYPES.map(oil => (
                          <td key={oil.key} className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-sm font-bold" style={{ color: oil.color }}>
                              ${parseFloat(item[oil.key]).toFixed(2)}
                            </span>
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                              title="Edit"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                              title="Hapus"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Menampilkan {pagination.from} - {pagination.to} dari {pagination.total} data
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                      let pageNum;
                      if (pagination.last_page <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.current_page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.current_page >= pagination.last_page - 2) {
                        pageNum = pagination.last_page - 4 + i;
                      } else {
                        pageNum = pagination.current_page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            pagination.current_page === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                    className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {editingId ? <FaEdit className="text-blue-600 w-5 h-5" /> : <FaPlus className="text-blue-600 w-5 h-5" />}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingId ? 'Edit Data Harga Minyak' :  'Tambah Data Harga Minyak'}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md: grid-cols-2 gap-6">
                {/* Tanggal */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus: ring-blue-500 transition-all ${
                      errors.tanggal ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                    }`}
                  />
                  {errors.tanggal && (
                    <p className="mt-1 text-sm text-red-600">{errors.tanggal}</p>
                  )}
                </div>

                {/* Periode */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Periode <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="periode"
                    value={formData.periode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus: ring-blue-500 focus: border-blue-500 transition-all"
                  >
                    {PERIODE_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Oil Prices */}
                {OIL_TYPES.map(oil => (
                  <div key={oil.key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Harga {oil.label} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">$</span>
                      <input
                        type="number"
                        name={oil.key}
                        value={formData[oil.key]}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        max="9999.99"
                        placeholder="0.00"
                        className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus: ring-blue-500 transition-all ${
                          errors[oil.key] ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus: border-blue-500'
                        }`}
                      />
                    </div>
                    {errors[oil.key] && (
                      <p className="mt-1 text-sm text-red-600">{errors[oil.key]}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Preview Card */}
              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📊</span> Preview Data
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Tanggal</p>
                    <p className="font-bold text-gray-900">{formData.tanggal || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Periode</p>
                    <p className="font-bold text-gray-900">
                      {PERIODE_OPTIONS.find(p => p.value === formData.periode)?.label || '-'}
                    </p>
                  </div>
                  {OIL_TYPES.map(oil => (
                    <div key={oil.key}>
                      <p className="text-xs text-gray-600 mb-1">{oil.label}</p>
                      <p className="font-bold" style={{ color: oil.color }}>
                        ${formData[oil.key] ?  parseFloat(formData[oil.key]).toFixed(2) : '0.00'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <FaSave className="w-4 h-4" />
                      <span>{editingId ? 'Update Data' : 'Simpan Data'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform:  translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default ManageMinyak;