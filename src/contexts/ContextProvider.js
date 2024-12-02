import React, {createContext, useContext, useState} from 'react';

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState('#1A97F5');
  const [currentPage, setCurrentPage] = useState(localStorage.getItem("currentPage") ? parseInt(localStorage.getItem("currentPage")) : 1);
  const [page_size, setPageSize] = useState(localStorage.getItem("page_size") ? parseInt(localStorage.getItem("page_size")) : 10);
  const [currentMode, setCurrentMode] = useState('Light');
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  
  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem('themeMode', e.target.value);
  };

  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem('colorMode', color);
  };

  const setPage = (page) => {
    setCurrentPage(page)
    localStorage.setItem('currentPage', page)
  }

  const handleClick = (clicked) => setIsClicked({ ...initialState, [clicked]: true });
  const handleClose = (clicked) => setIsClicked({ ...initialState, [clicked]: false });

  return (
    <StateContext.Provider value={{ handleClose, currentColor, currentMode, activeMenu, screenSize, setScreenSize, handleClick, isClicked, initialState, setIsClicked, setActiveMenu, setCurrentColor, setCurrentMode, setMode, setColor, themeSettings, setThemeSettings, setPage, setCurrentPage, currentPage, page_size, setPageSize }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);