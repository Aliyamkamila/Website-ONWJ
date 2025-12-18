import axiosInstance from '../api/axios';

const programService = {
    // ==================== PUBLIC APIs ====================
    
    /**
     * Get all programs with filters, search, and pagination
     * @param {Object} params - Query parameters (category, status, year, search, page, per_page, etc.)
     */
    getAllPrograms: async (params = {}) => {
        try {
            const response = await axiosInstance.get('/v1/programs', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching programs:', error);
            throw error;
        }
    },

    /**
     * Get single program detail by slug
     * @param {String} slug - Program slug
     */
    getProgramBySlug: async (slug) => {
        try {
            const response = await axiosInstance.get(`/v1/programs/${slug}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching program:', error);
            throw error;
        }
    },

    /**
     * Get recent programs for sidebar
     * @param {Number} limit - Number of programs to fetch (default: 3)
     */
    getRecentPrograms: async (limit = 3) => {
        try {
            const response = await axiosInstance.get('/v1/programs-recent', {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching recent programs:', error);
            throw error;
        }
    },

    /**
     * Get all program categories
     */
    getCategories: async () => {
        try {
            const response = await axiosInstance.get('/v1/program-categories');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    /**
     * Get program status options
     */
    getStatusOptions: async () => {
        try {
            const response = await axiosInstance.get('/v1/program-status-options');
            return response.data;
        } catch (error) {
            console.error('Error fetching status options:', error);
            throw error;
        }
    },

    /**
     * Get program statistics
     */
    getStatistics: async () => {
        try {
            const response = await axiosInstance.get('/v1/program-statistics');
            return response.data;
        } catch (error) {
            console.error('Error fetching statistics:', error);
            throw error;
        }
    },

    // ==================== ADMIN APIs ====================

    /**
     * Admin: Get all programs with filters
     * @param {Object} params - Query parameters
     */
    adminGetAllPrograms: async (params = {}) => {
        try {
            const response = await axiosInstance.get('/admin/programs', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching programs:', error);
            throw error;
        }
    },

    /**
     * Admin: Create new program
     * @param {Object} programData - Program data including image file
     */
    adminCreateProgram: async (programData) => {
        try {
            const formData = new FormData();
            
            // Append all fields to FormData
            formData.append('name', programData.name);
            formData.append('category', programData.category);
            formData.append('location', programData.location);
            formData.append('latitude', programData.latitude);
            formData.append('longitude', programData.longitude);
            formData.append('description', programData.description);
            formData.append('status', programData.status);
            formData.append('year', programData.year);
            
            if (programData.target) {
                formData.append('target', programData.target);
            }

            // Append facilities array
            programData.facilities.forEach((facility, index) => {
                formData.append(`facilities[${index}]`, facility);
            });

            // Append image if exists
            if (programData.image) {
                formData.append('image', programData.image);
            }

            const response = await axiosInstance.post('/admin/programs', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating program:', error);
            throw error;
        }
    },

    /**
     * Admin: Update existing program
     * @param {Number} id - Program ID
     * @param {Object} programData - Updated program data
     */
    adminUpdateProgram: async (id, programData) => {
        try {
            const formData = new FormData();
            
            // Append all fields to FormData
            formData.append('name', programData.name);
            formData.append('category', programData.category);
            formData.append('location', programData.location);
            formData.append('latitude', programData.latitude);
            formData.append('longitude', programData.longitude);
            formData.append('description', programData.description);
            formData.append('status', programData.status);
            formData.append('year', programData.year);
            
            if (programData.target) {
                formData.append('target', programData.target);
            }

            // Append facilities array
            programData.facilities.forEach((facility, index) => {
                formData.append(`facilities[${index}]`, facility);
            });

            // Append new image if exists
            if (programData.image && programData.image instanceof File) {
                formData.append('image', programData.image);
            }

            // Mark if image should be removed
            if (programData.removeImage) {
                formData.append('remove_image', '1');
            }

            const response = await axiosInstance.post(`/admin/programs/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating program:', error);
            throw error;
        }
    },

    /**
     * Admin: Delete program
     * @param {Number} id - Program ID
     */
    adminDeleteProgram: async (id) => {
        try {
            const response = await axiosInstance.delete(`/admin/programs/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting program:', error);
            throw error;
        }
    },
};

export default programService;