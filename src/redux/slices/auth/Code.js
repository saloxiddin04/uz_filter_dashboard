import React, {useEffect} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
  logOut,
  oneIdGetUser,
  oneIdGetUserDetail,
  oneIdLogin,
  setAccess,
  setAccessToken,
  setCode, setOneId,
  setRefresh, setTinOrPin, setUser
} from "./authSlice";
import {toast} from "react-toastify";
import {Loader} from "../../../components";

function Code() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {search, pathname} = useLocation()
  const code = search.substring(search.lastIndexOf('code=') + 5).split('&', 1)[0]

  const user = localStorage.getItem("user")

  const {access, access_token, refresh_token} = useSelector((state) => state.user)
  
  const getUser = async (tok) => {
    try {
      let res = await dispatch(oneIdGetUser(tok))
      localStorage.setItem("res", JSON.stringify(res?.payload?.data))
      dispatch(setTinOrPin(res?.payload?.data?.tin_or_pin))
      if (res?.payload?.data?.auth_method !== 'strong') {
        await dispatch(setAccess(res.payload.data.access))
        await dispatch(setRefresh(res.payload.data.refresh))
        let res2 = await dispatch(oneIdGetUserDetail({tin_or_pin: res?.payload?.data?.tin_or_pin, token: res?.payload?.data?.access}))
        await dispatch(setUser({payload: res2?.payload}))
        if (res2?.payload?.role === 'mijoz' || res2?.payload === undefined) {
          alert('Muvaffaqiyatli avtorizatsiyadan otdingiz. Administrator tomonidan tizimga kirish uchun ruxsat berilishini kutishingizni soraymiz.')
          await dispatch(logOut({access: res.payload.data.access, access_token: tok, refresh_token: res.payload.data.refresh}))
          navigate('/login')
        } else {
          navigate('/dashboard')
          window.location.reload()
        }
      } else {
        navigate('/two-factor')
      }
    } catch (e) {
      console.log(e)
    }
  }

  const login = async () => {
    try {
      let res = await dispatch(oneIdLogin(code))
      if (res.payload.data) {
        await dispatch(setAccessToken(res.payload.data.access_token))
        await getUser(res?.payload?.data?.access_token)
      }
    } catch (e) {
      console.log(e)
    }
  }


  useEffect(() => {
    dispatch(setOneId(true))
    if (code) {
      dispatch(setCode(code))
      login().then()
    } else {
      toast.error('Something went error')
    }
    navigate('/')
  }, [])

  useEffect(() => {
    if (user === 'undefined') {
      navigate('/login')
      dispatch(logOut({access, access_token, refresh_token}))
      localStorage.clear()
    }
  }, [user]);

  return <Loader />
}

export default Code;