import React, { useEffect } from 'react';
import {BrowserRouter, Routes, Route, Navigate, useLocation} from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';
import './index.css';

import { useStateContext } from './contexts/ContextProvider';
import Loader from './components/Loader';
import MainLayout from './Layout/MainLayout';
import AuthLayout from './Layout/AuthLayout';
import ProtectedRoutes from './utils/ProtectedRoutes';
import {Login, NotFound} from './pages';
import Code from './redux/slices/auth/Code';
import {routes} from "./routes";

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
              {routes && routes.map((item, index) => {
                return (
                  <Route
                    key={index}
                    path={item.path}
                    element={<item.element />}
                  />
                )
              })}
            </Route>
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/code" element={<Code />} />
            <Route path="/" element={<Navigate to="login" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
