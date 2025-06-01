import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: '/api',  // Using relative path that will be proxied through Netlify
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
        console.error('Request error:', error);
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
        
        // Handle specific error cases
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    throw new Error('Unauthorized. Please sign in again.');
                case 403:
                    throw new Error('Access denied. Please check your permissions.');
                case 404:
                    throw new Error('Resource not found. Please check the URL.');
                case 502:
                    throw new Error('Unable to connect to the server. Please try again later.');
                case 500:
                    throw new Error('Server error. Please try again later.');
                default:
                    throw new Error(error.response.data?.message || 'An error occurred. Please try again.');
            }
        }
        
        return Promise.reject(error);
    }
);

export default api; 