/**
 * Axios instance for backend API calls.
 */
import axios from 'axios';
import { API_BASE_URL } from './config';

const TOKEN_KEY = 'publicvoice_token';

export const apiClient = axios.create({
  baseURL: API_BASE_URL.replace(/\/$/, ''),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
