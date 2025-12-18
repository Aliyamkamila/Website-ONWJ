import api from '../api/axios';

export const hargaMinyakService = {
  // Public endpoints
  getAll: (params) => api.get('/v1/harga-minyak', { params }),
  
  getById: (id) => api.get(`/v1/harga-minyak/${id}`),
  
  getStatistics: (params) => api.get('/v1/harga-minyak-statistics', { params }),
  
  getLatest: (params) => api.get('/v1/harga-minyak-latest', { params }),

  // Admin:  CRUD operations
  admin:  {
    getAll: (params) => api.get('/admin/harga-minyak', { params }),
    
    create: (data) => api.post('/admin/harga-minyak', data),
    
    update: (id, data) => api.put(`/admin/harga-minyak/${id}`, data),
    
    delete: (id) => api.delete(`/admin/harga-minyak/${id}`),
    
    bulkStore: (data) => api.post('/admin/harga-minyak/bulk-store', data),
    
    bulkDelete: (ids) => api.post('/admin/harga-minyak/bulk-delete', { ids }),

    // Produksi bulanan (realisasi)
    getRealisasi: (params) => api.get('/admin/produksi-bulanan', { params }),
    
    storeRealisasi: (data) => api.post('/admin/produksi-bulanan', data),
  }
};

export default hargaMinyakService;