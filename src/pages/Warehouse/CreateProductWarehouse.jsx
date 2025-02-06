import React, {useEffect} from 'react';
import {Header, Pagination} from "../../components";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {getProductsForWarehouse, getWarehouse} from "../../redux/slices/warehouse/warehouseSlice";
import {useStateContext} from "../../contexts/ContextProvider";
import Loader from "../../components/Loader";
import {EyeIcon, PencilIcon} from "@heroicons/react/16/solid";

const CreateProductWarehouse = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {currentColor} = useStateContext()
  const {id} = useParams()
  
  const {loading, warehouse, productsForWarehouse} = useSelector(state => state.warehouse)
  
  useEffect(() => {
    dispatch(getProductsForWarehouse({warehouse_id: id}))
    dispatch(getWarehouse(id))
  }, [id, dispatch])
  
  console.log(productsForWarehouse?.result[0]?.product?.product_files[0])
  
  return (
    <div className="card">
      <div className={'flex items-start justify-between mb-4'}>
        <Header category="Страница" title={warehouse?.name} />
        <button
          className={'px-4 py-2 rounded text-white'}
          style={{backgroundColor: currentColor}}
          onClick={() => navigate('addProduct')}
        >
          Добавить товар
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
                <th scope="col" className="px-4 py-3">Название продукта</th>
                <th scope="col" className="px-4 py-3">Категория</th>
                <th scope="col" className="px-4 py-3">Бренд</th>
                <th scope="col" className="px-4 py-3">Количество</th>
                <th scope="col" className="px-4 py-3">Изображения</th>
                <th scope="col" className="px-4 py-3">Общая сумма</th>
                <th scope="col" className="px-4 py-3">Действие</th>
              </tr>
              </thead>
              <tbody>
              {productsForWarehouse && productsForWarehouse?.result?.map((item, index) => (
                <tr key={item?.id} className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'}>
                  <td className={'px-4 py-1'}>
                    {index + 1}
                  </td>
                  <td className={'px-3 py-1'}>
                    {item?.product?.name?.length > 25 ? `${item?.product?.name?.slice(0, 25)}...` : item?.product?.name}
                  </td>
                  <td className={'px-3 py-1'}>
                    {item?.product_variant?.category?.name}
                  </td>
                  <td className={'px-3 py-1'}>
                    {item?.product_variant?.brand?.name}
                  </td>
                  <td className={'px-3 py-1'}>
                    {item?.quantity?.toLocaleString("ru-Ru")}
                  </td>
                  <td className={'px-3 py-1'}>
                    {item?.product?.product_files && item?.product?.product_files[0]?.image?.file && (
                      <img
                        className="w-12 aspect-square object-cover"
                        loading="lazy"
                        src={item?.product?.product_files[0]?.image?.file}
                        alt={item?.product?.product_files[0]?.image?.file} />
                    )}
                  </td>
                  <td className={'px-3 py-1'}>
                    {item?.quantity_price?.toLocaleString("ru-RU")}
                  </td>
                  <td className="px-4 py-4 flex">
                    <PencilIcon
                      style={{color: currentColor}}
                      className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mr-auto`}
                      // onClick={() => navigate(`addProduct/${item.id}`)}
                    />
                    <EyeIcon
                      style={{color: currentColor}}
                      className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mr-auto`}
                      // onClick={() => navigate(`addProduct/${item.id}`)}
                    />
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
        }
      </div>
      
      <Pagination
        totalItems={productsForWarehouse?.count}
        itemsPerPage={10}
        // onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CreateProductWarehouse;