import React, { useEffect } from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useStateContext } from './contexts/ContextProvider';
import Loader from './components/Loader';
import MainLayout from './Layout/MainLayout';
import AuthLayout from './Layout/AuthLayout';
import ProtectedRoutes from './utils/ProtectedRoutes';
import {Login} from './pages';
import {routes} from "./routes";

const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode } = useStateContext();
  const { loading, access_token } = useSelector((state) => state.user || {});

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
          {
            access_token ? <Route element={<ProtectedRoutes />}>
              <Route element={<MainLayout />}>
                <Route path="login" element={<Navigate to={'/dashboard'}/>} />
                <Route path="/" element={<Navigate to={'/dashboard'}/>} />
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
            </Route> : <Route element={<AuthLayout />}>
              <Route path="*" element={<Navigate to={'/login'}/>} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={loading ? <Loader /> : <Navigate to="login" replace />} />
            </Route>
          }
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
