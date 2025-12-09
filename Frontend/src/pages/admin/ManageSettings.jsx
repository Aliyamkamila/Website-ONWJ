import React, { useState, useEffect } from 'react';
import { FaSave, FaUndo, FaImage, FaTimes, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import settingService from '../../services/settingService';

const ManageSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('company');

  // Image upload states
  const [uploadingImages, setUploadingImages] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});

  const categories = [
    { id: 'company', label: 'Informasi Perusahaan' },
    { id: 'social_media', label: 'Media Sosial' },
    { id: 'contact', label: 'Kontak' },
    { id: 'operating_hours', label: 'Jam Operasional' },
    { id: 'seo', label: 'SEO Settings' },
    { id: 'footer', label: 'Footer' },
    { id: 'logo', label: 'Logo & Favicon' },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingService.admin.getAll();

      if (response.data.success) {
        // Convert grouped settings to flat object
        const flatSettings = {};
        Object.values(response.data.data).forEach(categorySettings => {
          categorySettings. forEach(setting => {
            flatSettings[setting.key] = setting. value || '';
          });
        });
        setSettings(flatSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Gagal memuat pengaturan');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await settingService.admin.update(settings);

      if (response.data.success) {
        toast.success('Pengaturan berhasil disimpan! ');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (key, file) => {
    if (!file) return;

    // Validate file
    if (! file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB');
      return;
    }

    setUploadingImages(prev => ({ ...prev, [key]: true }));

    try {
      const response = await settingService.admin. uploadImage(key, file);

      if (response.data.success) {
        toast.success('Gambar berhasil diupload! ');
        
        // Update settings with new path
        setSettings(prev => ({
          ... prev,
          [key]: response.data.data.path
        }));

        // Update preview
        setImagePreviews(prev => ({
          ...prev,
          [key]: response.data.data.url
        }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Gagal upload gambar');
    } finally {
      setUploadingImages(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleImageDelete = async (key) => {
    if (! window.confirm('Apakah Anda yakin ingin menghapus gambar ini?')) {
      return;
    }

    try {
      const response = await settingService. admin.deleteImage(key);

      if (response.data.success) {
        toast.success('Gambar berhasil dihapus!');
        
        setSettings(prev => ({
          ... prev,
          [key]: ''
        }));

        setImagePreviews(prev => ({
          ...prev,
          [key]: null
        }));
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Gagal menghapus gambar');
    }
  };

  const handleReset = async () => {
    if (! window.confirm('Apakah Anda yakin ingin mereset semua pengaturan ke default?  Tindakan ini tidak dapat dibatalkan.')) {
      return;
    }

    try {
      const response = await settingService. admin.reset();

      if (response.data.success) {
        toast.success('Pengaturan berhasil direset! ');
        fetchSettings();
      }
    } catch (error) {
      console.error('Error resetting settings:', error);
      toast.error('Gagal mereset pengaturan');
    }
  };

  const renderField = (key, label, type = 'text', description = '') => {
    if (type === 'image') {
      const imageUrl = imagePreviews[key] || (settings[key] ?  `http://localhost:8000/storage/${settings[key]}` : null);

      return (
        <div key={key} className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
          </label>
          {description && (
            <p className="text-sm text-gray-500 mb-2">{description}</p>
          )}

          <div className="flex items-start gap-4">
            {/* Preview */}
            {imageUrl && (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={label}
                  className="w-32 h-32 object-contain border border-gray-300 rounded-lg bg-gray-50"
                />
                <button
                  onClick={() => handleImageDelete(key)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  title="Hapus gambar"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex-1">
              <input
                type="file"
                id={`upload-${key}`}
                accept="image/*"
                onChange={(e) => handleImageUpload(key, e.target.files[0])}
                className="hidden"
              />
              <label
                htmlFor={`upload-${key}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <FaImage />
                {uploadingImages[key] ? 'Uploading...' : imageUrl ? 'Ganti Gambar' : 'Upload Gambar'}
              </label>
              {uploadingImages[key] && (
                <div className="mt-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (type === 'textarea') {
      return (
        <div key={key} className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
          </label>
          {description && (
            <p className="text-sm text-gray-500 mb-2">{description}</p>
          )}
          <textarea
            value={settings[key] || ''}
            onChange={(e) => handleInputChange(key, e.target.value)}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={label}
          />
        </div>
      );
    }

    return (
      <div key={key} className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
        {description && (
          <p className="text-sm text-gray-500 mb-2">{description}</p>
        )}
        <input
          type={type}
          value={settings[key] || ''}
          onChange={(e) => handleInputChange(key, e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={label}
        />
      </div>
    );
  };

  const renderCategoryContent = () => {
    switch (activeTab) {
      case 'company':
        return (
          <>
            {renderField('company_name', 'Nama Perusahaan', 'text', 'Nama resmi perusahaan')}
            {renderField('company_address', 'Alamat Kantor', 'textarea', 'Alamat lengkap kantor pusat')}
            {renderField('company_phone', 'Telepon', 'tel', 'Nomor telepon kantor')}
            {renderField('company_email', 'Email', 'email', 'Email resmi perusahaan')}
            {renderField('company_fax', 'Fax', 'tel', 'Nomor fax kantor')}
          </>
        );

      case 'social_media': 
        return (
          <>
            {renderField('social_facebook', 'Facebook', 'url', 'URL halaman Facebook')}
            {renderField('social_instagram', 'Instagram', 'url', 'URL profil Instagram')}
            {renderField('social_twitter', 'Twitter/X', 'url', 'URL profil Twitter/X')}
            {renderField('social_linkedin', 'LinkedIn', 'url', 'URL halaman LinkedIn')}
            {renderField('social_youtube', 'YouTube', 'url', 'URL channel YouTube')}
          </>
        );

      case 'contact':
        return (
          <>
            {renderField('contact_email', 'Email Customer Service', 'email', 'Email untuk pertanyaan umum')}
            {renderField('contact_phone', 'Telepon Hotline', 'tel', 'Nomor telepon layanan pelanggan')}
            {renderField('contact_whatsapp', 'WhatsApp', 'tel', 'Nomor WhatsApp (format: 62xxx)')}
          </>
        );

      case 'operating_hours':
        return (
          <>
            {renderField('hours_weekday', 'Jam Kerja (Hari Kerja)', 'text', 'Jam operasional hari Senin-Jumat')}
            {renderField('hours_weekend', 'Jam Kerja (Akhir Pekan)', 'text', 'Jam operasional hari Sabtu-Minggu')}
          </>
        );

      case 'seo':
        return (
          <>
            {renderField('seo_meta_title', 'Meta Title', 'text', 'Judul SEO untuk search engine')}
            {renderField('seo_meta_description', 'Meta Description', 'textarea', 'Deskripsi SEO untuk search engine')}
            {renderField('seo_meta_keywords', 'Meta Keywords', 'textarea', 'Keywords SEO (pisahkan dengan koma)')}
          </>
        );

      case 'footer':
        return (
          <>
            {renderField('footer_about_text', 'About Text (Footer)', 'textarea', 'Teks deskripsi singkat di footer')}
            {renderField('footer_copyright', 'Copyright Text', 'text', 'Teks copyright di footer')}
          </>
        );

      case 'logo':
        return (
          <>
            {renderField('logo_main', 'Logo Utama', 'image', 'Logo untuk header (PNG/SVG, max 2MB)')}
            {renderField('logo_footer', 'Logo Footer', 'image', 'Logo untuk footer (PNG/SVG, max 2MB)')}
            {renderField('logo_favicon', 'Favicon', 'image', 'Icon browser tab (ICO/PNG, 32x32px)')}
          </>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan Website</h1>
          <p className="text-gray-600 mt-1">Kelola informasi umum, kontak, dan tampilan website</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            <FaUndo />
            Reset Default
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ?  (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <FaSave />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeTab === category. id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {category.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-8">
          {renderCategoryContent()}
        </div>
      </div>
    </div>
  );
};

export default ManageSettings;