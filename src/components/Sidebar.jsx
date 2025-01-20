import React from 'react';
import {Link, NavLink, useLocation} from 'react-router-dom';
import {MdOutlineCancel} from 'react-icons/md';

import {useStateContext} from '../contexts/ContextProvider';
import {useSelector} from "react-redux";

const Sidebar = () => {
  const {user} = useSelector(state => state.user)
  const {currentColor, activeMenu, setActiveMenu, screenSize, setPage, setCurrentPage, setPageSize} = useStateContext();
  const {pathname} = useLocation();

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded  text-white  text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';
  
  // if (loading) return <Loader/>

  return (
    <div className="h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="pl-3 flex justify-between items-center py-2" style={{backgroundColor: currentColor}}>
            <Link
              to={pathname} onClick={handleCloseSideBar}
              className="ml-3 mt-2 py-2 text-white"
            >
              Logo
            </Link>
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{color: currentColor}}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel/>
              </button>
          </div>
          <NavLink
            to={`/dashboard`}
            onClick={() => {
              setPage(1)
              localStorage.setItem("currentPage", '1');
              // handleCloseSideBar();
            }}
            style={({isActive}) => ({
              backgroundColor: isActive ? currentColor : '',
            })}
            className={({isActive}) => (isActive ? activeLink : normalLink)}
          >
            <span className="capitalize">Dashboard</span>
          </NavLink>
          <NavLink
            to={`/category`}
            onClick={() => {
              setPage(1)
              localStorage.setItem("currentPage", '1');
              // handleCloseSideBar();
            }}
            style={({isActive}) => ({
              backgroundColor: isActive ? currentColor : '',
            })}
            className={({isActive}) => (isActive ? activeLink : normalLink)}
          >
            <span className="capitalize">Category</span>
          </NavLink>
        </>
      )}
    </div>
  );
};

export default Sidebar;
