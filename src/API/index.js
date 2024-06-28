import axios from 'axios';
import {API_URL} from '../config';
import {toast} from "react-toastify";

const access_token = localStorage.getItem("access_token") || "";

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${access_token}`
  }
})

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