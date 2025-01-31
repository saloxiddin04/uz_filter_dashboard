import React from 'react';
import {useNavigate} from "react-router-dom";
import { HiArrowUturnUp } from "react-icons/hi2";
import {useStateContext} from "../contexts/ContextProvider";

const DetailNav = ({id, name, status}) => {
  const navigate = useNavigate();
  const {currentColor} = useStateContext();

  return (
    <>
      <div className="flex flex-wrap dark:text-white">
        <div className="w-full flex gap-3">
          <div className="cursor-pointer flex flex-col items-center w-[5%] border-r border-gray-200" onClick={() => navigate(-1)}>
            <HiArrowUturnUp style={{ color: currentColor }} className="size-6" />
            <span className={'text-xs mt-1'}>Назад</span>
          </div>
          <div className={'flex items-center gap-3'}>
            <div>
              <h1 className={'font-bold'}>{name}</h1>
              <span className={'font-light text-gray-300'}>{id}</span>
            </div>
            <span style={{background: currentColor}} className={'rounded-xl px-3 text-white'}>{status}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailNav;