import api from '../api/axios';

export const testimonialService = {
  // ===== PUBLIC ENDPOINTS =====
  
  /**
   * Get all testimonials with pagination & filters
   * @param {Object} params - { page, per_page, program, search }
   */
  getAll: (params = {}) => {
    return api.get('/v1/testimonials', { params });
  },

  /**
   * Get featured testimonials (for homepage highlights)
   */
  getFeatured: () => {
    return api.get('/v1/testimonials/featured');
  },

  /**
   * Get testimonials by specific program
   * @param {string} program - Program name
   */
  getByProgram: (program) => {
    return api.get(`/v1/testimonials/program/${program}`);
  },

  /**
   * Get single testimonial detail
   * @param {number} id - Testimonial ID
   */
  getById: (id) => {
    return api.get(`/v1/testimonials/${id}`);
  },

  /**
   * Get list of all programs (for filter dropdown)
   */
  getPrograms: () => {
    return api.get('/v1/testimonial-programs');
  },

  // ===== ADMIN ENDPOINTS =====
  
  admin: {
    /**
     * Get all testimonials for admin with filters
     * @param {Object} params - { page, per_page, search, program, is_featured }
     */
    getAll: (params = {}) => {
      return api.get('/v1/admin/testimonials', { params });
    },

    /**
     * Create new testimonial
     * @param {FormData} formData - Testimonial data with avatar image
     */
    create: (formData) => {
      return api.post('/v1/admin/testimonials', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },

    /**
     * Get single testimonial for editing
     * @param {number} id - Testimonial ID
     */
    getById: (id) => {
      return api. get(`/v1/admin/testimonials/${id}`);
    },

    /**
     * Update testimonial
     * @param {number} id - Testimonial ID
     * @param {FormData} formData - Updated data with optional new avatar
     */
    update:  (id, formData) => {
      return api.post(`/v1/admin/testimonials/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },

    /**
     * Delete testimonial
     * @param {number} id - Testimonial ID
     */
    delete: (id) => {
      return api.delete(`/v1/admin/testimonials/${id}`);
    },

    /**
     * Bulk delete testimonials
     * @param {Array<number>} ids - Array of testimonial IDs
     */
    bulkDelete: (ids) => {
      return api. post('/v1/admin/testimonials/bulk-delete', { ids });
    },

    /**
     * Toggle featured status
     * @param {number} id - Testimonial ID
     */
    toggleFeatured: (id) => {
      return api.post(`/v1/admin/testimonials/${id}/toggle-featured`);
    },

    /**
     * Get statistics for dashboard
     */
    getStatistics: () => {
      return api.get('/v1/admin/testimonial-statistics');
    },
  },
};

export default testimonialService;