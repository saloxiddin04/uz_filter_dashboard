import React, {useEffect} from 'react';
import {Outlet, useLocation} from 'react-router-dom';
import {useDispatch} from "react-redux";
import {setLogout} from "../redux/slices/auth/authSlice";

const AuthLayout = () => {
  const {pathname} = useLocation();
  const dispatch = useDispatch()
  
  useEffect(() => {
    if (pathname === '/login') {
      dispatch(setLogout())
    }
  }, []);
  
  return (
    <div className="auth-layout">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
