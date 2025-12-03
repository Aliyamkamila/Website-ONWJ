import axiosInstance from '../api/axios';

const penghargaanService = {
    // ==================== PUBLIC APIs ====================
    
    /**
     * Get all penghargaan with filters for Media Informasi page
     * @param {Object} params - Query parameters (year, category, search, etc.)
     */
    getAllPenghargaan: async (params = {}) => {
        try {
            const response = await axiosInstance.get('/v1/penghargaan', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching penghargaan:', error);
            throw error;
        }
    },

    /**
     * Get penghargaan for Landing Page
     * @param {Number} limit - Number of awards to fetch (default: 6)
     */
    getForLanding: async (limit = 6) => {
        try {
            const response = await axiosInstance.get('/v1/penghargaan/landing', {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching penghargaan for landing:', error);
            throw error;
        }
    },

    /**
     * Get single penghargaan detail by ID
     * @param {Number} id - Penghargaan ID
     */
    getPenghargaanById: async (id) => {
        try {
            const response = await axiosInstance.get(`/v1/penghargaan/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching penghargaan detail:', error);
            throw error;
        }
    },

    /**
     * Get all available years for filter
     */
    getYears: async () => {
        try {
            const response = await axiosInstance.get('/v1/penghargaan-years');
            return response.data;
        } catch (error) {
            console.error('Error fetching years:', error);
            throw error;
        }
    },

    /**
     * Get all available categories for filter
     */
    getCategories: async () => {
        try {
            const response = await axiosInstance.get('/v1/penghargaan-categories');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    // ==================== ADMIN APIs ====================

    /**
     * Admin: Get all penghargaan with filters
     * @param {Object} params - Query parameters (search, year, category, etc.)
     */
    adminGetAllPenghargaan: async (params = {}) => {
        try {
            const response = await axiosInstance.get('/v1/admin/penghargaan', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching penghargaan (admin):', error);
            throw error;
        }
    },

    /**
     * Admin: Create new penghargaan
     * @param {FormData} penghargaanData - Penghargaan data including image file
     */
    adminCreatePenghargaan: async (penghargaanData) => {
        try {
            const response = await axiosInstance.post('/v1/admin/penghargaan', penghargaanData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating penghargaan:', error);
            throw error;
        }
    },

    /**
     * Admin: Update existing penghargaan
     * @param {Number} id - Penghargaan ID
     * @param {FormData} penghargaanData - Updated penghargaan data
     */
    adminUpdatePenghargaan: async (id, penghargaanData) => {
        try {
            const response = await axiosInstance.post(`/v1/admin/penghargaan/${id}`, penghargaanData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating penghargaan:', error);
            throw error;
        }
    },

    /**
     * Admin: Delete penghargaan
     * @param {Number} id - Penghargaan ID
     */
    adminDeletePenghargaan: async (id) => {
        try {
            const response = await axiosInstance.delete(`/v1/admin/penghargaan/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting penghargaan:', error);
            throw error;
        }
    },

    /**
     * Admin: Bulk delete multiple penghargaan
     * @param {Array} ids - Array of penghargaan IDs to delete
     */
    adminBulkDeletePenghargaan: async (ids) => {
        try {
            const response = await axiosInstance.post('/v1/admin/penghargaan/bulk-delete', { ids });
            return response.data;
        } catch (error) {
            console.error('Error bulk deleting penghargaan:', error);
            throw error;
        }
    },

    /**
     * Admin: Get penghargaan statistics for dashboard
     */
    getStatistics: async () => {
        try {
            const response = await axiosInstance.get('/v1/admin/penghargaan-statistics');
            return response.data;
        } catch (error) {
            console.error('Error fetching penghargaan statistics:', error);
            throw error;
        }
    },
};

export default penghargaanService;