import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta?. env?.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 15000,
});

// ===== REQUEST INTERCEPTOR =====
apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('admin_token'); // ✅ Pakai Cookies
        
        if (token) {
            config.headers. Authorization = `Bearer ${token}`;
        }

        console.log('🚀 Testimonial API Request:', {
            method: config.method. toUpperCase(),
            url: config.url,
            hasToken: !!token,
        });

        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// ===== RESPONSE INTERCEPTOR =====
apiClient.interceptors.response.use(
    (response) => {
        console.log('✅ Testimonial API Response:', {
            status: response.status,
            url: response.config.url,
        });
        return response;
    },
    (error) => {
        console. error('❌ Testimonial API Error:', {
            message: error.message,
            status: error.response?.status,
            url: error.config?.url,
        });

        if (error.response?.status === 401) {
            Cookies.remove('admin_token');
            Cookies.remove('admin_user');
            
            if (window.location.pathname !== '/tukang-minyak-dan-gas/login') {
                window.location.href = '/tukang-minyak-dan-gas/login';
            }
        }

        return Promise.reject(error);
    }
);

// ===== PUBLIC API =====
export const testimonialApi = {
    getAll: (params = {}) => {
        return apiClient.get('/v1/testimonials', { params });
    },

    getById: (id) => {
        return apiClient.get(`/v1/testimonials/${id}`);
    },

    getFeatured: () => {
        return apiClient.get('/v1/testimonials/featured');
    },

    getByProgram: (program) => {
        return apiClient.get(`/v1/testimonials/program/${program}`);
    },

    getPrograms: () => {
        return apiClient.get('/v1/testimonial-programs');
    },
};

// ===== ADMIN API =====
export const testimonialAdminApi = {
    getAll: (params = {}) => {
        return apiClient.get('/admin/testimonials', { params });
    },

    getById: (id) => {
        return apiClient.get(`/admin/testimonials/${id}`);
    },

    create: (formData) => {
        return apiClient.post('/admin/testimonials', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    update: (id, formData) => {
        return apiClient. post(`/admin/testimonials/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    delete:  (id) => {
        return apiClient.delete(`/admin/testimonials/${id}`);
    },

    bulkDelete: (ids) => {
        return apiClient.post('/admin/testimonials/bulk-delete', { ids });
    },

    toggleFeatured: (id) => {
        return apiClient.post(`/admin/testimonials/${id}/toggle-featured`);
    },

    getStatistics: () => {
        return apiClient.get('/admin/testimonial-statistics');
    },
};

export default testimonialApi;