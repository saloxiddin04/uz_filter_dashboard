import React from 'react';

const Input = ({label, placeholder, type, disabled, value, onChange, className}) => {
  return (
    <>
      <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor={label}>
        {label}
      </label>
      <input
        className={`
          shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500
           ${className}
        `}
        id={label}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
      />
    </>
  );
};

export default Input;