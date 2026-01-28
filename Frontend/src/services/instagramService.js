import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor untuk attach token
apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor untuk handle errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove('admin_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Instagram Service
export const instagramService = {
    // Public API - Get Instagram posts for frontend
    getPublicPosts: async () => {
        try {
            const response = await apiClient.get('/v1/instagram-posts');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Admin API - Get all Instagram posts
    getAllPosts: async () => {
        try {
            const response = await apiClient.get('/admin/instagram-posts');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Admin API - Create Instagram post
    createPost: async (data) => {
        try {
            const response = await apiClient.post('/admin/instagram-posts', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Admin API - Update Instagram post
    updatePost: async (id, data) => {
        try {
            const response = await apiClient.put(`/admin/instagram-posts/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Admin API - Delete Instagram post
    deletePost: async (id) => {
        try {
            const response = await apiClient.delete(`/admin/instagram-posts/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default instagramService;