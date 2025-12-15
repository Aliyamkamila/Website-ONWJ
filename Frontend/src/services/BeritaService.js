import axios from 'axios';
import Cookies from 'js-cookie'; 

// ✅ Base URL dari environment variable
const API_URL = import.meta?.env?. VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 15000, // 15 seconds timeout
});

// ===== REQUEST INTERCEPTOR =====
apiClient.interceptors.request.use(
    (config) => {
        // ✅ FIX: Ganti localStorage. getItem() jadi Cookies. get()
        const token = Cookies.get('admin_token'); // ✅ INI YANG DIPERBAIKI
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Debug log
        console.log('🚀 API Request:', {
            method: config.method.toUpperCase(),
            url: config.url,
            baseURL:  config.baseURL,
            fullURL: `${config.baseURL}${config.url}`,
            params: config.params,
            hasToken: !!token, // ✅ Tambahkan log apakah token ada
        });

        return config;
    },
    (error) => {
        console.error('❌ Request Interceptor Error:', error);
        return Promise.reject(error);
    }
);

// ===== RESPONSE INTERCEPTOR =====
apiClient.interceptors.response.use(
    (response) => {
        // Debug log
        console.log('✅ API Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data,
        });

        return response;
    },
    (error) => {
        // Enhanced error handling
        console.error('❌ API Error:', {
            message: error. message,
            code: error. code,
            url: error. config?.url,
            status: error.response?.status,
            data: error.response?.data,
        });

        // Specific error messages
        if (error. code === 'ECONNABORTED') {
            console.error('⏱️ Request timeout - Backend lambat atau tidak running');
        } else if (error.code === 'ERR_NETWORK') {
            console.error('🌐 Network Error - Pastikan backend running di http://localhost:8000');
        } else if (error.response?.status === 404) {
            console.error('🔍 404 Not Found - Endpoint tidak ditemukan');
        } else if (error.response?.status === 401) {
            console.error('🔒 401 Unauthorized - Token tidak valid atau expired');
            
            // ✅ Auto redirect ke login jika 401
            Cookies.remove('admin_token');
            Cookies.remove('admin_user');
            
            if (window.location.pathname !== '/tukang-minyak-dan-gas/login') {
                window.location.href = '/tukang-minyak-dan-gas/login';
            }
        } else if (error.response?.status === 500) {
            console.error('💥 500 Server Error - Ada error di backend');
        }

        return Promise.reject(error);
    }
);

// ===== PUBLIC API =====
export const beritaApi = {
    /**
     * Get all berita for TJSL Page
     * @param {Object} params - Query parameters (page, per_page, category, search)
     * @returns {Promise}
     */
    getAll: (params = {}) => {
        return apiClient.get('/v1/berita', { params });
    },

    /**
     * Get single berita by slug
     * @param {string} slug - Berita slug
     * @returns {Promise}
     */
    getBySlug:  (slug) => {
        return apiClient.get(`/v1/berita/${slug}`);
    },

    /**
     * Get all available categories
     * @returns {Promise}
     */
    getCategories: () => {
        return apiClient.get('/v1/berita-categories');
    },

    /**
     * Get recent berita
     * @param {number} limit - Number of berita to fetch (default: 5)
     * @returns {Promise}
     */
    getRecent: (limit = 5) => {
        return apiClient. get('/v1/berita-recent', { params: { limit } });
    },

    /**
     * Get berita for Media Informasi page
     * @param {Object} params - Query parameters
     * @returns {Promise}
     */
    forMediaInformasi: (params = {}) => {
        return apiClient.get('/v1/berita/media-informasi', { params });
    },

    /**
     * Get pinned berita for Homepage
     * @returns {Promise}
     */
    forHomepage: () => {
        return apiClient.get('/v1/berita/homepage');
    },
};

// ===== ADMIN API =====
export const beritaAdminApi = {
    /**
     * Get all berita for admin (with filters)
     * @param {Object} params - Query parameters (page, per_page, status, category, search, sort_by, sort_order)
     * @returns {Promise}
     */
    getAll:  (params = {}) => {
        return apiClient.get('/v1/admin/berita', { params });
    },

    /**
     * Get single berita by ID (for admin)
     * @param {number} id - Berita ID
     * @returns {Promise}
     */
    getById:  (id) => {
        return apiClient.get(`/v1/admin/berita/${id}`);
    },

    /**
     * Create new berita
     * @param {FormData} formData - Berita data (must include:  title, date, category, content, image)
     * @returns {Promise}
     */
    create: (formData) => {
        return apiClient. post('/v1/admin/berita', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    /**
     * Update existing berita
     * @param {number} id - Berita ID
     * @param {FormData} formData - Updated berita data
     * @returns {Promise}
     */
    update: (id, formData) => {
        return apiClient. post(`/v1/admin/berita/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    /**
     * Delete berita
     * @param {number} id - Berita ID
     * @returns {Promise}
     */
    delete: (id) => {
        return apiClient. delete(`/v1/admin/berita/${id}`);
    },

    /**
     * Get berita statistics
     * @returns {Promise}
     */
    getStatistics: () => {
        return apiClient.get('/v1/admin/berita-statistics');
    },

    /**
     * Bulk delete berita
     * @param {Array} ids - Array of berita IDs
     * @returns {Promise}
     */
    bulkDelete:  (ids) => {
        return apiClient.post('/v1/admin/berita/bulk-delete', { ids });
    },
};

// ===== HELPER FUNCTION =====
export const testConnection = async () => {
    try {
        console.log('🧪 Testing API connection...');
        console.log('📍 Base URL:', API_URL);
        
        const response = await apiClient. get('/v1/berita', {
            params: { per_page: 1 }
        });
        
        console.log('✅ Connection successful!', response.data);
        return { success: true, message: 'Connected to backend' };
    } catch (error) {
        console.error('❌ Connection failed! ', error.message);
        return { 
            success: false, 
            message: error.message,
            hint: 'Pastikan backend running di http://localhost:8000'
        };
    }
};

// Default export
export default beritaApi;