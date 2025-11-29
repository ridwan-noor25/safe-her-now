/**
 * API service with JWT token handling
 * Automatically attaches JWT token to requests and handles authentication
 */
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

// Request interceptor: Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Validate token format (basic check)
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Invalid token format, remove it
        console.warn('Invalid token format detected, clearing token');
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle token expiration and validation errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 422) {
      // Token expired, invalid, or malformed
      const errorMessage = error.response?.data?.error || 'Authentication failed';
      console.error('Auth error:', errorMessage, error.response?.data);
      
      // Don't clear token if we're on auth pages (login/register)
      const isAuthPage = window.location.pathname.includes('/login') || 
                        window.location.pathname.includes('/register');
      
      if (!isAuthPage) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; full_name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user');
  },
};

// Reports API
export const reportsAPI = {
  getAll: (showAll = false) => api.get(`/reports${showAll ? '?all=true' : ''}`),
  getOne: (id: number) => api.get(`/reports/${id}`),
  create: (data: any) => api.post('/reports', data),
  update: (id: number, data: any) => api.put(`/reports/${id}`, data),
};

// File Upload API
export const uploadAPI = {
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Moderator API
export const moderatorAPI = {
  getQueue: (status = 'all') => api.get(`/moderator/reports?status=${status}`),
  getReviewedReports: (status = 'all') => api.get(`/moderator/reports/reviewed?status=${status}`),
  getReportDetails: (reportId: number) => api.get(`/moderator/reports/${reportId}`),
  addNote: (reportId: number, data: { note: string; status?: string }) =>
    api.post(`/moderator/reports/${reportId}/note`, data),
};

// Admin API
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  createUser: (data: { email: string; password: string; full_name: string; role: string }) =>
    api.post('/admin/users', data),
  updateUser: (userId: number, data: { is_active?: boolean }) =>
    api.put(`/admin/users/${userId}`, data),
  getStats: () => api.get('/admin/stats'),
  exportReports: () => api.get('/admin/reports/export', { responseType: 'blob' }),
};

export default api;

