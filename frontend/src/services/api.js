import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach merchant JWT if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('poc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle auth failures
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.response?.data?.error || '';
    const isAuthError = status === 401 ||
      (status === 400 && message.toLowerCase().includes('invalid token'));

    if (isAuthError) {
      // Token expired or invalid — clear and redirect
      localStorage.removeItem('poc_token');
      localStorage.removeItem('poc_merchantId');
      localStorage.removeItem('poc_user_token');
      localStorage.removeItem('poc_userId');

      const publicPaths = ['/', '/about', '/merchant/login', '/merchant/register', '/user/login', '/user/register'];
      const currentPath = window.location.pathname;
      const isPublic = publicPaths.some(path => currentPath === path) ||
                       currentPath.startsWith('/pay/') ||
                       currentPath.startsWith('/payment/status/');

      if (!isPublic) {
        window.location.href = '/merchant/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_URL };
