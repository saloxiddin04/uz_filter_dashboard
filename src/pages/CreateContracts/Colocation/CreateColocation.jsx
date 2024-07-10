import React, {useEffect, useRef, useState} from 'react';
import {Header, Input, Loader} from "../../../components";
import {useDispatch, useSelector} from "react-redux";
import {
  calculateColocation, clearStatesColocation, createColocation,
  getDataCenterList,
  getDataCenterTariff
} from "../../../redux/slices/contractCreate/Colocation/ColocationSlices";
import instance from "../../../API";
import {toast} from "react-toastify";
import {TrashIcon} from "@heroicons/react/16/solid";
import {useStateContext} from "../../../contexts/ContextProvider";
import {useNavigate} from "react-router-dom";
import {clearStatesFirstStep, getMfo, getUserByTin} from "../../../redux/slices/contractCreate/FirstStepSlices";
import moment from "moment/moment";

const CreateColocation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const {currentColor} = useStateContext();

  const {dataCenterList, dataCenterTariff, calculate, colocationDocument, loading} = useSelector((state) => state.createColocation);
  const {userByTin} = useSelector((state) => state.userByTin);

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


  // <------------ fiz_user states ------------>
  const [first_name, setFirstName] = useState('')
  const [mid_name, setMiddName] = useState('')
  const [sur_name, setSurName] = useState('')
  const [mob_phone_no, setMobileNum] = useState('')
  const [email, setEmail] = useState('')
  const [pport_no, setPportNo] = useState('')
  const [pinfl, setPinfl] = useState('')


  // ---------------- data -----------------------

  const [currentStep, setCurrentStep] = useState(1)

  const [typeContract, setTypeContract] = useState('')

  const [data, setData] = useState([
    {data_center: '', mounting_type: '', amount: '', status: 1, tariff: ''}
  ])
  const [selectedCombinations, setSelectedCombinations] = useState({});
  const [bookedContractDate, setBookedContractDate] = useState(new Date())
  const [contractNumberColocation, setContractNumberColocation] = useState('')

  useEffect(() => {
    if (currentStep === 2) {
      dispatch(getDataCenterList())
      dispatch(getDataCenterTariff())
    }
  }, [currentStep]);

  useEffect(() => {
    if (!handleValidateForCalculate()) {
      dispatch(calculateColocation({data, check: handleValidateForCalculate()}))
    }
  }, [data]);

  useEffect(() => {
    if (typeContract === "2") {
      fetchContractNum().then()
    }
  }, [typeContract]);

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

  // <------------- COLOCATION --------------->

  const handleChangeDataColocation = (e, index) => {
    const {name, value} = e.target;
    let newData = [...data];
    newData[index] = {...newData[index], [name]: value};

    if (name === 'amount') {
      newData[index].amount = Number(value)
    }

    let combination = `${newData[index].data_center}-${newData[index].mounting_type}`;
    let newSelectedCombinations = {...selectedCombinations};
    if (name === "mounting_type") {
      let oldCombination = `${newData[index].data_center}-${data[index].mounting_type}`;
      delete newSelectedCombinations[oldCombination];
    }
    newSelectedCombinations[combination] = index;

    setData(newData);
    setSelectedCombinations(newSelectedCombinations);
    // getCalculateColocation(newData)
  };

  const handleDeleteDataColocation = (i) => {
    const deletedData = [...data]
      deletedData.splice(i, 1)
      setData(deletedData)
      getCalculateColocation(deletedData)
  }

  const handleDataAddColocation = () => {
    const abc = [...data, {data_center: '', mounting_type: '', amount: '', status: 1, tariff: ''}]
    setData(abc)
  }

  const checkForDuplicateSelections = () => {
    let hasDuplicates = false;
    let combinations = {};

    for (let i = 0; i < data.length; i++) {
      let combination = `${data[i].data_center}-${data[i].mounting_type}`;
      if (combinations[combination]) {
        hasDuplicates = true;
        break;
      }
      combinations[combination] = true;
    }

    return hasDuplicates;
  };

  const handleValidateForCalculate = () => {
    if (checkForDuplicateSelections()) {
      return true;
    }
    for (const currentData of data) {
      if (
        !currentData?.amount ||
        !currentData?.data_center ||
        !currentData?.mounting_type
      ) {
        return true
      }
    }
    return false
  }

  const handleValidateColocation = () => {
    if (checkForDuplicateSelections()) {
      return true;
    }
    for (const currentData of data) {
      if (
        !calculate?.success ||
        !currentData?.amount ||
        !currentData?.data_center ||
        !currentData?.mounting_type
      ) {
        return true
      }
    }
    return false
  }

  const timeoutIdColocation = useRef(null)
  const getCalculateColocation = (data) => {
    clearTimeout(timeoutIdColocation.current)
    timeoutIdColocation.current = setTimeout(() => {
      dispatch(calculateColocation({data, check: handleValidateForCalculate()}))
    }, 200)
  }

  const fetchContractNum = async () => {
    await instance.get(`colocation/booked-contract?pin_or_tin=${userByTin?.bank_mfo ? userByTin?.tin : userByTin?.pin}`).then((res) => {
      if (res?.data?.success) {
        setContractNumberColocation(res?.data?.valid_new_contract_number)
      } else {
        toast.error(res?.response?.data?.err_msg)
      }
    })
  }

  const postContractNum = async () => {
    await instance.post('colocation/booked-contract', {
      pin_or_tin: userByTin?.bank_mfo ? userByTin?.tin : userByTin?.pin,
      contract_date: bookedContractDate?.toISOString()
    }).then((res) => {
      if (res.status === 201) {
        toast.success(`${contractNumberColocation} raqam muvuffaqiyatli band qilindi!`)
        navigate('/shartnomalar/colocation')
        setContractNumberColocation('')
      }
    })
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
            {typeContract === "1" && (
              <div className={'w-full flex items-center justify-between flex-wrap gap-4 mt-4'}>
                {data.map((el, i) => (
                  <div key={i} className="border rounded p-3 mt-4 w-full flex flex-col gap-4">
                    <div className="w-full text-end">
                      <button
                        onClick={() => handleDeleteDataColocation(i)}
                        disabled={data.length === 1}
                      >
                        <TrashIcon
                          color={currentColor}
                          className="size-6 cursor-pointer"
                        />
                      </button>
                    </div>
                    <div className={'flex flex-col'}>
                      <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="tariff">Tarif</label>
                      <select
                        className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
                        value={el.tariff}
                        onChange={(e) => handleChangeDataColocation(e, i)}
                        name="tariff"
                        id="tariff"
                      >
                        <option value={''} disabled={el.tariff}>Tanlang</option>
                        {dataCenterTariff && dataCenterTariff.map((item, index) => (
                          <option value={item.id} key={index}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className={'flex flex-col'}>
                      <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="address"
                      >Manzil</label>
                      <select
                        className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
                        value={el.data_center}
                        onChange={(e) => handleChangeDataColocation(e, i)}
                        name="data_center"
                        id="address"
                      >
                        <option value={''} disabled={el.data_center}>Tanlang</option>
                        {dataCenterList && dataCenterList.map((item, index) => (
                          <option value={item.id} key={index}>{item.display_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className={'flex flex-col'}>
                      <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="mounting_type">Shartnoma
                        obyekti</label>
                      <select
                        className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
                        value={el.mounting_type}
                        onChange={(e) => handleChangeDataColocation(e, i)}
                        name="mounting_type"
                        id="mounting_type"
                      >
                        <option value="">Tanlang</option>
                        <option value="RACK">Rack</option>
                        <option value="UNIT">Unit</option>
                      </select>
                    </div>
                    <div className={'flex flex-col'}>
                      <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="amount">
                        Shartnoma obyekti soni
                      </label>
                      <input
                        value={el.amount || ""}
                        onChange={(e) => handleChangeDataColocation(e, i)}
                        name="amount"
                        id="amount"
                        type="text"
                        className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                      />
                    </div>
                  </div>
                ))}
                <div className="w-full">
                  <div className={'flex flex-col items-end'}>
                    <div className="ml-auto w-1/5">
                      <label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="price">
                        Jami (so'm)
                      </label>
                    </div>
                    <input
                      value={calculate?.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') || ""}
                      disabled={true}
                      type="text"
                      id="price"
                      className="rounded w-1/5 py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                    />
                  </div>
                </div>
                <div className="w-full">
                  {checkForDuplicateSelections() && (
                    <div style={{marginTop: 10, color: 'red'}}>
                      1ta &quot;Data Markaz&quot; dan bir xil RACK yoki UNIT tanlay olmaysiz!
                    </div>
                  )}
                </div>
                <button
                  className={`px-3 py-2 rounded text-white mx-auto ${handleValidateColocation() ? 'opacity-25' : ''}`}
                  style={{backgroundColor: currentColor}}
                  onClick={handleDataAddColocation}
                >
                  Qo'shish
                </button>

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
                  <div className="flex gap-4">
                    <button
                      className={`px-4 py-2 rounded text-white border border-[${currentColor}]`}
                      style={{color: currentColor}}
                      onClick={() => setCurrentStep(1)}
                    >
                      Orqaga
                    </button>
                    <button
                      className={`px-4 py-2 rounded text-white ${handleValidateColocation() ? 'opacity-50' : ''}`}
                      style={{backgroundColor: currentColor}}
                      onClick={async () => {
                        try {
                          await dispatch(createColocation({
                            colocation: data,
                            service: 1,
                            is_back_office: true,
                            pin_or_tin: userByTin?.bank_mfo ? userByTin?.tin : userByTin?.pin,
                            save: 0,
                            user_type: userByTin?.bank_mfo ? 2 : 1,
                          })).then(() => setCurrentStep(3))
                        } catch (e) {
                          toast.error(e.message)
                        }
                      }}
                      disabled={handleValidateColocation()}
                    >
                      Keyingi
                    </button>
                  </div>
                </div>
              </div>
            )}
            {typeContract === "2" && (
              <div className="w-full flex items-center justify-between flex-wrap gap-4 mt-4">
                <div className={'w-[49%] flex items-end gap-4'}>
                  <div className={'w-[80%]'}>
                    <Input
                      value={contractNumberColocation}
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
                      value={moment(bookedContractDate).format('YYYY-MM-DD')}
                      label={'Shartnoma sanasi'}
                      type={'date'}
                      onChange={(e) => setBookedContractDate(e.target.value)}
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
                  <button
                    className={`px-4 py-2 rounded text-white`}
                    style={{backgroundColor: currentColor}}
                    onClick={postContractNum}
                  >
                    Saqlash
                  </button>
                </div>
              </div>
            )}
          </>
        )
      case 3:
        return (
          <>
            <div
              dangerouslySetInnerHTML={{__html: colocationDocument}}
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
                    dispatch(clearStatesColocation())
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
                  onClick={async () => {
                    try {
                      await dispatch(createColocation({
                        colocation: data,
                        service: 1,
                        is_back_office: true,
                        pin_or_tin: userByTin?.bank_mfo ? userByTin?.tin : userByTin?.pin,
                        save: 1,
                        user_type: userByTin?.bank_mfo ? 2 : 1,
                      })).then(() => {
                        navigate('/shartnomalar/colocation')
                        dispatch(clearStatesColocation())
                        dispatch(clearStatesFirstStep())
                      })
                    } catch (e) {
                      setCurrentStep(2)
                      toast.error(e.message)
                    }
                  }}
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

  if (loading) return <Loader/>;

  return (
    <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-10 bg-white rounded">
      <Header category="Colocation" title="Shartnomalar yaratish"/>
      {displayStep(currentStep)}
    </div>
  );
};

export default CreateColocation;