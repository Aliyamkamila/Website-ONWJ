import axios from '../api/axios';

const managementService = {
  /**
   * Get all active management data (Public)
   */
  getAll: async () => {
    try {
      const response = await axios.get('/v1/management');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get management by type (Public)
   */
  getByType: async (type) => {
    try {
      const response = await axios.get('/v1/management', { params: { type } });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Admin Methods
  admin: {
    /**
     * Get all management data (including inactive)
     */
    getAll: async () => {
      try {
        const response = await axios.get('/admin/management');
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Get single management
     */
    get: async (id) => {
      try {
        const response = await axios.get(`/admin/management/${id}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Create new management
     */
    create: async (formData) => {
      try {
        const response = await axios.post('/admin/management', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Update management
     */
    update: async (id, formData) => {
      try {
        const response = await axios.post(`/admin/management/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Delete management
     */
    delete: async (id) => {
      try {
        const response = await axios.delete(`/admin/management/${id}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
};

export default managementService;
