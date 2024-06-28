import React, {useState} from 'react';
import {Button, Input} from "../../components";
import Logo from "../../assets/images/logo";
import AuthLogo from "../../assets/images/AuthLogo";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {toast} from "react-toastify";
import axios from "axios";
import {APIS} from "../../config";
import {
  oneIdGetUserDetail,
  refreshToken,
  setAccessToken, setUser,
} from "../../redux/slices/auth/authSlice";

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [pin_or_tin, setPinOrTin] = useState('')
  const [password, setPassword] = useState('')

  const login = async () => {
    try {
      const response = await axios.post(APIS.customLogin, {pin_or_tin, password})
      if (response?.data?.success) {
        dispatch(setAccessToken(response?.data?.access))
        dispatch(refreshToken({refresh: response?.data?.refresh, role: response?.data?.role, navigate: navigate}))
        if (response?.data?.role !== 'mijoz') {
          await dispatch(oneIdGetUserDetail(response?.data?.access)).then(async (res) => {
            dispatch(setUser(res))
            navigate('/shartnomalar')
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