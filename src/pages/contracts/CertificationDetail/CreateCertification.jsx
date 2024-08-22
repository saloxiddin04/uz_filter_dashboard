import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useStateContext} from "../../../contexts/ContextProvider";
import {Input, Loader} from "../../../components";
import {
  clearStatesCertification,
  getCertificationCalculate,
  getCertificationCategory,
  getCertificationCountPrices,
  getCertificationTariff
} from "../../../redux/slices/contractCreate/Certification/CertificationSlice";
import instance from "../../../API";
import {TrashIcon} from "@heroicons/react/16/solid";
import {getContractDetail} from "../../../redux/slices/contracts/contractsSlice";
import {toast} from "react-toastify";

const CreateCertification = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {id, slug} = useParams();

  const {currentColor} = useStateContext();
  const {contractDetail} = useSelector(state => state.contracts);
  const {tariff, category, calculateCertification, contractDoc} = useSelector((state) => state.createCertification);

  const [typeContract, setTypeContract] = useState('')
  const [contract_number, setContractNumber] = useState('')
  const [contractDate, setContractDate] = useState('')
  const [priceSelect, setPriceSelect] = useState('')

  const [file, setFile] = useState(null)
  const [loader, setLoader] = useState(false)

  const [certificationScheme, setCertificationScheme] = useState('')
  const [compliance, setCompliance] = useState(false)
  const [complianceInput, setComplianceInput] = useState('')

  const [data, setData] = useState([
    {
      certification_type: '',
      tariff_telecommunications: '',
      input_device_count: '',
      tariff_telecommunications_prices: '',
      is_discount: false,
      discount_price: '',
      price: 0,
      selected_count: '',
      device_name: ''
    }
  ])

  const handleValAdd = () => {
    const abc = [...data, {
      certification_type: '',
      tariff_telecommunications: '',
      input_device_count: '',
      tariff_telecommunications_prices: '',
      is_discount: false,
      discount_price: '',
      price: 0,
      selected_count: '',
      device_name: ''
    }]
    setData(abc)
  }

  const timeoutId = useRef(null)
  const getCountPrices = useCallback((inputData, i, requestData) => {
    clearTimeout(timeoutId.current)
    timeoutId.current = setTimeout(async () => {
      let tariff_telecommunications_prices;
      switch (requestData.certification_type) {
        case 0:
          tariff_telecommunications_prices = requestData?.tariff_telecommunications_prices;
          break;
        case 1:
          tariff_telecommunications_prices = category.filter(cat => cat.type_of_tariff === Number(requestData.certification_type))[0]?.id
          break;
        case 2:
          tariff_telecommunications_prices = undefined
          break;
        case 3:
          tariff_telecommunications_prices = undefined
          break;
        default:
          tariff_telecommunications_prices = category.filter(cat => cat.type_of_tariff === Number(requestData.certification_type))[0]?.id
      }
      const dataForCountPrices = {
        certification_type: requestData?.certification_type === 0 || requestData?.certification_type === 1 ? 0 : requestData?.certification_type === 2 ? 1 : 2,
        input_device_count: requestData?.input_device_count,
        tariff_telecommunications: requestData?.tariff_telecommunications,
        tariff_telecommunications_prices: (requestData.certification_type === 1 && requestData.tariff_telecommunications_prices === undefined) ? category.filter(cat => cat.type_of_tariff === Number(requestData.certification_type))[0]?.id : tariff_telecommunications_prices
      }

      if (
        (requestData.certification_type === 0 && (requestData.tariff_telecommunications !== null && requestData.tariff_telecommunications_prices !== null))
        ||
        (requestData.certification_type === 1 && (requestData.tariff_telecommunications !== null && requestData.tariff_telecommunications_prices !== undefined)) ||
        (requestData.certification_type === 2) ||
        (requestData.certification_type === 3)
      ) {
        try {
          const response = await dispatch(getCertificationCountPrices(dataForCountPrices));
          inputData[i].selected_count = response?.payload?.devices_count_for_testing;
          inputData[i].price = response?.payload?.calculated_price
          setData([...inputData]);
        } catch (error) {
          console.log(error);
        }
      }
    }, 200);
  }, [category, dispatch, data])

  const handleChangeVal = (onChangeVal, i) => {
    let inputData = [...data]
    if (onChangeVal?.target?.checked) {
      inputData[i][onChangeVal?.target?.name] = onChangeVal?.target?.checked
    } else {
      inputData[i][onChangeVal?.target?.name] = onChangeVal?.target?.checked
      inputData[i][onChangeVal?.target?.name] = onChangeVal?.target?.value
      // getCalculate(inputData)
      if (inputData[i].is_discount === 'on') {
        inputData[i].is_discount = false
        inputData[i].discount_price = null
      }
      if (onChangeVal?.target?.name === 'certification_type') {
        dispatch(getCertificationTariff({type_of_tariff: onChangeVal?.target.value}))
        inputData[i].tariff_telecommunications = null
        inputData[i].tariff_telecommunications_prices = null
      } else if (onChangeVal?.target?.name === 'tariff_telecommunications') {
        try {
          dispatch(getCertificationCategory({id: onChangeVal?.target?.value}))
        } catch (e) {
          console.log(e)
        }
      }
    }

    if (
      (inputData[i].certification_type === '0' && inputData[i].tariff_telecommunications !== null) ||
      inputData[i].tariff_telecommunications_prices !== null || inputData[i].input_device_count !== null || category.length > 0
    ) {
      let tariff_telecommunications_prices;
      switch (inputData[i].certification_type) {
        case "0":
          tariff_telecommunications_prices = inputData[i].certification_type;
          break;
        case "1":
          tariff_telecommunications_prices = category.filter(cat => cat.type_of_tariff === Number(inputData[i].certification_type))[0]?.id
          break;
        case "2":
          tariff_telecommunications_prices = undefined
          break;
        case "3":
          tariff_telecommunications_prices = undefined
          break;
        default:
          tariff_telecommunications_prices = category.filter(cat => cat.type_of_tariff === Number(inputData[i].certification_type))[0]?.id
      }
      const requestData = {
        certification_type: Number(inputData[i].certification_type),
        input_device_count: Number(inputData[i].input_device_count),
        tariff_telecommunications: Number(inputData[i].certification_type) === 0 || Number(inputData[i].certification_type) === 1 ? inputData[i].tariff_telecommunications : undefined,
        tariff_telecommunications_prices
        // tariff_telecommunications_prices: Number(inputData[i].certification_type) === 0 ? inputData[i].tariff_telecommunications_prices : category[0]?.id
      };

      // getCountPrices(inputData, i, requestData)
      // getCalculate(inputData)
    }
    setData([...inputData]);
    const dataForCalculate = inputData?.map(item => {
      let certificationType;
      switch (item.certification_type) {
        case "0":
        case "1":
        case 0:
        case 1:
          certificationType = 0;
          break;
        case 2:
        case "2":
          certificationType = 1
          break;
        case 3:
        case "3":
          certificationType = 2
          break;
        default:
          certificationType = 2
      }
      return {
        certification_type: certificationType,
        device_name: item.device_name,
        discount_price: item.discount_price,
        input_device_count: item.input_device_count,
        is_discount: item.is_discount,
        price: item.price,
        selected_count: item.selected_count,
        tariff_telecommunications: item.tariff_telecommunications,
        tariff_telecommunications_prices: (certificationType === 0 && item.tariff_telecommunications_prices === null) ? category.filter(cat => cat.type_of_tariff === Number(item.certification_type))[0]?.id : item.tariff_telecommunications_prices
      };
    });
    // getCalculate(dataForCalculate)

    let tariff_telecommunications_prices;
    switch (inputData[i].certification_type) {
      case "0":
        tariff_telecommunications_prices = inputData[i].tariff_telecommunications_prices;
        break;
      case "1":
        tariff_telecommunications_prices = category.filter(cat => cat.type_of_tariff === Number(inputData[i].certification_type))[0]?.id
        break;
      case "2":
        tariff_telecommunications_prices = undefined
        break;
      case "3":
        tariff_telecommunications_prices = undefined
        break;
      default:
        tariff_telecommunications_prices = category.filter(cat => cat.type_of_tariff === Number(inputData[i].certification_type))[0]?.id
    }
    const requestData = {
      certification_type: Number(inputData[i].certification_type),
      input_device_count: Number(inputData[i].input_device_count),
      tariff_telecommunications: Number(inputData[i].certification_type) === 0 || Number(inputData[i].certification_type) === 1 ? inputData[i].tariff_telecommunications : undefined,
      tariff_telecommunications_prices
      // tariff_telecommunications_prices: Number(inputData[i].certification_type) === 0 ? inputData[i].tariff_telecommunications_prices : category[0]?.id
    };

    getCountPrices(inputData, i, requestData)
  }

  const handleDeleteVal = (i) => {
    const deleteVal = [...data]
    deleteVal.splice(i, 1)
    setData(deleteVal)
    // getCalculate(deleteVal)
  }

  const handleValidateSecond = () => {
    for (const currentProject of data) {
      if (
        !currentProject?.certification_type ||
        !currentProject?.input_device_count ||
        !currentProject?.price ||
        !certificationScheme ||
        currentProject?.certification_type === '0' && !currentProject?.tariff_telecommunications_prices ||
        (currentProject?.certification_type === '0' || currentProject?.certification_type === '1') && !currentProject?.tariff_telecommunications ||
        (currentProject?.certification_type === '2' || currentProject?.certification_type === '3') && !currentProject?.device_name ||
        currentProject?.is_discount && !currentProject?.discount_price ||
        !calculateCertification?.success ||
        !priceSelect || !file
      ) {
        return true
      }
    }
    return false
  }

  const handleValidateForCalculate = () => {
    for (const currentProject of data) {
      if (
        !currentProject?.certification_type ||
        !currentProject?.input_device_count ||
        !currentProject?.price ||
        !certificationScheme ||
        currentProject?.certification_type === '0' && !currentProject?.tariff_telecommunications_prices ||
        (currentProject?.certification_type === '0' || currentProject?.certification_type === '1') && !currentProject?.tariff_telecommunications ||
        (currentProject?.certification_type === '2' || currentProject?.certification_type === '3') && !currentProject?.device_name ||
        currentProject?.is_discount && !currentProject?.discount_price ||
        compliance && !complianceInput) {
        return true
      }
    }
    return false
  }

  useEffect(() => {
    const dataForCalculate = data?.map(item => {
      let certificationType;
      switch (item.certification_type) {
        case "0":
        case "1":
        case 0:
        case 1:
          certificationType = 0;
          break;
        case 2:
        case "2":
          certificationType = 1
          break;
        case 3:
        case "3":
          certificationType = 2
          break;
        default:
          certificationType = 2
      }
      return {
        certification_type: certificationType,
        device_name: item.device_name,
        discount_price: item.discount_price,
        input_device_count: item.input_device_count,
        is_discount: item.is_discount,
        price: item.price,
        selected_count: item.selected_count,
        tariff_telecommunications: item.tariff_telecommunications,
        tariff_telecommunications_prices: (certificationType === 0 && item.tariff_telecommunications_prices === null) ? category.filter(cat => cat.type_of_tariff === Number(item.certification_type))[0]?.id : item.tariff_telecommunications_prices
      };
    });
    if (!handleValidateForCalculate()) return getCalculate(dataForCalculate)
  }, [certificationScheme, complianceInput, data]);

  const timeoutIdCertification = useRef(null)
  const getCalculate = (data) => {
    clearTimeout(timeoutIdCertification.current)
    timeoutIdCertification.current = setTimeout(() => {
      dispatch(getCertificationCalculate({
        certification_devices: data,
        certification_schema: {schema_type: Number(certificationScheme), compliance_flag: compliance}
      }))
    }, 500)
  }

  const getCertificationScheme = async (data) => {
    const response = await instance.post('/tte_certification/certification-schema', data)
    return response.data
  }

  const bookedCertification = async () => {
    setLoader(true)
    try {
      const requestData = {
        certification_devices: JSON.stringify(data?.map(item => ({
          certification_type: item.certification_type === '0' || item.certification_type === '1' ? 0 : item.certification_type === '2' ? 1 : 2,
          device_name: item.device_name === '' ? null : item.device_name,
          discount_price: item.discount_price,
          input_device_count: item.input_device_count,
          is_discount: item.is_discount,
          price: item.price,
          selected_count: item.selected_count,
          tariff_telecommunications: item.tariff_telecommunications,
          tariff_telecommunications_prices: item.certification_type === "0" ? item?.tariff_telecommunications_prices : item.certification_type === "1" ? category.filter(cat => cat.type_of_tariff === Number(item.certification_type))[0]?.id : undefined
        }))),
        certification_schema: JSON.stringify({
          schema_type: Number(certificationScheme),
          compliance_flag: compliance,
        }),
        pay_choose: Number(priceSelect),
        file
      };
      await instance.patch(`/tte_certification/booked-contract/${id}`, requestData, {
        headers: { 'Content-type': 'multipart/form-data' }
      }).then((res) => {
        if (res?.data?.success) {
          setLoader(false)
          dispatch(getContractDetail({id,  slug}))
          toast.success("Muvofaqqiyatli yuklandi")
        } else {
          setLoader(false)
          toast.error("Xatolik")
        }
      })
    } catch (e) {
      setLoader(false)
    }
  }

  if (loader) return <Loader/>

  if (contractDetail?.contract?.contract_status === 'Shartnomani raqami bron qilingan') {
    return (
      <>
        <div className="w-2/4 my-2">
          <label
            htmlFor="type"
            className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
          >
            To'lov turi
          </label>
          <select
            name="type"
            id="type"
            className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
            value={priceSelect}
            onChange={(e) => setPriceSelect(e.target.value)}
          >
            <option disabled={priceSelect}>Tanlang...</option>
            {/*<option value={30}>30%/70%</option>*/}
            {/*<option value={50}>50%/50%</option>*/}
            <option value={2}>O'z mablag'i hisobidan (100%)</option>
          </select>
        </div>
        {priceSelect && (
          <>
            <div className="w-full flex items-center justify-between flex-wrap gap-4 my-4">
              <div className="w-full flex flex-wrap gap-4 my-2">
                {data && data?.map((item, i) => (
                  <div key={i} className="border-dashed border p-2 w-full flex flex-wrap gap-4 justify-between">
                    <div className="w-full text-end">
                      <button
                        onClick={() => handleDeleteVal(i)}
                        disabled={data.length === 1}
                      >
                        <TrashIcon
                          color={currentColor}
                          className="size-6 cursor-pointer"
                        />
                      </button>
                    </div>
                    <div className="w-full flex items-center justify-between gap-4">
                      <div className={'flex flex-col w-[49%]'}>
                        <label
                          className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                          htmlFor="certification_type"
                        >
                          Qurilma turini tanlang
                        </label>
                        <select
                          className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
                          value={item.certification_type || ''}
                          onChange={(e) => handleChangeVal(e, i)}
                          name="certification_type"
                          id="certification_type"
                        >
                          <option value="4" disabled={item.type}>Tanlang</option>
                          <option value="0">TTV*</option>
                          <option value="1">TTV**</option>
                          <option value="2">Smartfon</option>
                          <option value="3">Knopkali telefon</option>
                        </select>
                      </div>
                      {item?.certification_type === '0' || item?.certification_type === '1' || item?.certification_type === '' ? (
                        <div className={'flex flex-col w-[49%]'}>
                          <label
                            className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                            htmlFor="tariff_telecommunications"
                          >
                            Qurilma nomi
                          </label>
                          <select
                            className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
                            value={item.certification_type}
                            onChange={(e) => handleChangeVal(e, i)}
                            name={'tariff_telecommunications'}
                            id={'tariff_telecommunications'}
                          >
                            <option value="null" disabled={item.tariff_telecommunications}>Tanlang</option>
                            {tariff &&
                              tariff
                                .filter((el) => {
                                  return el?.type_of_tariff === Number(item.certification_type);
                                })
                                .map((detail) => (
                                    <option value={detail?.id} key={detail?.id}>
                                      {detail?.name_of_equipment}
                                    </option>
                                  )
                                )
                            }
                          </select>
                        </div>
                      ) : (
                        <div className={'flex flex-col w-[49%]'}>
                          <label
                            className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                            htmlFor="device_name"
                          >
                            Qurilma nomi
                          </label>
                          <input
                            value={item.device_name}
                            onChange={(e) => handleChangeVal(e, i)}
                            name='device_name'
                            id='device_name'
                            type="text"
                            className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                          />
                        </div>
                      )}
                    </div>
                    {item?.certification_type === "0" && (
                      <div className={'flex flex-col w-[49%]'}>
                        <label
                          className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                          htmlFor="tariff_telecommunications_prices"
                        >
                          Kategoriya
                        </label>
                        <select
                          className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
                          value={item.tariff_telecommunications_prices || ""}
                          onChange={(e) => handleChangeVal(e, i)}
                          name={'tariff_telecommunications_prices'}
                          id={'tariff_telecommunications_prices'}
                        >
                          <option value="0" disabled={item.tariff_telecommunications_prices}>Tanlang</option>
                          {category && category?.filter(element => (
                            element?.type_of_tariff === Number(item.certification_type)
                          ))?.map(el => (
                            <option value={el?.id} key={el?.id}>{el?.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className={'flex flex-col w-[49%]'}>
                      <label
                        className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                        htmlFor="input_device_count"
                      >
                        Qurilma soni
                      </label>
                      <input
                        value={item.input_device_count}
                        onChange={(e) => handleChangeVal(e, i)}
                        name='input_device_count'
                        id='input_device_count'
                        type="number"
                        className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                      />
                    </div>
                    <div className={'flex flex-col w-[49%]'}>
                      <label
                        className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                        htmlFor="selected_count"
                      >
                        Sinov uchun tanlangan qurilmalar soni
                      </label>
                      <input
                        value={item.selected_count || ''}
                        name='selected_count'
                        id='selected_count'
                        disabled={true}
                        type="text"
                        className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                      />
                    </div>
                    <div className={'flex flex-col w-[49%]'}>
                      <label
                        className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                        htmlFor="price"
                      >
                        Tarif bo’yicha jami to’lov miqdori (so’m)
                      </label>
                      <input
                        value={item.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') || ''}
                        name='price'
                        id='price'
                        disabled={true}
                        type="text"
                        className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                      />
                    </div>
                    {!item.is_discount && <div className="w-[49%] min-h-9"></div>}
                    {item.is_discount && (
                      <div className={'flex flex-col w-[49%]'}>
                        <label
                          className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                          htmlFor="discount_price"
                        >
                          Chegirmadagi to'lov miqdori
                        </label>
                        <input
                          value={item.discount_price || ''}
                          onChange={(e) => handleChangeVal(e, i)}
                          name='discount_price'
                          id="discount_price"
                          type="number"
                          className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                        />
                      </div>
                    )}
                    <div className={'flex items-center gap-4 w-[49%]'}>
                      <label className="block text-gray-700 text-sm font-bold ml-3" htmlFor="amount">
                        Chegirma berish
                      </label>
                      <input
                        checked={item.is_discount}
                        onChange={(e) => handleChangeVal(e, i)}
                        name='is_discount'
                        id="amount"
                        type="checkbox"
                        className="rounded py-1.5 px-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full flex items-center justify-center">
                <button
                  className={`px-4 py-2 rounded text-white ${handleValidateForCalculate() ? 'opacity-50' : ''}`}
                  style={{backgroundColor: currentColor}}
                  disabled={handleValidateForCalculate()}
                  onClick={() => handleValAdd()}
                >
                  Qo'shish
                </button>
              </div>
              <div className="w-full flex items-center justify-between gap-4 flex-wrap">
                <div className={'flex flex-col w-[49%]'}>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                    htmlFor="scheme"
                  >
                    Sertifikatlash sxemasini tanlang
                  </label>
                  <select
                    className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
                    value={certificationScheme}
                    onChange={(e) => {
                      if (e.target.value === '0') {
                        setCompliance(true)
                        getCertificationScheme({
                          schema_type: Number(e.target.value),
                          compliance_flag: true
                        }).then((res) => {
                          setComplianceInput(res?.schema_price)
                        })
                      }
                      setCertificationScheme(e.target.value)
                    }}
                    name="scheme"
                    id="scheme"
                  >
                    <option value="2" disabled={certificationScheme}>Tanlang</option>
                    <option value="0">3-sxema</option>
                    <option value="1">7-sxema</option>
                  </select>
                </div>
                <div className={'flex items-center gap-4 w-[49%]'}>
                  <input
                    checked={compliance}
                    onChange={(e) => {
                      setCompliance(e.target.checked)
                      getCertificationScheme({
                        schema_type: Number(certificationScheme),
                        compliance_flag: e.target.checked
                      }).then((res) => {
                        setComplianceInput(res?.schema_price)
                      })
                    }}
                    name='is_discount'
                    id="amount"
                    type="checkbox"
                    className="rounded py-1.5 px-2"
                    disabled={certificationScheme === '0'}
                  />
                  <label className="block text-gray-700 text-sm font-bold ml-3" htmlFor="amount">
                    Muvofiqlik belgisi
                  </label>
                </div>
                {!compliance && <div className="w-[49%] min-h-9"></div>}
                {compliance && (
                  <div className={'flex flex-col w-[49%]'}>
                    <label
                      className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                      htmlFor="discount_price"
                    >
                      Muvofiqlik belgisi uchun jami to’lov miqdori (so’m)
                    </label>
                    <input
                      value={complianceInput}
                      name='discount_price'
                      id="discount_price"
                      type="number"
                      disabled={true}
                      className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                    />
                  </div>
                )}
                <div className={'flex flex-col w-[49%]'}>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                    htmlFor="allPrice"
                  >
                    Shartnoma bo’yicha jami to’lov miqdori (so’m)
                  </label>
                  <input
                    value={calculateCertification?.calculated_price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') || ""}
                    type='text'
                    name='allPrice'
                    id='allPrice'
                    disabled={true}
                    className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                  />
                </div>
              </div>
            </div>
            <div className={'flex flex-col w-[49%] my-4'}>
              <label
                className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                htmlFor="discount_price"
              >
                Fayl
              </label>
              <input
                onChange={(e) => setFile(e.target.files[0])}
                name='discount_price'
                id="discount_price"
                type="file"
                accept="application/pdf"
                className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
              />
            </div>
            <div className="w-full flex items-center justify-between">
              <div>
                <button
                  className={'px-4 py-2 rounded'}
                  style={{
                    color: currentColor,
                    border: `1px solid ${currentColor}`
                  }}
                  onClick={() => {
                    navigate(-1)
                    dispatch(clearStatesCertification())
                    setFile(null)
                  }}
                >
                  Bekor qilish
                </button>
              </div>
              <div className="flex gap-4 items-center">
                <button
                  className={`px-4 py-2 rounded text-white ${handleValidateSecond() ? 'opacity-50' : ''}`}
                  style={{backgroundColor: currentColor}}
                  disabled={handleValidateSecond()}
                  onClick={bookedCertification}
                >
                  Saqlash
                </button>
              </div>
            </div>
          </>
        )}
      </>
    );
  }
};

export default CreateCertification;