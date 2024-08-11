import React, {useEffect} from 'react';
import {Outlet, Navigate, useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';

const ProtectedRoutes = () => {
	const {user, one_id} = useSelector((state) => state.user);
	const {pathname} = useLocation();
	
	useEffect(() => {
	}, [pathname]);
	
	return !one_id && (user ? <Outlet/> : <Navigate to="/login"/>);
	
};

export default ProtectedRoutes;
