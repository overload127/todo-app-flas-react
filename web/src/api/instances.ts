import * as axios from 'axios';
import { toast } from 'react-toastify';

import baseURL from './config';

const instance = axios.default.create({
  withCredentials: true,
  baseURL,
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (
      error.response &&
      error.response?.status === 401 &&
      error.response.config.url !== '/token/auth' &&
      error.response.config.url !== '/token/refresh'
    ) {
      toast.error('Это действие доступно только авторизованным пользователям. Выполните вход.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    }

    throw error;
  },
);

export default instance;
