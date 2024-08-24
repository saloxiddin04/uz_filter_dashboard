import React, {useState, useEffect, useMemo} from 'react';
import {useLocation, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {DetailNav, Input, Loader} from "../index";
import {toast} from "react-toastify";
import {
  createDevice, createUnit, deleteDevice,
  getDeviceDetail,
  getListProvider, getRackContractDetail,
  getRackDetail,
  getUnitContractInfo, patchDeviceConfig, patchDeviceGeneral
} from "../../redux/slices/dataCenter/dataCenterSlice";
import moment from "moment/moment";
import {useStateContext} from "../../contexts/ContextProvider";
import EmptyBlock from "./EmptyBlock";
import EmptyIcon from "../../assets/images/EmptyIcon";
import SelectIcon from "../../assets/images/SelectIcon";
import {BiBadgeCheck} from "react-icons/bi";
import RackDrawer from "./RackDrawer";

const ShowRack = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const {rack, client} = location.state

  const {currentColor} = useStateContext();

  const {
    loading,
    rack_detail,
    listProvider,
    deviceDetail,
    unitContractInfo,
    contractInfo
  } = useSelector(state => state.dataCenter);
  const {user} = useSelector((state) => state.user)

  const [count, setCount] = useState(1)
  const [selectable, setSelectable] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [unitInfo, setUnitInfo] = useState(0)
  const [addUnit, setAddUnit] = useState(0)
  const [modal, setModal] = useState(false)
  const [deviceValue, setDeviceValue] = useState('')
  const [selectedUnits, setSelectedUnits] = useState([])
  const [contractNumber, setContractNumber] = useState(null)
  const [contractDate, setContractDate] = useState()
  const [connectMethod, setConnectMethod] = useState('')
  const [connectContractNumber, setConnectContractNumber] = useState('')
  const [publisherValue, setPublisherValue] = useState('')
  const [deviceModel, setDeviceModel] = useState('')
  const [deviceNumber, setDeviceNumber] = useState('')
  const [electricityValue, setElectricityValue] = useState('')
  const [comment, setComment] = useState('')
  const [odf_count, setOdfCount] = useState('')

  const handleUnitSelect = (unit, busy) => {
    if (selectable) {
      if (!busy) {
        if (selectedUnits.length < 1) {
          setAddUnit(unit)
          setCount(unit)
          setSelectedUnits((prev) => [...prev, {unit}])
        } else {
          if (selectedUnits.length > 1) {
            setAddUnit((prev) => prev - 1)
            setCount((prev) => prev - 1)
            setSelectedUnits((prev) => prev.filter((el) => el.unit !== unit))
          }
        }
      }
    }
  }

  const getMinOfArray = () => {
    const num = selectedUnits && selectedUnits?.map((el) => el?.unit)
    return Math.min.apply(null, num)
  }

  const getMaxOfArray = () => {
    const num = selectedUnits && selectedUnits?.map((el) => el?.unit)
    return Math.max.apply(null, num)
  }

  const unitsData = useMemo(() => {
    if (!rack_detail) return null
    const selected = selectedUnits && selectedUnits?.map((el) => el?.unit)
    const handle = (i) => {
      return selected.find((el) => el === i)
    }
    return rack_detail?.units?.map((el) => {
      let deviceCount = 0;
      if (el.is_busy && el.start === el.place_number) {
        deviceCount = el.end - el.place_number + 1;
      }
      return {
        ...el,
        is_selected: el.place_number === handle(el.place_number),
        device_count: deviceCount,
      }
    })
  }, [rack_detail, selectedUnits, drawer])

  let arr = selectedUnits?.filter((obj, index, self) => index === self.findIndex((t) => t.unit === obj.unit))

  const increment = () => {
    if (selectedUnits.length < 4) {
      if (count < 42) {
        let nextObj = {}
        rack_detail?.units?.map((resp) => {
          if (resp.place_number === count + 1) {
            nextObj = resp
          }
        })
        if (!nextObj.is_busy) {
          if (arr.length === unitContractInfo?.unit_quota) {
            setCount(count)
            setAddUnit(count)
            setSelectedUnits((prev) => [...prev, {unit: count}])
          } else {
            setCount(count + 1)
            setAddUnit(count + 1)
            setSelectedUnits((prev) => [...prev, {unit: count + 1}])
          }
        } else {
          toast.error("Keyingi unit band bo'lgani uchun sotib olish mumkin emas!")
        }
      }
    }
  }

  const handleDevices = (deviceCount, number, busy, device, name, publisher) => {
    if (deviceCount === 4) {
      return (
        <div
          className="absolute top-1 left-5 w-[87%] h-[132px] ml-5 rounded cursor-pointer bg-cover border border-[#b6b6b6] bg-no-repeat z-10 text-white font-bold flex justify-center items-center"
          onClick={() => showUnitInfo(number, busy, device)}
          style={{background: currentColor}}
        >
          {name}: {publisher}
        </div>
      )
    }
    if (deviceCount === 3) {
      return (
        <div
          className="absolute top-0 left-5 w-[87%] h-[100px] ml-5 rounded cursor-pointer bg-cover border border-[#b6b6b6] bg-no-repeat z-10 text-white font-bold flex justify-center items-center"
          onClick={() => showUnitInfo(number, busy, device)}
          style={{background: currentColor}}
        >
          {name}: {publisher}
        </div>
      )
    }
    if (deviceCount === 2) {
      return (
        <div
          className="absolute top-0 left-5 w-[87%] h-[65px] ml-5 rounded cursor-pointer bg-cover border border-[#b6b6b6] bg-no-repeat z-10 text-white font-bold flex justify-center items-center"
          onClick={() => showUnitInfo(number, busy, device)}
          style={{background: currentColor}}
        >
          {name}: {publisher}
        </div>
      )
    }
    if (deviceCount === 1) {
      return (
        <div
          className="w-[90%] h-7 ml-4 rounded cursor-pointer bg-cover bg-no-repeat border border-[#b6b6b6] text-white font-bold flex justify-center items-center"
          onClick={() => showUnitInfo(number, busy, device)}
          style={{background: currentColor}}
        >
          {name}: {publisher}
        </div>
      )
    } else return <div className="w-[90%] h-7 ml-4 rounded border"/>
  }

  const handleSelectableDevices = (deviceCount, number, busy, selected) => {
    if (deviceCount === 4) {
      return <div
        className="absolute top-1 left-6 w-[90%] h-[149px] ml-4 rounded cursor-pointer bg-cover bg-no-repeat z-10"
        style={{cursor: 'no-drop'}}
      />
    }
    if (deviceCount === 3) {
      return <div
        className="absolute top-[-1.5rem] left-6 w-[90%] h-[121px] ml-4 rounded cursor-pointer bg-cover bg-no-repeat z-10"
        style={{cursor: 'no-drop'}}
      />
    }
    if (deviceCount === 2) {
      return <div
        className="absolute top-0 left-6 w-[90%] h-[65px] ml-4 rounded cursor-pointer bg-cover bg-no-repeat z-10"
        style={{cursor: 'no-drop'}}
      />
    }
    if (deviceCount === 1) {
      return <div className="w-[90%] h-7 ml-4 rounded cursor-pointer bg-cover  bg-no-repeat"
                  style={{cursor: 'no-drop'}}
      />
    } else
      return (
        !busy ? (
          <div
            className="w-[90%] h-7 ml-4 rounded flex items-center justify-center bg-blue-600 border border-dashed border-white"
            style={{
              cursor: 'pointer',
              backgroundColor: selected ? '#b6b6b6' : currentColor,
            }}
            onClick={() => handleUnitSelect(number, busy)}
          >
            {!busy && (
              <span className="font-bold text-xs leading-3 text-white" style={{color: selected ? '#000' : '#fff'}}>
                {selected ? 'Belgilangan joy' : '+ Joyni tanlang'}
              </span>
            )}
          </div>
        ) : (
          <div
            className="w-[90%] h-7 ml-4 rounded flex items-center justify-center border border-dashed"
            style={{
              cursor: 'pointer',
              borderColor: currentColor,
            }}
          >
            {busy && (
              <span className="font-bold text-xs leading-3" style={{color: currentColor}}>
                Band
              </span>
            )}
          </div>
        )
      )
  }

  const showUnitInfo = (unit, busy, device_id) => {
    if (busy) {
      setUnitInfo(unit)
      dispatch(getDeviceDetail(device_id)).then((res) => {
        setDeviceValue(res?.payload?.device_general_info?.device)
        setContractDate(
          res?.payload?.device_colocation?.provider_contract_date
          // parseISO(res?.device_colocation?.provider_contract_date),
        )
        setConnectMethod(res?.payload?.device_colocation?.provider)
        setConnectContractNumber(res?.payload?.device_colocation?.provider_contract_number)
        setPublisherValue(res?.payload?.device_general_info?.device_publisher)
        setDeviceModel(res?.payload?.device_general_info?.device_model)
        setDeviceNumber(res?.payload?.device_general_info?.device_number)
        setElectricityValue(res?.payload?.device_general_info?.electricity)
        setComment(res?.payload?.device_colocation?.description)
        setOdfCount(res?.payload?.device_colocation?.odf_count)
      })
    }
  }

  const sendContractNumber = () => {
    const units = unitsData.filter((el) => el.is_selected).map((unit) => unit.id)
    dispatch(getUnitContractInfo({contract_number: contractNumber, rack, units}))
  }

  const clearData = () => {
    setDrawer(false)
    setModal(false)
    setSelectable(false)
    setAddUnit(0)
    setUnitInfo(0)
    setSelectedUnits([])
    setContractNumber('')
    setConnectMethod('')
    setConnectContractNumber('')
    setContractDate('')
    setDeviceValue('')
    setPublisherValue('')
    setDeviceModel('')
    setDeviceNumber('')
    setElectricityValue('')
  }

  const addDevice = () => {
    const units = unitsData.filter((el) => el.is_selected).map((unit) => unit.id)
    const body = {
      device_general_info: {
        rack: rack_detail?.id,
        units,
        device: deviceValue,
        device_publisher: publisherValue,
        device_model: deviceModel,
        device_number: deviceNumber,
        electricity: Number(electricityValue),
      },
      device_config: {
        contract: unitContractInfo?.id,
        odf_count: Number(odf_count),
        provider: connectMethod,
        provider_contract_number: connectContractNumber,
        description: comment,
        provider_contract_date:
          contractDate === '' || contractDate === null
            ? null
            : moment(contractDate).format('YYYY-MM-DD'),
      },
    }
    const soldBody = {
      rack: rack_detail?.id,
      device: deviceValue,
      device_publisher: publisherValue,
      device_model: deviceModel,
      device_number: deviceNumber,
      electricity: parseInt(electricityValue),
      units,
      description: comment,
    }
    setAddUnit(0)
    setSelectedUnits([])
    setContractNumber('')
    setConnectMethod('')
    setConnectContractNumber('')
    setContractDate('')
    setDeviceValue('')
    setPublisherValue('')
    setDeviceModel('')
    setDeviceNumber('')
    setElectricityValue('')
    if (rack_detail?.is_busy) {
      dispatch(createDevice(soldBody)).then(() => {
        dispatch(getRackDetail(rack))
        dispatch(getListProvider())
        setSelectable(false)
        clearData()
      })
    }
    if (!rack_detail?.is_busy && rack_detail?.is_for_unit_service) {
      dispatch(createUnit(body)).then(() => {
        dispatch(getRackDetail(rack))
        dispatch(getListProvider())
        setSelectable(false)
        clearData()
      })
    }
    dispatch(getRackDetail(rack))
    setSelectable(false)
  }

  const handleDeleteDevice = () => {
    dispatch(deleteDevice({id: deviceDetail?.unit?.id, slug: 'unit'})).then((res) => {
      if (res?.payload?.success) {
        dispatch(getListProvider())
        dispatch(getRackDetail(rack))
      }
    })
    setModal(false)
    setSelectable(false)
    setAddUnit(0)
    setUnitInfo(0)
    setSelectedUnits([])
    setContractNumber('')
    setConnectMethod('')
    setConnectContractNumber('')
    setContractDate('')
    setDeviceValue('')
    setPublisherValue('')
    setDeviceModel('')
    setDeviceNumber('')
    setElectricityValue('')
  }

  const handleUpdate = () => {
    const data = {
      description: comment,
      odf_count,
      provider: connectMethod,
      provider_contract_number: connectContractNumber,
      provider_contract_date:
        contractDate === '' || contractDate === null
          ? null
          : moment(contractDate).format('YYYY-MM-DD'),
    }
    const data2 = {
      rack: rack_detail?.id,
      device: deviceValue,
      device_publisher: publisherValue,
      device_model: deviceModel,
      device_number: deviceNumber,
      electricity: parseInt(electricityValue),
    }
    if (rack_detail?.is_busy) {
      dispatch(patchDeviceGeneral({data: data2, id: deviceDetail?.device_general_info?.id})).then(
        () => {
          dispatch(getRackDetail(rack))
        },
      )
    } else {
      dispatch(patchDeviceConfig({data, id: deviceDetail?.device_colocation?.id})).then(() => {
        dispatch(patchDeviceGeneral({data: data2, id: deviceDetail?.device_general_info?.id})).then(
          () => {
            dispatch(getRackDetail(rack))
          },
        )
      })
    }
  }

  const handleClear = () => {
    setAddUnit(0)
    setSelectedUnits([])
    setContractNumber('')
    setConnectMethod('')
    setConnectContractNumber('')
    setContractDate('')
    setDeviceValue('')
    setPublisherValue('')
    setDeviceModel('')
    setDeviceNumber('')
    setElectricityValue('')
  }

  const handleLabel = (status) => {
    if (status === "To'lov kutilmoqda" || status === 'Aktiv') return 'Shartnoma raqami'
    if (!status) return 'Shartnoma raqami'
    else return 'Shartnoma raxbariyat tomonlama imzolanmagan!'
  }

  const handleLabelColor = (status) => {
    if (status === "To'lov kutilmoqda" || status === 'Aktiv') return '#5B5B5B'
    if (!status) return '#5B5B5B'
    else return 'red'
  }

  const handleDisabled = (status) => {
    if (rack_detail?.is_busy) {
      if (deviceValue?.length < 1) return true
      if (publisherValue?.length < 1) return true
      if (deviceModel?.length < 1) return true
      if (deviceNumber?.length < 1) return true
      if (electricityValue?.length < 1) return true
      else return false
    }
    if (!rack_detail?.is_busy) {
      if (
        !deviceValue ||
        !selectedUnits ||
        !contractNumber ||
        !connectMethod ||
        unitContractInfo?.empty === 0 ||
        unitContractInfo?.count < arr.length ||
        !publisherValue ||
        !deviceModel ||
        !deviceNumber ||
        !electricityValue ||
        handleLabel(unitContractInfo?.contract?.contract_status?.name) ===
        'Shartnoma raxbariyat tomonlama imzolanmagan!' ||
        unitContractInfo?.electricity - electricityValue < 0
      )
        return true
      if (status !== "To'lov kutilmoqda" || status === 'Aktiv') return false
      if (!status) return true
      if (connectMethod?.length < 1) return true
      if (contractInfo?.empty === 0) return true
      if (deviceValue?.length < 1) return true
      if (publisherValue?.length < 1) return true
      if (deviceModel?.length < 1) return true
      if (deviceNumber?.length < 1) return true
      if (electricityValue?.length < 1) return true
      else return false
    }
  }

  const handleDisabledOpacity = (status) => {
    if (rack_detail?.is_busy) {
      if (deviceValue?.length < 1) return 0.5
      if (publisherValue?.length < 1) return 0.5
      if (deviceModel?.length < 1) return 0.5
      if (deviceNumber?.length < 1) return 0.5
      if (electricityValue?.length < 1) return 0.5
      else return 1
    }
    if (!rack_detail?.is_busy) {
      if (
        !deviceValue ||
        !selectedUnits ||
        !contractNumber ||
        !connectMethod ||
        unitContractInfo?.empty === 0 ||
        unitContractInfo?.count < arr.length ||
        !publisherValue ||
        !deviceModel ||
        !deviceNumber ||
        !electricityValue ||
        handleLabel(unitContractInfo?.contract?.contract_status?.name) ===
        'Shartnoma raxbariyat tomonlama imzolanmagan!'
      )
        return 0.5
      if (status !== "To'lov kutilmoqda" || status !== 'Aktiv') return 1
      if (!status) return 0.5
      if (connectMethod?.length < 1) return 0.5
      if (contractInfo?.empty === 0) return 0.5
      if (deviceValue?.length < 1) return 0.5
      if (publisherValue?.length < 1) return 0.5
      if (deviceModel?.length < 1) return 0.5
      if (deviceNumber?.length < 1) return 0.5
      if (electricityValue?.length < 1) return 0.5
      else return 1
    }
  }

  useEffect(() => {
    dispatch(getRackDetail(rack))
    dispatch(getListProvider())
  }, [dispatch, drawer])

  useEffect(() => {
    if (drawer) {
      dispatch(getRackContractDetail(rack_detail?.id))
    }
  }, [drawer])

  const handleShowRackInfo = () => {
    if (loading) return <Loader/>
    else {
      if (unitInfo === 0) {
        if (!selectable)
          return (
            <div className="showRack_rackBlock-body h-[750px]">
              <EmptyBlock
                icon={<EmptyIcon/>}
                title="Yangi server qo'shish"
                descr="Yangi server qo'shish uchun “Server qo'shish” tugmasini bosing"
                button="+ Server qo'shish"
                style={{
                  background: currentColor,
                  opacity:
                    user?.role === 'direktor' ||
                    user?.role === "direktor o'rinbosari" ||
                    user?.role === "departament boshlig'i" ||
                    user?.role === "bosh direktor maslahatchisi" ||
                    user?.role === 'buxgalteriya'
                      ? 0.5
                      : 1,
                }}
                role={
                  user?.role === 'direktor' ||
                  user?.role === "direktor o'rinbosari" ||
                  user?.role === "direktor o'rinbosari" ||
                  user?.role === "bosh direktor maslahatchisi" ||
                  user?.role === "departament boshlig'i"
                }
                onClick={() => {
                  setSelectable(true)
                }}
              />
            </div>
          )
        else {
          if (addUnit === 0) {
            return (
              <div className="showRack_rackBlock-body h-[750px]">
                <EmptyBlock
                  icon={<SelectIcon/>}
                  title="Server joyini tanlang"
                  descr="Bo'sh joyni tanlang va malumotlarni kiriting"
                  button="Bekor qilish"
                  onClick={() => {
                    setSelectable(false)
                  }}
                  style={{
                    color: 'red',
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: 'red',
                  }}
                />
              </div>
            )
          } else
            return (
              <div
                className="showRack_rackBlock-infoBody h-[750px] overflow-y-scroll rounded shadow-md mt-5 border p-4 dark:text-white"
              >
                <div className="flex justify-between">
                  <span className="font-bold dark:text-white">
                    UNIT raqami:{' '}
                    {selectedUnits.length > 1 ? `${getMinOfArray()} - ${getMaxOfArray()}` : addUnit}
                  </span>
                  <button
                    className="px-4 py-2 rounded bg-red-500 text-white"
                    disabled={
                      user?.role === 'direktor' ||
                      user?.role === "direktor o'rinbosari" ||
                      user?.role === "bosh direktor maslahatchisi" ||
                      user?.role === "departament boshlig'i"
                    }
                    style={{display: selectable ? 'none' : 'block'}}
                    onClick={() => setModal(true)}
                  >
                    Serverni ochirish
                  </button>
                </div>
                {!rack_detail?.is_busy && (
                  <>
                    <div className="font-bold text-center">Shartnoma maʼlumotlari</div>
                    <div className="my-4 flex justify-between">
                      <div className="w-[49%] flex flex-wrap gap-4 rounded border p-4">
                        <div className="showRack_rackBlock-infoBody-contractInfo_block_title">
                          {/*<ContractIcon />*/}
                          <span className="font-bold">Shartnoma</span>
                        </div>
                        <div className={'w-full flex items-end gap-4'}>
                          <div className={'w-full'}>
                            <Input
                              value={contractNumber || ''}
                              onChange={(e) => setContractNumber(e.target.value.toUpperCase())}
                              label={handleLabel(unitContractInfo?.contract?.contract_status?.name)}
                            />
                          </div>
                          <button
                            className={`px-4 py-2 rounded text-white disabled:opacity-25`}
                            style={{backgroundColor: currentColor}}
                            onClick={sendContractNumber}
                            disabled={!contractNumber}
                          >
                            Izlash
                          </button>
                        </div>
                        <div className="w-full">
                          <Input
                            label={'STIR/JShShIR'}
                            value={unitContractInfo?.client?.tin
                              ? unitContractInfo?.client?.tin
                              : unitContractInfo?.client?.pin || ''
                            }
                            type={'text'}
                            disabled={true}
                          />
                        </div>
                        <div className="w-full">
                          <Input
                            label={'Shartnoma sanasi'}
                            value={
                              unitContractInfo?.contract_date &&
                              moment(unitContractInfo?.contract_date).format('DD.MM.YYYY HH:mm:ss') || ''
                            }
                            type={'text'}
                            disabled={true}
                          />
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <div className="w-[49%]">
                            <Input
                              label={'Unit soni'}
                              value={unitContractInfo?.unit_count || ''}
                              type={'text'}
                              disabled={true}
                            />
                          </div>
                          <div className="w-[49%]">
                            <Input
                              label={'Unit qoldigi'}
                              value={unitContractInfo?.unit_quota || ''}
                              type={'text'}
                              disabled={true}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="w-[49%] flex flex-wrap gap-4 rounded border p-4">
                        <div>
                          {/*<SoldIcon />*/}
                          <span className="font-bold">Mijoz</span>
                        </div>
                        <div className="w-full">
                          <Input
                            label={'F.I.SH'}
                            value={unitContractInfo?.client?.full_name || ''}
                            type={'text'}
                            disabled={true}
                          />
                        </div>
                        <div className="w-full">
                          <Input
                            label={'Telefon'}
                            value={unitContractInfo?.client?.mob_phone_no || ''}
                            type={'text'}
                            disabled={true}
                          />
                        </div>
                        <div className="w-full">
                          <Input
                            label={'Pochta manzili'}
                            value={unitContractInfo?.client?.email || ''}
                            type={'text'}
                            disabled={true}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="my-4">
                      <div className="text-center font-bold">Izoh</div>
                      <textarea
                        cols="30"
                        rows="10"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="rounded w-full border outline-none p-4 dark:text-black"
                      />
                    </div>
                    <div className="rounded p-4 border">
                      <div className="flex flex-wrap gap-4">
                        <div className="pb-4">
                          {/*<LanguageIcon color="#0E0E4B" />*/}
                          <span className="font-bold">Internetga ulanish manbayi</span>
                        </div>
                        <div className="w-full">
                          <Input
                            label={'ODF soni'}
                            value={odf_count || ''}
                            type={'text'}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              const numericValue = inputValue.replace(/\D/g, '');
                              setOdfCount(numericValue);
                            }}
                          />
                        </div>
                        <div className={'w-full'}>
                          <label
                            htmlFor="client"
                            className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
                          >
                            Provayder nomi
                          </label>
                          <select
                            name="client"
                            id="client"
                            className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                            value={connectMethod}
                            onChange={(e) => setConnectMethod(e.target.value)}
                          >
                            <option value="" disabled={connectMethod}>Tanlang...</option>
                            {listProvider?.internet_provider?.map((item, index) => (
                              <option value={item?.id} key={index}>{item?.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="w-full">
                          <Input
                            label={'Shartnoma raqami'}
                            value={connectContractNumber || ''}
                            type={'text'}
                            onChange={(e) => setConnectContractNumber(e.target.value)}
                          />
                        </div>
                        <div className="w-full">
                          <Input
                            label={'Shartnoma sanasi'}
                            value={contractDate || ''}
                            type={'date'}
                            onChange={(e) => setContractDate(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded border p-4 my-4">
                      <div className="flex flex-wrap gap-4">
                        <div>
                          {/*<PaymentIcon />*/}
                          <span className="font-bold">Toʼlov</span>
                        </div>
                        <div className="w-full">
                          <Input
                            label={"To'lov miqdori"}
                            value={unitContractInfo?.contract?.contract_cash || ''}
                            type={'text'}
                            disabled={true}
                          />
                        </div>
                        <div className="w-full">
                          <Input
                            label={"Joriy oy uchun to'landi"}
                            value={unitContractInfo?.contract?.payed_cash || ''}
                            type={'text'}
                            disabled={true}
                          />
                        </div>
                        <div className="w-full">
                          <Input
                            label={"Qarzdorlik"}
                            value={unitContractInfo?.contract?.arrearage || ''}
                            type={'text'}
                            disabled={true}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {unitContractInfo && (
                          <>
                            <div className="w-full">
                              <Input
                                label={"Shartnoma holati"}
                                value={unitContractInfo?.contract?.contract_status?.name || ''}
                                type={'text'}
                                disabled={true}
                              />
                            </div>
                            <div className="w-full">
                              <Input
                                label={"Shartnoma amal qilish muddati"}
                                value={
                                  unitContractInfo?.contract?.expiration_date
                                    ? unitContractInfo?.contract?.expiration_date
                                    : moment(unitContractInfo?.contract?.contract_date)
                                    .add(1, 'y')
                                    .format('DD-MM-YYYY') || ''
                                }
                                type={'text'}
                                disabled={true}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <div className="font-bold text-center dark:text-white">Qurilma maʼlumotlari</div>
                <div className="my-4 flex flex-wrap justify-between gap-4 p-4 border rounded">
                  <div className="w-full">
                    {/*<DeviceInfoIcon />*/}
                    <span className="font-bold">Umumiy maʼlumot</span>
                  </div>
                  <div className={'w-full'}>
                    <label
                      htmlFor="client"
                      className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
                    >
                      Qurilma turi
                    </label>
                    <select
                      name="client"
                      id="client"
                      className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                      value={deviceValue}
                      onChange={(e) => setDeviceValue(e.target.value)}
                    >
                      <option value="" disabled={deviceValue}>Tanlang...</option>
                      {listProvider?.device?.map((item, index) => (
                        <option value={item?.id} key={index}>{item?.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className={'w-full'}>
                    <label
                      htmlFor="client"
                      className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
                    >
                      Ishlab chiqaruvchi
                    </label>
                    <select
                      name="client"
                      id="client"
                      className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                      value={publisherValue}
                      onChange={(e) => setPublisherValue(e.target.value)}
                    >
                      <option value="" disabled={publisherValue}>Tanlang...</option>
                      {listProvider?.device_publisher?.map((item, index) => (
                        <option value={item?.id} key={index}>{item?.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full">
                    <Input
                      label={"Qurilma modeli"}
                      value={deviceModel || ''}
                      onChange={(e) => setDeviceModel(e.target.value)}
                      type={'text'}
                    />
                  </div>
                  <div className="w-full">
                    <Input
                      label={"Qurilma seriya raqami"}
                      value={deviceNumber || ''}
                      onChange={(e) => setDeviceNumber(e.target.value)}
                      type={'text'}
                    />
                  </div>
                  <div className="w-full">
                    <Input
                      label={"Elektr iste'moli"}
                      value={electricityValue || ''}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const numericValue = inputValue.replace(/\D/g, '');
                        setElectricityValue(numericValue);
                      }}
                      type={'text'}
                    />
                  </div>
                </div>

                <div className="ml-auto w-full flex justify-start gap-4">
                  <button className="px-4 py-2 rounded bg-red-500 text-white" onClick={handleClear}>Bekor qilish
                  </button>
                  <button
                    className={`px-4 py-2 rounded text-white`}
                    style={{
                      backgroundColor: currentColor,
                      opacity: handleDisabledOpacity(
                        unitContractInfo?.contract?.contract_status?.name,
                      ),
                    }}
                    onClick={addDevice}
                    disabled={handleDisabled(unitContractInfo?.contract?.contract_status?.name)}
                  >
                    Saqlash
                  </button>
                </div>
              </div>
            )
        }
      } else
        return (
          <>
            <div className="showRack_rackBlock-infoBody mt-4 border rounded p-4 max-h-[750px] overflow-y-scroll">
              <div className="flex justify-between items-center">
                <span className="font-bold dark:text-white"
                >UNIT raqami: {deviceDetail?.unit?.start + '-' + deviceDetail?.unit?.end}</span>
                <button
                  disabled={
                    user?.role === 'direktor' ||
                    user?.role === "direktor o'rinbosari" ||
                    user?.role === "bosh direktor maslahatchisi" ||
                    user?.role === "departament boshlig'i"
                  }
                  className="px-4 py-2 rounded bg-red-500 text-white"
                  style={{display: selectable ? 'none' : 'block'}}
                  onClick={handleDeleteDevice}
                >
                  Serverni ochirish
                </button>
              </div>
              {!rack_detail?.is_busy && (
                <>
                  <div className="font-bold text-center">Shartnoma maʼlumotlari</div>
                  <div className="my-4 flex justify-between">
                    <div className="w-[49%] flex flex-wrap gap-4 rounded border p-4">
                      <div className="showRack_rackBlock-infoBody-contractInfo_block_title">
                        {/*<ContractIcon />*/}
                        <span className="font-bold">Shartnoma</span>
                      </div>
                      <div className={'w-full flex items-end gap-4'}>
                        <div className={'w-full'}>
                          <Input
                            value={deviceDetail?.contract_number || ''}
                            label="Shartnoma raqami"
                            disabled={true}
                          />
                        </div>
                      </div>
                      <div className="w-full">
                        <Input
                          label={'STIR/JShShIR'}
                          value={deviceDetail?.client?.tin
                            ? deviceDetail?.client?.tin
                            : deviceDetail?.client?.pin || ''
                          }
                          type={'text'}
                          disabled={true}
                        />
                      </div>
                      <div className="w-full">
                        <Input
                          label={'Shartnoma sanasi'}
                          value={
                            moment(deviceDetail?.contract?.contract_date).format('DD.MM.YYYY') || ''
                          }
                          type={'text'}
                          disabled={true}
                        />
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <div className="w-[49%]">
                          <Input
                            label={'Unit soni'}
                            value={deviceDetail?.unit_count || ''}
                            type={'text'}
                            disabled={true}
                          />
                        </div>
                        <div className="w-[49%]">
                          <Input
                            label={'Unit qoldigi'}
                            value={deviceDetail?.unit_quota || ''}
                            type={'text'}
                            disabled={true}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-[49%] flex flex-wrap gap-4 rounded border p-4">
                      <div>
                        {/*<SoldIcon />*/}
                        <span className="font-bold">Mijoz</span>
                      </div>
                      <div className="w-full">
                        <Input
                          label={'F.I.SH'}
                          value={deviceDetail?.client?.full_name || ''}
                          type={'text'}
                          disabled={true}
                        />
                      </div>
                      <div className="w-full">
                        <Input
                          label={'Telefon'}
                          value={deviceDetail?.client?.mob_phone_no || ''}
                          type={'text'}
                          disabled={true}
                        />
                      </div>
                      <div className="w-full">
                        <Input
                          label={'Pochta manzili'}
                          value={deviceDetail?.client?.email || ''}
                          type={'text'}
                          disabled={true}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="my-4">
                    <div className="text-center font-bold">Izoh</div>
                    <textarea
                      cols="30"
                      rows="10"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="rounded w-full border outline-none p-4 dark:text-black"
                    />
                  </div>
                  <div className="rounded p-4 border">
                    <div className="flex flex-wrap gap-4">
                      <div className="pb-4">
                        {/*<LanguageIcon color="#0E0E4B" />*/}
                        <span className="font-bold">Internetga ulanish manbayi</span>
                      </div>
                      <div className="w-full">
                        <Input
                          label={'ODF soni'}
                          value={odf_count || ''}
                          type={'text'}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const numericValue = inputValue.replace(/\D/g, '');
                            setOdfCount(numericValue);
                          }}
                        />
                      </div>
                      <div className={'w-full'}>
                        <label
                          htmlFor="client"
                          className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
                        >
                          Provayder nomi
                        </label>
                        <select
                          name="client"
                          id="client"
                          className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                          value={connectMethod}
                          onChange={(e) => setConnectMethod(e.target.value)}
                        >
                          <option value="" disabled={connectMethod}>Tanlang...</option>
                          {listProvider?.internet_provider?.map((item, index) => (
                            <option value={item?.id} key={index}>{item?.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-full">
                        <Input
                          label={'Shartnoma raqami'}
                          value={connectContractNumber || ''}
                          type={'text'}
                          onChange={(e) => setConnectContractNumber(e.target.value)}
                        />
                      </div>
                      <div className="w-full">
                        <Input
                          label={'Shartnoma sanasi'}
                          value={contractDate || ''}
                          type={'date'}
                          onChange={(e) => setContractDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded border p-4 my-4">
                    <div className="flex flex-wrap gap-4">
                      <div>
                        {/*<PaymentIcon />*/}
                        <span className="font-bold">Toʼlov</span>
                      </div>
                      <div className="w-full">
                        <Input
                          label={"To'lov miqdori"}
                          value={unitContractInfo?.contract?.contract_cash || ''}
                          type={'text'}
                          disabled={true}
                        />
                      </div>
                      <div className="w-full">
                        <Input
                          label={"Joriy oy uchun to'landi"}
                          value={unitContractInfo?.contract?.payed_cash || ''}
                          type={'text'}
                          disabled={true}
                        />
                      </div>
                      <div className="w-full">
                        <Input
                          label={"Qarzdorlik"}
                          value={unitContractInfo?.contract?.arrearage || ''}
                          type={'text'}
                          disabled={true}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {unitContractInfo && (
                        <>
                          <div className="w-full">
                            <Input
                              label={"Shartnoma holati"}
                              value={unitContractInfo?.contract?.contract_status?.name || ''}
                              type={'text'}
                              disabled={true}
                            />
                          </div>
                          <div className="w-full">
                            <Input
                              label={"Shartnoma amal qilish muddati"}
                              value={
                                unitContractInfo?.contract?.expiration_date
                                  ? unitContractInfo?.contract?.expiration_date
                                  : moment(unitContractInfo?.contract?.contract_date)
                                  .add(1, 'y')
                                  .format('DD-MM-YYYY') || ''
                              }
                              type={'text'}
                              disabled={true}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="font-bold text-center dark:text-white">Qurilma maʼlumotlari</div>
              <div className="my-4 flex flex-wrap justify-between gap-4 p-4 border rounded dark:text-white">
                <div className="w-full">
                  {/*<DeviceInfoIcon />*/}
                  <span className="font-bold">Umumiy maʼlumot</span>
                </div>
                <div className={'w-full'}>
                  <label
                    htmlFor="client"
                    className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
                  >
                    Qurilma turi
                  </label>
                  <select
                    name="client"
                    id="client"
                    className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                    value={deviceValue}
                    onChange={(e) => setDeviceValue(e.target.value)}
                  >
                    <option value="" disabled={deviceValue}>Tanlang...</option>
                    {listProvider?.device?.map((item, index) => (
                      <option value={item?.id} key={index}>{item?.name}</option>
                    ))}
                  </select>
                </div>
                <div className={'w-full'}>
                  <label
                    htmlFor="client"
                    className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
                  >
                    Ishlab chiqaruvchi
                  </label>
                  <select
                    name="client"
                    id="client"
                    className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                    value={publisherValue}
                    onChange={(e) => setPublisherValue(e.target.value)}
                  >
                    <option value="" disabled={publisherValue}>Tanlang...</option>
                    {listProvider?.device_publisher?.map((item, index) => (
                      <option value={item?.id} key={index}>{item?.name}</option>
                    ))}
                  </select>
                </div>
                <div className="w-full">
                  <Input
                    label={"Qurilma modeli"}
                    value={deviceModel || ''}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    type={'text'}
                  />
                </div>
                <div className="w-full">
                  <Input
                    label={"Qurilma seriya raqami"}
                    value={deviceNumber || ''}
                    onChange={(e) => setDeviceNumber(e.target.value)}
                    type={'text'}
                  />
                </div>
                <div className="w-full">
                  <Input
                    label={"Elektr iste'moli"}
                    value={electricityValue || ''}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const numericValue = inputValue.replace(/\D/g, '');
                      setElectricityValue(numericValue);
                    }}
                    type={'text'}
                  />
                </div>
              </div>

              <div className="ml-auto w-full flex justify-start gap-4">
                <button
                  className="px-4 py-2 rounded bg-red-500 text-white"
                  onClick={() => {
                    setUnitInfo(0)
                    clearData()
                  }}
                >
                  Bekor qilish
                </button>
                <button
                  className={`px-4 py-2 rounded text-white`}
                  style={{
                    backgroundColor: currentColor,
                  }}
                  onClick={handleUpdate}
                >
                  Saqlash
                </button>
              </div>
            </div>
            {/*<Modal open={modal} onClose={() => setModal(false)}>*/}
            {/*  <DeleteUnitModal onClose={() => setModal(false)} confirm={handleDeleteDevice} />*/}
            {/*</Modal>*/}
          </>
        )
    }
  }

  return (
    <>
      <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-4 bg-white dark:bg-secondary-dark-bg rounded">
        <DetailNav
          id={rack}
          name={client}
          status={rack_detail?.is_for_unit_service ? 'Unitlar uchun' : (rack_detail?.is_busy ? 'Sotilgan' : "Bo'sh")}
        />
      </div>
      <div className="mx-4">
        <div className="flex justify-between w-full relative md:mt-8 mt-24 p-2 md:px-4 bg-white dark:bg-secondary-dark-bg rounded">
          <div className="flex-3 flex flex-col w-[30%]">
            <div className="flex items-center justify-between w-full h-14 dark:bg-secondary-dark-bg bg-white border rounded p-5">
              <span className="font-bold text-2xl leading-6 text-black dark:text-white">Unitni tanlang</span>
              <div className="flex items-center">
              <span className="font-bold text-xl leading-9 text-black dark:text-white">
                {selectedUnits.length > 1 ? `${getMinOfArray()} - ${getMaxOfArray()}` : addUnit}
              </span>
                <div className="flex flex-col justify-center ml-5 showRack_unitBlock-head-count-buttons">
                  <button
                    disabled={!selectable} onClick={increment}
                    className="bg-white border rounded p-1 px-2 font-bold flex items-center justify-center"
                  >
                    {/*<AddIcon />*/} +
                  </button>
                </div>
              </div>
            </div>
            <div
              className="mt-5 w-full max-h-[750px] overflow-y-scroll bg-white dark:bg-secondary-dark-bg border rounded p-5 showRack_unitBlock-body"
            >
              {
                loading
                  ?
                  <Loader/>
                  :
                  unitsData?.sort((rack1, rack2) => rack1.place_number - rack2.place_number)?.map((el) => (
                    <div className="flex items-center relative mt-2 w-full" key={el.id}>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-lg leading-5 ${el.is_busy ? 'bg-white text-gray-800' : 'text-[#b6b6b6]'} ${el.unit_valid_action ? 'bg-red-500' : ''}`}
                        title={el?.unit_valid_action !== null && el?.unit_valid_action?.status_code === 1 && el?.unit_valid_action?.message || ''}
                      >
                        {el.place_number}
                      </div>
                      {selectable
                        ? handleSelectableDevices(unitsData?.length + 1, el.place_number, el.is_busy, el.is_selected)
                        : handleDevices(el.device_count, el.place_number, el.is_busy, el.id, el?.device_general_info?.device?.name, el?.device_general_info?.device_publisher?.name)}
                    </div>
                  ))
              }
            </div>
          </div>
          <div className="flex-9 ml-7 w-full">
            <div
              className="flex items-center justify-between h-14 px-5 bg-white dark:bg-secondary-dark-bg border rounded showRack_rackBlock-head"
            >
              <div style={{width: 50}}/>
              <span className="font-bold text-2xl leading-6 text-dark dark:text-white">Rack: {rack_detail?.place_number}</span>
              {rack_detail?.is_busy ? (
                <div
                  className="flex items-center rounded-full cursor-pointer showRack_rackBlock-head-sold"
                  onClick={() => setDrawer(true)}
                >
                  {<BiBadgeCheck size={30} color={currentColor}/>}
                </div>
              ) : (
                <button
                  className={`flex items-center rounded-full border-0 p-1 disabled:opacity-50`}
                  onClick={() => setDrawer(true)}
                  disabled={rack_detail?.is_for_unit_service || ["direktor", "direktor o'rinbosari", "departament boshlig'i", "bosh direktor maslahatchisi"].includes(user?.role)}
                >
                  {<BiBadgeCheck size={30} color={'#b6b6b6'}/>}
                </button>
              )}
            </div>
            {handleShowRackInfo()}
          </div>
          {/*<Drawer anchor="right" open={drawer} onClose={clearData}>*/}
          {drawer && (
            <RackDrawer
              onClose={clearData}
              type={rack_detail?.is_busy ? 'sold' : 'notSold'}
              rack_id={rack_detail?.id}
              devicesLength={rack_detail?.unit_count}
            />
          )}
          {/*</Drawer>*/}
        </div>
      </div>
    </>
  );

};

export default ShowRack;