import React, {useEffect, useRef, useState} from 'react';
import {Header} from "../../components";
import {getAllProducts} from "../../redux/slices/products/productSlice";
import {ArrowPathIcon, FunnelIcon} from "@heroicons/react/16/solid";
import {useDispatch, useSelector} from "react-redux";
import {useStateContext} from "../../contexts/ContextProvider";
import {getAllUsers} from "../../redux/slices/users/usersSlice";
import Loader from "../../components/Loader";
import {usersRoles} from "../../data/dummy";

const Employees = () => {
  const dispatch = useDispatch()
  const {currentColor} = useStateContext()
  
  const timeoutId = useRef(null)
  
  const {users, loading} = useSelector(state => state.users)
  
  const [handleFilter, setFilter] = useState(false)
  const [phone_number, setPhoneNumber] = useState(undefined)
  const [user_roles, setUserRoles] = useState(undefined)
  
  useEffect(() => {
    dispatch(getAllUsers())
  }, [dispatch])
  
  const searchEmployee = (value) => {
    console.log(value)
    setPhoneNumber(value)
    clearTimeout(timeoutId.current)
    timeoutId.current = setTimeout(() => {
      dispatch(getAllUsers({phone_number: value, user_roles}))
    }, 500)
  }
  
  return (
    <div className="card">
      <div className={'flex items-start justify-between mb-4'}>
        <Header category="Страница" title="Сотрудники" />
        
        {handleFilter && (
          <>
            <div className="flex justify-center gap-4 items-center w-[65%]">
              <div className={'flex flex-col w-[35%]'}>
								<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="amount">
                	Телефон номер
                </label>
                <input
                  value={phone_number || ""}
                  onChange={(e) => searchEmployee(e.target.value)}
                  name="amount"
                  id="amount"
                  type="text"
                  className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                />
							</div>
              <div className={'flex flex-col w-[35%]'}>
                <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="mounting_type">Роли</label>
                <select
                  className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
                  value={user_roles || ''}
                  onChange={(e) => {
                    setUserRoles(e.target.value)
                    dispatch(getAllUsers({phone_number, user_roles: e.target.value}))
                  }}
                  name="mounting_type"
                  id="mounting_type"
                >
                  <option value={undefined} disabled={user_roles}>Выбирать</option>
                  {usersRoles?.map((item) => (
                    <option value={item?.value} key={item?.value}>{item?.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}
        
        <div className="flex items-center gap-6 pt-5">
          {handleFilter ? (
            <button
              className={`px-2 py-1 rounded border text-center`}
              style={{borderColor: currentColor}}
              onClick={() => {
                dispatch(getAllUsers())
                setFilter(false)
                setPhoneNumber(undefined)
                setUserRoles(undefined)
              }}
            >
              <ArrowPathIcon className="size-6" fill={currentColor} />
            </button>
          ) : (
            <button title="filter" onClick={() => setFilter(true)}>
              <FunnelIcon className="size-6" color={currentColor} />
            </button>
          )}
        </div>
      </div>
      
      <div className="relative overflow-x-auto shadow-md sm:rounded">
        {
          loading
            ?
            <Loader />
            :
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead
                className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
              >
              <tr>
                <th scope="col" className="px-3 py-3"></th>
                <th scope="col" className="px-4 py-3">Имя</th>
                <th scope="col" className="px-4 py-3">Фамилия</th>
                <th scope="col" className="px-4 py-3">Телефон номер</th>
                <th scope="col" className="px-4 py-3">Роли</th>
                <th scope="col" className="px-4 py-3">Емаил</th>
              </tr>
              </thead>
              <tbody>
              {users?.map((item, index) => (
                <tr key={item?.id} className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'}>
                  <td className={'px-4 py-1'}>
                    {index + 1}
                  </td>
                  <td className={'px-3 py-1'}>
                    {item?.first_name}
                  </td>
                  <td className={'px-3 py-1'}>
                    {item?.last_name}
                  </td>
                  <td className={'px-3 py-1'}>
                    {item?.phone_number}
                  </td>
                  <td className={'px-3 py-1'}>
                    {item?.user_roles}
                  </td>
                  <td className={'px-3 py-1'}>
                    {item?.email}
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
        }
      </div>
    </div>
  );
};

export default Employees;