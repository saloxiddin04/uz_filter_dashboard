import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { MdOutlineCancel } from 'react-icons/md';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';

import { useStateContext } from '../contexts/ContextProvider';
import { useSelector } from "react-redux";

const menuData = [
  {
    title: "Dashboard",
    path: "/dashboard",
  },
  {
    title: "Utils",
    children: [
      { name: "Category", path: "/category" },
      { name: "Attributes", path: "/attributes" },
      { name: "Brands", path: "/brands" },
    ],
  },
  {
    title: "Products",
    path: '/products'
  },
]

const Sidebar = () => {
  const { user } = useSelector((state) => state.user);
  const { currentColor, activeMenu, setActiveMenu, screenSize, setPage } = useStateContext();
  const { pathname } = useLocation();

  // Track open/close state for parent menus with children
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (title) => {
    setOpenMenus((prevState) => ({
      ...prevState,
      [title]: !prevState[title],
    }));
  };

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded text-white text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

  // Check if a parent menu is active based on the current path
  const isParentActive = (children) =>
    children?.some((child) => pathname.startsWith(child.path));

  return (
    <div className="h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="pl-3 flex justify-between items-center py-2" style={{ backgroundColor: currentColor }}>
            <Link
              to={pathname}
              onClick={handleCloseSideBar}
              className="ml-3 mt-2 py-2 text-white"
            >
              Logo
            </Link>
            <button
              type="button"
              onClick={() => setActiveMenu(!activeMenu)}
              style={{ color: currentColor }}
              className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
            >
              <MdOutlineCancel />
            </button>
          </div>

          {menuData.map((item) => (
            <div key={item.title} className="m-2">
              {/* Check if the item has children */}
              {item.children ? (
                <>
                  {/* Parent Section */}
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className={`flex justify-between items-center w-[95%] p-4 rounded hover:bg-light-gray ${
                      isParentActive(item.children) ? activeLink : normalLink
                    }`}
                    style={{
                      backgroundColor: isParentActive(item.children) ? currentColor : ''
                    }}
                  >
                    <span className="capitalize">{item.title}</span>
                    {openMenus[item.title] ? <AiOutlineUp /> : <AiOutlineDown />}
                  </button>

                  {/* Render children if the parent is open */}
                  {openMenus[item.title] && (
                    <div className="pl-6">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.name}
                          to={child.path}
                          onClick={() => {
                            setPage(1);
                            localStorage.setItem("currentPage", '1');
                          }}
                          style={({ isActive }) => ({
                            backgroundColor: isActive ? currentColor : '',
                          })}
                          className={({ isActive }) => (isActive ? activeLink : normalLink)}
                        >
                          <span className="capitalize">{child.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // Render a flat link for items without children
                <NavLink
                  to={item.path}
                  onClick={() => {
                    setPage(1);
                    localStorage.setItem("currentPage", '1');
                  }}
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? currentColor : '',
                  })}
                  className={({ isActive }) => (isActive ? activeLink : normalLink)}
                >
                  <span className="capitalize">{item.title}</span>
                </NavLink>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Sidebar;
