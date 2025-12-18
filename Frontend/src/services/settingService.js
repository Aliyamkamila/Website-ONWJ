import api from '../api/axios';

export const settingService = {
  /**
   * Get all public settings (Public)
   */
  getAll:  () => {
    return api.get('/v1/settings');
  },

  // ===== ADMIN ENDPOINTS =====
  admin: {
    /**
     * Get all settings for admin (grouped by category)
     */
    getAll: () => {
      return api.get('/admin/settings');
    },

    /**
     * Update multiple settings
     * @param {Object} data - Key-value pairs of settings
     */
    update:  (data) => {
      return api.put('/admin/settings', data);
    },

    /**
     * Upload image/logo
     * @param {string} key - Setting key (e.g., 'logo_main')
     * @param {File} file - Image file
     */
    uploadImage: (key, file) => {
      const formData = new FormData();
      formData.append('key', key);
      formData.append('image', file);

      return api.post('/admin/settings/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },

    /**
     * Delete image/logo
     * @param {string} key - Setting key
     */
    deleteImage: (key) => {
      return api.delete(`/admin/settings/image/${key}`);
    },

    /**
     * Reset settings to default
     */
    reset: () => {
      return api.post('/admin/settings/reset');
    },
  },
};

export default settingService;