import React from 'react';

const EmptyBlock = ({ icon, title, descr, button, onClick, style, role }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center border rounded mt-5 h-full">
      {icon}
      <div className="mt-12 font-bold text-2xl leading-6 text-[#0E0E4B]">
        {title}
      </div>
      <div className="mt-4 font-normal text-xl leading-6 text-[#0E0E4B] max-w-[345px] text-center">
        {descr}
      </div>
      <button
        onClick={onClick}
        style={style}
        disabled={role}
        className="mt-5 px-5 py-2 rounded-full border-0 font-bold text-xl leading-6 text-white"
      >
        {button}
      </button>
    </div>
  );
};

export default EmptyBlock;
