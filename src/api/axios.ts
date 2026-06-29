import axios from 'axios';

// Get the base URL from Vite environment variables or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Basic recursive sanitization function for frontend payloads
const sanitizePayload = (data: any): any => {
  if (typeof data === 'string') {
    // Basic protection: Remove <script> tags and encode common dangerous characters
    return data
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript URI
      .replace(/on\w+=/gi, ''); // Remove inline event handlers
  }
  if (Array.isArray(data)) {
    return data.map(sanitizePayload);
  }
  if (data !== null && typeof data === 'object') {
    const sanitized: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        sanitized[key] = sanitizePayload(data[key]);
      }
    }
    return sanitized;
  }
  return data;
};

// Request interceptor to add the auth token to headers and sanitize payload
api.interceptors.request.use(
  (config) => {
    // Sanitize outgoing request payload
    if (config.data) {
      config.data = sanitizePayload(config.data);
    }

    const token = localStorage.getItem('buyer_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Pass the currently selected language to the backend
    const currentLang = localStorage.getItem('buyer_language') || 'en';
    config.headers['Accept-Language'] = currentLang;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry / unauthorized requests
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login if unauthorized
      // Only redirect if we are not already on the landing page or login related flows
      localStorage.removeItem('buyer_token');
      localStorage.removeItem('buyer_user');

      const isPublicRoute = window.location.pathname === '/' || window.location.pathname === '/login';
      if (!isPublicRoute) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);


export default api;
