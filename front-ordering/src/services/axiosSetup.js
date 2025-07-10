import axios from 'axios';
import { refreshMerchantAccessToken } from './auth'; // Your refresh function

export function setupMerchantAxiosInterceptors() {
  axios.defaults.withCredentials = true; // Always send cookies!

  axios.interceptors.response.use(
    response => response,
    async error => {
      if (error.response && error.response.status === 401) {
        const success = await refreshMerchantAccessToken();
        if (success) {
          error.config._retry = true; // prevent infinite retry loops
          return axios(error.config); // retry original request
        }
      }
      return Promise.reject(error);
    }
  );
}