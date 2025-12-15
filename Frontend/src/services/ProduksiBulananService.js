import api from '../api/axios';

export const produksiBulananService = {
  // Public endpoints
  getAll: (params) => api.get('/v1/produksi-bulanan', { params }),
  
  getById: (id) => api.get(`/v1/produksi-bulanan/${id}`),
  
  getStatistics: (params) => api.get('/v1/produksi-bulanan-statistics', { params }),

  // Admin: CRUD operations
  admin: {
    getAll: (params) => {
      console.log('📋 Fetching admin produksi with params:', params);
      return api.get('/v1/admin/produksi-bulanan', { params });
    },
    
    create: (data) => {
      console.log('📝 Creating produksi:', data);
      return api.post('/v1/admin/produksi-bulanan', data);
    },
    
    update: (id, data) => {
      console.log('✏️ Updating produksi:', id, data);
      return api.put(`/v1/admin/produksi-bulanan/${id}`, data);
    },
    
    delete: (id) => {
      console.log('🗑️ Deleting produksi:', id);
      return api.delete(`/v1/admin/produksi-bulanan/${id}`);
    },

    getAreas: () => {
      console.log('📍 Fetching available areas');
      return api.get('/v1/admin/produksi-bulanan/areas');
    },
  },
};

export default produksiBulananService;
