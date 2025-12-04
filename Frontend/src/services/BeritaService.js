import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add auth token if available (for admin routes)
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ===== PUBLIC API =====
export const beritaApi = {
    // Get berita for TJSL Page
    getAll: (params = {}) => {
        return apiClient.get('/v1/berita', { params });
    },

    // Get single berita by slug
    getBySlug: (slug) => {
        return apiClient.get(`/v1/berita/${slug}`);
    },

    // Get categories
    getCategories: () => {
        return apiClient.get('/v1/berita-categories');
    },

    // Get recent berita
    getRecent: (limit = 5) => {
        return apiClient.get('/v1/berita-recent', { params: { limit } });
    },
};

// ===== ADMIN API =====
export const beritaAdminApi = {
    // Get all berita (with filters)
    getAll: (params = {}) => {
        return apiClient.get('/v1/admin/berita', { params });
    },

    // Get single berita by ID
    getById: (id) => {
        return apiClient.get(`/v1/admin/berita/${id}`);
    },

    // Create new berita
    create: (formData) => {
        return apiClient.post('/v1/admin/berita', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Update berita
    update: (id, formData) => {
        return apiClient.post(`/v1/admin/berita/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Delete berita
    delete: (id) => {
        return apiClient.delete(`/v1/admin/berita/${id}`);
    },

    // Get statistics
    getStatistics: () => {
        return apiClient. get('/v1/admin/berita-statistics');
    },
};

export default beritaApi;