import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const programService = {
    // Public APIs
    getAllPrograms: async (params = {}) => {
        try {
            const response = await axios.get(`${API_URL}/v1/programs`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching programs:', error);
            throw error;
        }
    },

    getProgramBySlug: async (slug) => {
        try {
            const response = await axios.get(`${API_URL}/v1/programs/${slug}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching program:', error);
            throw error;
        }
    },

    getRecentPrograms: async (limit = 3) => {
        try {
            const response = await axios.get(`${API_URL}/v1/programs-recent`, {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching recent programs:', error);
            throw error;
        }
    },

    getCategories: async () => {
        try {
            const response = await axios.get(`${API_URL}/v1/program-categories`);
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    getStatusOptions: async () => {
        try {
            const response = await axios.get(`${API_URL}/v1/program-status-options`);
            return response.data;
        } catch (error) {
            console.error('Error fetching status options:', error);
            throw error;
        }
    },

    getStatistics: async () => {
        try {
            const response = await axios.get(`${API_URL}/v1/program-statistics`);
            return response.data;
        } catch (error) {
            console.error('Error fetching statistics:', error);
            throw error;
        }
    },

    // Admin APIs
    adminGetAllPrograms: async (params = {}) => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await axios.get(`${API_URL}/v1/admin/programs`, {
                params,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching programs:', error);
            throw error;
        }
    },

    adminCreateProgram: async (formData) => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await axios.post(`${API_URL}/v1/admin/programs`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating program:', error);
            throw error;
        }
    },

    adminUpdateProgram: async (id, formData) => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await axios.post(`${API_URL}/v1/admin/programs/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating program:', error);
            throw error;
        }
    },

    adminDeleteProgram: async (id) => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await axios.delete(`${API_URL}/v1/admin/programs/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting program:', error);
            throw error;
        }
    },
};

export default programService;