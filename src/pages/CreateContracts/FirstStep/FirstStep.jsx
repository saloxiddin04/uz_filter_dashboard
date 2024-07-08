import React, {useState} from 'react';
import {Button, Header, Input, Loader} from "../../../components";
import {useStateContext} from "../../../contexts/ContextProvider";
import {useDispatch, useSelector} from "react-redux";
import {getUserByTin, getMfo} from "../../../redux/slices/contractCreate/FirstStepSlices";

const FirstStep = () => {
  const dispatch = useDispatch();
  
  const {userByTin, loading} = useSelector((state) => state.userByTin);
  
  const {currentColor} = useStateContext();
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
  
  if (loading) return <Loader />
  
  return (
    <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-10 bg-white rounded">
      <Header category="Sahifa" title="Shartnomalar yaratish"/>
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
          className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
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
              className={`px-4 py-2 rounded text-white ${stir.length === 9 ? 'opacity-1' : 'opacity-75'}`}
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
        </div>
      )}
      {client === 'fiz' && (
        <div className={'w-8/12 flex items-end gap-4 mt-4'}>
          <div className={'w-full flex gap-4 items-end'}>
            <div className={'w-2/5'}>
              <Input label={'Passport malumotlari'}/>
            </div>
            <div className={'w-3/5'}>
              <Input label={''}/>
            </div>
          </div>
          <button
            className={'px-4 py-2 rounded text-white'}
            style={{backgroundColor: currentColor}}
          >
            Izlash
          </button>
        </div>
      )}
    </div>
  );
};

export default FirstStep;