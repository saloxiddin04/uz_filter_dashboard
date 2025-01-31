import React, {useEffect, useState} from 'react';
import {Header, Pagination} from "../../components";
import {useStateContext} from "../../contexts/ContextProvider";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../../components/Loader";
import {getAllProducts} from "../../redux/slices/products/productSlice";
import moment from "moment";
import {ArrowPathIcon, EyeIcon, FunnelIcon, PencilIcon} from "@heroicons/react/16/solid";
import {getAllCategories} from "../../redux/slices/utils/category/categorySlice";

const Products = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {currentColor, currentPage} = useStateContext();
  
  const {loading, products} = useSelector((state) => state.product)
  const {categories} = useSelector(state => state.category)
  
  const [handleFilter, setFilter] = useState(false)
  const [name, setName] = useState(undefined)
  const [category, setCategory] = useState(undefined)
  
  useEffect(() => {
    dispatch(getAllProducts({page: currentPage, page_size: 10}))
  }, []);
  
  useEffect(() => {
    if (handleFilter) {
      dispatch(getAllCategories())
    }
  }, [handleFilter, dispatch])
  
  const handlePageChange = (page) => {
    dispatch(getAllProducts({page, page_size: 10}))
  }
  
  return (
    <div className="card">
      <div className={'flex items-start justify-between mb-4'}>
        <Header category="Страница" title="Продукты" />
        
        {handleFilter && (
          <>
            <div className="flex justify-center gap-4 items-center w-[65%]">
              <div className={'flex flex-col w-[35%]'}>
								<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="amount">
									Название продукта
								</label>
								<input
                  value={name || ""}
                  onChange={(e) => setName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      if (!name) {
                        // toast.error('Shartnoma raqamini kitiring')
                      } else {
                        // postFilteredContracts()
                      }
                    }
                  }}
                  name="amount"
                  id="amount"
                  type="text"
                  className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                />
							</div>
              <div className={'flex flex-col w-[35%]'}>
                <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="mounting_type">Категория</label>
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
            </div>
          </>
        )}
        
        <div className="flex items-center gap-6 pt-5">
          {handleFilter ? (
            <button
              className={`px-2 py-1 rounded border text-center`}
              style={{borderColor: currentColor}}
              onClick={() => {
                // setPage(1)
                setFilter(false)
                // setContractNumber(undefined)
                // setContractStatus(undefined)
                // setTin(undefined)
                dispatch(getAllProducts())
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
            onClick={() => navigate('/products/:id')}
          >
            Создать продукт
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
                <th scope="col" className="px-4 py-3">Изображения</th>
                <th scope="col" className="px-4 py-3">Время создания</th>
                <th scope="col" className="px-4 py-3">Действие</th>
              </tr>
              </thead>
              <tbody>
              {products?.result?.map((item, index) => (
                <tr key={item?.id} className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'}>
                  <td className={'px-4 py-1'}>
                    {index + 1}
                  </td>
                  <td className={'px-3 py-1'}>
                    {item?.name}
                  </td>
                  <td className={'px-3 py-1'}>
                    {item?.category?.name}
                  </td>
                  <td className={'px-3 py-1'}>
                    {item?.product_files[0]?.image?.file && (
                      <img className="w-16 aspect-auto" loading="lazy" src={item?.product_files[0]?.image?.file} alt={item?.product_files[0]?.image?.file} />
                    )}
                  </td>
                  <td className={'px-3 py-1'}>
                    {moment(item?.created_time).format('DD-MM-YYYY')}
                  </td>
                  <td className="px-4 py-4">
                    <EyeIcon
                      style={{color: currentColor}}
                      className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mr-auto`}
                      onClick={() => navigate(`/products/${item.id}`)}
                    />
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
        }
      </div>
      
      <Pagination
        totalItems={products?.count}
        itemsPerPage={10}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Products;