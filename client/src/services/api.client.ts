import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

// Response interceptor: unwrap data and normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error?.message ??
      error.response?.data?.message ??
      error.message ??
      'An unexpected error occurred';

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
