import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Sidebar, Footer, ThemeSettings } from '../components';
// import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { FiSettings } from 'react-icons/fi';
import { useStateContext } from '../contexts/ContextProvider';

const MainLayout = () => {
  const { setCurrentColor, currentColor, themeSettings, setThemeSettings, currentMode, activeMenu } = useStateContext();

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <div className="flex relative dark:bg-main-dark-bg">
        <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
          {/*<TooltipComponent content="Settings" position="Top">*/}
            <button
              type="button"
              onClick={() => setThemeSettings(true)}
              style={{ background: currentColor, borderRadius: '50%' }}
              className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
            >
              <FiSettings />
            </button>
          {/*</TooltipComponent>*/}
        </div>
        {activeMenu ? (
          <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
            <Sidebar />
          </div>
        ) : (
          <div className="w-0 dark:bg-secondary-dark-bg">
            <Sidebar />
          </div>
        )}
        <div
          className={
            activeMenu
              ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  '
              : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
          }
        >
          <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full" style={{backgroundColor: currentColor}}>
            <Navbar />
          </div>
          {themeSettings && <ThemeSettings />}
          <div className="pt-14">
            <Outlet />
          </div>
          {/*<Footer />*/}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
