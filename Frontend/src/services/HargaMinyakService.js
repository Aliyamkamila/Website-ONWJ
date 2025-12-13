import api from '../api/axios';

export const hargaMinyakService = {
  // Public endpoints
  getAll: (params) => api.get('/v1/harga-minyak', { params }),
  
  getById: (id) => api.get(`/v1/harga-minyak/${id}`),
  
  getStatistics: (params) => api.get('/v1/harga-minyak-statistics', { params }),
  
  getLatest: (params) => api.get('/v1/harga-minyak-latest', { params }),

  // Admin:  CRUD operations
  admin:  {
    getAll: (params) => api.get('/v1/admin/harga-minyak', { params }),
    
    create: (data) => api.post('/v1/admin/harga-minyak', data),
    
    update: (id, data) => api.put(`/v1/admin/harga-minyak/${id}`, data),
    
    delete: (id) => api.delete(`/v1/admin/harga-minyak/${id}`),
    
    bulkStore: (data) => api.post('/v1/admin/harga-minyak/bulk-store', data),
    
    bulkDelete: (ids) => api.post('/v1/admin/harga-minyak/bulk-delete', { ids }),

    // Realisasi Bulanan
    getRealisasi: (params) => api.get('/v1/admin/realisasi-bulanan', { params }),
    
    storeRealisasi: (data) => api.post('/v1/admin/realisasi-bulanan', data),
  }
};

export default hargaMinyakService;