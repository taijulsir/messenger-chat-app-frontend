import axios from 'axios';
import { useRouter } from 'next/navigation'; // For redirecting to login page

// Create Axios instance with default settings
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5012/api', // Update with your API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token from localStorage to Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');  // Get token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 Unauthorized and redirect to login page
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const router = useRouter();
      router.push('/auth/login');  // Redirect to login page if 401 error occurs
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
