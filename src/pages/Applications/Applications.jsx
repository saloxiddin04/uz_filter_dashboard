import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {getApplications} from "../../redux/slices/applications/applicationsSlice";
import {Header, Loader, Pagination} from "../../components";
import moment from "moment/moment";
import {EyeIcon} from "@heroicons/react/16/solid";
import {useStateContext} from "../../contexts/ContextProvider";

const headers = [
  {label: 'Mijoz'},
  {label: 'STIR/JSHSHIR'},
  {label: 'Ariza sanasi'},
  {label: 'Telefon raqami'},
  {label: "Email"},
  {label: "Xizmat"},
  {label: 'Status'},
];

const Applications = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {currentColor} = useStateContext();

  const {applications, loading} = useSelector(state => state.applications)

  const currentPage = parseInt(localStorage.getItem("currentPage")) || undefined

  useEffect(() => {
    dispatch(getApplications({page_size: currentPage}))
  }, []);

  const handlePageChange = (page) => {
    dispatch(getApplications({page_size: page}))
  }

  return (
    <div className={'m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-10 bg-white rounded'}>
      <Header category="Sahifa" title="Arizalar"/>
      <div className={'relative overflow-x-auto shadow-md sm:rounded'}>
        {
          loading
            ?
          <Loader/>
            :
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-3 py-3"></th>
                  {headers && headers.map((header, index) => (
                    <th key={index} scope={'col'} className={'px-6 py-3 cursor-pointer'}>
                      {header.label}
                    </th>
                  ))}
                  <th scope="col" className="px-6 py-3">
                    Boshqarish
                  </th>
                </tr>
              </thead>
              <tbody>
              {applications?.result?.length !== 0 && applications?.result?.map((item, index) => (
                <tr
                  key={item?.pk}
                  className={'hover:bg-gray-100 hover:dark:bg-gray-800'}
                >
                  <td scope="row" className="px-6 py-4 font-medium whitespace-nowrap border-b-1">
                    {index + 1}
                  </td>
                  <td className={'px-6 py-4 border-b-1'}>
                    {`${item?.name?.substring(0, 30)}...`}
                  </td>
                  <td className={'px-6 py-4 border-b-1'}>
                    {item?.client_innpinfl}
                  </td>
                  <td className={'px-6 py-4 border-b-1'}>
                    {moment(item?.created_at).format('DD-MM-YYYY')}
                  </td>
                  <td className={'px-6 py-4 border-b-1'}>
                    {item?.phone}
                  </td>
                  <td className={'px-6 py-4 border-b-1'}>
                    {item?.email}
                  </td>
                  <td className={'px-6 py-4 border-b-1'}>
                    {item?.service?.name}
                  </td>
                  <td className={'px-6 py-4 border-b-1'}>
                    {item?.is_contracted ? 'Shartnoma yuborildi' : 'Yangi'}
                  </td>
                  <td className="px-4 py-4 border-b-1">
                    <EyeIcon
                      style={{color: currentColor}}
                      className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mx-auto`}
                      onClick={() => navigate(`/application/${item.pk}`)}
                    />
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
        }
      </div>
      <Pagination
        totalItems={applications?.count}
        itemsPerPage={10}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Applications;