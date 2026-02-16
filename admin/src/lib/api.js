import axios from 'axios';

let API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003/api';

// Ensure API_URL ends with /api for consistency
if (API_URL && !API_URL.endsWith('/api')) {
    API_URL = `${API_URL}${API_URL.endsWith('/') ? '' : '/'}api`;
}

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for auth token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }
        }
        return Promise.reject(error);
    }
);

// API methods
export const programsApi = {
    getAll: (params) => api.get('/programs', { params }),
    getFeatured: () => api.get('/programs/featured'),
    getBySlug: (slug) => api.get(`/programs/${slug}`),
    getCategories: () => api.get('/programs/categories'),
    create: (data) => api.post('/programs', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, data) => api.put(`/programs/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => api.delete(`/programs/${id}`),
};

export const galleryApi = {
    getAll: (params) => api.get('/gallery', { params }),
    getAlbums: () => api.get('/gallery/albums'),
    upload: (data) => api.post('/gallery', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => api.delete(`/gallery/${id}`),
};

export const settingsApi = {
    getAll: () => api.get('/settings'),
    get: (key) => api.get(`/settings/${key}`),
    updateAll: (data) => api.put('/settings', data),
    update: (key, value) => api.put(`/settings/${key}`, { value }),
};

export const blogsApi = {
    getAll: (params) => api.get('/blogs', { params }),
    get: (id) => api.get(`/blogs/${id}`),
    create: (data) => api.post('/blogs', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, data) => api.put(`/blogs/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => api.delete(`/blogs/${id}`),
};

export const dashboardApi = {
    getStats: () => api.get('/dashboard/stats'),
};

export default api;
