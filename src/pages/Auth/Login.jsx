import React, {useEffect, useState} from 'react';
import {Button, Input, Loader} from "../../components";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {toast} from "react-toastify";
import {getUserDetail, login, setAccessToken, setRefresh, setUser} from "../../redux/slices/auth/authSlice";

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
        <div className={'flex justify-center items-center h-screen bg-login-bg w-2/4'}>
        </div>

        <div className="flex flex-col justify-center items-center h-screen w-2/4">
          <div className="w-8/12 mx-auto">
            <div className={'flex flex-col'}>
              <Input value={phone_number || ""} onChange={handlePhone} type={'text'} label={'Phone number'} className={'mb-4'} />
              <Input value={password || ""} onChange={(e) => setPassword(e.target.value)} type={'password'} label={'Password'} className={'mb-4'} />
              <Button text={'Login'} color={'white'} bg={'bg-blue-500'} className={'rounded'} onClick={handleLogin} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;