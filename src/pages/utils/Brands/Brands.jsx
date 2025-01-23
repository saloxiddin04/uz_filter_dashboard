import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useStateContext} from "../../../contexts/ContextProvider";
import {Header} from "../../../components";
import Loader from "../../../components/Loader";
import {getAllBrands} from "../../../redux/slices/utils/brands/brandSlice";
import {PencilIcon} from "@heroicons/react/16/solid";

const Brands = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {currentColor} = useStateContext();

  const {loading, brands} = useSelector((state) => state.brand)

  useEffect(() => {
    dispatch(getAllBrands())
  }, [dispatch]);

  return (
    <div className={'card'}>
      <div className={'flex items-start justify-between mb-4'}>
        <Header category="Page" title="Brands"/>
        <button
          className={'px-4 py-2 rounded text-white'}
          style={{backgroundColor: currentColor}}
          onClick={() => navigate('/brands/:id')}
        >
          Create Brand
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded">
        {
          loading
            ?
            <Loader/>
            :
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead
                className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
              >
              <tr>
                <th scope="col" className="px-3 py-3"></th>
                <th scope="col" className="px-4 py-3">Name</th>
                <th scope="col" className="px-4 py-3">Image</th>
                <th scope="col" className="px-4 py-3">Action</th>
              </tr>
              </thead>
              <tbody>
              {brands?.map((item, index) => (
                <tr key={item?.id} className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'}>
                  <td className={'px-4 py-1'}>
                    {index + 1}
                  </td>
                  <td className={'px-2 py-1'}>
                    {item?.name}
                  </td>
                  <td className={'px-2 py-1'}>
                    {item?.image && (
                      <img loading="lazy" className="w-16 aspect-auto" src={item?.image} alt={item?.name}/>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <PencilIcon
                      style={{color: currentColor}}
                      className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mr-auto`}
                      onClick={() => navigate(`/brands/${item.id}`)}
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

export default Brands;