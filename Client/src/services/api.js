import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Services
export const studentService = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  exportCsv: () => api.get('/students/export/csv', { responseType: 'blob' })
};

export const codeforcesService = {
  getContestHistory: (studentId, days = 30) => api.get(`/codeforces/contests/${studentId}?days=${days}`),
  getProblemData: (studentId, days = 30) => api.get(`/codeforces/problems/${studentId}?days=${days}`),
  syncData: (studentId) => api.post(`/codeforces/sync/${studentId}`)
};

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me')
};

export default api;