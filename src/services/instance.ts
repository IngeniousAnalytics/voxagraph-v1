// instance.ts
import { ENotify } from '@ai-dashboard/ui';
import axios, { AxiosInstance } from 'axios';

// Create instances
const dashApiClient = axios.create({
  baseURL: 'http://80.225.200.22:1312',
    //baseURL: 'http://127.0.0.1:8000',
});

// Function to get token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');
// Function to add interceptors to a given client
const addAuthInterceptor = (client: AxiosInstance) => {
  client.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        ENotify('warning', error.message);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        window.dispatchEvent(new Event('storage'));
        window.location.reload();
        console.error('API Error:', error.response?.data || error.message);
      } else {
        // localStorage.removeItem('authToken');
        // localStorage.removeItem('userInfo');
        // window.dispatchEvent(new Event('storage'));
        // window.location.reload();
        // console.error('API Error:', error.response?.data || error.message);
      }

      return Promise.reject(error);
    }
  );
};

// Manually apply interceptors to each client
addAuthInterceptor(dashApiClient);

// Export instances with custom names
export const dashApiInstance = dashApiClient;
