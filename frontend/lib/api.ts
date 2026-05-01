import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({ baseURL });

let accessToken: string | null = null;
let refreshToken: string | null = null;

export function setTokens(access: string | null, refresh: string | null) {
  accessToken = access;
  refreshToken = refresh;
  if (typeof window !== 'undefined') {
    if (access) localStorage.setItem('accessToken', access);
    else localStorage.removeItem('accessToken');
    if (refresh) localStorage.setItem('refreshToken', refresh);
    else localStorage.removeItem('refreshToken');
  }
}

export function loadStoredTokens() {
  if (typeof window === 'undefined') return;
  accessToken = localStorage.getItem('accessToken');
  refreshToken = localStorage.getItem('refreshToken');
  return { accessToken, refreshToken };
}

export function getAccessToken() {
  return accessToken;
}

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined' && !accessToken) {
    accessToken = localStorage.getItem('accessToken');
  }
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    const rt = refreshToken || (typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null);
    if (error.response?.status === 401 && !original._retry && rt) {
      original._retry = true;
      try {
        const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken: rt });
        setTokens(data.accessToken, data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        setTokens(null, null);
      }
    }
    return Promise.reject(error);
  }
);
