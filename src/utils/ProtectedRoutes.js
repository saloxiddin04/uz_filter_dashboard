import React, {useEffect} from 'react';
import {Outlet, Navigate, useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';

const ProtectedRoutes = () => {
	const {user, loading} = useSelector((state) => state.user);
	const {pathname} = useLocation();
	
	useEffect(() => {
	}, [pathname]);
	
	return !loading && (user ? <Outlet/> : <Navigate to="/login"/>);
	
};

export default ProtectedRoutes;
