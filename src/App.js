import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';
import './index.css';

import { useStateContext } from './contexts/ContextProvider';
import Loader from './components/Loader';
import MainLayout from './Layout/MainLayout';
import AuthLayout from './Layout/AuthLayout';
import ProtectedRoutes from './utils/ProtectedRoutes';
import { Orders, Employees, Customers, Login } from './pages';
import Code from './redux/slices/auth/Code';

const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode } = useStateContext();
  const { loading } = useSelector((state) => state.user);

  if (loading) return <Loader />;

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Orders />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/customers" element={<Customers />} />
            </Route>
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/code" element={<Code />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
