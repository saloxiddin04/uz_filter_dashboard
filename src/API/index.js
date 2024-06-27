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

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('unauth')
      window.location.href = '/login'
      localStorage.clear()
      window.location.reload()
    }
    toast.error(error.message)
    return Promise.reject(error);
  }
);

export default instance