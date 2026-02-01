import axios from 'axios';

// Local dev: use Vite proxy (/api). Production: use full backend URL (Render).
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

export const auth = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me')
};

export const cars = {
  list: () => api.get('/cars'),
  create: (data) => api.post('/cars', data)
};

export const packages = {
  list: () => api.get('/packages'),
  create: (data) => api.post('/packages', data)
};

export const servicePackages = {
  list: () => api.get('/service-packages'),
  get: (id) => api.get(`/service-packages/${id}`),
  create: (data) => api.post('/service-packages', data),
  update: (id, data) => api.put(`/service-packages/${id}`, data),
  delete: (id) => api.delete(`/service-packages/${id}`)
};

export const payments = {
  list: () => api.get('/payments'),
  create: (data) => api.post('/payments', data)
};

export const reports = {
  daily: (date) => api.get('/reports/daily', { params: { date } })
};

export default api;
