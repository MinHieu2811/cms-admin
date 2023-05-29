import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { AUTH_TOKEN_KEY } from '../services/auth/AuthContext';
import { isBrowser } from '../utils/checkBrowser';

const axiosInstace = Axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "POST, PUT, PATCH, GET, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "*",
  },
  timeout: 30000,
});

const handleRefetchToken = async () => {
  try {
    return await Axios.get('/api/auth/refresh')?.then((res) => res?.data);
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

axiosInstace.interceptors.request.use(
  /* @ts-ignore */
  (config: AxiosRequestConfig) => {
    const isExternal = !!config?.url?.startsWith('http');
    /* @ts-enabled */
    const token = isBrowser ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
    const authHeaders =
      token && !isExternal ? { Authorization: `Bearer ${token}` } : {};
    return {
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
      ...config,
      headers: {
        ...authHeaders,
        ...config?.headers,
      },
    };
  },
  async (err: AxiosError) => {
    return Promise.reject(err)
  }
);

axiosInstace.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response?.headers['x-total-count']) {
      return {
        content: response?.data,
        totalItems: response?.headers['x-total-count'],
      };
    }
    return response?.data;
  },
  async (err) => {
    const originalConfig = err.config;
    if (err.response) {
      if (err.response.status === 401 && !originalConfig?._retry) {
        originalConfig._retry = true;
        const accessToken = await handleRefetchToken();
        if (window) window.localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
        Axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        return axiosInstace({
          baseURL: "http://localhost:3000",
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
      }
    }
  }
);

export {axiosInstace}