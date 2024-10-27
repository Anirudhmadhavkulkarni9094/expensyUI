import axios from 'axios';

// Create an instance of Axios
const api = axios.create({
  baseURL: '/api', // Set your base URL here
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    // If the token exists, set the `x-auth-token` header
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
