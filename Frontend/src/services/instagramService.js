import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Accept': 'application/json',
        // ❌ JANGAN set 'Content-Type' di sini!
        // Biar axios auto-detect (FormData = multipart, Object = json)
    },
});

// Request interceptor untuk attach token
apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // ✅ DEBUG LOG
        console.log('🚀 API Request:', {
            url: config.url,
            method: config.method,
            hasToken: !!token,
            contentType: config.headers['Content-Type'],
            isFormData: config.data instanceof FormData,
        });

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor untuk handle errors
apiClient.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', {
            url: response.config.url,
            status: response.status,
        });
        return response;
    },
    (error) => {
        console.error('❌ API Error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.response?.data?.message,
        });

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
            console.error('Error fetching public Instagram posts:', error);
            throw error;
        }
    },

    // Admin API - Get all Instagram posts
    getAllPosts: async () => {
        try {
            const response = await apiClient.get('/admin/instagram-posts');
            return response.data;
        } catch (error) {
            console.error('Error fetching Instagram posts:', error);
            throw error;
        }
    },

    // Admin API - Create Instagram post
    createPost: async (formData) => {
        try {
            console.log('📤 Creating Instagram post with FormData...');
            
            // ✅ Axios akan auto-detect FormData dan set Content-Type: multipart/form-data
            const response = await apiClient.post('/admin/instagram-posts', formData);
            
            console.log('✅ Instagram post created successfully');
            return response.data;
        } catch (error) {
            console.error('❌ Error creating Instagram post:', error);
            throw error;
        }
    },

    // Admin API - Update Instagram post
    updatePost: async (id, formData) => {
        try {
            console.log(`📤 Updating Instagram post #${id} with FormData...`);
            
            // ✅ PAKAI POST (bukan PUT) karena FormData
            // Laravel akan terima via _method=PUT yang sudah ditambahkan di frontend
            const response = await apiClient.post(`/admin/instagram-posts/${id}`, formData);
            
            console.log('✅ Instagram post updated successfully');
            return response.data;
        } catch (error) {
            console.error(`❌ Error updating Instagram post #${id}:`, error);
            throw error;
        }
    },

    // Admin API - Delete Instagram post
    deletePost: async (id) => {
        try {
            console.log(`🗑️ Deleting Instagram post #${id}...`);
            
            const response = await apiClient.delete(`/admin/instagram-posts/${id}`);
            
            console.log('✅ Instagram post deleted successfully');
            return response.data;
        } catch (error) {
            console.error(`❌ Error deleting Instagram post #${id}:`, error);
            throw error;
        }
    },
};

export default instagramService;