import React, {useState} from 'react';
import {useStateContext} from "../contexts/ContextProvider";

const Input = ({label, placeholder, type, disabled, value, onChange, className}) => {

  const {currentColor} = useStateContext();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor={label}>
        {label}
      </label>
      <input
        className={`
          shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight
           ${className}
        `}
        id={label}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          outline: 'none',
          borderColor: isFocused ? currentColor : '',
          boxShadow: isFocused ? `0 0 0 2px rgba(66, 153, 225, 0.5)` : '',
        }}
      />
    </>
  );
};

export default Input;