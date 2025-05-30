import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: 'https://13.203.227.147/api',
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
    (response) => {
        // Handle successful responses (including 201 Created)
        if (response.status >= 200 && response.status < 300) {
            return response;
        }
        return Promise.reject(response);
    },
    async (error) => {
        // Handle network errors
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout:', error);
            throw new Error('Request timed out. Please try again.');
        }
        
        // Handle no response
        if (!error.response) {
            console.error('No response received:', error);
            throw new Error('No response from server. Please check your connection and try again.');
        }

        // Handle specific status codes
        if (error.response.status === 201) {
            // 201 Created is actually a success
            return error.response;
        }

        // Handle other errors
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
);

export default api; 