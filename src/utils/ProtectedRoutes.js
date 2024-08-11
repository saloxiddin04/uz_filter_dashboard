import React, {useEffect} from 'react';
import {Outlet, Navigate, useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';
import Code from "../redux/slices/auth/Code";

const ProtectedRoutes = () => {
	const {user} = useSelector((state) => state.user);
	const {pathname} = useLocation();
	
	useEffect(() => {
		if (pathname === '/code') {
			<Code/>;
		} else {
			user ? <Outlet/> : <Navigate to="/login"/>;
		}
	}, [pathname]);
	
	if (pathname === '/code') {
		return <Code/>;
	} else {
		return user ? <Outlet/> : <Navigate to="/login"/>;
	}
	
};

export default ProtectedRoutes;
