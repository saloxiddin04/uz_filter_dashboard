import React, {useEffect} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
  oneIdGetUser,
  oneIdGetUserDetail,
  oneIdLogin,
  setAccess,
  setAccessToken,
  setCode,
  setRefresh, setUser
} from "./authSlice";
import {toast} from "react-toastify";
import {Loader} from "../../../components";

function Code() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {search, pathname} = useLocation()
  const code = search.substring(search.lastIndexOf('code=') + 5).split('&', 1)[0]
  
  console.log(pathname)
  
  const getUser = async (tok) => {
    try {
      let res = await dispatch(oneIdGetUser(tok))
      if (res?.payload?.data) {
        await dispatch(setAccess(res.payload.data.access))
        await dispatch(setRefresh(res.payload.data.refresh))
        let res2 = await dispatch(oneIdGetUserDetail(res?.payload?.data?.access)).then(() => navigate('/dashboard'))
        dispatch(setUser({payload: res2?.payload}))
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
    if (code) {
      dispatch(setCode(code))
      login().then()
    } else {
      toast.error('Something went error')
    }
    navigate('/')
  }, [])

  return (
    <div>
      <Loader />
    </div>
  );
}

export default Code;