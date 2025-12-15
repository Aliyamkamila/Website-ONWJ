import axios from 'axios';
import Cookies from 'js-cookie';

// Base API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// ✅ DEBUG LOG
console.log('🔧 tjslService initialized');
console.log('📍 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('📍 API_BASE_URL:', API_BASE_URL);

// TJSL API Services
export const tjslService = {
    // ========================================
    // STATISTIK TJSL APIs
    // ========================================
    
    /**
     * Get all TJSL statistics
     * @returns {Promise} Response with statistics data
     */
    getAllStatistics: async () => {
        try {
            console.log('📞 Calling getAllStatistics');
            const response = await axiosInstance.get('/v1/admin/tjsl/statistik');
            return response.data;
        } catch (error) {
            console. error('❌ Error in getAllStatistics:', error);
            throw error;
        }
    },

    /**
     * Bulk update TJSL statistics
     * @param {Array} statistics - Array of {key, value} objects
     * @returns {Promise} Response with update result
     */
    bulkUpdateStatistics: async (statistics) => {
        try {
            console.log('📞 Calling bulkUpdateStatistics with data:', statistics);
            const response = await axiosInstance.post('/v1/admin/tjsl/statistik/bulk-update', {
                statistics
            });
            return response.data;
        } catch (error) {
            console.error('❌ Error in bulkUpdateStatistics:', error);
            throw error;
        }
    },

    /**
     * Reset all TJSL statistics to default values
     * @returns {Promise} Response with reset result
     */
    resetStatistics: async () => {
        try {
            console.log('📞 Calling resetStatistics');
            const response = await axiosInstance. post('/v1/admin/tjsl/statistik/reset');
            return response.data;
        } catch (error) {
            console.error('❌ Error in resetStatistics:', error);
            throw error;
        }
    },

    /**
     * Get a single statistic by key
     * @param {string} key - Statistic key
     * @returns {Promise} Response with single statistic data
     */
    getStatisticByKey: async (key) => {
        try {
            console.log('📞 Calling getStatisticByKey with key:', key);
            const response = await axiosInstance.get(`/v1/admin/tjsl/statistik/${key}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error in getStatisticByKey:', error);
            throw error;
        }
    },

    /**
     * Update a single statistic
     * @param {string} key - Statistic key
     * @param {number} value - New value
     * @returns {Promise} Response with update result
     */
    updateStatistic: async (key, value) => {
        try {
            console.log('📞 Calling updateStatistic with key:', key, 'value:', value);
            const response = await axiosInstance. put(`/v1/admin/tjsl/statistik/${key}`, {
                value
            });
            return response.data;
        } catch (error) {
            console.error('❌ Error in updateStatistic:', error);
            throw error;
        }
    },

    // ========================================
    // PROGRAM TJSL APIs (Jika ada)
    // ========================================
    
    /**
     * Get all TJSL programs
     * @param {Object} params - Query parameters (page, limit, status, etc.)
     * @returns {Promise} Response with programs data
     */
    getAllPrograms: async (params = {}) => {
        try {
            console.log('📞 Calling getAllPrograms with params:', params);
            const response = await axiosInstance.get('/v1/admin/tjsl/programs', { params });
            return response.data;
        } catch (error) {
            console.error('❌ Error in getAllPrograms:', error);
            throw error;
        }
    },

    /**
     * Get TJSL program by ID
     * @param {number|string} id - Program ID
     * @returns {Promise} Response with program data
     */
    getProgramById: async (id) => {
        try {
            console.log('📞 Calling getProgramById with id:', id);
            const response = await axiosInstance.get(`/v1/admin/tjsl/programs/${id}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error in getProgramById:', error);
            throw error;
        }
    },

    /**
     * Create new TJSL program
     * @param {FormData} formData - Program data (supports file upload)
     * @returns {Promise} Response with created program
     */
    createProgram:  async (formData) => {
        try {
            console.log('📞 Calling createProgram');
            const response = await axiosInstance.post('/v1/admin/tjsl/programs', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response. data;
        } catch (error) {
            console.error('❌ Error in createProgram:', error);
            throw error;
        }
    },

    /**
     * Update TJSL program
     * @param {number|string} id - Program ID
     * @param {FormData} formData - Updated program data
     * @returns {Promise} Response with updated program
     */
    updateProgram: async (id, formData) => {
        try {
            console. log('📞 Calling updateProgram with id:', id);
            // Laravel convention for PUT with FormData
            formData.append('_method', 'PUT');
            
            const response = await axiosInstance.post(`/v1/admin/tjsl/programs/${id}`, formData, {
                headers: {
                    'Content-Type':  'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('❌ Error in updateProgram:', error);
            throw error;
        }
    },

    /**
     * Delete TJSL program
     * @param {number|string} id - Program ID
     * @returns {Promise} Response with deletion result
     */
    deleteProgram: async (id) => {
        try {
            console. log('📞 Calling deleteProgram with id:', id);
            const response = await axiosInstance.delete(`/v1/admin/tjsl/programs/${id}`);
            return response.data;
        } catch (error) {
            console.error('❌ Error in deleteProgram:', error);
            throw error;
        }
    },

    // ========================================
    // PUBLIC TJSL APIs (Jika ada endpoint public)
    // ========================================
    
    /**
     * Get public TJSL statistics (no auth required)
     * @returns {Promise} Response with public statistics
     */
    getPublicStatistics: async () => {
        try {
            console.log('📞 Calling getPublicStatistics');
            const response = await axiosInstance.get('/v1/tjsl/statistik');
            return response.data;
        } catch (error) {
            console.error('❌ Error in getPublicStatistics:', error);
            throw error;
        }
    },

    /**
     * Get public TJSL programs (no auth required)
     * @param {Object} params - Query parameters
     * @returns {Promise} Response with public programs
     */
    getPublicPrograms: async (params = {}) => {
        try {
            console.log('📞 Calling getPublicPrograms with params:', params);
            const response = await axiosInstance.get('/v1/tjsl/programs', { params });
            return response.data;
        } catch (error) {
            console.error('❌ Error in getPublicPrograms:', error);
            throw error;
        }
    },
};

export default tjslService;