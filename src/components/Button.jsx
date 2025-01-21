import React from 'react';

import { useStateContext } from '../contexts/ContextProvider';

const Button = ({ icon, color, bgHoverColor, size, text, width, className, onClick, disabled, bg, style }) => {

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${bg} text-${size} p-2 w-${width} hover:drop-shadow-xl hover:bg-${bgHoverColor} text-${color} ${className} ${disabled ? 'opacity-75' : 'opacity-100'} `}
      disabled={disabled}
      style={style}
    >
      {icon} {text}
    </button>
  );
};

export default Button;
