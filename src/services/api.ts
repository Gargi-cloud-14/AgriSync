import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

/**
 * Centralized Axios API Client
 * Configured with baseURL from VITE_API_BASE_URL for future Node/Express & MongoDB integration.
 * Handled by Member 3 (Backend + MongoDB + Cloud).
 */
const BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer Token if logged in
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('agrisync_auth_token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Uniform error handling & status handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired or invalid token
      console.warn('[AgriSync API] Unauthorized access (401). Redirecting to login.');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        // Clear token but avoid hard refresh if on public pages
        localStorage.removeItem('agrisync_auth_token');
        localStorage.removeItem('agrisync_auth_user');
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Helper to safely query backend, falling back to local mock data
 * when the backend server is not yet running in student development environments.
 */
export async function fetchWithFallback<T>(
  apiCall: () => Promise<AxiosResponse<T>>,
  fallbackData: T
): Promise<T> {
  try {
    const response = await apiCall();
    return response.data;
  } catch (err) {
    // Graceful offline/demo mode for development until Node/Express backend is started
    console.info('[AgriSync Service Layer] Backend not reachable at ' + BASE_URL + '; using local demonstration dataset.');
    return fallbackData;
  }
}

export default apiClient;
