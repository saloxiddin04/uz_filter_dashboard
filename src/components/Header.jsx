import React from 'react';

const Header = ({ category, title }) => (
  <div>
    <p className="text-lg text-gray-400 dark:text-white">{category}</p>
    <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
      {title}
    </p>
  </div>
);

export default Header;
