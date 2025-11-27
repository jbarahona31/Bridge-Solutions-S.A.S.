import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  }
};

export const cotizacionService = {
  create: async (cotizacionData) => {
    const response = await api.post('/cotizaciones', cotizacionData);
    return response.data;
  },

  getMyCotizaciones: async () => {
    const response = await api.get('/cotizaciones/mis-cotizaciones');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/cotizaciones/${id}`);
    return response.data;
  },

  update: async (id, cotizacionData) => {
    const response = await api.put(`/cotizaciones/${id}`, cotizacionData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/cotizaciones/${id}`);
    return response.data;
  },

  // Admin functions
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/cotizaciones?${params}`);
    return response.data;
  },

  updateEstado: async (id, estadoData) => {
    const response = await api.patch(`/cotizaciones/${id}/estado`, estadoData);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/cotizaciones/admin/stats');
    return response.data;
  }
};

export const documentoService = {
  upload: async (formData) => {
    const response = await api.post('/documentos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getMyDocumentos: async () => {
    const response = await api.get('/documentos/mis-documentos');
    return response.data;
  },

  getByCotizacion: async (cotizacionId) => {
    const response = await api.get(`/documentos/cotizacion/${cotizacionId}`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/documentos/${id}`);
    return response.data;
  },

  // Admin function
  getAll: async () => {
    const response = await api.get('/documentos');
    return response.data;
  }
};

export const usuarioService = {
  getAll: async () => {
    const response = await api.get('/usuarios');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  }
};
