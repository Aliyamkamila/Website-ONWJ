// services/wilayahKerjaService.js
import api from './axios';

export const wilayahKerjaService = {
  // Get all areas (TEKKOM + TJSL)
  getAll: (params) => api.get('/v1/wilayah-kerja', { params }),
  
  // Get by category only
  getTekkom: () => api.get('/v1/wilayah-kerja?category=TEKKOM'),
  getTjsl: () => api.get('/v1/wilayah-kerja?category=TJSL'),
  
  // Get single area
  getById: (id, category) => api.get(`/v1/wilayah-kerja/${id}?category=${category}`),
  
  // Get statistics
  getStatistics: () => api.get('/v1/wilayah-kerja-statistics'),
  
  // Admin:  CRUD operations
  admin: {
    getAll: (params) => api.get('/v1/admin/wilayah-kerja', { params }),
    create: (data) => api.post('/v1/admin/wilayah-kerja', data),
    update: (id, data) => api.put(`/v1/admin/wilayah-kerja/${id}`, data),
    delete: (id, category) => api.delete(`/v1/admin/wilayah-kerja/${id}?category=${category}`),
    restore: (id, category) => api.post(`/v1/admin/wilayah-kerja/${id}/restore?category=${category}`),
  }
};