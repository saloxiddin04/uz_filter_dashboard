import axios from 'axios';
import {api_url} from '../config';
import {toast} from "react-toastify";

const access_token = localStorage.getItem("access") || "";
const res = localStorage.getItem("res");
const pin_or_tin = res ? JSON.parse(res) : [];

console.log('pin_or_tin?.tin_or_pin', pin_or_tin?.tin_or_pin)

const instance = axios.create({
  baseURL: api_url,
  headers: {
    "Content-Type": "application/json",
    "PINORTIN": pin_or_tin?.tin_or_pin
  }
})

if (access_token) {
  instance.defaults.headers.common = { Authorization: `Bearer ${access_token}` };
}

instance.interceptors.request.use(
  (config) => {
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
      config.headers['PINORTIN'] = pin_or_tin?.tin_or_pin
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
  (error) => {
    if (access_token && error.response.status === 401) {
      window.location.href = '/login'
      localStorage.clear()
      window.location.reload()
    }
    toast.error(error.message)
    return Promise.reject(error);
  }
);

export default instance