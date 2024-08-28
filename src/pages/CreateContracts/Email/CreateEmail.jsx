import React, {useEffect, useState} from 'react';
import {Header, Input, Loader} from "../../../components";
import {clearStatesFirstStep, getMfo, getUserByTin} from "../../../redux/slices/contractCreate/FirstStepSlices";
import {useStateContext} from "../../../contexts/ContextProvider";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import instance from "../../../API";
import {toast} from "react-toastify";
import {refreshUserByTin} from "../../../redux/slices/contracts/contractsSlice";

const CreateEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {currentColor} = useStateContext();

  const {userByTin} = useSelector((state) => state.userByTin);

  const [currentStep, setCurrentStep] = useState(1);

  const [client, setClient] = useState('');

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
  const [mob_phone_no, setMobileNum] = useState('')
  const [email, setEmail] = useState('')

  const [emailContractNum, setEmailContractNumber] = useState('')
  const [contract_date, setContractDate] = useState('')

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (currentStep === 2) {
      fetchContractNum().then()
    }
  }, [currentStep]);

  const validationJuridic = () => {
    return stir === '' || name === '' || bank_mfo === '' || bank_name === '' || per_adr === '' || paymentAccount === '';
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

  const fetchContractNum = async () => {
    setLoading(true)
    try {
      await instance.get('e-xat/booked-contract').then(({data}) => {
        setEmailContractNumber(data?.valid_new_contract_number)
        setLoading(false)
      })
    } catch (e) {
      toast.error(e.message)
      setLoading(false)
    }
  }

  const postContractNum = async () => {
    setLoading(true)
    try {
      await instance.post('e-xat/booked-contract', {
        pin_or_tin: stir,
        contract_date: new Date(contract_date)?.toISOString()
      }).then((res) => {
        if (res.status === 201) {
          toast.success(`${emailContractNum} raqam muvuffaqiyatli band qilindi!`)
          navigate('/shartnomalar/e-xat')
          setEmailContractNumber('')
          dispatch(clearStatesFirstStep())
          setLoading(false)
        }
      })
    } catch (e) {
      toast.error(e.message)
      setLoading(false)
    }
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

  if (loading) return <Loader />

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
          </>
        )
      case 2:
        return (
          <>
            <div className="w-full my-2 flex items-center">
              <div className="w-2/4">
                <label
                  htmlFor="contract_number"
                  className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
                >
                  Shartnoma raqami
                </label>
                <div className="flex items-center gap-4">
                  <input
                    id="contract_number"
                    type={'text'}
                    className="rounded w-[65%] py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                    placeholder={'Shartnoma raqam'}
                    value={emailContractNum || ''}
                    onChange={(e) => setEmailContractNumber(e.target.value)}
                    disabled={true}
                  />
                  <button
                    className={`px-4 py-2 rounded text-white`}
                    style={{backgroundColor: currentColor}}
                    onClick={fetchContractNum}
                  >
                    Raqam olish
                  </button>
                </div>
              </div>
              <div className="flex flex-col w-4/5">
                <label className={'block text-gray-700 text-sm font-bold mb-1 ml-3'} htmlFor="contract_date">Shartnoma
                  sanasi</label>
                <input
                  id="contract_date"
                  type={'date'}
                  className="rounded w-[45%] py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
                  placeholder={'Shartnoma sanasi'}
                  value={contract_date || ''}
                  onChange={(e) => setContractDate(e.target.value)}
                />
              </div>
            </div>
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
                  }}
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
                  className={`px-4 py-2 rounded text-white disabled:opacity-25`}
                  style={{backgroundColor: currentColor}}
                  disabled={!contract_date || !emailContractNum}
                  onClick={postContractNum}
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
      <Header category="Exat" title="Shartnomalar yaratish"/>
      {displayStep(currentStep)}
    </div>
  );
};

export default CreateEmail;