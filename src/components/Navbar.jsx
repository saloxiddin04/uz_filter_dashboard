import React, {useEffect} from 'react';
import {AiOutlineMenu} from 'react-icons/ai';
import {MdKeyboardArrowDown} from 'react-icons/md';
import {TooltipComponent} from '@syncfusion/ej2-react-popups';

import avatar from '../data/avatar.jpg';
import {useStateContext} from '../contexts/ContextProvider';

import {useSelector} from "react-redux";
import UserProfile from "./UserProfile";


const NavButton = ({title, customFunc, icon, color, dotColor}) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{color}}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{background: dotColor}}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

const Navbar = () => {
  const {user} = useSelector((state) => state.user)

  const {currentColor, activeMenu, setActiveMenu, handleClick, setScreenSize, screenSize, isClicked} = useStateContext();

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

  return (
    <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">
      <NavButton title="Menu" customFunc={handleActiveMenu} color={currentColor} icon={<AiOutlineMenu/>}/>
      <div className="flex">
        <TooltipComponent content="Profile" position="BottomCenter">
          <div
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
            onClick={() => handleClick('userProfile')}
          >
            <span className="text-gray-400 font-bold ml-1 text-14 flex items-center gap-2">
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
              <h1>{user?.first_name}</h1>
            </span>
            <MdKeyboardArrowDown className="text-gray-400 text-14"/>
          </div>
        </TooltipComponent>

        {isClicked.userProfile && (<UserProfile />)}
      </div>
    </div>
  );
};

export default Navbar;
