import axios from 'axios';
import Cookies from 'js-cookie'; // ✅ Digunakan untuk mengambil token dari cookie

// Base API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// ✅ DEBUG LOG
console.log('🔧 umkmService initialized');
console.log('📍 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('📍 API_BASE_URL:', API_BASE_URL);

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    // Jika backend menggunakan cookie, withCredentials harus true
    // withCredentials: true, // <-- Opsional: Coba aktifkan ini jika token disimpan sebagai HttpOnly cookie
});

// Add auth token to requests if available
apiClient.interceptors.request.use(
    (config) => {
        console.log('🚀 UMKM API Request:', {
            method: config.method.toUpperCase(),
            url: config.url,
            baseURL: config.baseURL,
            fullURL: `${config.baseURL}${config.url}`,
            params: config.params,
        });
        
        // PERBAIKAN: Mengambil token dari Cookies
        const token = Cookies.get('admin_token'); 
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
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
        console.error('❌ UMKM API Error:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url,
        });
        
        const status = error.response?.status;

        if (status === 401) {
            Cookies.remove('admin_token');
            window.location.href = '/login';
        }
        // PERBAIKAN FUNDAMENTAL: Melempar rejection agar catch block di komponen tereksekusi
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
            // PERBAIKAN: Cukup lempar objek error Axios
            throw error; 
        }
    },

    getUmkmById: async (id) => {
        try {
            const response = await apiClient.get(`/v1/umkm/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getCategories: async () => {
        try {
            const response = await apiClient.get('/v1/umkm-categories');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getStatusOptions: async () => {
        try {
            const response = await apiClient.get('/v1/umkm-status-options');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Admin APIs
    adminGetAllUmkm: async () => {
        try {
            const response = await apiClient.get('/v1/admin/umkm');
            return response.data;
        } catch (error) {
            // PERBAIKAN: Cukup lempar objek error Axios
            throw error;
        }
    },

    createUmkm: async (formData) => {
        try {
            const response = await apiClient.post('/v1/admin/umkm', formData, {
                headers: {
                    // Set Content-Type ke undefined agar Axios/Browser otomatis mengatur boundary
                    'Content-Type': undefined, 
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateUmkm: async (id, formData) => {
        try {
            // Pastikan Anda menggunakan PUT atau PATCH di backend Laravel/Express/dll. 
            // Jika backend hanya menerima POST untuk update form-data, tambahkan _method: 'PUT'/'PATCH' 
            // ke dalam formData (ini adalah konvensi Laravel)
            
            // Contoh konvensi Laravel:
            // formData.append('_method', 'PUT'); 

            const response = await apiClient.post(`/v1/admin/umkm/${id}`, formData, {
                headers: {
                    'Content-Type': undefined, 
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteUmkm: async (id) => {
        try {
            const response = await apiClient.delete(`/v1/admin/umkm/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default umkmService;