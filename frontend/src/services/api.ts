import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 Unauthorized (Refresh token logic can be added here)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // const originalRequest = error.config;
    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   try {
    //     const refreshToken = localStorage.getItem('refresh_token');
    //     const res = await axios.post(`${BASE_URL}/auth/refresh`, { refresh_token: refreshToken });
    //     const { access_token } = res.data;
    //     localStorage.setItem('access_token', access_token);
    //     api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    //     return api(originalRequest);
    //   } catch (refreshError) {
    //     localStorage.removeItem('access_token');
    //     localStorage.removeItem('refresh_token');
    //     window.location.href = '/login';
    //     return Promise.reject(refreshError);
    //   }
    // }
    return Promise.reject(error);
  }
);
