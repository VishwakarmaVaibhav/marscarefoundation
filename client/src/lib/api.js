import axios from 'axios';

const getBaseUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5003/api';
    // Remove trailing slash if present
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    // Ensure it ends with /api
    if (!url.endsWith('/api')) {
        url += '/api';
    }
    return url;
};

const API_URL = getBaseUrl();

export const api = axios.create({
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
    getCategories: () => api.get('/program-categories'),
};

export const blogsApi = {
    getAll: (params) => api.get('/blogs', { params }),
    getBySlug: (slug) => api.get(`/blogs/${slug}`),
    getCategories: () => api.get('/blogs/categories'),
};

export const galleryApi = {
    getAll: (params) => api.get('/gallery', { params }),
    getAlbums: () => api.get('/gallery/albums'),
};

export const donationsApi = {
    createOrder: (data) => api.post('/donations/create-order', data),
    verifyPayment: (data) => api.post('/donations/verify', data),
};

export const volunteersApi = {
    register: (data) => api.post('/volunteers/register', data),
};

export const contactApi = {
    submit: (data) => api.post('/contact', data),
};

export const settingsApi = {
    getAll: () => api.get('/settings'),
    get: (key) => api.get(`/settings/${key}`),
};



export default api;
