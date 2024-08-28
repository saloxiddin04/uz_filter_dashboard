import React, {useEffect, useState} from 'react';
import {Button, Input, TabsRender} from "../../components";
import Logo from "../../assets/images/logo";
import AuthLogo from "../../assets/images/AuthLogo";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {api_url, APIS} from "../../config";
import instance from "../../API";
import {HooksCommission} from "../../components/eSign/eSignConfig";
import {
  oneIdGetUserDetail,
  refreshToken,
  setAccess,
  setTinOrPin,
  setUser
} from "../../redux/slices/auth/authSlice";
import {toast} from "react-toastify";

const tabs = [
  {
    title: 'One id',
    active: true
  },
  // {
  //   title: "ERI",
  //   active: false
  // },
  // {
  //   title: "PINFL",
  //   active: false
  // }
];

const Login = () => {
  const {signIn, AppLoad} = HooksCommission()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [pin_or_tin, setPinOrTin] = useState('')
  const [password, setPassword] = useState('')

  const [openTab, setOpenTab] = useState(tabs.findIndex(tab => tab.active));

  useEffect(() => {
    if (openTab === 1) {
      AppLoad()
    }
  }, [openTab]);

  const login = async () => {
    window.location.href =
      `${api_url}/api/oauth/oneid-login?path=` + window.location.origin
  }

  const loginPin = async () => {
    try {
      const response = await instance.post(APIS.customLogin, {pin_or_tin, password})
      instance.defaults.headers.common = { Authorization: `Bearer ${response?.data?.access}` }
      if (response?.data?.success) {
        dispatch(setAccess(response?.data?.access))
        dispatch(refreshToken({refresh: response?.data?.refresh, role: response?.data?.role, navigate: navigate}))
        if (response?.data?.role !== 'mijoz') {
          await dispatch(oneIdGetUserDetail(response?.data?.access)).then(async (res) => {
            await dispatch(setTinOrPin(res?.payload?.pin))
            await dispatch(setUser(res))
            navigate('/dashboard')
            window.location.reload()
          })
        } else {
          setPinOrTin('')
          setPassword('')
        }
      }
    } catch (e) {
      toast.error(e.message)
    }
  }

  const loginEri = async () => {
    await instance.get(`${APIS.eriLogin}`).then(({data}) => {
      localStorage.setItem('challenge', data?.challenge)
      signIn()
    })
  }

  const renderTypeLogin = (value) => {
    switch (value) {
      case 0:
        return (
          <>
            <div className={'w-full flex justify-center'}>
              <Button
                text={'Kirish'}
                color={'white'}
                className={'bg-blue-600 rounded mt-2 mx-auto text-center'}
                width={'24'}
                onClick={login}
                // disabled={password === '' || password.length <= 7 || pin_or_tin === ''}
              />
            </div>
          </>
        )
      case 1:
        return (
          <div className={'w-full'}>
            <select
              name="S@loxiddin"
              id="S@loxiddin"
              className='sign w-full px-2 py-2 rounded focus:outline-none focus:border-blue-500 mx-auto'
            />
            <div className={'w-full flex justify-center'}>
              <Button
                text={'Kirish'}
                color={'white'}
                className={'bg-blue-600 rounded mt-2 mx-auto text-center'}
                width={'24'}
                onClick={loginEri}
              />
            </div>
          </div>
        )
      case 2:
        return (
          <>
            <div className={'mb-2'}>
              <Input
                type={'text'}
                placeholder={'PINFL'}
                value={pin_or_tin || ''}
                onChange={(e) => setPinOrTin(e.target.value)}
              />
            </div>
            <div>
              <Input
                type={'password'}
                placeholder={'Parol'}
                value={password || ''}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={'w-full flex justify-center'}>
              <Button
                text={'Kirish'}
                color={'white'}
                className={'bg-blue-600 rounded mt-2 mx-auto text-center'}
                width={'24'}
                onClick={loginPin}
                disabled={password === '' || password.length <= 7 || pin_or_tin === ''}
              />
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className={'flex justify-center items-center h-screen bg-login-bg'}>
        <div className={'container m-auto w-2/5'}>
          <div className={'flex flex-col justify-center items-center mb-5 border-b-white border-b pb-2'}>
            <TabsRender
              tabs={tabs}
              color={'rgb(59 130 246)'}
              openTab={openTab}
              setOpenTab={setOpenTab}
            />
            <Logo/>
          </div>
          {renderTypeLogin(openTab)}
          <div className={'flex justify-center mt-5 border-t-white border-t pt-2'}>
          <span className={'text-white'}>
            © Copyright 2022.{" "}
            <a href="https://unicon.uz/" className={'text-underline underline'} target="_blank" rel="noreferrer">
              UNICON.UZ
            </a>
          </span>
          </div>
          <div className="absolute left-0 bottom-0">
            <AuthLogo/>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;