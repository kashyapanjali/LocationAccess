import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: 'https://brainbrief.in/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        // Add timestamp to prevent caching
        config.params = { ...config.params, _t: Date.now() };
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.code === 'ECONNABORTED' || !error.response) {
            // Handle timeout or network errors
            console.error('Network error:', error);
            throw new Error('Network error. Please check your connection and try again.');
        }
        return Promise.reject(error);
    }
);

export default api; 