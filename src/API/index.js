import axios from 'axios';
import {API_URL, APIS} from '../config';

const user = localStorage.getItem("token") || "";

const getToken = () => {
  return localStorage.getItem("token") || "";
};

const logout = async () => {
  const tokens = {
    access: localStorage.getItem('access_token'),
    refresh_token: localStorage.getItem('refresh_token')
  };

  try {
    await axios.post(
      APIS.logOut,
      { "refresh_token": tokens.refresh_token },
      {
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
          'x-authentication': tokens.access
        }
      }
    );
  } catch (error) {
    console.log('Logout error:', error.message);
  } finally {
    localStorage.removeItem('user');
    localStorage.removeItem('oneIdCode');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = "/login";
  }
};

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  }
})

instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${user ? user : ""}`
  return config
})

instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      logout().then(r => r);
    }
    return Promise.reject(error);
  }
);

export default instance