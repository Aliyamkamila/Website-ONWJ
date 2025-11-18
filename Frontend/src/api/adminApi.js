import axiosInstance from './axios';

export const adminApi = {
  // Get all admins
  getAdmins: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/admin/admins', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch admins' };
    }
  },

  // Get single admin
  getAdmin: async (id) => {
    try {
      const response = await axiosInstance.get(`/admin/admins/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch admin' };
    }
  },

  // Create admin
  createAdmin: async (data) => {
    try {
      const response = await axiosInstance.post('/admin/admins', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create admin' };
    }
  },

  // Update admin
  updateAdmin: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/admin/admins/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update admin' };
    }
  },

  // Delete admin
  deleteAdmin: async (id) => {
    try {
      const response = await axiosInstance.delete(`/admin/admins/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete admin' };
    }
  },
};