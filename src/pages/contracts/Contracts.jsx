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
  const {pathname} = useLocation();
  const {currentColor} = useStateContext();

  const {sidebar} = useSelector(state => state.sections)
  const {contracts, loading} = useSelector(state => state.contracts)
  
  const currentPage = parseInt(localStorage.getItem("currentPage")) || undefined

  function filterBySlug() {
    const matchedPermission = sidebar?.permissions.find(permission => `${permission.slug}` === pathname.split('/')[1]);
    return matchedPermission ? matchedPermission.children : [];
  }

  const children = filterBySlug();

  const filteredChildren = children.filter(item =>
    item?.slug === 'vps' || item?.slug === 'colocation' || item?.slug === 'e-xat'
  );
  
  useEffect(() => {
    if (!slug) {
      navigate(`/shartnomalar/${filteredChildren[0]?.slug}`);
    } else {
      dispatch(getContracts({page: currentPage, slug}))
    }
  }, [dispatch, slug]);
  
  const handlePageChange = (page) => {
    dispatch(getContracts({page, slug}))
  }
  
  return (
    <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-10 bg-white rounded">
      <div className={'flex items-center justify-between'}>
        <Header category="Sahifa" title="Shartnomalar"/>
        <button
          className={'px-4 py-2 rounded text-white mb-10'}
          style={{backgroundColor: currentColor}}
          onClick={() => navigate(`/shartnomalar/${slug}/create`)}
        >
          Shartnoma yaratish
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
                <th scope="col" className="px-4 py-3">Mijoz</th>
                <th scope="col" className="px-6 py-3">STIR/JSHSHIR</th>
                <th scope="col" className="px-8 py-3">Shartnoma raqami</th>
                <th scope="col" className="px-6 py-3">Shartnoma sanasi</th>
                <th scope="col" className="px-6 py-3">Amal qilish sanasi</th>
                <th scope="col" className="px-6 py-3">Shartnoma qiymati (so'm)</th>
                <th scope="col" className="px-6 py-3">To'langan qiymat (so'm)</th>
                <th scope="col" className="px-6 py-3">Qarzdorlik (so'm)</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Boshqarish</th>
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
                  <td className={'px-4 py-2 border-b-1'}>
                    {
                      item?.client?.name
                        ? item?.client?.name?.length > 30
                          ? `${item?.client?.name?.substring(0, 30)}...`
                          : item?.client?.name
                        : item?.client?.full_name?.length > 30
                          ? `${item?.client?.full_name?.substring(0, 30)}...`
                          : item?.client?.full_name
                    }
                  </td>
                  <td className={'px-6 py-4 border-b-1'}>
                    {item?.client.name ? item?.client?.tin : item?.client?.pin}
                  </td>
                  <td className={'px-10 py-4 border-b-1'}>
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
                  <td className={'px-5 py-4 border-b-1'}>
                    {item?.contract_cash?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  </td>
                  <td className={'px-8 py-4 border-b-1'}>
                    {item?.payed_cash?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  </td>
                  <td className={'px-5 py-4 border-b-1'}>
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
