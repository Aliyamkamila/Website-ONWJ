import axios from 'axios';

// Base API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    // DISABLE withCredentials untuk token-based auth
    withCredentials: false, // UBAH JADI FALSE atau HAPUS BARIS INI
});

// Add auth token to requests if available
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - redirect to login
            localStorage.removeItem('admin_token');
            window.location.href = '/tukang-minyak-dan-gas/login';
        }
        return Promise.reject(error);
    }
);

// UMKM API Services
export const umkmService = {
    // Public APIs
    getAllUmkm: async (params = {}) => {
        try {
            const response = await apiClient.get('/v1/umkm', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getUmkmById: async (id) => {
        try {
            const response = await apiClient.get(`/v1/umkm/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getCategories: async () => {
        try {
            const response = await apiClient.get('/v1/umkm-categories');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getStatusOptions: async () => {
        try {
            const response = await apiClient.get('/v1/umkm-status-options');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Admin APIs
    adminGetAllUmkm: async () => {
        try {
            const response = await apiClient.get('/v1/admin/umkm');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    createUmkm: async (formData) => {
        try {
            const response = await apiClient.post('/v1/admin/umkm', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    updateUmkm: async (id, formData) => {
        try {
            const response = await apiClient.post(`/v1/admin/umkm/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    deleteUmkm: async (id) => {
        try {
            const response = await apiClient.delete(`/v1/admin/umkm/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

export default umkmService;