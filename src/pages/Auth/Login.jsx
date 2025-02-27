import React, {useEffect, useState} from 'react';
import {Button, Input, Loader} from "../../components";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {toast} from "react-toastify";
import {getUserDetail, login, setAccessToken, setRefresh, setUser} from "../../redux/slices/auth/authSlice";
import logo from "../../assets/images/logo.svg"

const Login = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [phone_number, setPhoneNumber] = useState('+998')
  const [password, setPassword] = useState(null)

  const handlePhone = (e) => {
    const inputValue = e.target.value;

    if (inputValue.startsWith("+998")) {
      const sanitizedValue = inputValue.replace(/[^\d+]/g, "");
      setPhoneNumber(sanitizedValue?.trim());
    }
  };

  const handleLogin = () => {
    if (phone_number === '+998' || !password) return toast.error('All inputs required')

    dispatch(login({phone_number, password})).then(({payload}) => {
      if (payload?.access && payload?.refresh_token) {
        dispatch(setAccessToken(payload))
        dispatch(setRefresh(payload))

        dispatch(getUserDetail()).then((res) => {
          if (res?.payload) {
            dispatch(setUser(res.payload));
            navigate("/dashboard");
          } else {
            console.error("Failed to fetch user details");
          }
        });
      }
    }).catch(e => console.log('error: ', e))
  }

  return (
    <>
      <div className="flex">
        <div className={'flex flex-col justify-center items-center h-screen bg-login-bg w-2/4 px-10 text-center'}>
          <img src={logo} alt="logo"/>
          <h1 className="text-white text-xl">
            Uzfiltr – Лидер в фильтрации
          </h1>
          <div className="w-full border border-white h-[1px] my-4"></div>
          <p className="text-white">
            «Узфильтр» — ведущий поставщик пневмолент, фильтровальных рукавов и иглоподобных тканей в Центральной Азии.
            Мы помогаем очищать воздух и жидкости и защищать окружающую среду с помощью инновационных технологий.
          </p>
          <div className="w-full border border-white h-[1px] my-4"></div>
        </div>
        
        <div className="flex flex-col justify-center items-center h-screen w-2/4">
          <div className="w-8/12 mx-auto">
            <div className={'flex flex-col'}>
              <Input value={phone_number || ""} onChange={handlePhone} type={'text'} label={'Телефон номер'}
                     className={'mb-4'}/>
              <Input value={password || ""} onChange={(e) => setPassword(e.target.value)} type={'password'}
                     label={'Пароль'} className={'mb-4'}/>
              <Button text={'Логин'} color={'white'} bg={'bg-blue-500'} className={'rounded'} onClick={handleLogin}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;