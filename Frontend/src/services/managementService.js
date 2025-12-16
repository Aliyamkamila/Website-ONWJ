import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';
const API_ADMIN_URL = 'http://localhost:8000/api/v1/admin';

const managementService = {
  /**
   * Get all active management data (Public)
   */
  getAll: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/managements`);
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
      const response = await axios.get(`${API_BASE_URL}/managements/type/${type}`);
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
        const token = localStorage.getItem('admin_token');
        const response = await axios.get(`${API_ADMIN_URL}/managements`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
        const token = localStorage.getItem('admin_token');
        const response = await axios.get(`${API_ADMIN_URL}/managements/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
        const token = localStorage.getItem('admin_token');
        const response = await axios.post(`${API_ADMIN_URL}/managements`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
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
        const token = localStorage.getItem('admin_token');
        const response = await axios.post(`${API_ADMIN_URL}/managements/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
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
        const token = localStorage.getItem('admin_token');
        const response = await axios.delete(`${API_ADMIN_URL}/managements/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  },
};

export default managementService;
