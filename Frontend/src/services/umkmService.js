import axios from 'axios';

// Base API URL
const API_BASE_URL = import.meta.env. VITE_API_BASE_URL || 'http://localhost:8000/api';

// ✅ DEBUG LOG
console.log('🔧 umkmService initialized');
console.log('📍 VITE_API_BASE_URL:', import.meta.env. VITE_API_BASE_URL);
console.log('📍 API_BASE_URL:', API_BASE_URL);

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false,
});

// Add auth token to requests if available
apiClient.interceptors.request.use(
    (config) => {
        console.log('🚀 UMKM API Request:', {
            method: config.method. toUpperCase(),
            url: config.url,
            baseURL: config.baseURL,
            fullURL: `${config.baseURL}${config.url}`,
            params: config.params,
        });
        
        const token = localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise. reject(error);
    }
);

// Handle response errors
apiClient.interceptors.response.use(
    (response) => {
        console.log('✅ UMKM API Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data,
        });
        return response;
    },
    (error) => {
        console. error('❌ UMKM API Error:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url,
        });
        
        if (error.response?.status === 401) {
            // Unauthorized - redirect to login
            localStorage. removeItem('admin_token');
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
            console.log('📞 Calling getAllUmkm with params:', params);
            const response = await apiClient.get('/v1/umkm', { params });
            return response.data;
        } catch (error) {
            console. error('❌ getAllUmkm error:', error);
            throw error. response?.data || error.message;
        }
    },

    getUmkmById: async (id) => {
        try {
            const response = await apiClient.get(`/v1/umkm/${id}`);
            return response. data;
        } catch (error) {
            throw error.response?.data || error. message;
        }
    },

    getCategories: async () => {
        try {
            const response = await apiClient.get('/v1/umkm-categories');
            return response.data;
        } catch (error) {
            throw error.response?. data || error.message;
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
            throw error.response?.data || error. message;
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