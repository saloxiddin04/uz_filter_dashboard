import React from 'react';
import {Link, NavLink, useLocation} from 'react-router-dom';
import {MdOutlineCancel} from 'react-icons/md';
// import {TooltipComponent} from '@syncfusion/ej2-react-popups';

import {useStateContext} from '../contexts/ContextProvider';
import {useSelector} from "react-redux";
import Loader from "./Loader";
import Logo from "../assets/images/logo";

const Sidebar = () => {
  const {loading, sidebar} = useSelector(state => state.sections)
  const {currentColor, activeMenu, setActiveMenu, screenSize} = useStateContext();
  const {pathname} = useLocation();

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded  text-white  text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

  function filterBySlug() {
    const matchedPermission = sidebar?.permissions.find(permission => `${permission.slug}` === pathname.split('/')[1]);
    return matchedPermission ? matchedPermission.children : [];
  }

  const children = filterBySlug();

  const slugs = ['vps', 'colocation', 'e-xat', 'expertise', 'tte_certification'];
  const slugsRegistry = ['vps', 'colocation'];

  if (loading) return <Loader/>

  return (
    <div className="h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="pl-3 flex justify-between items-center py-2" style={{backgroundColor: currentColor}}>
            <Link
              to={pathname} onClick={handleCloseSideBar}
              className="ml-3 mt-2"
            >
              <Logo/>
            </Link>
            {/*<TooltipComponent content="Menu" position="BottomCenter">*/}
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{color: currentColor}}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel/>
              </button>
            {/*</TooltipComponent>*/}
          </div>
          <div className="pl-3 mt-5">
            {children.length === 0 && (
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
                <NavLink
                  to={`/xizmatlar`}
                  onClick={() => {
                    localStorage.setItem("currentPage", '1');
                    handleCloseSideBar();
                  }}
                  style={({isActive}) => ({
                    backgroundColor: isActive ? currentColor : '',
                  })}
                  className={({isActive}) => (isActive ? activeLink : normalLink)}
                >
                  <span className="capitalize">Xizmatlar</span>
                </NavLink>
              </div>
            )}
            {pathname.indexOf('/shartnomalar') === 0 ? (
              children && children.filter(item => slugs.includes(item?.slug))?.map((item) => {
                const newPath = `${pathname.split('/')[1]}/${item.slug}`;
                return (
                  <div key={item.slug}>
                    <NavLink
                      to={newPath}
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
                )
              })) : pathname.indexOf('/registry') === 0 ? (
              children && children.filter(item => slugsRegistry.includes(item?.slug))?.map((item) => {
                const newPath = `${pathname.split('/')[1]}/${item.slug}`;
                return (
                  <div key={item.slug}>
                    <NavLink
                      to={newPath}
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
                )
              })) : (
              children && children.map((item) => {
                const newPath = `${pathname.split('/')[1]}/${item.slug}`;
                return (
                  <div key={item.slug}>
                    <NavLink
                      to={newPath}
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
                )
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
