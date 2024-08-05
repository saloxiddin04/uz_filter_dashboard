import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
  clearEmployees,
  clearRegistryStates, getContractsForRegistry,
  getEmployeeUsers,
  getServices, postEmployees, postRegistry
} from "../../redux/slices/registry/registrySlice";
import {Header, Loader} from "../../components";
import {useNavigate, useParams} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider";
import moment from "moment";
import {PlusIcon, TrashIcon} from "@heroicons/react/16/solid";
import {toast} from "react-toastify";

const CreateRegistry = () => {
  const {currentColor} = useStateContext();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {loading, employee, employees, services, contracts, registries} = useSelector((state) => state.registry)

  const {slug} = useParams()

  const [step, setStep] = useState(1)

  const [contract_ids, setContractIds] = useState([])

  const [role_name, setRoleName] = useState('')
  const [participant_user, setParticipantUser] = useState('')

  const [registryType, setRegistryType] = useState('')
  const [registryDate, setRegistryDate] = useState(new Date())

  const [start_time, setStartTime] = useState(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return firstDayOfMonth.toISOString().split('T')[0];
  });
  const [end_time, setEndTime] = useState(() => {
    const now = new Date();
    const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const lastDayOfCurrentMonth = new Date(firstDayOfNextMonth - 1);
    return lastDayOfCurrentMonth.toISOString().split('T')[0];
  });

  useEffect(() => {
    dispatch(getServices())
    dispatch(getEmployeeUsers())
  }, [dispatch]);

  const serviceId = services?.find(el => el?.slug === slug)?.id

  const addIds = (id) => {
    setContractIds((prevIds) => {
      if (!prevIds.includes(id)) {
        return [...prevIds, id];
      }
      return prevIds;
    });
  };

  const removeId = (id) => {
    setContractIds((prevIds) => prevIds.filter((item) => item !== id));
  };

  const clear = () => {
    dispatch(clearRegistryStates())
    dispatch(clearEmployees())
    setRegistryType('')
    setRegistryDate(new Date())
    setStartTime('')
    setEndTime('')
    setContractIds([])
    setRoleName('')
    setParticipantUser('')
  }

  const handleValidateForGetContracts = () => {
    return !serviceId || !registryType || !registryDate || !start_time || !end_time;
  }

  const handleValidateForPostRegistries = () => {
    return !serviceId || !registryType || !registryDate || !start_time || !end_time || contract_ids.length <= 0 || !participant_user;
  }

  const getContracts = () => {
    dispatch(getContractsForRegistry({
      type: Number(registryType),
      service: Number(serviceId),
      start_time: new Date(start_time).toISOString(),
      end_time: new Date(end_time).toISOString()
    })).then((res) => {
      const ids = res?.payload?.contract_objs?.map(contract => contract.id);
      setContractIds(ids);
    })
  }

  const getEmployees = () => {
    dispatch(postEmployees({
      service: Number(serviceId),
      role_name
    }))
  }

  if (loading) return <Loader />

  const displayStep = (value) => {
    switch (value) {
      case 1:
        return (
          <>
            <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
              <div className={'w-[49%] flex items-end justify-between'}>
                <div className="flex flex-col w-[85%]">
                  <label
                    htmlFor="client"
                    className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
                  >
                    Rol
                  </label>
                  <select
                    name="client"
                    id="client"
                    className={`px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                    value={role_name}
                    onChange={(e) => {
                      setRoleName(e.target.value)
                      dispatch(clearEmployees())
                    }}
                  >
                    <option value="" disabled={role_name}>
                      Tanlang...
                    </option>
                    {employee && Object.entries(employee?.role_names).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className={`w-[10%] px-4 py-2 rounded text-white disabled:opacity-25`}
                  style={{backgroundColor: currentColor}}
                  onClick={getEmployees}
                  disabled={!role_name}
                >
                  Izlash
                </button>
              </div>
              <div className={'w-[49%] flex flex-col'}>
                <label
                  htmlFor="client"
                  className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
                >
                  Xodim
                </label>
                <select
                  name="client"
                  id="client"
                  className={`w-full disabled:opacity-25 px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                  value={participant_user}
                  onChange={(e) => setParticipantUser(e.target.value)}
                  disabled={!employees}
                >
                  <option disabled={participant_user}>Tanlang...</option>
                  {employees && employees?.employees?.map(item => (
                    <option key={item?.pin_or_tin} value={item?.pin_or_tin}
                    >{`${item?.name} - ${item?.role_name}`}</option>
                  ))}
                </select>
              </div>
              <div className={'w-[49%] flex flex-col'}>
                <label
                  htmlFor="client"
                  className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
                >
                  Reestr turi
                </label>
                <select
                  name="client"
                  id="client"
                  className={`w-full disabled:opacity-25 px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                  onChange={(e) => setRegistryType(e.target.value)}
                  value={registryType}
                >
                  <option disabled={registryType}>Tanlang...</option>
                  <option value="1">Asosiy</option>
                  <option value="2">Qo'shimcha</option>
                </select>
              </div>
              <div className={'w-[49%] flex flex-col'}>
                <label
                  htmlFor="client"
                  className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
                >
                  Reestr uchun sana
                </label>
                <input
                  value={registryDate?.toISOString().split('T')[0]}
                  disabled={true}
                  name="client"
                  id="client"
                  type="date"
                  className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                />
              </div>
              <div className={'w-[49%] flex flex-col'}>
                <label
                  htmlFor="client"
                  className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
                >
                  dan
                </label>
                <input
                  value={start_time}
                  onChange={(e) => setStartTime(e.target.value)}
                  name="client"
                  id="client"
                  type="date"
                  className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                />
              </div>
              <div className={'w-[49%] flex items-end justify-between'}>
                <div className="flex flex-col w-[85%]">
                  <label
                    htmlFor="client"
                    className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
                  >
                    gacha
                  </label>
                  <input
                    value={end_time}
                    onChange={(e) => setEndTime(e.target.value)}
                    name="client"
                    id="client"
                    type="date"
                    className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                  />
                </div>
                <button
                  className={`w-[10%] px-4 py-2 rounded text-white disabled:opacity-25`}
                  style={{backgroundColor: currentColor}}
                  onClick={getContracts}
                  disabled={handleValidateForGetContracts()}
                >
                  Izlash
                </button>
              </div>
            </div>
            {contracts?.success && (
              loading ? <Loader/> :
                <table className="w-full border text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead
                    className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                  >
                  <tr>
                    <th scope="col" className="px-3 py-3"></th>
                    <th scope="col" className="px-4 py-3">Mijoz</th>
                    <th scope="col" className="px-6 py-3">STIR/JSHSHIR</th>
                    <th scope="col" className="px-6 py-3">Shartnoma raqami</th>
                    <th scope="col" className="px-6 py-3">Shartnoma sanasi</th>
                    <th scope="col" className="px-6 py-3">Shartnoma status</th>
                    <th scope="col" className="px-6 py-3">Boshqarish</th>
                  </tr>
                  </thead>
                  <tbody>
                  {contracts?.contract_objs?.map((el, i) => {
                    return (
                      <tr
                        key={el?.id}
                        className={'hover:bg-gray-100 hover:dark:bg-gray-800'}
                      >
                        <td scope="row" className="px-6 py-4 font-medium whitespace-nowrap border-b-1">
                          {i + 1}
                        </td>
                        <td className={'px-6 py-4 border-b-1'}>
                          {el?.client?.client_name && el?.client?.client_name?.length > 30 ? `${el?.client?.client_name?.substring(0, 30)}...` : el?.client?.client_name}
                        </td>
                        <td className={'px-6 py-4 border-b-1'}>
                          {el?.client?.tin_or_pin}
                        </td>
                        <td className={'px-6 py-4 border-b-1'}>{el?.contract_number}</td>
                        <td className={'px-6 py-4 border-b-1'}>
                          {moment(el?.contract_date).format('DD.MM.YYYY HH:mm:ss')}
                        </td>
                        <td className={'px-6 py-4 border-b-1'}>
                          {el.contract_status.name ? el?.contract_status?.name : el?.contract_status}
                        </td>
                        <td className="border-b-1">
                          {contract_ids.includes(el.id) ? (
                            <button
                              className={`px-4 py-2 rounded text-white ml-6 border border-red-400`}
                              onClick={() => removeId(el.id)}
                            >
                              <TrashIcon fill={'rgb(248 113 113)'} className="size-5"/>
                            </button>
                          ) : (
                            <button
                              className={`px-4 py-2 rounded text-white ml-6`}
                              style={{
                                border: `1px solid ${currentColor}`
                              }}
                              onClick={() => addIds(el.id)}
                            >
                              <PlusIcon fill={currentColor} className="size-5"/>
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                  </tbody>
                </table>
            )}
            <div className="w-full flex items-center justify-between my-4">
              <div>
                <button
                  className={'px-4 py-2 rounded'}
                  style={{
                    color: currentColor,
                    border: `1px solid ${currentColor}`
                  }}
                  onClick={() => {
                    navigate(-1)
                    dispatch(clearRegistryStates())
                    clear()
                  }}
                >
                  Bekor qilish
                </button>
              </div>
              <div className="flex gap-4">
                <button
                  className={`px-4 py-2 rounded text-white border border-[${currentColor}]`}
                  style={{color: currentColor}}
                  onClick={() => setStep(1)}
                >
                  Orqaga
                </button>
                <button
                  className={`px-4 py-2 rounded text-white disabled:opacity-25`}
                  style={{backgroundColor: currentColor}}
                  disabled={handleValidateForPostRegistries()}
                  onClick={async () => {
                    try {
                      await dispatch(postRegistry({
                        type: Number(registryType),
                        service: Number(serviceId),
                        start_time: new Date(start_time).toISOString(),
                        end_time: new Date(end_time).toISOString(),
                        object_ids: contract_ids,
                        save: 0,
                        participant_user
                      })).then((res) => {
                        if (res?.payload?.success) {
                          setStep(2)
                        }
                      })
                    } catch (e) {
                      return e.message
                    }
                  }}
                >
                  Keyingi
                </button>
              </div>
            </div>
          </>
        )
      case 2:
        return (
          <>
            {registries?.success && (
              <table className="w-full border text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead
                  className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                >
                <tr>
                  <th scope="col" className="px-3 py-3"></th>
                  <th scope="col" className="px-4 py-3">Mijoz</th>
                  <th scope="col" className="px-6 py-3">STIR/JSHSHIR</th>
                  <th scope="col" className="px-6 py-3">Shartnoma raqami</th>
                  <th scope="col" className="px-6 py-3">Shartnoma sanasi</th>
                  <th scope="col" className="px-6 py-3">Shartnoma status</th>
                </tr>
                </thead>
                <tbody>
                {registries?.contract_objs?.map((el, i) => {
                  return (
                    <tr
                      key={el?.id}
                      className={'hover:bg-gray-100 hover:dark:bg-gray-800'}
                    >
                      <td scope="row" className="px-6 py-4 font-medium whitespace-nowrap border-b-1">
                        {i + 1}
                      </td>
                      <td className={'px-6 py-4 border-b-1'}>
                        {el?.client?.client_name && el?.client?.client_name?.length > 30 ? `${el?.client?.client_name?.substring(0, 30)}...` : el?.client?.client_name}
                      </td>
                      <td className={'px-6 py-4 border-b-1'}>
                        {el?.client?.tin_or_pin}
                      </td>
                      <td className={'px-6 py-4 border-b-1'}>{el?.contract_number}</td>
                      <td className={'px-6 py-4 border-b-1'}>
                        {moment(el?.contract_date).format('DD.MM.YYYY HH:mm:ss')}
                      </td>
                      <td className={'px-6 py-4 border-b-1'}>
                        {el.contract_status.name ? el?.contract_status?.name : el?.contract_status}
                      </td>
                    </tr>
                  )
                })}
                </tbody>
              </table>
            )}
            <div className="w-full flex items-center justify-between my-4">
              <div>
                <button
                  className={'px-4 py-2 rounded'}
                  style={{
                    color: currentColor,
                    border: `1px solid ${currentColor}`
                  }}
                  onClick={() => {
                    navigate(-1)
                    dispatch(clearRegistryStates())
                    clear()
                  }}
                >
                  Bekor qilish
                </button>
              </div>
              <div className="flex gap-4">
                <button
                  className={`px-4 py-2 rounded text-white border border-[${currentColor}]`}
                  style={{color: currentColor}}
                  onClick={() => setStep(1)}
                >
                  Orqaga
                </button>
                <button
                  className={`px-4 py-2 rounded text-white disabled:opacity-25`}
                  style={{backgroundColor: currentColor}}
                  disabled={handleValidateForPostRegistries()}
                  onClick={async () => {
                    try {
                      await dispatch(postRegistry({
                        type: Number(registryType),
                        service: Number(serviceId),
                        start_time: new Date(start_time).toISOString(),
                        end_time: new Date(end_time).toISOString(),
                        object_ids: contract_ids,
                        save: 1,
                        participant_user
                      })).then((res) => {
                        if (res?.payload?.success) {
                          toast.success('Reestr muvofaqqiyatli yarildi')
                          navigate(-1)
                          dispatch(clearRegistryStates())
                          clear()
                        }
                      })
                    } catch (e) {
                      setStep(1)
                      return e.message
                    }
                  }}
                >
                  Tasdiqlash
                </button>
              </div>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-10 bg-white rounded">
      <Header category={'Reestr yaratish'} title={slug?.toUpperCase()}/>
      <div className="relative overflow-x-auto shadow-md sm:rounded px-2 py-4">
        {displayStep(step)}
      </div>
    </div>
  );
};

export default CreateRegistry;