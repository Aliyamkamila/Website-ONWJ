import axios from '../api/axios';

/**
 * Hero Section Service
 * Handles all hero section related API calls
 */
const heroService = {
  /**
   * Get all active hero sections
   * @returns {Promise<Array>} Array of active hero sections
   */
  async getHeroSections() {
    try {
      const response = await axios.get('/v1/hero-sections');
      if (response.data.success) {
        return response.data.data || [];
      }
      throw new Error(response.data.message || 'Failed to fetch hero sections');
    } catch (error) {
      console.error('Error fetching hero sections:', error);
      throw error;
    }
  },

  /**
   * Get all hero sections (including inactive) - Admin only
   * @returns {Promise<Array>} Array of all hero sections
   */
  async getAllHeroSections() {
    try {
      const response = await axios.get('/v1/admin/hero-sections');
      if (response.data.success) {
        return response.data.data || [];
      }
      throw new Error(response.data.message || 'Failed to fetch hero sections');
    } catch (error) {
      console.error('Error fetching all hero sections:', error);
      throw error;
    }
  },

  /**
   * Create a new hero section - Admin only
   * @param {Object} data Hero section data
   * @returns {Promise<Object>} Created hero section
   */
  async createHeroSection(data) {
    try {
      const response = await axios.post('/v1/admin/hero-sections', data);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to create hero section');
    } catch (error) {
      console.error('Error creating hero section:', error);
      throw error;
    }
  },

  /**
   * Update a hero section - Admin only
   * @param {number} id Hero section ID
   * @param {Object} data Hero section data to update
   * @returns {Promise<Object>} Updated hero section
   */
  async updateHeroSection(id, data) {
    try {
      const response = await axios.put(`/v1/admin/hero-sections/${id}`, data);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to update hero section');
    } catch (error) {
      console.error('Error updating hero section:', error);
      throw error;
    }
  },

  /**
   * Delete a hero section - Admin only
   * @param {number} id Hero section ID
   * @returns {Promise<Object>} Response data
   */
  async deleteHeroSection(id) {
    try {
      const response = await axios.delete(`/v1/admin/hero-sections/${id}`);
      if (response.data.success) {
        return response.data;
      }
      throw new Error(response.data.message || 'Failed to delete hero section');
    } catch (error) {
      console.error('Error deleting hero section:', error);
      throw error;
    }
  },

  /**
   * Reorder hero sections - Admin only
   * @param {Array} items Array of items with id and order
   * @returns {Promise<Object>} Response data
   */
  async reorderHeroSections(items) {
    try {
      const response = await axios.post('/v1/admin/hero-sections/reorder', { items });
      if (response.data.success) {
        return response.data;
      }
      throw new Error(response.data.message || 'Failed to reorder hero sections');
    } catch (error) {
      console.error('Error reordering hero sections:', error);
      throw error;
    }
  },
};

export default heroService;
