import React, {useEffect, useRef} from 'react';
import { MdOutlineCancel } from 'react-icons/md';

import { Button } from '.';
import { userProfileData } from '../data/dummy';
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {logOut} from "../redux/slices/auth/authSlice";
import {useStateContext} from "../contexts/ContextProvider";

const UserProfile = ({onClose}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {pathname} = useLocation()

  const {user, access, access_token, refresh_token} = useSelector((state) => state.user)

  const modalRef = useRef();

  const handleLogout = async () => {
    await dispatch(logOut({access, access_token, refresh_token}))
    navigate('/')
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef?.current.contains(event.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={modalRef} className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
          onClick={onClose}
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
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
        </span>
        <div>
          <p className="font-semibold text-xl dark:text-gray-200"> {user?.full_name} </p>
          <p className="text-gray-500 text-sm dark:text-gray-400"> {user?.role} </p>
        </div>
      </div>
      <div>
        {userProfileData.map((item, index) => (
          <div
            key={index}
            className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]"
            onClick={() => navigate(item.to)}
            style={{ backgroundColor: pathname === '/profile' ? 'rgb(247 247 247)' : '' }}
          >
            <button
              type="button"
              style={{color: item.iconColor, backgroundColor: item.iconBg}}
              className=" text-xl rounded-lg p-3 hover:bg-light-gray"
            >
              {item.icon}
            </button>

            <div>
              <p className="font-semibold dark:text-gray-200 ">{item.title}</p>
              <p className="text-gray-500 text-sm dark:text-gray-400"> {item.desc} </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <Button
          text={'Logout'}
          color={'white'}
          className={'bg-blue-600 rounded mt-2 mx-auto text-center'}
          width={'full'}
          onClick={handleLogout}
        />
      </div>
    </div>

  );
};

export default UserProfile;
