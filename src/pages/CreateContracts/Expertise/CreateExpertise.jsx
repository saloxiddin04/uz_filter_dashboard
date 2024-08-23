import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Header, Input, Loader} from "../../../components";
import {useStateContext} from "../../../contexts/ContextProvider";
import {clearStatesFirstStep, getMfo, getUserByTin} from "../../../redux/slices/contractCreate/FirstStepSlices";
import {useLocation, useNavigate} from "react-router-dom";
import {
  clearStatesExpertise,
  createContractExpertise,
  getCalculateExpertise,
  getExpertiseContractNumber,
  getTariffsExpertise
} from "../../../redux/slices/contractCreate/Expertise/expertiseSlices";
import {TrashIcon} from "@heroicons/react/16/solid";
import {toast} from "react-toastify";
import instance from "../../../API";

const CreateExpertise = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {currentColor} = useStateContext();
  const {sidebar} = useSelector((state) => state.sections);
  const {state} = useLocation()

  const [currentStep, setCurrentStep] = useState(1)

  const [typeContract, setTypeContract] = useState('')

  const [client, setClient] = useState('');

  // -------------------- juridic ---------------------
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
  const [mob_phone_no, setMobileNum] = useState('')
  const [email, setEmail] = useState('')

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

  const validationJuridic = () => {
    return stir === '' || name === '' || bank_mfo === '' || bank_name === '' || per_adr === '' || paymentAccount === '';
  }

  // ------------------ EXPERTISE --------------------//
  const {
    tarifsApplication,
    calculate,
    loading,
    expertiseDocument
  } = useSelector(state => state.createExpertise)
  const [contract_number, setContractNumber] = useState('')
  const [contractDate, setContractDate] = useState('')
  const [priceSelect, setPriceSelect] = useState('')

  const service = sidebar?.permissions.find(item => item?.slug === state?.path)?.children?.find(el => el?.slug === state?.slug)

  const [val, setVal] = useState([
    {expertise_service_tarif: '', price: 0, name_of_tarif: '', is_discount: false, discount_price: ''},
  ])

  useEffect(() => {
    dispatch(getTariffsExpertise())
    dispatch(getExpertiseContractNumber({service_id: service?.id})).then((res) => {
      setContractNumber(res?.payload?.contract_number)
    })
  }, []);

  useEffect(() => {
    if (!handleValidateSecondForCalculate()) {
      getCalculate(val)
    }
  }, [val, contractDate]);

  const timeoutId = useRef(null)
  const getCalculate = useCallback((data) => {
    clearTimeout(timeoutId.current)
    timeoutId.current = setTimeout(() => {
      dispatch(getCalculateExpertise(data))
    }, 500)
  }, [])

  const handleValAdd = () => {
    const abc = [...val, {expertise_service_tarif: '', price: 0, name_of_tarif: '', is_discount: false, discount_price: ''}]
    setVal(abc)
  }

  const handleChangeVal = (onChangeVal, i) => {
    let inputData = [...val]
    if (onChangeVal?.target?.checked) {
      inputData[i][onChangeVal?.target?.name] = onChangeVal?.target?.checked
    } else {
      inputData[i][onChangeVal?.target?.name] = onChangeVal?.target?.checked
      inputData[i][onChangeVal?.target?.name] = onChangeVal?.target?.value
      const tariffPriceFilter = tarifsApplication?.find((
        item => item.id === Number(inputData[i].expertise_service_tarif)
      ))
      setVal(prevState => [prevState[i].price = tariffPriceFilter?.price])
      if (inputData[i].is_discount === 'on') {
        inputData[i].is_discount = false
        inputData[i].discount_price = ''
      }
    }
    setVal(inputData)
  }

  const fetchContractNum = () => {
    dispatch(getExpertiseContractNumber({service_id: service?.id})).then((res) => {
      setContractNumber(res?.payload?.contract_number)
    })
  }

  const handleValidateSecondForCalculate = () => {
    for (const currentProject of val) {
      if (
        typeContract === '1' && !priceSelect ||
        !contract_number ||
        !contractDate ||
        !currentProject?.expertise_service_tarif ||
        (currentProject?.is_discount && !currentProject?.discount_price) ||
        !currentProject?.price ||
        !currentProject?.name_of_tarif) {
        return true
      }
    }
    return false
  }

  const handleValidateSecond = () => {
    for (const currentProject of val) {
      if (
        typeContract === '1' && !priceSelect ||
        !contract_number ||
        !contractDate || !calculate?.total_cash ||
        (currentProject?.is_discount && !currentProject?.discount_price) ||
        !currentProject?.expertise_service_tarif ||
        !currentProject?.price ||
        !currentProject?.name_of_tarif) {
        return true
      }
    }
    return false
  }

  const handleDeleteVal = (i) => {
    const deleteVal = [...val]
    deleteVal.splice(i, 1)
    setVal(deleteVal)
  }

  const yurBody = {
    stir,
    service: Number(service?.id),
    service_id: Number(service?.id),
    price_select_percentage: Number(priceSelect),
    contract_number: contract_number,
    contract_date: new Date(contractDate ? contractDate : new Date()).toISOString(),
    projects: val,
    contract_cash: Number(calculate?.total_cash),
    save: currentStep === 2 ? 0 : 1,
  }

  const postContractExpertise = async () => {
    await dispatch(createContractExpertise(yurBody)).then((res) => {
      setCurrentStep(3)
      if (yurBody.save === 1) {
        navigate('/shartnomalar/expertise')
        dispatch(clearStatesExpertise())
        dispatch(clearStatesFirstStep())
      }
    }).catch(e => {
      toast.error(e.message)
      setCurrentStep(2)
    })
  }

  const expertiseBookedContract = async () => {
    try {
      await instance.post('/expertise/booked-contract', {pin_or_tin: stir}).then((res) => {
        if (res?.data?.success) {
          toast.success('Muvoffaqiyatli saqlandi')
          navigate('/shartnomalar/expertise')
          setTypeContract('')
          setContractDate('')
          setContractNumber('')
        }
      })
    } catch (e) {
      toast.error(e.message)
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
                  <option value={30}>30%/70%</option>
                  <option value={50}>50%/50%</option>
                  <option value={100}>100%</option>
                </select>
              </div>
            )}
            {(typeContract === '1' && priceSelect) && (
              <>
                <div className="w-full flex items-center justify-between flex-wrap gap-4 mt-4">
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
                      onClick={fetchContractNum}
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
                    {val && val?.map((data, i) => (
                      <div key={i} className="border-dashed border p-2 w-full flex flex-col gap-4">
                        <div className="w-full text-end">
                          <button
                            onClick={() => handleDeleteVal(i)}
                            disabled={val.length === 1}
                          >
                            <TrashIcon
                              color={currentColor}
                              className="size-6 cursor-pointer"
                            />
                          </button>
                        </div>
                        <div className="w-full flex items-center justify-between gap-4">
                          <div className={'flex flex-col w-[49%]'}>
                            <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="tariff">Tarif</label>
                            <select
                              className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
                              value={data.expertise_service_tarif}
                              onChange={(e) => handleChangeVal(e, i)}
                              name="expertise_service_tarif"
                              id="tariff"
                            >
                              <option value="0" disabled={data.expertise_service_tarif}>Tanlang</option>
                              {tarifsApplication?.map((item) => (
                                <option key={item.id} value={item.id}>{item.title_of_tarif}</option>
                              ))}
                            </select>
                          </div>
                          <div className={'flex flex-col w-[49%]'}>
                            <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="amount">
                              To'lov miqdori
                            </label>
                            <input
                              value={data.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                              disabled={true}
                              onChange={(e) => handleChangeVal(e, i)}
                              name='price'
                              id="amount"
                              type="text"
                              className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                            />
                          </div>
                        </div>
                        <div className="w-full flex items-center justify-between">
                          {!data.is_discount && <div className="w-2/4 min-h-9"></div>}
                          {data.is_discount && (
                            <div className={'flex flex-col w-[49%]'}>
                              <label className="block text-gray-700 text-sm font-bold mb-1 ml-3"
                                     htmlFor="discount_price"
                              >
                                Chegirmadagi to'lov miqdori
                              </label>
                              <input
                                value={data.discount_price}
                                onChange={(e) => handleChangeVal(e, i)}
                                name='discount_price'
                                id="discount_price"
                                type="number"
                                className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                              />
                            </div>
                          )}
                          <div className={'flex items-center gap-4 w-2/4'}>
                            <label className="block text-gray-700 text-sm font-bold ml-3" htmlFor="amount">
                              Chegirma berish
                            </label>
                            <input
                              checked={data.is_discount}
                              onChange={(e) => handleChangeVal(e, i)}
                              name='is_discount'
                              id="amount"
                              type="checkbox"
                              className="rounded py-1.5 px-2"
                            />
                          </div>
                        </div>
                        <div className={'flex flex-col w-full'}>
                          <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="name_of_tarif">
                            Loyiha nomini kiriting
                          </label>
                          <input
                            value={data.name_of_tarif}
                            onChange={(e) => handleChangeVal(e, i)}
                            name='name_of_tarif'
                            id='name_of_tarif'
                            type="text"
                            className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="w-full flex items-center justify-between">
                    <button
                      className={`px-4 py-2 rounded text-white ${handleValidateSecond() ? 'opacity-50' : ''}`}
                      style={{backgroundColor: currentColor}}
                      disabled={handleValidateSecond()}
                      onClick={() => handleValAdd()}
                    >
                      Loyiha qo'shish
                    </button>
                    <div className={'flex flex-col w-[30%]'}>
                      <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="cash">
                        Jami (so'm)
                      </label>
                      <input
                        value={calculate?.total_cash?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') || ''}
                        disabled={true}
                        id="cash"
                        type="text"
                        className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                      />
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
                        onClick={postContractExpertise}
                      >
                        Keyingi
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            {typeContract === "2" && (
              <div className="w-full flex items-center justify-between flex-wrap gap-4 mt-4">
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
                    onClick={fetchContractNum}
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

                <div className="w-full flex items-center justify-between">
                  <div>
                    <button
                      className={'px-4 py-2 rounded'}
                      style={{
                        color: currentColor,
                        border: `1px solid ${currentColor}`
                      }}
                      onClick={() => {
                        dispatch(clearStatesFirstStep())
                        navigate(-1)
                      }}
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
                      className={`px-4 py-2 rounded text-white`}
                      style={{backgroundColor: currentColor}}
                      onClick={expertiseBookedContract}
                    >
                      Saqlash
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )
      case 3:
        return (
          <>
            <div
              dangerouslySetInnerHTML={{__html: expertiseDocument}}
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
                    dispatch(clearStatesExpertise())
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
                  onClick={postContractExpertise}
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

  if (loading) return <Loader/>

  return (
    <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-10 bg-white dark:bg-secondary-dark-bg rounded">
      <Header category="Ekspertiza" title="Shartnomalar yaratish"/>
      {displayStep(currentStep)}
    </div>
  );
};

export default CreateExpertise;