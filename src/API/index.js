import axios from 'axios';
import {API_URL, APIS} from '../config';
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import {setLogout} from "../redux/slices/auth/authSlice";

const user = localStorage.getItem("access_token") || "";

const getToken = () => {
  return localStorage.getItem("access_token") || "";
};

const logout = async () => {
  const dispatch = useDispatch()

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
    dispatch(setLogout())
  } catch (error) {
    toast.error(error.message)
    console.log('Logout error:', error.message);
    dispatch(setLogout())
  } finally {
    dispatch(setLogout())
  }
};

console.log(user)

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
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
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
      await logout()
    }
    return Promise.reject(error);
  }
);

export default instance