import React from 'react';
import {Outlet, Navigate, useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';
import Code from "../redux/slices/auth/Code";

const ProtectedRoutes = () => {
	const user = useSelector((state) => state.user.user);
	const {pathname} = useLocation()
	// const user = true;
	if (pathname === '/code') {
		return <Code />
	} else {
		return user ? <Outlet/> : <Navigate to="/login"/>;
	}
};

export default ProtectedRoutes;
