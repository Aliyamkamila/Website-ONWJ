import api from '../api/axios';

const galleryService = {
    // ==================== CATEGORIES ====================
    
    /**
     * Get all gallery categories (Public)
     * @param {Object} params - Query parameters
     * @returns {Promise}
     */
    getCategories: async (params = {}) => {
        try {
            const response = await api.get('/gallery-categories', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    /**
     * Get single category by slug (Public)
     * @param {string} slug
     * @returns {Promise}
     */
    getCategory: async (slug) => {
        try {
            const response = await api.get(`/gallery-categories/${slug}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error;
        }
    },

    /**
     * Create new category (Admin)
     * @param {Object} data
     * @returns {Promise}
     */
    createCategory: async (data) => {
        try {
            const response = await api.post('/admin/gallery-categories', data);
            return response.data;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },

    /**
     * Update category (Admin)
     * Menggunakan PUT/PATCH di backend, tapi request client biasanya bisa pakai PUT.
     * @param {number} id
     * @param {Object} data
     * @returns {Promise}
     */
    updateCategory: async (id, data) => {
        try {
            // Menggunakan .put() sesuai dengan updateCategory
            const response = await api.put(`/admin/gallery-categories/${id}`, data); 
            return response.data;
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    },

    /**
     * Delete category (Admin)
     * @param {number} id
     * @returns {Promise}
     */
    deleteCategory: async (id) => {
        try {
            const response = await api.delete(`/admin/gallery-categories/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    },

    // ==================== GALLERY ====================

    /**
     * Get all gallery images (Public)
     * @param {Object} params - { category, search, featured, sort_by, sort_order, page, per_page }
     * @returns {Promise}
     */
    getGallery: async (params = {}) => {
        try {
            const response = await api.get('/gallery', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching gallery:', error);
            throw error;
        }
    },

    /**
     * Get single gallery image by slug (Public)
     * @param {string} slug
     * @returns {Promise}
     */
    getGalleryImage: async (slug) => {
        try {
            const response = await api.get(`/gallery/${slug}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching gallery image:', error);
            throw error;
        }
    },

    /**
     * Get featured gallery images (Public)
     * @param {number} limit
     * @returns {Promise}
     */
    getFeaturedGallery: async (limit = 6) => {
        try {
            const response = await api.get('/gallery/featured', { params: { limit } });
            return response.data;
        } catch (error) {
            console.error('Error fetching featured gallery:', error);
            throw error;
        }
    },

    /**
     * Get all gallery images (Admin)
     * @param {Object} params
     * @returns {Promise}
     */
    getAdminGallery: async (params = {}) => {
        try {
            const response = await api.get('/admin/gallery', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching admin gallery:', error);
            throw error;
        }
    },

    /**
     * Upload single gallery image (Admin)
     * @param {FormData} formData
     * @param {Function} onUploadProgress - Upload progress callback
     * @returns {Promise}
     */
    uploadImage: async (formData, onUploadProgress) => {
        try {
            const response = await api.post('/admin/gallery', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (onUploadProgress) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        onUploadProgress(percentCompleted);
                    }
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    },

    /**
     * Batch upload gallery images (Admin)
     * @param {FormData} formData
     * @param {Function} onUploadProgress
     * @returns {Promise}
     */
    batchUploadImages: async (formData, onUploadProgress) => {
        try {
            // Perlu dipastikan route /admin/gallery/batch-upload sudah dibuat di backend Laravel
            const response = await api.post('/admin/gallery/batch-upload', formData, { 
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (onUploadProgress) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        onUploadProgress(percentCompleted);
                    }
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error batch uploading images:', error);
            throw error;
        }
    },

    /**
     * Update gallery image (Admin)
     * Menggunakan POST karena FormData/file upload, dengan ID di URL.
     * @param {number} id
     * @param {FormData} formData
     * @returns {Promise}
     */
    updateImage: async (id, formData) => {
        try {
            // Di Laravel, POST ke URL dengan ID sering digunakan untuk update dengan FormData (karena PUT tidak mendukung multipart)
            const response = await api.post(`/admin/gallery/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error updating image:', error);
            throw error;
        }
    },

    /**
     * Delete gallery image (Admin)
     * @param {number} id
     * @returns {Promise}
     */
    deleteImage: async (id) => {
        try {
            const response = await api.delete(`/admin/gallery/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting image:', error);
            throw error;
        }
    },

    /**
     * Bulk delete gallery images (Admin)
     * @param {Array} ids - Array of image IDs
     * @returns {Promise}
     */
    bulkDeleteImages: async (ids) => {
        try {
            const response = await api.post('/admin/gallery/bulk-delete', { ids });
            return response.data;
        } catch (error) {
            console.error('Error bulk deleting images:', error);
            throw error;
        }
    },

    /**
     * Get gallery statistics (Admin)
     * @returns {Promise}
     */
    getStatistics: async () => {
        try {
            // Perlu dipastikan route /admin/gallery/statistics sudah dibuat di backend Laravel
            const response = await api.get('/admin/gallery/statistics'); 
            return response.data;
        } catch (error) {
            console.error('Error fetching statistics:', error);
            throw error;
        }
    },
};

export default galleryService;