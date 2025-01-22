import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || '';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

// Add request interceptor for authentication
api.interceptors.request.use(
  async (config) => {
    try {
      // Add any auth tokens or headers here
            const token = await getAuthToken();
      
      async function getAuthToken(): Promise<string | null> {
        // Implement your logic to get the auth token here
        return localStorage.getItem('authToken');
      }
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error adding auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
