import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaImage, FaTimes, FaNewspaper, FaCalendar, FaUser, FaEye, FaSave, FaCheck, FaSearch, FaFilter, FaArrowLeft, FaFileExcel, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { beritaAdminApi } from '../../services/BeritaService';
import toast from 'react-hot-toast';

const ManageBerita = () => {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    // State untuk data dari API
    const [beritaList, setBeritaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filteredBerita, setFilteredBerita] = useState([]);
    
    const [stats, setStats] = useState({
        total: 0,
        published: 0,
        tjsl: 0,
        pinned: 0,
    });
    
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
        'Pendidikan',
        'Kegiatan Internal'
    ];

    // ===== FETCH DATA FROM API =====
    useEffect(() => {
        fetchBerita();
        fetchStatistics();
    }, []);

    const fetchBerita = async () => {
        try {
            setLoading(true);
            const response = await beritaAdminApi.getAll({
                per_page: 999,
                sort_by: 'created_at',
                sort_order: 'desc'
            });
            
            if (response.data.success) {
                setBeritaList(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching berita:', error);
            toast.error('Gagal memuat data berita');
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await beritaAdminApi.getStatistics();
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    // ===== FILTERING =====
    useEffect(() => {
        let result = [... beritaList];

        if (searchTerm) {
            result = result.filter(item =>
                item.title.toLowerCase(). includes(searchTerm.toLowerCase()) ||
                (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterCategory) {
            result = result.filter(item => item.category === filterCategory);
        }

        if (filterStatus) {
            result = result.filter(item => item.status. toLowerCase() === filterStatus.toLowerCase());
        }

        setFilteredBerita(result);
    }, [searchTerm, filterCategory, filterStatus, beritaList]);

    const clearFilters = () => {
        setSearchTerm('');
        setFilterCategory('');
        setFilterStatus('');
    };

    // ===== EXPORT TO EXCEL =====
    const exportToExcel = () => {
        try {
            if (filteredBerita.length === 0) {
                toast.error('⚠️ Tidak ada data untuk diexport! ');
                return;
            }

            const exportData = filteredBerita.map((item, index) => ({
                'No': index + 1,
                'Judul': item.title || '-',
                'Kategori': item.category || '-',
                'Tanggal': item.date ? new Date(item.date). toLocaleDateString('id-ID') : '-',
                'Penulis': item.author || '-',
                'Status': item.status || '-',
                'Tampil di TJSL': item.show_in_tjsl ? 'Ya' : 'Tidak',
                'Tampil di Media Informasi': item.show_in_media_informasi ? 'Ya' : 'Tidak',
                'Tampil di Dashboard': item.show_in_dashboard ? 'Ya' : 'Tidak',
                'Pinned ke Homepage': item.pin_to_homepage ? 'Ya' : 'Tidak',
            }));

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(exportData);

            ws['!cols'] = [
                { wch: 5 }, { wch: 50 }, { wch: 15 }, { wch: 20 },
                { wch: 20 }, { wch: 12 }, { wch: 18 }, { wch: 25 },
                { wch: 20 }, { wch: 22 }
            ];

            XLSX. utils.book_append_sheet(wb, ws, 'Data Berita');

            const timestamp = new Date().toISOString().slice(0, 10);
            const filename = `Data_Berita_MHJ_ONWJ_${timestamp}.xlsx`;

            XLSX.writeFile(wb, filename);

            toast.success(`✅ Data berhasil diexport!\n\nTotal: ${filteredBerita.length} berita`);

        } catch (error) {
            console.error('❌ Error exporting to Excel:', error);
            toast. error('❌ Gagal export ke Excel! ');
        }
    };

    // ===== FORM HANDLERS =====
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
                toast.error('Ukuran file terlalu besar!  Maksimal 5MB');
                return;
            }
            
            setFormData(prev => ({
                ...prev,
                image: file,
                imagePreview: URL. createObjectURL(file)
            }));
        }
    };

    const removeImage = () => {
        if (formData.imagePreview) {
            URL. revokeObjectURL(formData.imagePreview);
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

    // ===== SUBMIT FORM (CREATE/UPDATE) =====
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.date || !formData.category || !formData. content) {
            toast.error('Mohon lengkapi semua field yang wajib diisi!');
            return;
        }

        if (! formData.image && !editingId) {
            toast. error('Mohon upload foto berita! ');
            return;
        }

        try {
            setSubmitting(true);

            // Prepare FormData
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('date', formData. date);
            submitData.append('category', formData.category);
            submitData.append('author', formData.author || '');
            submitData.append('short_description', formData.shortDescription || '');
            submitData. append('content', formData.content);
            submitData.append('status', formData.status);
            submitData.append('display_option', formData.displayOption || '');
            submitData.append('auto_link', formData. autoLink || 'none');
            submitData.append('show_in_tjsl', formData. showInTJSL ? '1' : '0');
            submitData.append('show_in_media_informasi', formData.showInMediaInformasi ?  '1' : '0');
            submitData.append('show_in_dashboard', formData.showInDashboard ? '1' : '0');
            submitData.append('pin_to_homepage', formData.pinToHomepage ? '1' : '0');

            if (formData.image) {
                submitData.append('image', formData.image);
            }

            let response;
            if (editingId) {
                response = await beritaAdminApi.update(editingId, submitData);
                toast.success('✅ Berita berhasil diupdate!');
            } else {
                response = await beritaAdminApi.create(submitData);
                toast.success('✅ Berita berhasil ditambahkan!');
            }

            // Refresh data
            await fetchBerita();
            await fetchStatistics();

            setShowForm(false);
            resetForm();

        } catch (error) {
            console.error('Error submitting berita:', error);
            const errorMsg = error.response?.data?.message || 'Gagal menyimpan berita';
            toast.error(`❌ ${errorMsg}`);
        } finally {
            setSubmitting(false);
        }
    };

    // ===== EDIT =====
    const handleEdit = (id) => {
        const berita = beritaList. find(b => b.id === id);
        if (berita) {
            setFormData({
                title: berita.title,
                date: berita.date,
                category: berita.category,
                author: berita.author || '',
                image: null,
                imagePreview: berita.full_image_url || null,
                shortDescription: berita.short_description || '',
                content: berita.content || '',
                status: berita. status,
                displayOption: berita.display_option || '',
                autoLink: berita.auto_link || 'none',
                showInTJSL: berita.show_in_tjsl,
                showInMediaInformasi: berita. show_in_media_informasi,
                showInDashboard: berita.show_in_dashboard,
                pinToHomepage: berita.pin_to_homepage
            });
            setEditingId(id);
            setShowForm(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // ===== DELETE =====
    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
            try {
                await beritaAdminApi.delete(id);
                toast.success('✅ Berita berhasil dihapus!');
                
                // Refresh data
                await fetchBerita();
                await fetchStatistics();
            } catch (error) {
                console.error('Error deleting berita:', error);
                toast.error('❌ Gagal menghapus berita!');
            }
        }
    };

    const handleCancel = () => {
        if (window.confirm('Apakah Anda yakin ingin membatalkan?  Data yang belum disimpan akan hilang.')) {
            setShowForm(false);
            resetForm();
        }
    };

    const handlePreview = () => {
        if (! formData.title || !formData.content) {
            toast.error('Mohon isi minimal judul dan konten untuk preview!');
            return;
        }
        toast.info('Preview feature coming soon!');
    };

    // ===== RENDER =====
    if (loading && !showForm) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <FaSpinner className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div>
            {/* Tombol Kembali */}
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
                    <h1 className="text-3xl font-bold text-gray-900">Kelola Berita</h1>
                    <p className="text-gray-600 mt-1">Manajemen berita dan artikel perusahaan</p>
                </div>
                
                {! showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
                    >
                        <FaPlus />
                        Tambah Berita Baru
                    </button>
                )}
            </div>

            {/* Stats Cards */}
            {! showForm && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                <FaNewspaper className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.total}</div>
                        <div className="text-sm text-blue-100">Total Berita</div>
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

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                <FaNewspaper className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.tjsl}</div>
                        <div className="text-sm text-purple-100">Berita TJSL</div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                <FaNewspaper className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.pinned}</div>
                        <div className="text-sm text-orange-100">Pinned</div>
                    </div>
                </div>
            )}

            {/* Search & Filter + Export Button */}
            {!showForm && (
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <FaFilter className="text-gray-500" />
                            <h3 className="text-lg font-semibold text-gray-900">Pencarian & Filter</h3>
                        </div>

                        <button
                            onClick={exportToExcel}
                            className="flex items-center gap-2 px-5 py-2. 5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0. 5"
                        >
                            <FaFileExcel className="w-5 h-5" />
                            Export ke Excel
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari judul, penulis, kategori..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">Semua Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>

                    {(searchTerm || filterCategory || filterStatus) && (
                        <div className="mt-4 flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                                Menampilkan <span className="font-semibold text-blue-600">{filteredBerita.length}</span> dari {beritaList.length} berita
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

            {/* Form atau Table - sisa code sama seperti sebelumnya, hanya ganti dummyBerita dengan filteredBerita */}
            
            {! showForm && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            {/* ...  table header sama ...  */}
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredBerita.map((item) => (
                                    <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-gray-900 line-clamp-2">{item.title}</div>
                                            <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                <FaUser className="w-3 h-3" />
                                                {item.author || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {item. category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                            {item.formatted_date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                item.status === 'published' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {item.status === 'published' ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {item.show_in_tjsl && (
                                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-md font-semibold">
                                                        TJSL
                                                    </span>
                                                )}
                                                {item.show_in_media_informasi && (
                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-semibold">
                                                        Media
                                                    </span>
                                                )}
                                                {item.show_in_dashboard && (
                                                    <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-md font-semibold">
                                                        Dashboard
                                                    </span>
                                                )}
                                                {item.pin_to_homepage && (
                                                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-md font-semibold">
                                                        PINNED
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleEdit(item.id)}
                                                    className="text-blue-600 hover:text-blue-900 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <FaEdit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item. id)}
                                                    className="text-red-600 hover:text-red-900 transition-colors p-2 hover:bg-red-50 rounded-lg"
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
                    
                    {filteredBerita.length === 0 && (
                        <div className="text-center py-16 bg-gray-50">
                            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <FaNewspaper className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-lg font-medium mb-2">
                                {searchTerm || filterCategory || filterStatus
                                    ? 'Tidak ada berita yang sesuai dengan filter'
                                    : 'Belum ada berita'}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* FORM - Sisa form sama persis seperti code sebelumnya, hanya submit handler yang berubah */}
        </div>
    );
};

export default ManageBerita;