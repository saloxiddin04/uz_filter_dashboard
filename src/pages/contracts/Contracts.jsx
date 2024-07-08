import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Header, Pagination} from '../../components';
import {getContracts} from "../../redux/slices/contracts/contractsSlice";
import Loader from "../../components/Loader";
import {useStateContext} from "../../contexts/ContextProvider";
import moment from "moment/moment";
import {EyeIcon} from "@heroicons/react/16/solid";
import {useLocation, useNavigate, useParams} from "react-router-dom";

const Contracts = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {slug} = useParams();
  const {currentColor} = useStateContext();

  const {contracts, loading} = useSelector(state => state.contracts)

  const currentPage = parseInt(localStorage.getItem("currentPage")) || undefined

  const headers = [
    {key: 'client?.full_name', label: 'Mijoz'},
    {key: 'client?.pin', label: 'STIR/JSHSHIR'},
    {key: 'contract_number', label: 'Shartnoma raqami'},
    {key: 'contract_date', label: 'Shartnoma sanasi'},
    {key: 'expiration_date', label: 'Amal qilish sanasi'},
    {key: 'contract_cash', label: "Shartnoma qiymati (so'm)"},
    {key: 'payed_cash', label: "To'langan qiymat (so'm)"},
    {key: 'arrearage', label: "Qarzdorlik (so'm)"},
    {key: 'contract_status', label: 'Status'},
  ];

  useEffect(() => {
    dispatch(getContracts({page: currentPage, slug}))
  }, [dispatch, slug]);

  const handlePageChange = (page) => {
    dispatch(getContracts({page, slug}))
  }
  
  return (
    <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-10 bg-white rounded">
      <Header category="Sahifa" title="Shartnomalar"/>
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
            {contracts?.result?.all?.length !== 0 && contracts?.result?.all?.map((item, index) => (
              <tr
                key={item?.id}
                className={'hover:bg-gray-100 hover:dark:bg-gray-800'}
              >
                <td scope="row" className="px-6 py-4 font-medium whitespace-nowrap border-b-1">
                  {index + 1}
                </td>
                <td className={'px-6 py-4 border-b-1'}>
                  {`${item?.client?.full_name?.substring(0, 30)}...`}
                </td>
                <td className={'px-6 py-4 border-b-1'}>
                  {item?.client?.pin}
                </td>
                <td className={'px-6 py-4 border-b-1'}>
                  {item?.contract_number}
                </td>
                <td className={'px-6 py-4 border-b-1'}>
                  {moment(item?.contract_date).format('DD-MM-YYYY')}
                </td>
                <td className={'px-6 py-4 border-b-1'}>
                  {item?.expiration_date == null
                    ? moment(moment().year().toString() + '-12-31T23:59:00').format(
                      'DD.MM.YYYY',
                    )
                    : moment(item?.expiration_date).format('DD.MM.YYYY')}
                </td>
                <td className={'px-2 py-4 border-b-1'}>
                  {item?.contract_cash?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                </td>
                <td className={'px-6 py-4 border-b-1'}>
                  {item?.payed_cash?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                </td>
                <td className={'px-2 py-4 border-b-1'}>
                  {item?.arrearage?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                </td>
                <td className={'px-4 py-1 border-b-1'}>
                  {item?.contract_status}
                </td>
                <td className="px-4 py-4 border-b-1">
                  <EyeIcon
                    style={{color: currentColor}}
                    className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mx-auto`}
                    onClick={() => navigate(`/shartnomalar/${slug}/${item.id}`)}
                  />
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        }
      </div>
      <Pagination
        totalItems={contracts?.count}
        itemsPerPage={10}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
export default Contracts;
