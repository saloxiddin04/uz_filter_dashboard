import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {useStateContext} from "../../../contexts/ContextProvider";
import {Header, Input} from "../../../components";
import {clearStatesFirstStep, getMfo, getUserByTin} from "../../../redux/slices/contractCreate/FirstStepSlices";
import {
  clearStatesCertification,
  getCertificationCalculate,
  getCertificationCategory, getCertificationCountPrices,
  getCertificationTariff, postCertificationContract
} from "../../../redux/slices/contractCreate/Certification/CertificationSlice";
import instance from "../../../API";
import {TrashIcon} from "@heroicons/react/16/solid";
import {toast} from "react-toastify";
import {clearStatesExpertise} from "../../../redux/slices/contractCreate/Expertise/expertiseSlices";
import {refreshUserByTin} from "../../../redux/slices/contracts/contractsSlice";

const CreateCertification = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch();

  const [client, setClient] = useState('');

  const {currentColor} = useStateContext();

  const {tariff, category, calculateCertification, contractDoc} = useSelector((state) => state.createCertification);


  // -------------------- juridic ---------------------
  const [loader, setLoader] = useState(false)
  const [stir, setStir] = useState('');
  const [name, setName] = useState('')
  const [lang, setLang] = useState('')
  const [per_adr, setPerAdr] = useState('')
  const [director_firstname, setDirectorFirstName] = useState('')
  const [director_lastname, setDirectorLastName] = useState('')
  const [director_middlename, setDirectorMiddleName] = useState('')
  const [bank_mfo, setBankMfo] = useState('')
  const [bank_name, setBankName] = useState('')
  const [paymentAccount, setPaymentAccount] = useState('')
  const [xxtut, setXxtut] = useState('')
  const [ktut, setKtut] = useState('')
  const [oked, setOked] = useState('')
  const [position, setPosition] = useState('')


  // <------------ fiz_user states ------------>
  const [first_name, setFirstName] = useState('')
  const [mid_name, setMiddName] = useState('')
  const [sur_name, setSurName] = useState('')
  const [mob_phone_no, setMobileNum] = useState('')
  const [email, setEmail] = useState('')
  const [pport_no, setPportNo] = useState('')
  const [pinfl, setPinfl] = useState('')

  const [currentStep, setCurrentStep] = useState(1)

  const [typeContract, setTypeContract] = useState('')
  const [contract_number, setContractNumber] = useState('')
  const [contractDate, setContractDate] = useState('')
  const [priceSelect, setPriceSelect] = useState('')

  const validationJuridic = () => {
    return stir === '' || name === '' || bank_mfo === '' || bank_name === '' || per_adr === '' || paymentAccount === '';
  }

  const validationPhysics = () => {
    return first_name === '' || mid_name === '' || sur_name === '' || mob_phone_no === '' || email === '' || pport_no === '' || pinfl === ''
  }

  const searchUserJuridic = () => {
    dispatch(getUserByTin({stir, client})).then((res) => {
      setName(res?.payload?.name === null ? '' : res?.payload?.name)
      setPosition(res?.payload?.position === null ? '' : res?.payload?.position)
      setPerAdr(res?.payload?.per_adr === null ? '' : res?.payload?.per_adr)
      setPaymentAccount(res?.payload?.paymentAccount === null ? '' : res?.payload?.paymentAccount)
      setBankMfo(res?.payload?.bank_mfo?.mfo === null ? '' : res?.payload?.bank_mfo?.mfo)
      setBankName(res?.payload?.bank_mfo?.bank_name === null ? '' : res?.payload?.bank_mfo?.bank_name)
      setXxtut(res?.payload?.xxtut === null ? '' : res?.payload?.xxtut)
      setOked(res?.payload?.oked === null ? '' : res?.payload?.oked)
      setKtut(res?.payload?.ktut === null ? '' : res?.payload?.ktut)
      setDirectorLastName(res?.payload?.director_lastname === null ? '' : res?.payload?.director_lastname)
      setDirectorFirstName(res?.payload?.director_firstname === null ? '' : res?.payload?.director_firstname)
      setDirectorMiddleName(res?.payload?.director_middlename === null ? '' : res?.payload?.director_middlename)
      setLang(res?.payload?.lang === null ? '' : res?.payload?.lang)
      setEmail(res?.payload?.email === null ? '' : res?.payload?.email)
      setMobileNum(res?.payload?.mob_phone_no === null ? '' : res?.payload?.mob_phone_no)
    })
  }

  const setMfoFunc = () => {
    dispatch(getMfo({mfo: bank_mfo})).then(res => setBankName(res?.payload?.bank_name))
  }

  const searchUserPhysics = () => {
    dispatch(getUserByTin({pin: pinfl, client, passport_ce: pport_no})).then((res) => {
      setPportNo(res?.payload?.pport_no === null ? '' : res?.payload?.pport_no)
      setMiddName(res?.payload?.mid_name === null ? '' : res?.payload?.mid_name)
      setFirstName(res?.payload?.first_name === null ? '' : res?.payload?.first_name)
      setSurName(res?.payload?.sur_name === null ? '' : res?.payload?.sur_name)
      setMobileNum(res?.payload?.mob_phone_no === null ? '' : res?.payload?.mob_phone_no)
      setEmail(res?.payload?.email === null ? '' : res?.payload?.email)
      setPerAdr(res?.payload?.per_adr === null ? '' : res?.payload?.per_adr)
    })
  }

  const updateYurUser = async () => {
    const data = {
      tin: stir,
      name,
      paymentAccount: paymentAccount?.replace(/[_\s]/g, ''),
      oked,
      xxtut,
      ktut,
      position,
      director_middlename,
      director_lastname,
      director_firstname,
      per_adr,
      mfo: bank_mfo,
      email,
      lang,
      mob_phone_no
    }
    await instance.patch('/accounts/update-yuruser-cabinet', data).then((res) => {
      if (res.status === 200) {
        toast.success('Muvoffaqiyatli saqlandi!')
      } else {
        toast.error('Xatolik')
      }
    })
  }

  // ---------------- data -----------------------
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
        !priceSelect
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

  useEffect(() => {
    getCertificationContractNumber().then()
  }, []);

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

  const getCertificationContractNumber = async () => {
    try {
      const response = await instance.get('/tte_certification/contract-create')
      setContractNumber(response?.data?.contract_number)
    } catch (e) {
      console.log(e)
    }
  }

  const postContractCertification = async () => {
    try {
      await dispatch(postCertificationContract({
        certification_devices: data?.map(item => ({
          certification_type: item.certification_type === '0' || item.certification_type === '1' ? 0 : item.certification_type === '2' ? 1 : 2,
          device_name: item.device_name === '' ? null : item.device_name,
          discount_price: item.discount_price,
          input_device_count: item.input_device_count,
          is_discount: item.is_discount,
          price: item.price,
          selected_count: item.selected_count,
          tariff_telecommunications: item.tariff_telecommunications,
          tariff_telecommunications_prices: item.certification_type === "0" ? item?.tariff_telecommunications_prices : item.certification_type === "1" ? category.filter(cat => cat.type_of_tariff === Number(item.certification_type))[0]?.id : undefined
        })),
        certification_schema: {
          schema_type: Number(certificationScheme),
          compliance_flag: compliance,
        },
        pay_choose: Number(priceSelect),
        save: currentStep === 2 ? 0 : 1,
        contract_date: new Date()?.toISOString(),
        pin_or_tin: client === 'fiz' ? pinfl : stir
      })).then(() => {
        if (currentStep === 3) {
          toast.success("Shartnoma yuborildi")
          navigate('/shartnomalar/tte_certification')
          dispatch(clearStatesCertification())
          dispatch(clearStatesFirstStep())
        }
        setCurrentStep(3);
      })
      window.scroll(0,0)
    } catch (e) {
      toast.error(e.message)
    }
  }

  const postContractBookedCertification = async () => {
    try {
      await instance.post('/tte_certification/booked-contract', {
        pin_or_tin: client === 'fiz' ? pinfl : stir,
        contract_date: new Date(contractDate)?.toISOString()
      },).then((res) => {
        if (res.status === 201) {
          toast.success(`${contract_number} raqam muvuffaqiyatli band qilindi!`)
          navigate('/shartnomalar/tte_certification')
          setContractNumber('')
        } else {
          toast.error(res?.response?.data?.err_msg)
        }
      })
    } catch (e) {
      console.log(e)
      toast.error('Xatolik')
    }
  }

  const displayStep = (step) => {
    switch (step) {
      case 1:
        return (
          <>
            <div className={'w-[49%]'}>
              <label
                htmlFor="client"
                className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
              >
                Mijoz turi
              </label>
              <select
                name="client"
                id="client"
                className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                value={client}
                onChange={(e) => setClient(e.target.value)}
              >
                <option value="" disabled={client}>Tanlang...</option>
                <option value="fiz">Jismoniy</option>
                <option value="yur">Yuridik</option>
              </select>
            </div>
            {client === 'yur' && (
              <div className={'w-full flex items-center justify-between flex-wrap gap-4 mt-4'}>
                <div className={'w-8/12 flex items-end gap-4'}>
                  <div className={'w-full'}>
                    <Input
                      value={stir}
                      onChange={(e) => {
                        const re = /^[0-9\b]+$/;
                        if (e.target.value === '' || re.test(e.target.value)) {
                          setStir(e.target.value.slice(0, 9));
                        }
                      }}
                      label={'Tashkilotning STIR raqami'}
                      className={`${stir.length === 9 ? 'border border-green-500' : ''}`}
                    />
                  </div>
                  <button
                    className={`px-4 py-2 rounded text-white ${stir.length === 9 ? 'opacity-1' : 'opacity-50'}`}
                    style={{backgroundColor: currentColor}}
                    onClick={searchUserJuridic}
                    disabled={stir.length !== 9}
                  >
                    Izlash
                  </button>
                  <button
                    className={`px-4 py-2 rounded text-white ${stir.length === 9 ? 'opacity-1' : 'opacity-50'}`}
                    style={{backgroundColor: currentColor}}
                    onClick={() => {
                      setLoader(true)
                      try {
                        dispatch(refreshUserByTin({tin: stir})).then((res) => {
                          setLoader(false)
                          setName(res?.payload?.name || '')
                          setPosition(res?.payload?.position || '')
                          setPerAdr(res?.payload?.per_adr || '')
                          setPaymentAccount(res?.payload?.paymentAccount || '')
                          setBankMfo(res?.payload?.bank_mfo?.mfo || '')
                          setBankName(res?.payload?.bank_mfo?.bank_name || '')
                          setXxtut(res?.payload?.xxtut || '')
                          setOked(res?.payload?.oked || '')
                          setKtut(res?.payload?.ktut || '')
                          setDirectorLastName(res?.payload?.director_lastname || '')
                          setDirectorFirstName(res?.payload?.director_firstname || '')
                          setDirectorMiddleName(res?.payload?.director_middlename || '')
                          setLang(res?.payload?.lang || '')
                          setEmail(res?.payload?.email || '')
                          setMobileNum(res?.payload?.mob_phone_no || '')
                        })
                      } catch (e) {
                        setLoader(false)
                      }
                    }}
                    disabled={stir.length !== 9}
                  >
                    {loader ? 'Yangilanmoqda...' : 'Yangilash'}
                  </button>
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Tashkilot nomi'}
                    className={`${name.length > 0 ? 'border border-green-500' : ''}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type={'text'}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <div className={'w-full flex items-end justify-between'}>
                    <div className={'w-[88%]'}>
                      <Input
                        label={'MFO'}
                        className={`${bank_mfo.length > 0 ? 'border border-green-500' : ''}`}
                        value={bank_mfo}
                        onChange={(e) => setBankMfo(e.target.value)}
                      />
                    </div>
                    <button
                      className={`px-4 py-2 rounded text-white`}
                      style={{backgroundColor: currentColor}}
                      onClick={setMfoFunc}
                    >
                      Izlash
                    </button>
                  </div>
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Yuridik manzil'}
                    className={`${per_adr.length > 0 ? 'border border-green-500' : ''}`}
                    value={per_adr}
                    onChange={(e) => setPerAdr(e.target.value)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Bank filliali'}
                    className={`${bank_name.length > 0 ? 'border border-green-500' : ''}`}
                    value={bank_name}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Lavozim'}
                    className={`${position.length > 0 ? 'border border-green-500' : ''}`}
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Hisob raqami'}
                    className={`${paymentAccount.length > 0 ? 'border border-green-500' : ''}`}
                    value={paymentAccount}
                    onChange={(e) => setPaymentAccount(e.target.value)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Familiya'}
                    className={`${director_lastname.length > 0 ? 'border border-green-500' : ''}`}
                    value={director_lastname}
                    onChange={(e) => setDirectorLastName(e.target.value)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'XXTUT'}
                    className={`${xxtut.length > 0 ? 'border border-green-500' : ''}`}
                    value={xxtut}
                    onChange={(e) => setXxtut(e.target.value)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Ismi'}
                    className={`${director_firstname.length > 0 ? 'border border-green-500' : ''}`}
                    value={director_firstname}
                    onChange={(e) => setDirectorFirstName(e.target.value)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'KTUT'}
                    className={`${ktut.length > 0 ? 'border border-green-500' : ''}`}
                    value={ktut}
                    onChange={(e) => setKtut(e.target.value)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Sharifi'}
                    className={`${director_middlename.length > 0 ? 'border border-green-500' : ''}`}
                    value={director_middlename}
                    onChange={(e) => setDirectorMiddleName(e.target.value)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'IFUT'}
                    className={`${oked.length > 0 ? 'border border-green-500' : ''}`}
                    value={oked}
                    onChange={(e) => setOked(e.target.value)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Telefon raqami'}
                    className={`${mob_phone_no.length > 0 ? 'border border-green-500' : ''}`}
                    value={mob_phone_no}
                    onChange={(e) => setMobileNum(e.target.value)}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Email'}
                    className={`${email.length > 0 ? 'border border-green-500' : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                  />
                </div>
                <div className="w-full flex items-center justify-between">
                  <button
                    className={`px-4 py-2 rounded text-white disabled:opacity-25`}
                    style={{backgroundColor: currentColor}}
                    disabled={!stir}
                    onClick={updateYurUser}
                  >
                    Saqlash
                  </button>
                </div>
                <div className="w-full flex items-center justify-between">
                  <div>
                    <button
                      className={'px-4 py-2 rounded'}
                      style={{
                        color: currentColor,
                        border: `1px solid ${currentColor}`
                      }}
                      onClick={() => navigate(-1)}
                    >
                      Bekor qilish
                    </button>
                  </div>
                  <button
                    className={`px-4 py-2 rounded text-white ${validationJuridic() ? 'opacity-50' : ''}`}
                    style={{backgroundColor: currentColor}}
                    onClick={() => setCurrentStep(2)}
                    disabled={validationJuridic()}
                  >
                    Keyingi
                  </button>
                </div>
              </div>
            )}
            {client === 'fiz' && (
              <div className={'w-full flex items-center justify-between flex-wrap gap-4 mt-4'}>
                <div className={'w-8/12 flex items-end gap-4'}>
                  <div className={'w-full flex items-end gap-4'}>
                    <div className={'w-2/5'}>
                      <Input
                        label={'Passport malumotlari'}
                        placeholder={'Passport seriyasi va raqami'}
                        value={pport_no}
                        onChange={(e) => setPportNo(e.target.value.toUpperCase().slice(0, 9))}
                        type={'text'}
                        className={`${pport_no.length === 9 ? 'border border-green-500' : ''}`}
                      />
                    </div>
                    <div className={'w-3/5'}>
                      <Input
                        label={''}
                        placeholder={'JShIShIR'}
                        onChange={(e) => {
                          const re = /^[0-9\b]+$/;
                          if (e.target.value === '' || re.test(e.target.value)) {
                            setPinfl(e.target.value.slice(0, 14));
                          }
                        }}
                        value={pinfl}
                        type={'text'}
                        className={`${pinfl.length === 14 ? 'border border-green-500' : ''}`}
                      />
                    </div>
                  </div>
                  <button
                    className={'px-4 py-2 rounded text-white'}
                    style={{backgroundColor: currentColor}}
                    onClick={searchUserPhysics}
                  >
                    Izlash
                  </button>
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Familiyasi'}
                    className={`${sur_name.length > 0 ? 'border border-green-500' : ''}`}
                    value={sur_name}
                    onChange={(e) => setSurName(e.target.value)}
                    type={'text'}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Yashash manzili'}
                    className={`${per_adr.length > 0 ? 'border border-green-500' : ''}`}
                    value={per_adr}
                    onChange={(e) => setPerAdr(e.target.value)}
                    type={'text'}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Ismi'}
                    className={`${first_name.length > 0 ? 'border border-green-500' : ''}`}
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                    type={'text'}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Telefon raqami'}
                    className={`${mob_phone_no.length > 0 ? 'border border-green-500' : ''}`}
                    value={mob_phone_no}
                    onChange={(e) => setMobileNum(e.target.value)}
                    type={'text'}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Otasining ismi'}
                    className={`${mid_name.length > 0 ? 'border border-green-500' : ''}`}
                    value={mid_name}
                    onChange={(e) => setMiddName(e.target.value)}
                    type={'text'}
                  />
                </div>
                <div className={'w-[49%]'}>
                  <Input
                    label={'Email'}
                    className={`${email.length > 0 ? 'border border-green-500' : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type={'email'}
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
                      onClick={() => navigate(-1)}
                    >
                      Bekor qilish
                    </button>
                  </div>
                  <button
                    className={`px-4 py-2 rounded text-white ${validationPhysics() ? 'opacity-50' : ''}`}
                    style={{backgroundColor: currentColor}}
                    onClick={() => setCurrentStep(2)}
                    disabled={validationPhysics()}
                  >
                    Keyingi
                  </button>
                </div>
              </div>
            )}
          </>
        )
      case 2:
        return (
          <>
            <div className="w-2/4">
              <label
                htmlFor="type"
                className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
              >
                Shartnoma turi
              </label>
              <select
                name="type"
                id="type"
                className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
                value={typeContract}
                onChange={(e) => setTypeContract(e.target.value)}
              >
                <option value="" disabled={typeContract}>Tanlang...</option>
                <option value="1">Yangi shartnoma tuzish</option>
                <option value="2">Shartnoma raqam bron qilish</option>
              </select>
            </div>
            {typeContract === '1' && (
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
            )}
            {(typeContract === '1' && priceSelect) && (
              <>
                <div className="w-full flex items-center justify-between flex-wrap gap-4 my-4">
                  <div className={'w-[49%] flex items-end gap-4'}>
                    <div className={'w-[80%]'}>
                      <Input
                        value={contract_number}
                        label={'Shartnoma raqami'}
                        disabled={true}
                      />
                    </div>
                    <button
                      className={`px-4 py-2 rounded text-white w-2/12`}
                      style={{backgroundColor: currentColor}}
                      onClick={getCertificationContractNumber}
                    >
                      Raqam olish
                    </button>
                  </div>
                  <div className={'w-[49%] flex items-end'}>
                    <div className="w-full">
                      <Input
                        value={contractDate}
                        label={'Shartnoma sanasi'}
                        type={'date'}
                        onChange={(e) => setContractDate(e.target.value)}
                      />
                    </div>
                  </div>
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
                <div className="w-full flex items-center justify-between">
                  <div>
                    <button
                      className={'px-4 py-2 rounded'}
                      style={{
                        color: currentColor,
                        border: `1px solid ${currentColor}`
                      }}
                      onClick={() => navigate(-1)}
                    >
                      Bekor qilish
                    </button>
                  </div>
                  <div className="flex gap-4 items-center">
                    <button
                      className={`px-4 py-2 rounded text-white`}
                      style={{color: currentColor, border: `1px solid ${currentColor}`}}
                      onClick={() => setCurrentStep(1)}
                    >
                      Orqaga
                    </button>
                    <button
                      className={`px-4 py-2 rounded text-white ${handleValidateSecond() ? 'opacity-50' : ''}`}
                      style={{backgroundColor: currentColor}}
                      disabled={handleValidateSecond()}
                      onClick={postContractCertification}
                    >
                      Keyingi
                    </button>
                  </div>
                </div>
              </>
            )}
            {typeContract === '2' && (
              <>
                <div className="w-full flex items-center justify-between flex-wrap gap-4 my-4">
                  <div className={'w-[49%] flex items-end gap-4'}>
                    <div className={'w-[80%]'}>
                      <Input
                        value={contract_number}
                        label={'Shartnoma raqami'}
                        disabled={true}
                      />
                    </div>
                    <button
                      className={`px-4 py-2 rounded text-white w-2/12`}
                      style={{backgroundColor: currentColor}}
                      onClick={getCertificationContractNumber}
                    >
                      Raqam olish
                    </button>
                  </div>
                  <div className={'w-[49%] flex items-end'}>
                    <div className="w-full">
                      <Input
                        value={contractDate}
                        label={'Shartnoma sanasi'}
                        type={'date'}
                        onChange={(e) => setContractDate(e.target.value)}
                      />
                    </div>
                  </div>
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
                        dispatch(clearStatesCertification())
                        dispatch(clearStatesFirstStep())
                        navigate(-1)}
                      }
                    >
                      Bekor qilish
                    </button>
                  </div>
                  <div className="flex gap-4 items-center">
                    <button
                      className={`px-4 py-2 rounded text-white`}
                      style={{color: currentColor, border: `1px solid ${currentColor}`}}
                      onClick={() => {
                        dispatch(clearStatesCertification())
                        dispatch(clearStatesFirstStep())
                        navigate(-1)}
                      }
                    >
                      Orqaga
                    </button>
                    <button
                      className={`px-4 py-2 rounded text-white ${(!contract_number || !contractDate) ? 'opacity-50' : ''}`}
                      style={{backgroundColor: currentColor}}
                      disabled={!contract_number || !contractDate}
                      onClick={postContractBookedCertification}
                    >
                      Saqlash
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )
      case 3:
        return (
          <>
            <div
              dangerouslySetInnerHTML={{__html: contractDoc}}
              className="px-2 py-3 border rounded"
            />
            <div className="w-full flex items-center justify-between mt-4">
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
                  }}
                >
                  Bekor qilish
                </button>
              </div>
              <div className="flex gap-4">
                <button
                  className={`px-4 py-2 rounded text-white border border-[${currentColor}]`}
                  style={{color: currentColor}}
                  onClick={() => setCurrentStep(2)}
                >
                  Orqaga
                </button>
                <button
                  className={`px-4 py-2 rounded text-white`}
                  style={{backgroundColor: currentColor}}
                  onClick={postContractCertification}
                >
                  Saqlash
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
    <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-10 bg-white dark:bg-secondary-dark-bg rounded">
      <Header category="Sertifikatsiya" title="Shartnomalar yaratish"/>
      {displayStep(currentStep)}
    </div>
  );
};

export default CreateCertification;