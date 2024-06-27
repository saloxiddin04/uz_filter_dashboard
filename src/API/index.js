import axios from 'axios';
import {API_URL} from '../config';
import {toast} from "react-toastify";

const user = localStorage.getItem("access_token") || "";

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user}`
  }
})

instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${user ? user : ""}`
  return config
})

instance.interceptors.request.use(
  (config) => {
    if (user) {
      config.headers.Authorization = `Bearer ${user}`;
    }
    return config;
  },
  async (error) => {
    toast.error(error.message)
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.log('unauth')
      await localStorage.clear()
      window.location.href = '/login'
      window.location.reload()
    }
    return Promise.reject(error);
  }
);

export default instance