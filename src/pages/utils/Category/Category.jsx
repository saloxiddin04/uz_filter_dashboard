import React, {useEffect, useState} from 'react';
import {Button, Header} from "../../../components";
import Loader from "../../../components/Loader";
import {useDispatch, useSelector} from "react-redux";
import {ChevronRightIcon, EyeIcon, PencilIcon} from "@heroicons/react/16/solid";
import {getAllCategories} from "../../../redux/slices/utils/category/categorySlice";
import {useStateContext} from "../../../contexts/ContextProvider";
import {useNavigate} from "react-router-dom";

const Category = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {currentColor} = useStateContext();
  const {loading, categories} = useSelector((state) => state.category)

  const [accordionSelected, setAccordionSelected] = useState(null)

  useEffect(() => {
    dispatch(getAllCategories())
  }, [dispatch]);

  const toggle = (i) => {
    if (accordionSelected === i) {
      return setAccordionSelected(null)
    }
    setAccordionSelected(i)
  }

  return (
    <div className={'card'}>
      <div className={'flex items-start justify-between mb-4'}>
        <Header category="Page" title="Category"/>
        <button
          className={'px-4 py-2 rounded text-white'}
          style={{backgroundColor: currentColor}}
          onClick={() => navigate('/category/:id')}
        >
          Create Category
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
              {categories?.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <tr key={item?.id} className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'}>
                      <td scope="row"
                          className="px-4 py-4 font-medium whitespace-nowrap flex gap-1 items-center">
                        {item?.children?.length > 0 && (
                          <div className="cursor-pointer">
                            <ChevronRightIcon
                              onClick={() => toggle(index)}
                              className={`size-6 ${accordionSelected === index ? 'rotate-90' : ''}`}
                            />
                          </div>
                        )}
                        {index + 1}
                      </td>
                      <td className={'px-2 py-1'}>
                        {item?.name}
                      </td>
                      <td className={'px-2 py-1'}>
                        {item?.image && (
                          <img className="w-16 aspect-auto" src={item?.image} alt={item?.name}/>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <PencilIcon
                          style={{color: currentColor}}
                          className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mr-auto`}
                          onClick={() => navigate(`/category/${item.id}`)}
                        />
                      </td>
                    </tr>

                    {accordionSelected === index && item?.children?.map((el, i) => (
                      <tr key={el?.id} className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'}>
                        <td
                          scope="row"
                          className="px-10 py-4 font-medium whitespace-nowrap">
                          {`${index + 1}.${i + 1} `}
                        </td>
                        <td className={'px-2 py-1'}>
                          {el?.name}
                        </td>
                        <td className={'px-2 py-1'}>
                          {el?.image && (
                            <img className="w-16 aspect-auto" src={el?.image} alt={el?.name}/>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <PencilIcon
                            style={{color: currentColor}}
                            className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mr-auto`}
                            onClick={() => navigate(`/category/${el.id}`)}
                          />
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                )
              })}
              </tbody>
            </table>
        }
      </div>
    </div>
  );
};

export default Category;