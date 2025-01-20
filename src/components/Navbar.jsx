import React, {useEffect} from 'react';
import {Link, NavLink, useLocation, useNavigate, useNavigation} from 'react-router-dom';
import {AiOutlineMenu} from 'react-icons/ai';
import {MdKeyboardArrowDown} from 'react-icons/md';
// import {TooltipComponent} from '@syncfusion/ej2-react-popups';

import {useStateContext} from '../contexts/ContextProvider';

import {useSelector} from "react-redux";
import UserProfile from "./UserProfile";
import {Loader} from "./index";


const NavButton = ({title, customFunc, icon, color, dotColor}) => (
  // <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{color}}
      className="relative text-xl rounded-full p-3"
    >
      <span
        style={{background: dotColor}}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  // </TooltipComponent>
);

const Navbar = () => {
  const {user} = useSelector((state) => state.user)
  // const {sidebar, loading} = useSelector(state => state.sections)

  const {currentColor, activeMenu, setActiveMenu, handleClick, setScreenSize, screenSize, isClicked, setPage, handleClose} = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);
  
  const activeLink = 'flex items-center gap-5 p-2.5 rounded font-semibold text-white text-md m-2 border-b border-neutral-50';
  const normalLink = 'flex items-center gap-5 p-2.5 rounded font-semibold text-md text-gray-300 dark:text-gray-200' +
    ' dark:hover:text-black hover:bg-gray-100 hover:text-black m-2';

  return (
    <div
      className="flex justify-between items-center p-2 md:ml-6 fixed top-0 right-0 z-50"
      style={{
        background: currentColor,
        width: activeMenu ? '85%' : '100%',
      }}
    >
      <NavButton title="Menu" customFunc={handleActiveMenu} color={'#fff'} icon={<AiOutlineMenu/>}/>
      <div className="relative flex items-center gap-5">
        {/*<div>*/}
        {/*  <NavLink*/}
        {/*    to={`/dashboard`}*/}
        {/*    onClick={() => {*/}
        {/*      setPage(1)*/}
        {/*      localStorage.setItem("currentPage", '1');*/}
        {/*      // handleCloseSideBar();*/}
        {/*    }}*/}
        {/*    style={({isActive}) => ({*/}
        {/*      backgroundColor: isActive ? currentColor : '',*/}
        {/*    })}*/}
        {/*    className={({isActive}) => (isActive ? activeLink : normalLink)}*/}
        {/*  >*/}
        {/*    <span className="capitalize">Statistika</span>*/}
        {/*  </NavLink>*/}
        {/*</div>*/}
        {/*{sidebar?.permissions && sidebar?.permissions?.map((item, index) => (*/}
        {/*  <div key={index}>*/}
        {/*    <NavLink*/}
        {/*      to={`/${item.slug}`}*/}
        {/*      key={item.slug}*/}
        {/*      onClick={() => {*/}
        {/*        setPage(1)*/}
        {/*        localStorage.setItem("currentPage", '1');*/}
        {/*      }}*/}
        {/*      style={({isActive}) => ({*/}
        {/*        backgroundColor: isActive ? currentColor : '',*/}
        {/*      })}*/}
        {/*      className={({isActive}) => (isActive ? activeLink : normalLink)}*/}
        {/*    >*/}
        {/*      <span className="capitalize">{item.name}</span>*/}
        {/*    </NavLink>*/}
        {/*  </div>*/}
        {/*))}*/}
      </div>
      <div className="flex">
        {/*<TooltipComponent content="Profile" position="BottomCenter">*/}
          <div
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray hover:text-gray-900 rounded-lg userProfile"
            onClick={() => handleClick('userProfile')}
          >
            <span className="text-white-400 font-bold ml-1 text-14 flex items-center gap-2 hover:text-gray-900">
              <svg
                className='w-10 h-10 rounded-full'
                xmlns='http://www.w3.org/2000/svg'
                role='img'
                aria-label='Placeholder: Thumbnail'
                preserveAspectRatio='xMidYMid slice'
                focusable='false'
              >
                <title>Placeholder</title>
                <rect width='100%' height='100%' fill='#55595c'></rect>
                <text x={'35%'} y={'65%'} fill={'#fff'} className='text-lg text-uppercase p-0 m-0'>
                    {user?.first_name?.charAt(0)}
                </text>
              </svg>
              <h1 className="text-neutral-50">{user?.first_name}</h1>
            </span>
            <MdKeyboardArrowDown className="text-gray-400 text-14"/>
          </div>
        {/*</TooltipComponent>*/}

        {isClicked.userProfile && (<UserProfile onClose={handleClose} />)}
      </div>
    </div>
  );
};

export default Navbar;
