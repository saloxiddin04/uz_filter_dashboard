import React, {useState} from 'react';
import {Button, Input} from "../../components";
import Logo from "../../assets/images/logo";
import AuthLogo from "../../assets/images/AuthLogo";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import axios from "axios";
import {APIS} from "../../config";
import {
  logOut,
  oneIdGetUserDetail,
  refreshToken,
  setAccessToken,
  setUser
} from "../../redux/slices/auth/authSlice";

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {access, access_token, refresh_token} = useSelector(state => state.user)

  const [pin_or_tin, setPinOrTin] = useState('')
  const [password, setPassword] = useState('')

  const login = async () => {
    try {
      const response = await axios.post(APIS.customLogin, {pin_or_tin,password})
      if (response?.data?.success) {
        dispatch(setAccessToken(response?.data?.access))
        dispatch(refreshToken({refresh: response?.data?.refresh, role: response?.data?.role, navigate: navigate}))
        await dispatch(oneIdGetUserDetail(response?.data?.access)).then(async (res) => {
          dispatch(setUser(res))
          if (res?.userdata?.role?.name === 'mijoz' || res?.userdata?.role?.name === null) {
            toast('Muvaffaqiyatli avtorizatsiyadan otdingiz. Administrator tomonidan tizimga kirish uchun ruxsat berilishini kutishingizni soraymiz.')
            await dispatch(logOut({access, access_token, refresh_token}))
          } else {
            navigate('/orders')
          }
        })
      }
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div className={'flex justify-center items-center h-screen bg-login-bg'}>
      <div className={'container m-auto w-2/5'}>
        <div className={'flex justify-center mb-5 border-b-white border-b pb-2'}>
          <Logo/>
        </div>
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
            onClick={login}
            disabled={password === '' || password.length <= 7 || pin_or_tin === ''}
          />
        </div>
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
  );
};

export default Login;