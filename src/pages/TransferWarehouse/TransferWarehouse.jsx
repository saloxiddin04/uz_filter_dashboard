import React, {useEffect} from 'react';
import {Header} from "../../components";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider";
import {getAllTransfers} from "../../redux/slices/transferWarehouse/transferWarehouseSlice";
import Loader from "../../components/Loader";
import {EyeIcon} from "@heroicons/react/16/solid";
import moment from "moment";

const TransferWarehouse = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {currentColor} = useStateContext()
  
  const {transfers, loading} = useSelector(state => state.transfer)
  
  useEffect(() => {
    dispatch(getAllTransfers({page: 1, page_size: 10}))
  }, [dispatch])
  
  return (
    <>
      <div className="card">
        <div className={'flex items-start justify-between mb-4'}>
          <Header category="Страница" title="Складской перенос" />
          <button
            className={'px-4 py-2 rounded text-white'}
            style={{backgroundColor: currentColor}}
            onClick={() => navigate('/transfer/:id')}
          >
            Создать перенос
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
                <th scope="col" className="px-4 py-3">Со склада</th>
                <th scope="col" className="px-4 py-3">На склад</th>
                <th scope="col" className="px-4 py-3">Сотрудник</th>
                <th scope="col" className="px-4 py-3">Статус</th>
                <th scope="col" className="px-4 py-3">Дата создание</th>
                <th scope="col" className="px-4 py-3">Действие</th>
              </tr>
              </thead>
              <tbody>
              {transfers && transfers?.result?.map((item, index) => (
                <tr key={item?.id} className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'}>
                  <td className={'px-4 py-1'}>
                    {index + 1}
                  </td>
                  <td className={'px-3 py-1'}>
                    {item?.from_warehouse?.name + " / " + item?.from_warehouse?.phone_number} / {item?.from_warehouse?.warehouse_type ? "продукт" : "сырье и материалы"}
                  </td>
                  <td className={'px-3 py-1'}>
                    {item?.to_warehouse?.name + " / " + item?.to_warehouse?.name} / {item?.to_warehouse?.warehouse_type ? "продукт" : "сырье и материалы"}
                  </td>
                  <td className={'px-3 py-1'}>
                    {item?.action_user?.first_name + " / " + item?.action_user?.phone_number}
                  </td>
                  <td className={'px-3 py-1'}>
                    {item?.status}
                  </td>
                  <td className={'px-3 py-1'}>
                    {moment(item?.created_time).format("DD-MM-YYYY")}
                  </td>
                  <td className="px-4 py-4 flex">
                    <EyeIcon
                      style={{color: currentColor}}
                      className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mr-auto`}
                      onClick={() => navigate(`/transfer/${item.id}`)}
                    />
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
        }
        </div>
      </div>
    </>
  );
};

export default TransferWarehouse;