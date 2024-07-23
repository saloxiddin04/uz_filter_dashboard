import React, {useState, useEffect, useMemo} from 'react';
import {useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Loader} from "../index";
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

const ShowRack = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const { rack } = location.state

  const {currentColor} = useStateContext();

  const {loading, rack_detail, listProvider, deviceDetail, unitContractInfo, contractInfo} = useSelector(state => state.dataCenter);
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
          setSelectedUnits((prev) => [...prev, { unit }])
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
      return {
        ...el,
        is_selected: el.place_number === handle(el.place_number),
        device_count: el.is_busy && el.start === el.place_number && el.end - el.place_number + 1,
      }
    })
  }, [rack_detail, selectedUnits])

  let arr = selectedUnits?.filter(
    (obj, index, self) => index === self.findIndex((t) => t.unit === obj.unit),
  )

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
            setSelectedUnits((prev) => [...prev, { unit: count }])
          } else {
            setCount(count + 1)
            setAddUnit(count + 1)
            setSelectedUnits((prev) => [...prev, { unit: count + 1 }])
          }
        } else {
          toast.error("Keyingi unit band bo'lgani uchun sotib olish mumkin emas!")
        }
      }
    }
  }

  const handleDevices = (deviceCount, number, busy, device) => {
    if (deviceCount === 4) {
      return (
        <div
          className="absolute top-1 left-6 w-[90%] h-[149px] ml-4 rounded cursor-pointer bg-cover bg-[#b6b6b6] bg-no-repeat z-10"
          onClick={() => showUnitInfo(number, busy, device)}
        />
      )
    }
    if (deviceCount === 3) {
      return (
        <div
          className="absolute top-[-1.5rem] left-6 w-[90%] h-[121px] ml-4 rounded cursor-pointer bg-cover bg-[#b6b6b6] bg-no-repeat z-10"
          onClick={() => showUnitInfo(number, busy, device)}
        />
      )
    }
    if (deviceCount === 2) {
      return (
        <div
          className="absolute top-[-0.5rem] left-6 w-[90%] h-[76px] ml-4 rounded cursor-pointer bg-cover bg-[#b6b6b6] bg-no-repeat z-10"
          onClick={() => showUnitInfo(number, busy, device)}
        />
      )
    }
    if (deviceCount === 1) {
      return (
        <div
          className="w-[90%] h-7 ml-4 rounded cursor-pointer bg-cover bg-no-repeat bg-[#b6b6b6]"
          onClick={() => showUnitInfo(number, busy, device)}
        />
      )
    } else return <div className="w-[90%] h-7 ml-4 rounded bg-[#b6b6b6] border" />
  }

  const handleSelectableDevices = (deviceCount, number, busy, selected) => {
    if (deviceCount === 4) {
      return <div className="absolute top-1 left-6 w-[90%] h-[149px] ml-4 rounded cursor-pointer bg-cover bg-[#b6b6b6] bg-no-repeat z-10" style={{ cursor: 'no-drop' }} />
    }
    if (deviceCount === 3) {
      return <div className="absolute top-[-1.5rem] left-6 w-[90%] h-[121px] ml-4 rounded cursor-pointer bg-cover bg-[#b6b6b6] bg-no-repeat z-10" style={{ cursor: 'no-drop' }} />
    }
    if (deviceCount === 2) {
      return <div className="absolute top-[-0.5rem] left-6 w-[90%] h-[76px] ml-4 rounded cursor-pointer bg-cover bg-[#b6b6b6] bg-no-repeat z-10" style={{ cursor: 'no-drop' }} />
    }
    if (deviceCount === 1) {
      return <div className="w-[90%] h-7 ml-4 rounded cursor-pointer bg-cover bg-[#b6b6b6] bg-no-repeat" style={{ cursor: 'no-drop' }} />
    } else
      return (
        <div
          className="w-[90%] h-7 ml-4 rounded flex items-center justify-center bg-blue-600 border border-dashed border-white"
          style={{
            cursor: 'pointer',
            backgroundColor: selected ? '#b6b6b6' : currentColor,
          }}
          onClick={() => {
            handleUnitSelect(number, busy)
          }}
        >
          {!busy && (
            <span className="font-bold text-xs leading-3 text-white" style={{ color: selected ? '#000' : '#fff' }}>
              {selected ? 'Belgilangan joy' : '+ Joyni tanlang'}
            </span>
          )}
        </div>
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
        dispatch(getListProvider(access))
        setSelectable(false)
      })
    }
    if (!rack_detail?.is_busy && rack_detail?.is_for_unit_service) {
      dispatch(createUnit(body)).then(() => {
        dispatch(getRackDetail(rack))
        dispatch(getListProvider())
        setSelectable(false)
      })
    }
    dispatch(getRackDetail(rack))
    setSelectable(false)
  }

  const handleDeleteDevice = () => {
    dispatch(deleteDevice(deviceDetail?.unit?.id, 'unit')).then((res) => {
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
  }, [dispatch])

  useEffect(() => {
    if (drawer) {
      dispatch(getRackContractDetail(rack_detail?.id))
    }
  }, [drawer])

  const handleShowRackInfo = () => {
    if (unitInfo === 0) {
      if (!selectable)
        return (
          <div className="showRack_rackBlock-body h-[750px]">
            <EmptyBlock
              icon={<EmptyIcon />}
              title="Yangi server qo'shish"
              descr="Yangi server qo'shish uchun “Server qo'shish” tugmasini bosing"
              button="+ Server qo'shish"
              style={{
                background: currentColor,
                opacity:
                  user?.userdata?.role?.name === 'direktor' ||
                  user?.userdata?.role?.name === "direktor o'rinbosari" ||
                  user?.userdata?.role?.name === "departament boshlig'i" ||
                  user?.userdata?.role?.name === 'buxgalteriya'
                    ? 0.5
                    : 1,
              }}
              role={
                user?.userdata?.role?.name === 'direktor' ||
                user?.userdata?.role?.name === "direktor o'rinbosari" ||
                user?.userdata?.role?.name === "departament boshlig'i"
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
                icon={<SelectIcon />}
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
            <div className="showRack_rackBlock-infoBody">
              <div className="showRack_rackBlock-infoBody-head">
                <span>
                  UNIT raqami:{' '}
                  {selectedUnits.length > 1 ? `${getMinOfArray()} - ${getMaxOfArray()}` : addUnit}
                </span>
                <button
                  disabled={
                    user?.userdata?.role?.name === 'direktor' ||
                    user?.userdata?.role?.name === "direktor o'rinbosari" ||
                    user?.userdata?.role?.name === "departament boshlig'i"
                  }
                  style={{ display: selectable ? 'none' : 'block' }}
                  onClick={() => setModal(true)}
                >
                  Serverni ochirish
                </button>
              </div>
              {!rack_detail?.is_busy && (
                <>
                  <div className="showRack_rackBlock-infoBody-text">Shartnoma maʼlumotlari</div>
                  <div className="showRack_rackBlock-infoBody-contractInfo">
                    <div className="showRack_rackBlock-infoBody-contractInfo_block">
                      <div className="showRack_rackBlock-infoBody-contractInfo_block_title">
                        {/*<ContractIcon />*/}
                        <span>Shartnoma</span>
                      </div>
                      {/*<InputBlock*/}
                      {/*  type="inputWithButton"*/}
                      {/*  label={handleLabel(unitContractInfo?.contract?.contract_status?.name)}*/}
                      {/*  labelColor={handleLabelColor(*/}
                      {/*    unitContractInfo?.contract?.contract_status?.name,*/}
                      {/*  )}*/}
                      {/*  submit={sendContractNumber}*/}
                      {/*  value={contractNumber}*/}
                      {/*  onChange={(e) => setContractNumber(e.target.value)}*/}
                      {/*/>*/}
                      {/*<InputBlock*/}
                      {/*  type="input"*/}
                      {/*  label="STIR/JShShIR"*/}
                      {/*  value={*/}
                      {/*    unitContractInfo?.client?.tin*/}
                      {/*      ? unitContractInfo?.client?.tin*/}
                      {/*      : unitContractInfo?.client?.pin*/}
                      {/*  }*/}
                      {/*  disabled={true}*/}
                      {/*/>*/}
                      {/*<InputBlock*/}
                      {/*  type="input"*/}
                      {/*  label="Shartnoma sanasi"*/}
                      {/*  disabled={true}*/}
                      {/*  value={*/}
                      {/*    unitContractInfo?.contract_date &&*/}
                      {/*    moment(unitContractInfo?.contract_date).format('DD.MM.YYYY HH:mm:ss')*/}
                      {/*  }*/}
                      {/*/>*/}
                      {/*<InputBlock*/}
                      {/*  type="multipleInput"*/}
                      {/*  label="Unit soni"*/}
                      {/*  value={unitContractInfo?.unit_count}*/}
                      {/*  label2="Unit qoldigʼi"*/}
                      {/*  value2={unitContractInfo?.unit_quota}*/}
                      {/*  disabled={true}*/}
                      {/*/>*/}
                    </div>
                    <div className="showRack_rackBlock-infoBody-contractInfo_block">
                      <div className="showRack_rackBlock-infoBody-contractInfo_block_title">
                        {/*<SoldIcon />*/}
                        <span>Mijoz</span>
                      </div>
                      {/*<InputBlock*/}
                      {/*  type="input"*/}
                      {/*  label="F.I.SH."*/}
                      {/*  value={unitContractInfo?.client?.full_name}*/}
                      {/*/>*/}
                      {/*<InputBlock*/}
                      {/*  type="input"*/}
                      {/*  label="Telefon"*/}
                      {/*  value={unitContractInfo?.client?.mob_phone_no}*/}
                      {/*/>*/}
                      {/*<InputBlock*/}
                      {/*  type="input"*/}
                      {/*  label="Pochta manzili"*/}
                      {/*  value={unitContractInfo?.client?.email}*/}
                      {/*/>*/}
                    </div>
                  </div>
                  <div>
                    <div className="showRack_rackBlock-infoBody-text">Izoh</div>
                    <textarea
                      cols="30"
                      rows="10"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      style={{ width: '100%', marginTop: 20, borderRadius: 8, outline: 'none' }}
                    />
                  </div>
                  <div className="rackDrawer-internetConnect">
                    <div className="rackDrawer-internetConnect_block">
                      <div className="rackDrawer-internetConnect_block_title">
                        {/*<LanguageIcon color="#0E0E4B" />*/}
                        <span>Internetga ulanish manbayi</span>
                      </div>
                      {/*<InputBlock*/}
                      {/*  type="input"*/}
                      {/*  label="ODF soni"*/}
                      {/*  value={odf_count}*/}
                      {/*  onChange={(e) => {*/}
                      {/*    const inputValue = e.target.value;*/}
                      {/*    const numericValue = inputValue.replace(/\D/g, '');*/}
                      {/*    setOdfCount(numericValue);*/}
                      {/*  }}*/}
                      {/*/>*/}
                      {/*<InputBlock*/}
                      {/*  type="select"*/}
                      {/*  label="Provayder nomi"*/}
                      {/*  value={connectMethod}*/}
                      {/*  onChange={(e) => setConnectMethod(e.target.value)}*/}
                      {/*  data={listProvider?.internet_provider}*/}
                      {/*/>*/}
                      {/*<InputBlock*/}
                      {/*  type="input"*/}
                      {/*  label="Shartnoma raqami"*/}
                      {/*  value={connectContractNumber}*/}
                      {/*  onChange={(e) => setConnectContractNumber(e.target.value)}*/}
                      {/*/>*/}
                      {/*<InputBlock*/}
                      {/*  type="datePicker"*/}
                      {/*  label="Shartnoma sanasi"*/}
                      {/*  value={contractDate}*/}
                      {/*  onChange={(e) => setContractDate(e)}*/}
                      {/*/>*/}
                    </div>
                  </div>
                  <div className="showRack_rackBlock-infoBody-payment">
                    <div className="showRack_rackBlock-infoBody-payment_block">
                      <div className="showRack_rackBlock-infoBody-payment_block_title">
                        {/*<PaymentIcon />*/}
                        <span>Toʼlov</span>
                      </div>
                      {/*<InputBlock*/}
                      {/*  type="input"*/}
                      {/*  label="Toʼlov miqdori"*/}
                      {/*  value={unitContractInfo?.contract?.contract_cash}*/}
                      {/*  disabled={true}*/}
                      {/*/>*/}
                      {/*<InputBlock*/}
                      {/*  type="input"*/}
                      {/*  label="Joriy oy uchun toʼlandi"*/}
                      {/*  value={unitContractInfo?.contract?.payed_cash}*/}
                      {/*  disabled={true}*/}
                      {/*/>*/}
                      {/*<InputBlock*/}
                      {/*  type="input"*/}
                      {/*  label="Qarzdorlik"*/}
                      {/*  value={unitContractInfo?.contract?.arrearage}*/}
                      {/*  disabled={true}*/}
                      {/*/>*/}
                    </div>
                    <div className="showRack_rackBlock-infoBody-payment_block">
                      {/*{unitContractInfo && (*/}
                      {/*  <InputBlock*/}
                      {/*    type="payed"*/}
                      {/*    label="Shartnoma holati"*/}
                      {/*    status={unitContractInfo?.contract?.contract_status?.name}*/}
                      {/*  />*/}
                      {/*)}*/}
                      {/*{unitContractInfo && (*/}
                      {/*  <InputBlock*/}
                      {/*    type="srok"*/}
                      {/*    label="Shartnoma amal qilish muddati"*/}
                      {/*    value={*/}
                      {/*      unitContractInfo?.contract?.expiration_date*/}
                      {/*        ? unitContractInfo?.contract?.expiration_date*/}
                      {/*        : moment(unitContractInfo?.contract?.contract_date)*/}
                      {/*          .add(1, 'y')*/}
                      {/*          .format('DD-MM-YYYY')*/}
                      {/*    }*/}
                      {/*  />*/}
                      {/*)}*/}
                    </div>
                  </div>
                </>
              )}

              <div className="showRack_rackBlock-infoBody-text">Qurilma maʼlumotlari</div>
              <div className="showRack_rackBlock-infoBody-deviceInfo">
                <div className="showRack_rackBlock-infoBody-deviceInfo_title">
                  {/*<DeviceInfoIcon />*/}
                  <span>Umumiy maʼlumot</span>
                </div>
                {/*<InputBlock*/}
                {/*  type="select"*/}
                {/*  label="Qurilma turi"*/}
                {/*  value={deviceValue}*/}
                {/*  onChange={(e) => setDeviceValue(e.target.value)}*/}
                {/*  data={listProvider?.device}*/}
                {/*/>*/}
                {/*<InputBlock*/}
                {/*  type="select"*/}
                {/*  label="Ishlab chiqaruvchi"*/}
                {/*  value={publisherValue}*/}
                {/*  onChange={(e) => setPublisherValue(e.target.value)}*/}
                {/*  data={listProvider?.device_publisher}*/}
                {/*/>*/}
                {/*<InputBlock*/}
                {/*  type="input"*/}
                {/*  label="Qurilma modeli"*/}
                {/*  value={deviceModel}*/}
                {/*  onChange={(e) => setDeviceModel(e.target.value)}*/}
                {/*/>*/}
                {/*<InputBlock*/}
                {/*  type="input"*/}
                {/*  label="Qurilma seriya raqami"*/}
                {/*  value={deviceNumber}*/}
                {/*  onChange={(e) => setDeviceNumber(e.target.value)}*/}
                {/*/>*/}
                {/*<InputBlock*/}
                {/*  type="input"*/}
                {/*  label="Elektr iste`moli (W)"*/}
                {/*  inputType="number"*/}
                {/*  value={electricityValue}*/}
                {/*  onChange={(e) => setElectricityValue(e.target.value)}*/}
                {/*/>*/}
              </div>

              <div className="showRack_rackBlock-infoBody-btnWrap">
                <button onClick={handleClear}>Bekor qilish</button>
                <button
                  onClick={addDevice}
                  disabled={handleDisabled(unitContractInfo?.contract?.contract_status?.name)}
                  style={{
                    opacity: handleDisabledOpacity(
                      unitContractInfo?.contract?.contract_status?.name,
                    ),
                  }}
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
          <div className="showRack_rackBlock-infoBody">
            <div className="showRack_rackBlock-infoBody-head">
              <span>UNIT raqami: {deviceDetail?.unit?.start + '-' + deviceDetail?.unit?.end}</span>
              <button
                disabled={
                  user?.userdata?.role?.name === 'direktor' ||
                  user?.userdata?.role?.name === "direktor o'rinbosari" ||
                  user?.userdata?.role?.name === "departament boshlig'i"
                }
                style={{ display: selectable ? 'none' : 'block' }}
                onClick={() => setModal(true)}
              >
                Serverni ochirish
              </button>
            </div>
            {!rack_detail?.is_busy && (
              <>
                <div className="showRack_rackBlock-infoBody-text">Shartnoma maʼlumotlari</div>
                <div className="showRack_rackBlock-infoBody-contractInfo">
                  <div className="showRack_rackBlock-infoBody-contractInfo_block">
                    <div className="showRack_rackBlock-infoBody-contractInfo_block_title">
                      {/*<ContractIcon />*/}
                      <span>Shartnoma</span>
                    </div>
                    {/*<InputBlock*/}
                    {/*  type="input"*/}
                    {/*  label="Shartnoma raqami"*/}
                    {/*  value={deviceDetail?.contract_number || ''}*/}
                    {/*/>*/}
                    {/*<InputBlock*/}
                    {/*  type="input"*/}
                    {/*  label="STIR/JShShIR"*/}
                    {/*  value={*/}
                    {/*    deviceDetail?.client?.tin*/}
                    {/*      ? deviceDetail?.client?.tin*/}
                    {/*      : deviceDetail?.client?.pin || ''*/}
                    {/*  }*/}
                    {/*  disabled={true}*/}
                    {/*/>*/}
                    {/*<InputBlock*/}
                    {/*  type="input"*/}
                    {/*  label="Shartnoma sanasi"*/}
                    {/*  value={*/}
                    {/*    moment(deviceDetail?.contract?.contract_date).format('DD.MM.YYYY') || ''*/}
                    {/*  }*/}
                    {/*/>*/}
                    {/*<InputBlock*/}
                    {/*  type="multipleInput"*/}
                    {/*  label="Unit soni"*/}
                    {/*  value={deviceDetail?.unit_count || ''}*/}
                    {/*  label2="Unit qoldigʼi"*/}
                    {/*  value2={deviceDetail?.unit_quota || ''}*/}
                    {/*  disabled={true}*/}
                    {/*/>*/}
                  </div>
                  <div className="showRack_rackBlock-infoBody-contractInfo_block">
                    <div className="showRack_rackBlock-infoBody-contractInfo_block_title">
                      {/*<SoldIcon />*/}
                      <span>Mijoz</span>
                    </div>
                    {/*<InputBlock*/}
                    {/*  type="input"*/}
                    {/*  label="F.I.Sh."*/}
                    {/*  value={deviceDetail?.client?.full_name || ''}*/}
                    {/*/>*/}
                    {/*<InputBlock*/}
                    {/*  type="input"*/}
                    {/*  label="Telefon"*/}
                    {/*  value={deviceDetail?.client?.mob_phone_no || ''}*/}
                    {/*/>*/}
                    {/*<InputBlock*/}
                    {/*  type="input"*/}
                    {/*  label="Pochta manzili"*/}
                    {/*  value={deviceDetail?.client?.email || ''}*/}
                    {/*/>*/}
                  </div>
                </div>
                <div>
                  <div className="showRack_rackBlock-infoBody-text">Izoh</div>
                  <textarea
                    cols="30"
                    rows="10"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ width: '100%', marginTop: 20, borderRadius: 8, outline: 'none' }}
                  />
                </div>
                <div className="rackDrawer-internetConnect">
                  <div className="rackDrawer-internetConnect_block">
                    <div className="rackDrawer-internetConnect_block_title">
                      {/*<LanguageIcon color="#0E0E4B" />*/}
                      <span>Internetga ulanish manbayi</span>
                    </div>
                    {/*<InputBlock*/}
                    {/*  type="input"*/}
                    {/*  label="ODF soni"*/}
                    {/*  value={odf_count}*/}
                    {/*  onChange={(e) => {*/}
                    {/*    const inputValue = e.target.value;*/}
                    {/*    const numericValue = inputValue.replace(/\D/g, '');*/}
                    {/*    setOdfCount(numericValue);*/}
                    {/*  }}*/}
                    {/*/>*/}
                    {/*<InputBlock*/}
                    {/*  type="select"*/}
                    {/*  label="Provayder nomi"*/}
                    {/*  value={connectMethod}*/}
                    {/*  onChange={(e) => setConnectMethod(e.target.value)}*/}
                    {/*  data={listProvider?.internet_provider}*/}
                    {/*/>*/}
                    {/*<InputBlock*/}
                    {/*  type="input"*/}
                    {/*  label="Shartnoma raqami"*/}
                    {/*  value={connectContractNumber}*/}
                    {/*  onChange={(e) => setConnectContractNumber(e.target.value)}*/}
                    {/*/>*/}
                    {/*<InputBlock*/}
                    {/*  type="datePicker"*/}
                    {/*  label="Shartnoma sanasi"*/}
                    {/*  value={contractDate}*/}
                    {/*  onChange={(e) => setContractDate(e)}*/}
                    {/*/>*/}
                  </div>
                </div>
                <div className="showRack_rackBlock-infoBody-payment">
                  <div className="showRack_rackBlock-infoBody-payment_block">
                    <div className="showRack_rackBlock-infoBody-payment_block_title">
                      {/*<PaymentIcon />*/}
                      <span>Toʼlov</span>
                    </div>
                    {/*<InputBlock*/}
                    {/*  type="input"*/}
                    {/*  label="Toʼlov miqdori"*/}
                    {/*  // value={deviceDetail?.contract?.contract_cash}*/}
                    {/*/>*/}
                    {/*<InputBlock*/}
                    {/*  type="input"*/}
                    {/*  label="Joriy oy uchun toʼlandi"*/}
                    {/*  // value={deviceDetail?.contract?.payed_cash}*/}
                    {/*/>*/}
                    {/*<InputBlock*/}
                    {/*  type="input"*/}
                    {/*  label="Qarzdorlik"*/}
                    {/*  // value={deviceDetail?.contract?.arrearage}*/}
                    {/*/>*/}
                  </div>
                  <div className="showRack_rackBlock-infoBody-payment_block">
                  </div>
                </div>
              </>
            )}
            <div className="showRack_rackBlock-infoBody-text">Qurilma maʼlumotlari</div>
            <div className="showRack_rackBlock-infoBody-deviceInfo">
              <div className="showRack_rackBlock-infoBody-deviceInfo_title">
                {/*<DeviceInfoIcon />*/}
                <span>Umumiy maʼlumot</span>
              </div>
              {/*<InputBlock*/}
              {/*  type="select"*/}
              {/*  label="Qurilma turi"*/}
              {/*  value={deviceValue}*/}
              {/*  onChange={(e) => setDeviceValue(e.target.value)}*/}
              {/*  data={listProvider?.device}*/}
              {/*/>*/}
              {/*<InputBlock*/}
              {/*  type="select"*/}
              {/*  label="Ishlab chiqaruvchi"*/}
              {/*  value={publisherValue}*/}
              {/*  data={listProvider?.device_publisher}*/}
              {/*  onChange={(e) => setPublisherValue(e.target.value)}*/}
              {/*/>*/}
              {/*<InputBlock*/}
              {/*  type="input"*/}
              {/*  label="Qurilma modeli"*/}
              {/*  value={deviceModel}*/}
              {/*  onChange={(e) => setDeviceModel(e.target.value)}*/}
              {/*/>*/}
              {/*<InputBlock*/}
              {/*  type="input"*/}
              {/*  label="Qurilma seriya raqami"*/}
              {/*  value={deviceNumber}*/}
              {/*  onChange={(e) => setDeviceNumber(e.target.value)}*/}
              {/*/>*/}
              {/*<InputBlock*/}
              {/*  type="input"*/}
              {/*  label="Elektr iste`moli (W)"*/}
              {/*  value={electricityValue}*/}
              {/*  onChange={(e) => setElectricityValue(e.target.value)}*/}
              {/*/>*/}
            </div>
            <div className="showRack_rackBlock-infoBody-btnWrap">
              <button onClick={() => setUnitInfo(0)}>Bekor qilish</button>
              <button onClick={handleUpdate}>Saqlash</button>
            </div>
          </div>
          {/*<Modal open={modal} onClose={() => setModal(false)}>*/}
          {/*  <DeleteUnitModal onClose={() => setModal(false)} confirm={handleDeleteDevice} />*/}
          {/*</Modal>*/}
        </>
      )
  }

  if (loading) return <Loader />

  return (
    <div className="flex justify-between w-full h-full showRack md:mt-8 mt-24 p-2 md:px-4 bg-white rounded">
      <div className="flex-3 flex flex-col w-1/3">
        <div className="flex items-center justify-between w-full h-14 bg-white border rounded p-5">
          <span className="font-bold text-2xl leading-6 text-black">Unitni tanlang</span>
          <div className="flex items-center">
          <span className="font-bold text-3xl leading-9 text-black">
            {selectedUnits.length > 1 ? `${getMinOfArray()} - ${getMaxOfArray()}` : addUnit}
          </span>
            <div className="flex flex-col justify-center ml-5 showRack_unitBlock-head-count-buttons">
              <button disabled={!selectable} onClick={increment} className="bg-white border rounded p-1 px-2 font-bold flex items-center justify-center">
                {/*<AddIcon />*/} +
              </button>
            </div>
          </div>
        </div>
        <div className="mt-5 w-full max-h-[750px] overflow-y-scroll bg-white border rounded p-5 showRack_unitBlock-body">
          {unitsData
            ?.sort((rack1, rack2) => rack1.place_number - rack2.place_number)
            ?.map((el) => (
              <div className="flex items-center relative mt-2 w-full" key={el.id}>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-lg leading-5 ${el.is_busy ? 'bg-white text-gray-800' : 'text-[#b6b6b6]'} ${el.unit_valid_action ? 'bg-red-500' : ''}`}
                  title={el?.unit_valid_action !== null && el?.unit_valid_action?.status_code === 1 && el?.unit_valid_action?.message || ''}
                >
                  {el.place_number}
                </div>
                {selectable
                  ? handleSelectableDevices(unitsData?.length + 1, el.place_number, el.is_busy, el.is_selected)
                  : handleDevices(el.device_count, el.place_number, el.is_busy, el.id)}
              </div>
            ))}
        </div>
      </div>
      <div className="flex-9 ml-14 showRack_rackBlock w-full">
        <div className="flex items-center justify-between h-14 px-5 bg-white border rounded showRack_rackBlock-head">
          <div style={{ width: 50 }} />
          <span className="font-bold text-2xl leading-6 text-dark">Rack: {rack_detail?.place_number}</span>
          {rack_detail?.is_busy ? (
            <div
              className="flex items-center bg-yellow-500 rounded-full cursor-pointer showRack_rackBlock-head-sold"
              onClick={() => setDrawer(true)}
              style={{background: currentColor}}
            >
              <span className="ml-2.5 font-medium text-xs leading-3 p-2 text-white">sotilgan</span>
            </div>
          ) : (
            <button
              className={`flex items-center rounded-full border-0 p-1 disabled:opacity-50`}
              onClick={() => setDrawer(true)}
              style={{background: currentColor}}
              disabled={rack_detail?.is_for_unit_service || ["direktor", "direktor o'rinbosari", "departament boshlig'i"].includes(user?.userdata?.role?.name)}
            >
              <span className="ml-2.5 font-medium text-xs leading-3 text-white">RACK sotilgan belgisi</span>
            </button>
          )}
        </div>
        {handleShowRackInfo()}
      </div>
      {/*<Drawer anchor="right" open={drawer} onClose={clearData}>*/}
      {/*  {drawer && (*/}
      {/*    <RackDrawer*/}
      {/*      onClose={clearData}*/}
      {/*      type={rack_detail?.is_busy ? 'sold' : 'notSold'}*/}
      {/*      rack_id={rack_detail?.id}*/}
      {/*      devicesLength={rack_detail?.unit_count}*/}
      {/*    />*/}
      {/*  )}*/}
      {/*</Drawer>*/}
    </div>
  );

};

export default ShowRack;