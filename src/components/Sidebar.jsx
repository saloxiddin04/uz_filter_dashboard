import React, {useEffect, useState} from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { MdOutlineCancel } from 'react-icons/md';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';

import { useStateContext } from '../contexts/ContextProvider';
import {useDispatch, useSelector} from "react-redux";
import {getAllWarehouses} from "../redux/slices/warehouse/warehouseSlice";

const menuData = [
  {
    title: "Статистика",
    path: "/dashboard",
  },
  {
    title: "Склады",
    path: "/warehouse",
    children: []
  },
  {
    title: "Продукты",
    path: '/products'
  },
  {
    title: "Утилиты",
    children: [
      { name: "Категория", path: "/category" },
      { name: "Атрибуты", path: "/attributes" },
      { name: "Бренды", path: "/brands" },
    ],
  },
  {
    title: "Сотрудники",
    path: '/employees'
  },
  {
    title: "Складской перенос",
    path: "/transfer"
  }
]

const Sidebar = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user);
  const { currentColor, activeMenu, setActiveMenu, screenSize, setPage } = useStateContext();
  const { pathname } = useLocation();
  
  const {warehouses} = useSelector(state => state.warehouse)

  // Track open/close state for parent menus with children
  const [openMenus, setOpenMenus] = useState({});
  
  useEffect(() => {
    dispatch(getAllWarehouses())
  }, [])

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
  
  const updateMenuDataWithWarehouses = (menuData, warehouses) => {
    const warehouseMenu = menuData.find((item) => item.title === "Склады");
    
    if (warehouseMenu) {
      warehouseMenu.children = [
        {name: "Все склады", path: '/warehouses'},
        ...(warehouses?.map((warehouse) => ({
          name: warehouse?.name,
          path: `/warehouse/products/${warehouse?.id}`,
        })) || []),
      ];
    }
    
    return menuData;
  };
  
  const updatedMenuData = updateMenuDataWithWarehouses(menuData, warehouses);

  return (
    <div className="h-screen pb-10">
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
          
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-80px)]">
            {updatedMenuData.map((item) => (
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
                            state={{name: child.name}}
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
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
