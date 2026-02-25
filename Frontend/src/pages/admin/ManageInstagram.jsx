import React, { useState, useEffect } from 'react';
import { FaInstagram, FaPlus, FaEdit, FaTrash, FaEyeSlash, FaSpinner, FaCalendar, FaGlobe, FaCog, FaSave, FaArrowLeft, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';
import instagramService from '../../services/instagramService';

const ManageInstagram = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  
  // State untuk upload file
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    instagram_url: '',
    caption: '',
    image_url: '',
    media_type: 'IMAGE',
    posted_at: new Date().toISOString().split('T')[0],
    show_in_media: true,
    status: 'published',
    order: 0,
  });

  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
  });

  // Fetch posts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await instagramService.getAllPosts();
      setPosts(response.data || []);
      
      // Calculate stats
      const data = response.data || [];
      setStats({
        total: data.length,
        published: data.filter(p => p.status === 'published').length,
        draft: data.filter(p => p.status === 'draft').length,
      });
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      toast.error('Gagal memuat data Instagram posts');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle submit with FormData for file upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.instagram_url) {
      toast.error('URL Instagram wajib diisi!');
      return;
    }

    if (!editingPost && !imageFile) {
      toast.error('Thumbnail wajib diupload!');
      return;
    }

    setSubmitting(true);

    try {
      // Pakai FormData untuk upload file
      const submitData = new FormData();
      submitData.append('instagram_url', formData.instagram_url);
      submitData.append('caption', formData.caption || '');
      submitData.append('media_type', formData.media_type);
      submitData.append('posted_at', formData.posted_at);
      submitData.append('show_in_media', formData.show_in_media ? '1' : '0');
      submitData.append('status', formData.status);
      submitData.append('order', formData.order.toString());

      // Upload thumbnail
      if (imageFile) {
        submitData.append('thumbnail', imageFile);
      }

      // DEBUG: Log FormData
      console.log('📤 Submitting data:');
      for (let [key, value] of submitData.entries()) {
        if (key === 'thumbnail') {
          console.log(`  ${key}:`, value.name, `(${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`  ${key}:`, value);
        }
      }

      if (editingPost) {
        // Tambah _method untuk PUT via POST (karena Laravel)
        submitData.append('_method', 'PUT');
        console.log(`  _method: PUT (untuk update)`);
        
        await instagramService.updatePost(editingPost.id, submitData);
        toast.success('✅ Instagram post berhasil diupdate!');
      } else {
        await instagramService.createPost(submitData);
        toast.success('✅ Instagram post berhasil ditambahkan!');
      }
      
      await fetchPosts();
      resetForm();
    } catch (error) {
      console.error('❌ Error saving Instagram post:', error);
      console.error('Response data:', error.response?.data);
      
      const errorMsg = error.response?.data?.message || '❌ Gagal menyimpan Instagram post';
      const errorDetails = error.response?.data?.errors;
      
      if (errorDetails) {
        console.log('Validation errors:', errorDetails);
        const firstError = Object.values(errorDetails)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : errorMsg);
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit with file preview
  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      instagram_url: post.instagram_url,
      caption: post.caption || '',
      image_url: post.image_url || '',
      media_type: post.media_type || 'IMAGE',
      posted_at: post.posted_at ? new Date(post.posted_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      show_in_media: post.show_in_media,
      status: post.status,
      order: post.order || 0,
    });
    setImageFile(null); // Reset upload file
    setImagePreview(null); // Reset preview
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus Instagram post ini?')) return;

    try {
      await instagramService.deletePost(id);
      toast.success('✅ Instagram post berhasil dihapus!');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting Instagram post:', error);
      toast.error('❌ Gagal menghapus Instagram post');
    }
  };

  // Reset form with file states
  const resetForm = () => {
    setShowForm(false);
    setEditingPost(null);
    setImageFile(null);
    setImagePreview(null);
    setFormData({
      instagram_url: '',
      caption: '',
      image_url: '',
      media_type: 'IMAGE',
      posted_at: new Date().toISOString().split('T')[0],
      show_in_media: true,
      status: 'published',
      order: 0,
    });
  };

  // Function untuk cancel (dengan confirm dialog)
  const handleCancel = () => {
    // Cek apakah ada perubahan data
    const hasChanges = 
      formData.instagram_url !== '' ||
      formData.caption !== '' ||
      imageFile !== null;

    if (hasChanges) {
      if (window.confirm('Apakah Anda yakin ingin membatalkan? Data yang belum disimpan akan hilang.')) {
        resetForm();
      }
    } else {
      resetForm();
    }
  };

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
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-semibold transition-all mb-6"
        >
          <FaArrowLeft />
          Kembali
        </button>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instagram Posts</h1>
          <p className="text-gray-600 mt-1">Kelola konten Instagram yang tampil di Media & Informasi</p>
        </div>
        
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
          >
            <FaPlus />
            Tambah Post Instagram
          </button>
        )}
      </div>

      {/* Stats Cards */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaInstagram className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.total}</div>
            <div className="text-sm text-blue-100">Total Posts</div>
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

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaEyeSlash className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.draft}</div>
            <div className="text-sm text-orange-100">Draft</div>
          </div>
        </div>
      )}

      {/* ========== FORM INPUT INSTAGRAM POST ========== */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {editingPost ? 'Edit Instagram Post' : 'Tambah Instagram Post Baru'}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Lengkapi formulir di bawah ini untuk mengelola konten Instagram
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Section 1: Informasi Dasar */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaInstagram className="w-4 h-4 text-blue-600" />
                </div>
                Informasi Dasar
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                
                {/* 1️⃣ UPLOAD THUMBNAIL (WAJIB) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Thumbnail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // Validasi size (max 5MB)
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error('Ukuran file maksimal 5MB!');
                          e.target.value = null;
                          return;
                        }
                        
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required={!editingPost} // Wajib saat create, optional saat edit
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    📸 Screenshot atau download gambar dari Instagram post (max 5MB)
                  </p>
                  
                  {/* Preview */}
                  {(imagePreview || (editingPost && formData.image_url)) && (
                    <div className="mt-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Preview:</p>
                      <img 
                        src={imagePreview || formData.image_url} 
                        alt="Preview" 
                        className="w-40 h-40 object-cover rounded-lg border-2 border-blue-300 shadow-md"
                      />
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="mt-2 text-sm text-red-600 hover:text-red-800 font-semibold"
                        >
                          🗑️ Hapus gambar
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* 2️⃣ URL INSTAGRAM (WAJIB - untuk link "Lihat di Instagram") */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL Post Instagram <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="instagram_url"
                    value={formData.instagram_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="https://www.instagram.com/p/ABC123..."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    🔗 URL ini akan dipakai untuk tombol "Lihat di Instagram" di website
                  </p>
                </div>

                {/* 3️⃣ CAPTION (OPTIONAL - input manual) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Caption
                  </label>
                  <textarea
                    name="caption"
                    value={formData.caption}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Copy paste caption dari Instagram (optional)..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    💬 Caption akan ditampilkan di card Instagram di website
                  </p>
                </div>

                {/* 4️⃣ MEDIA TYPE & TANGGAL POST */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tipe Media
                    </label>
                    <select
                      name="media_type"
                      value={formData.media_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="IMAGE">📷 Gambar</option>
                      <option value="VIDEO">🎥 Video</option>
                      <option value="CAROUSEL_ALBUM">🖼️ Album</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <FaCalendar className="w-4 h-4 text-gray-500" />
                        Tanggal Post
                      </div>
                    </label>
                    <input
                      type="date"
                      name="posted_at"
                      value={formData.posted_at}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Pengaturan Publikasi */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FaCog className="w-4 h-4 text-orange-600" />
                </div>
                Pengaturan Publikasi
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status Publikasi <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="draft">📝 Draft (Belum Dipublikasi)</option>
                    <option value="published">✅ Published (Tampilkan di Website)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    min="0"
                    placeholder="0"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Post dengan urutan lebih kecil akan ditampilkan lebih dulu
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Distribusi Konten */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <FaGlobe className="w-4 h-4 text-indigo-600" />
                </div>
                Distribusi Konten
              </h3>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <p className="text-sm text-gray-700 mb-4 font-medium">
                  Pilih di mana Instagram post ini akan ditampilkan
                </p>
                <label className="flex items-start gap-3 cursor-pointer p-4 bg-white rounded-lg border-2 border-transparent hover:border-blue-400 transition-all">
                  <input
                    type="checkbox"
                    name="show_in_media"
                    checked={formData.show_in_media}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-900 block">📱 Media & Informasi</span>
                    <span className="text-xs text-gray-600">Tampil di halaman /media-informasi</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                disabled={submitting}
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <FaSave />
                    {editingPost ? 'Update Post' : 'Simpan Post'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========== TABLE LIST INSTAGRAM POSTS ========== */}
      {!showForm && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Preview
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Caption
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Ditampilkan Di
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4">
                      {post.image_url ? (
                        <img
                          src={post.image_url}
                          alt={post.caption}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                          <FaInstagram className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {post.caption || 'No caption'}
                      </div>
                      <a
                        href={post.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline mt-1 inline-flex items-center gap-1"
                      >
                        <FaInstagram className="w-3 h-3" />
                        Lihat di Instagram →
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(post.posted_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {post.show_in_media && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-semibold">
                          Media & Informasi
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(post)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                          title="Edit"
                        >
                          <FaEdit className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(post.id)}
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
          
          {posts.length === 0 && !loading && (
            <div className="text-center py-16 bg-gray-50">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaInstagram className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium mb-2">
                Belum ada Instagram post
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Mulai tambahkan post Instagram pertama Anda
              </p>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Tambah Post Pertama
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageInstagram;