import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import { Message } from '@arco-design/web-vue';
import type { ResultVO } from '@/types/api';

const service = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

service.interceptors.response.use(
  (response: AxiosResponse<ResultVO<unknown>>) => {
    return response;
  },
  (error) => {
    let message = '网络异常，请稍后再试';
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 401:
          message = '登录已过期，请重新登录';
          localStorage.removeItem('token');
          break;
        case 500:
          message = '服务器内部错误';
          break;
        default:
          message = `请求失败 (${status})`;
      }
    } else if (error.request) {
      message = '网络连接失败，请检查网络';
    }
    Message.error(message);
    return Promise.reject(error);
  }
);

export default service;
