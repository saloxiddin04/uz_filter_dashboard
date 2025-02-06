import React, {useCallback, useEffect, useState} from 'react';
import {Header, Pagination} from "../../components";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {getProductsForWarehouse, getWarehouse} from "../../redux/slices/warehouse/warehouseSlice";
import {useStateContext} from "../../contexts/ContextProvider";
import Loader from "../../components/Loader";
import {ArrowPathIcon, EyeIcon, FunnelIcon, PencilIcon} from "@heroicons/react/16/solid";
import {getAllCategories} from "../../redux/slices/utils/category/categorySlice";
import {Debounce} from "../../utils/Debounce";

const CreateProductWarehouse = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {currentColor} = useStateContext()
  const {id} = useParams()
  
  const {loading, warehouse, productsForWarehouse} = useSelector(state => state.warehouse)
  const {categories} = useSelector(state => state.category)
  
  const [handleFilter, setFilter] = useState(false)
  const [unique_code, setUniqueCode] = useState(undefined)
  const [product_name, setProductName] = useState(undefined)
  const [category, setCategory] = useState(undefined)
  
  useEffect(() => {
    dispatch(getProductsForWarehouse({
      warehouse_id: id,
      filters: {page: 1, page_size: 10},
    }))
    dispatch(getWarehouse(id))
    dispatch(getAllCategories())
  }, [id, dispatch])
  
  const debouncedSearch = useCallback(
    Debounce((filters) => {
      dispatch(getProductsForWarehouse({ filters, warehouse_id: id }));
    }, 500),
    [dispatch, id]
  )
  
  useEffect(() => {
    if (handleFilter) {
      debouncedSearch({
        product_name,
        unique_code,
        category,
      });
    }
  }, [product_name, unique_code, category, debouncedSearch]);
  
  const handleChangePage = (page) => {
    dispatch(getProductsForWarehouse({
      filters: {page, page_size: 10},
      warehouse_id: id
    }))
  }
  
  return (
    <div className="card">
      <div className={'flex items-start justify-between mb-4'}>
        <Header category="Страница" title={warehouse?.name} />
        
        {handleFilter && (
          <>
            <div className="flex justify-center gap-4 items-center w-[65%]">
              <div className={'flex flex-col w-[35%]'}>
								<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="amount">
									Название продукта
								</label>
								<input
                  value={product_name || ""}
                  onChange={(e) => setProductName(e.target.value)}
                  name="amount"
                  id="amount"
                  type="text"
                  className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                />
							</div>
              <div className={'flex flex-col w-[35%]'}>
                <label
                  className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                  htmlFor="mounting_type">Категория</label>
                <select
                  className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
                  value={category || ''}
                  onChange={(e) => setCategory(e.target.value)}
                  name="mounting_type"
                  id="mounting_type"
                >
                  <option value={undefined} disabled={category}>Tanlang</option>
                  {categories?.map((item) => (
                    <option value={item?.id} key={item?.id}>{item?.name}</option>
                  ))}
                </select>
              </div>
              <div className={'flex flex-col w-[35%]'}>
								<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="amount">
									Код продукта
								</label>
								<input
                  value={unique_code || ""}
                  onChange={(e) => setUniqueCode(e.target.value)}
                  name="amount"
                  id="amount"
                  type="text"
                  className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                />
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
                setFilter(false)
                setProductName(undefined)
                setUniqueCode(undefined)
                setCategory(undefined)
                dispatch(getProductsForWarehouse({
                  warehouse_id: id,
                  filters: {page: 1, page_size: 10},
                }))
              }}
            >
              <ArrowPathIcon className="size-6" fill={currentColor} />
            </button>
          ) : (
            <button title="filter" onClick={() => setFilter(true)}>
              <FunnelIcon className="size-6" color={currentColor} />
            </button>
          )}
          
          <button
            className={'px-4 py-2 rounded text-white'}
            style={{backgroundColor: currentColor}}
            onClick={() => navigate('addProduct')}
          >
            Добавить товар
          </button>
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
        onPageChange={handleChangePage}
      />
    </div>
  );
};

export default CreateProductWarehouse;