import React, {useEffect} from 'react';
import {Header} from "../../components";
import {useDispatch, useSelector} from "react-redux";
import {useStateContext} from "../../contexts/ContextProvider";
import {getAllWarehouses} from "../../redux/slices/warehouse/warehouseSlice";
import {useNavigate} from "react-router-dom";
import Loader from "../../components/Loader";
import moment from "moment";
import {EyeIcon, PencilIcon} from "@heroicons/react/16/solid";

const Warehouse = () => {
  const dispatch = useDispatch()
  const {currentColor} = useStateContext()
  const navigate = useNavigate()
  
  const {warehouses, loading} = useSelector(state => state.warehouse)
  
  useEffect(() => {
    dispatch(getAllWarehouses())
  }, [dispatch])
  
  return (
    <div className="card">
      <div className={'flex items-start justify-between mb-4'}>
        <Header category="Страница" title="Склады" />
        <button
          className={'px-4 py-2 rounded text-white'}
          style={{backgroundColor: currentColor}}
          onClick={() => navigate('/warehouse/:id')}
        >
          Создать склад
        </button>
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
                <th scope="col" className="px-4 py-3">Название склада</th>
                <th scope="col" className="px-4 py-3">Адрес склада</th>
                <th scope="col" className="px-4 py-3">Склад телефонного номера</th>
                <th scope="col" className="px-4 py-3">Менеджер склада</th>
                <th scope="col" className="px-4 py-3">Время создания</th>
                <th scope="col" className="px-4 py-3">Действие</th>
              </tr>
              </thead>
              <tbody>
              {warehouses && warehouses?.map((item, index) => (
                <tr key={item?.id} className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'}>
                  <td className={'px-4 py-1'}>
                    {index + 1}
                  </td>
                  <td className={'px-3 py-1'}>
                    {item?.name}
                  </td>
                  <td className={'px-3 py-1'}>
                    {item?.address}
                  </td>
                  <td className={'px-3 py-1'}>
                    {item?.phone_number}
                  </td>
                  <td className={'px-3 py-1'}>
                    {item?.warehouse_manager?.first_name} / {item?.warehouse_manager?.phone_number}
                  </td>
                  <td className={'px-3 py-1'}>
                    {moment(item?.created_time).format('DD-MM-YYYY')}
                  </td>
                  <td className="px-4 py-4 flex items-center">
                    <EyeIcon
                      style={{color: currentColor}}
                      className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mr-auto`}
                      onClick={() => navigate(`/warehouse/${item.id}`)}
                    />
                    <PencilIcon
                      style={{color: currentColor}}
                      className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mr-auto`}
                      onClick={() => navigate(`/warehouse/${item.id}`)}
                    />
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

export default Warehouse;