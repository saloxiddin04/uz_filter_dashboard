import React from 'react';

import { useStateContext } from '../contexts/ContextProvider';

const Button = ({ icon, color, bgHoverColor, size, text, width, className, onClick, disabled }) => {
  const { setIsClicked, initialState } = useStateContext();

  const handleClick = () => {
    setIsClicked(initialState);
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`text-${size} p-2 w-${width} hover:drop-shadow-xl hover:bg-${bgHoverColor} text-${color} ${className} ${disabled ? 'opacity-75' : 'opacity-100'} `}
      disabled={disabled}
    >
      {icon} {text}
    </button>
  );
};

export default Button;
