import React from 'react';
import {Link, NavLink} from 'react-router-dom';
import {MdOutlineCancel} from 'react-icons/md';
import {TooltipComponent} from '@syncfusion/ej2-react-popups';

import {useStateContext} from '../contexts/ContextProvider';
import {useSelector} from "react-redux";
import Loader from "./Loader";

const Sidebar = () => {
  const {sections, loading} = useSelector(state => state.sections)
  const {currentColor, activeMenu, setActiveMenu, screenSize} = useStateContext();

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded  text-white  text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

  if (loading) return <Loader/>

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link to="/" onClick={handleCloseSideBar}
                  className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900">
              <span>UNICON.UZ</span>
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{color: currentColor}}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel/>
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-10 ">
            <div>
              <NavLink
                to={`/dashboard`}
                onClick={() => {
                  localStorage.setItem("currentPage", '1');
                  handleCloseSideBar();
                }}
                style={({isActive}) => ({
                  backgroundColor: isActive ? currentColor : '',
                })}
                className={({isActive}) => (isActive ? activeLink : normalLink)}
              >
                <span className="capitalize">Statistika</span>
              </NavLink>
            </div>
            {sections && sections.map((item) => (
              <div key={item.slug}>
                <NavLink
                  to={`/${item.slug}`}
                  key={item.slug}
                  onClick={() => {
                    localStorage.setItem("currentPage", '1');
                    handleCloseSideBar();
                  }}
                  style={({isActive}) => ({
                    backgroundColor: isActive ? currentColor : '',
                  })}
                  className={({isActive}) => (isActive ? activeLink : normalLink)}
                >
                  <span className="capitalize">{item.name}</span>
                </NavLink>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
