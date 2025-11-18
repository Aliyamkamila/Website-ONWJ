import axiosInstance from './axios';
import Cookies from 'js-cookie';

export const authApi = {
  // Login
  login: async (credentials) => {
    try {
      console.log('Attempting login with:', { email: credentials.email });
      
      const response = await axiosInstance.post('/tukang-minyak-dan-gas/login', credentials);
      
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        // Save token and user data
        Cookies.set('admin_token', response.data.data.token, { 
          expires: 1,
          sameSite: 'lax',
          secure: false, // false untuk http, true untuk https
        });
        Cookies.set('admin_user', JSON.stringify(response.data.data.admin), { 
          expires: 1,
          sameSite: 'lax',
          secure: false,
        });
        
        console.log('Token saved to cookie');
      }
      
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      
      // Better error message
      if (error.code === 'ERR_NETWORK') {
        throw { 
          message: 'Tidak dapat terhubung ke server. Pastikan backend berjalan di http://localhost:8000' 
        };
      }
      
      if (error.response?.status === 0) {
        throw { 
          message: 'CORS error. Periksa konfigurasi backend Laravel.' 
        };
      }
      
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Logout
  logout: async () => {
    try {
      await axiosInstance.post('/admin/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      Cookies.remove('admin_token');
      Cookies.remove('admin_user');
    }
  },

  // Get current user
  me: async () => {
    try {
      const response = await axiosInstance.get('/admin/me');
      
      if (response.data.success) {
        // Update cookie with fresh data
        Cookies.set('admin_user', JSON.stringify(response.data.data), { expires: 1 });
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get user data' };
    }
  },

  // Refresh token
  refresh: async () => {
    try {
      const response = await axiosInstance.post('/admin/refresh');
      
      if (response.data.success) {
        Cookies.set('admin_token', response.data.data.token, { expires: 1 });
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to refresh token' };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = Cookies.get('admin_token');
    return !!token;
  },

  // Get current user from cookie
  getCurrentUser: () => {
    const userStr = Cookies.get('admin_user');
    return userStr ? JSON.parse(userStr) : null;
  },
};