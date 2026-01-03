import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('vendor');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    verifyFSSAI: (fssaiNumber) => api.post('/auth/verify-fssai', { fssaiNumber }),
    signup: (data) => api.post('/auth/signup', data),
    login: (fssaiNumber, password) => api.post('/auth/login', { fssaiNumber, password })
};

// Vendor APIs
export const vendorAPI = {
    getProfile: () => api.get('/vendor/profile'),
    updateProfile: (data) => api.put('/vendor/profile', data),
    updateLocation: (data) => api.put('/vendor/location', data)
};

// Listings APIs
export const listingsAPI = {
    getAll: (params = {}) => api.get('/listings', { params }),
    getById: (id) => api.get(`/listings/${id}`),
    create: (data) => api.post('/listings', data),
    update: (id, data) => api.put(`/listings/${id}`, data),
    delete: (id) => api.delete(`/listings/${id}`),
    toggle: (id) => api.patch(`/listings/${id}/toggle`)
};

// Prices APIs
export const pricesAPI = {
    getAll: (params = {}) => api.get('/prices', { params }),
    getCommodities: () => api.get('/prices/commodities')
};

export default api;
