import React, {useEffect} from 'react';
import {Header, Pagination} from "../../components";
import {useStateContext} from "../../contexts/ContextProvider";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../../components/Loader";
import {getAllProducts} from "../../redux/slices/products/productSlice";
import moment from "moment";
import {PencilIcon} from "@heroicons/react/16/solid";

const Products = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {currentColor} = useStateContext();
  
  const {loading, products} = useSelector((state) => state.product)
  
  useEffect(() => {
    dispatch(getAllProducts())
  }, []);
  
  const handlePageChange = (page) => {
    dispatch(getAllProducts({page, page_size: 10}))
    
  }
  
  return (
    <div className="card">
      <div className={'flex items-start justify-between mb-4'}>
        <Header category="Page" title="Products" />
        <button
          className={'px-4 py-2 rounded text-white'}
          style={{backgroundColor: currentColor}}
          onClick={() => navigate('/products/:id')}
        >
          Create Product
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
                <th scope="col" className="px-4 py-3">Name</th>
                <th scope="col" className="px-4 py-3">Category</th>
                <th scope="col" className="px-4 py-3">Created time</th>
                <th scope="col" className="px-4 py-3">Action</th>
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
                    {moment(item?.created_time).format('DD-MM-YYYY')}
                  </td>
                  <td className="px-4 py-4">
                    <PencilIcon
                      style={{color: currentColor}}
                      className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mr-auto`}
                      // onClick={() => navigate(`/attributes/${item.id}`)}
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