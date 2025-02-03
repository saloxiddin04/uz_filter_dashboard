import React from 'react';
import { BsCurrencyDollar } from 'react-icons/bs';

export const themeColors = [
  {
    name: 'blue-theme',
    color: '#1A97F5',
  },
  {
    name: 'green-theme',
    color: '#03C9D7',
  },
  {
    name: 'purple-theme',
    color: '#7352FF',
  },
  {
    name: 'red-theme',
    color: '#FF5C8E',
  },
  {
    name: 'indigo-theme',
    color: '#1E4DB7',
  },
  {
    color: '#FB9678',
    name: 'orange-theme',
  },
];

export const userProfileData = [
  {
    icon: <BsCurrencyDollar />,
    title: 'My Profile',
    desc: 'Account Settings',
    iconColor: '#03C9D7',
    iconBg: '#E5FAFB',
    to: '/profile'
  },
];

export const usersRoles = [
  {
    title: "СОТРУДНИК",
    value: "employee"
  },
  {
    title: "ОПЕРАТОР",
    value: "operator"
  },
  {
    title: "АДМИН",
    value: "admin"
  },
  {
    title: "ДИРЕКТОР",
    value: "director"
  },
  {
    title: "БУХГАЛТЕР",
    value: "accountant"
  },
  {
    title: "СКЛАД_МЕНЕДЖЕР",
    value: "warehouse_manager"
  },
  {
    title: "МЕНЕДЖЕР ПО ПРОДАЖАМ",
    value: "sales_manager"
  }
]
