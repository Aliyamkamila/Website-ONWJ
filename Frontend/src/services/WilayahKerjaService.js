// services/wilayahKerjaService.js
import api from '../api/axios';

export const wilayahKerjaService = {
  // Get all areas (TEKKOM + TJSL)
  getAll: (params) => api.get('/v1/wilayah-kerja', { params }),
  
  // Get by category only
  getTekkom: () => api.get('/v1/wilayah-kerja', { params: {category: 'TEKKOM'} }),
  getTjsl: () => api.get('/v1/wilayah-kerja', { params: {category: 'TJSL'} }),
  
  // Get single area
  getById: (id, category) => api.get(`/v1/wilayah-kerja/${id}`, {
    params: {category}
  }),
  
  // Get statistics
  getStatistics: () => api.get('/v1/wilayah-kerja-statistics'),
  
  // Admin:  CRUD operations
  admin: {
    getAll: (params) => {
      console.log('📋 Fetching admin wilayah-kerja with params:', params);
      return api.get('/v1/admin/wilayah-kerja', { params });
    },
    create: (data) => api.post('/v1/admin/wilayah-kerja', data),
    update: (id, data) => api.put(`/v1/admin/wilayah-kerja/${id}`, data),
    delete: (id, category) => api.delete(`/v1/admin/wilayah-kerja/${id}`, {
      params: { category }
    }),
    restore: (id, category) => api.post(`/v1/admin/wilayah-kerja/${id}/restore`, null, {
      params: { category }
    }),
  },
};