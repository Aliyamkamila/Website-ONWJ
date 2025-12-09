import api from '../api/axios';

export const contactService = {
  /**
   * Submit contact form (Public)
   * @param {Object} data - { name, email, phone, subject, message }
   */
  submit: (data) => {
    return api.post('/v1/contact', data);
  },

  // ===== ADMIN ENDPOINTS =====
  admin: {
    /**
     * Get all contact submissions
     * @param {Object} params - { page, per_page, search, status, date_from, date_to }
     */
    getAll: (params = {}) => {
      return api.get('/v1/admin/contacts', { params });
    },

    /**
     * Get single contact detail
     * @param {number} id - Contact ID
     */
    getById: (id) => {
      return api.get(`/v1/admin/contacts/${id}`);
    },

    /**
     * Update contact status
     * @param {number} id - Contact ID
     * @param {Object} data - { status, admin_notes }
     */
    updateStatus: (id, data) => {
      return api.patch(`/v1/admin/contacts/${id}/status`, data);
    },

    /**
     * Delete contact
     * @param {number} id - Contact ID
     */
    delete: (id) => {
      return api.delete(`/v1/admin/contacts/${id}`);
    },

    /**
     * Bulk delete contacts
     * @param {Array<number>} ids - Array of contact IDs
     */
    bulkDelete: (ids) => {
      return api.post('/v1/admin/contacts/bulk-delete', { ids });
    },

    /**
     * Get contact statistics
     */
    getStatistics: () => {
      return api.get('/v1/admin/contacts/statistics');
    },
  },
};

export default contactService;