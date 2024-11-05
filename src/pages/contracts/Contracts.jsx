import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Header, Pagination} from '../../components';
import {getContracts, getFilteredContracts} from "../../redux/slices/contracts/contractsSlice";
import Loader from "../../components/Loader";
import {useStateContext} from "../../contexts/ContextProvider";
import moment from "moment/moment";
import {ArrowPathIcon, EyeIcon, FolderIcon, FunnelIcon} from "@heroicons/react/16/solid";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {BiSearch} from "react-icons/bi";
import {colocationStatus, e_xat, expertiseStatus, tte_certification, vpsStatus} from "../../data/dummy";
import instance from "../../API";
import {toast} from "react-toastify";

const Contracts = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {slug} = useParams();
  const {pathname} = useLocation();
  const {currentColor, setPage, currentPage} = useStateContext();

  const {sidebar} = useSelector(state => state.sections)
  const {contracts, loading} = useSelector(state => state.contracts)
  const {user} = useSelector((state) => state.user)

  const [handleFilter, setFilter] = useState(false)
  const [contract_number, setContractNumber] = useState(undefined)
  const [contract_status, setContractStatus] = useState(undefined)
  const [tin_or_pin, setTin] = useState(undefined)

  function filterBySlug() {
    const matchedPermission = sidebar?.permissions.find(permission => `${permission.slug}` === pathname.split('/')[1]);
    return matchedPermission ? matchedPermission.children : [];
  }

  const children = filterBySlug();

  const filteredChildren = children.filter(item =>
    item?.slug === 'vps' || item?.slug === 'colocation' || item?.slug === 'e-xat' || item?.slug === 'tte_certification'
  );
  
  useEffect(() => {
    if (!slug) {
      navigate(`/shartnomalar/${filteredChildren[0]?.slug}`);
    } else {
      dispatch(getContracts({page: currentPage, slug}))
    }
  }, [dispatch, slug]);
  
  const handlePageChange = (page) => {
    if (contract_number || contract_status || tin_or_pin) {
      const body = {
        tin_or_pin: tin_or_pin === '' ? undefined : tin_or_pin,
        contract_status: Number(contract_status),
        contract_number: contract_number === '' ? undefined : contract_number
      }
      dispatch(getFilteredContracts({slug, page, body}))
    } else {
      dispatch(getContracts({page, slug}))
    }
  }

  const postFilteredContracts = () => {
    const body = {
      tin_or_pin: tin_or_pin === '' ? undefined : tin_or_pin,
      contract_status: Number(contract_status),
      contract_number: contract_number === '' ? undefined : contract_number
    }
    if (currentPage > 1) {
      setPage(1)
      dispatch(getFilteredContracts({slug, page: 1, body}))
    } else {
      dispatch(getFilteredContracts({slug, page: currentPage, body}))
    }
  }

  const downloadExcel = async () => {
    try {
      await instance.post(`/${slug}/excel`, {}, {
        headers: { "Content-type": "blob" },
        responseType: "arraybuffer"
      }).then((res) => {
        if (res.status === 200) {
          const fileURL = URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = fileURL;
          link.setAttribute("download", `${slug}.xls`);
          document.body.appendChild(link);
          link.click();
        } else {
          toast.error('Xatolik')
        }
      })
    } catch (e) {
      return e.message
    }
  }

  return (
    <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-10 dark:bg-secondary-dark-bg bg-white rounded">
      <div className={'flex items-start justify-between'}>
        <Header category="Sahifa" title="Shartnomalar"/>
        {handleFilter && (
          <>
            <div className="flex gap-4 items-center w-[65%]">
              <div className={'flex flex-col w-[35%]'}>
                <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="amount">
                  Shartnoma raqami
                </label>
                <input
                  value={contract_number || ""}
                  onChange={(e) => setContractNumber(e.target.value.toUpperCase())}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      if (!contract_number) {
                        toast.error('Shartnoma raqamini kitiring')
                      } else {
                        postFilteredContracts()
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
                <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="mounting_type">Shartnoma
                  status</label>
                <select
                  className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
                  value={contract_status || ''}
                  onChange={(e) => setContractStatus(e.target.value)}
                  name="mounting_type"
                  id="mounting_type"
                >
                  <option value={undefined} disabled={contract_status}>Tanlang</option>
                  {slug === 'e-xat' && (
                    e_xat?.map((item, index) => (
                      <option value={item.value} key={index}>{item.title}</option>
                    ))
                  )}
                  {slug === 'tte_certification' && (
                    tte_certification?.map((item, index) => (
                      <option value={item.value} key={index}>{item.title}</option>
                    ))
                  )}
                  {slug === 'vps' && (
                    vpsStatus?.map((item, index) => (
                      <option value={item.value} key={index}>{item.title}</option>
                    ))
                  )}
                  {slug === 'expertise' && (
                    expertiseStatus?.map((item, index) => (
                      <option value={item.value} key={index}>{item.title}</option>
                    ))
                  )}
                  {slug === 'colocation' && (
                    colocationStatus?.map((item, index) => (
                      <option value={item.value} key={index}>{item.title}</option>
                    ))
                  )}
                </select>
              </div>
              <div className={'flex w-[35%] gap-2 items-center'}>
                <div className="flex flex-col w-full">
                  <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="amount">
                    JShShIR/STIR
                  </label>
                  <input
                    value={tin_or_pin || ""}
                    onChange={(e) => {
                      const re = /^[0-9\b]+$/;
                      if (e.target.value === '' || re.test(e.target.value)) {
                        setTin(e.target.value)
                      }
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        if (!tin_or_pin) {
                          toast.error('Stir/JShShIR kiriting!')
                        } else {
                          postFilteredContracts()
                        }
                      }
                    }}
                    name="amount"
                    id="amount"
                    type="text"
                    className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                  />
                </div>
                <button
                  className="rounded px-4 py-1 mt-5 disabled:opacity-25"
                  style={{border: `1px solid ${currentColor}`}}
                  onClick={postFilteredContracts}
                  disabled={!contract_status && !contract_number && !tin_or_pin}
                >
                  <BiSearch className="size-6" color={currentColor} />
                </button>
              </div>
            </div>
          </>
        )}
        <div className="flex items-center gap-6 mb-8 pt-5">
          {handleFilter ? (
            <button
              className={`px-2 py-1 rounded border text-center`}
              style={{borderColor: currentColor}}
              onClick={() => {
                setPage(1)
                setFilter(false)
                setContractNumber(undefined)
                setContractStatus(undefined)
                setTin(undefined)
                dispatch(getContracts({page: 1, slug}))
              }}
            >
              <ArrowPathIcon className="size-6" fill={currentColor}/>
            </button>
          ) : (
            <button title="filter" onClick={() => setFilter(true)}>
              <FunnelIcon className="size-6" color={currentColor}/>
            </button>
          )}
          <button title="Excel" onClick={downloadExcel} className="rounded px-3 py-1 disabled:opacity-25" style={{border: `1px solid ${currentColor}`}}>
            <FolderIcon className="size-6" fill={currentColor} />
          </button>
          {(user?.userdata?.role?.name === 'admin' || user?.userdata?.role?.name === "IUT XRvaEQB boshlig'ining o'rinbosari" || user?.is_pinned_user) && (
            <button
              className={'px-4 py-2 rounded text-white'}
              style={{backgroundColor: currentColor}}
              onClick={() => navigate(`/shartnomalar/${slug}/create`, {state: {slug, path: 'shartnomalar'}})}
            >
              Shartnoma yaratish
            </button>
          )}
        </div>
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
              {contracts?.result?.length !== 0 && contracts?.result?.map((item, index) => (
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
                    {item?.contract_date ? moment(item?.contract_date).format('DD-MM-YYYY') : '-'}
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
