import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {APIS} from "../../../config";
import axios from "axios";
import {clearSidebar} from "../sections/sectionSlice";
import instance from "../../../API";

const user = JSON.parse(localStorage.getItem("user") !== "undefined" ? localStorage.getItem("user") : null)

const initialState = {
  user,
  loading: false,
  one_id: false,
  error: null,
  oneIdCode: localStorage.getItem('oneIdCode') || '',
  access: localStorage.getItem('access'),
  access_token: localStorage.getItem('access_token'),
  refresh_token: localStorage.getItem('refresh_token'),
  tin_or_pin: localStorage.getItem('tin_or_pin'),
}

export const oneIdLogin = createAsyncThunk(
  "auth/oneIdLogin",
  async (code) => {
    try {
      return await axios.post(
        APIS.login,
        {},
        {
          headers: {
            "x-path": window.location.href,
            "x-auth": `${code}`
          }
        }
      )
    } catch (e) {
      console.log(e.message)
    }
  },
  {
    pending: (state) => {
      state.loading = true
    },
    fulfilled: (state) => {
      state.loading = false
    }
  }
)

export const oneIdGetUser = createAsyncThunk(
  "auth/oneIdGetUser",
  async (access_token) => {
    try {
      return await axios.post(
        APIS.getUser,
        {"is_client": 1},
        {
          headers: {
            "x-authentication": `${access_token}`
          }
        },
      )
      // if (response.data?.role === 'Mijoz') {
      //   return response.data
      // } else {
      //   window.location.href = '/dashboard'
      //   return response.data
      // }
      
    } catch (e) {
      console.log(e)
    }
  },
  {
    pending: (state) => {
      state.loading = true
    },
    fulfilled: (state) => {
      state.loading = false
    }
  }
)

export const refreshToken = createAsyncThunk(
  'auth/getRefreshToken',
  async (data, {dispatch}) => {
    try {
      const response = await axios.post(
        APIS.refreshToken,
        {refresh: data.refresh}
      )
      dispatch(setRefresh(response.data?.access))
      if (data.role === 'mijoz') {
        alert('Muvaffaqiyatli avtorizatsiyadan otdingiz. Administrator tomonidan tizimga kirish uchun ruxsat berilishini kutishingizni soraymiz.')
        dispatch(logOut({refresh_token: data.refresh, access: data.access, access_token: data.access}))
      } else if (data.role === null) {
        alert('Muvaffaqiyatli avtorizatsiyadan otdingiz. Administrator tomonidan tizimga kirish uchun ruxsat berilishini kutishingizni soraymiz.')
        dispatch(logOut({refresh_token: data.refresh, access: data.access, access_token: data.access}))
      } else {
        data.navigate('/dashboard')
      }
      return response.data
    } catch (e) {
      console.log(e)
    }
  },
  {
    pending: (state) => {
      state.loading = true
    },
    fulfilled: (state, {payload}) => {
      state.refresh_token = payload?.access
      state.loading = false
    }
  }
)

export const oneIdGetUserDetail = createAsyncThunk("auth/oneIdGetUserDetail", async (tin_or_pin) => {
    try {
      const response = await instance.get('/contracts/user-detail', {
        headers: {
          "PINORTIN": tin_or_pin?.tin_or_pin,
          Authorization: `Bearer ${tin_or_pin?.token}`
        }
      })
      return response.data
    } catch (e) {
      console.log(e.message)
    }
  },
  {
    pending: (state, _) => {
      state.loading = true
    },
    fulfilled: (state, {payload}) => {
      state.user = payload
      state.loading = false
    },
  }
)

export const logOut = createAsyncThunk(
  "auth/oneIdLogOut",
  async (tokens, {dispatch}) => {
    try {
      await axios.post(
        APIS.logOut,
        {"refresh_token": tokens.refresh_token},
        {
          headers: {
            'Authorization': `Bearer ${tokens.access}`,
            'x-authentication': tokens.access_token
          }
        }
      )
      dispatch(setLogout())
      dispatch(clearSidebar())
    } catch (e) {
      dispatch(setLogout())
      dispatch(clearSidebar())
    } finally {
      dispatch(setLogout())
      dispatch(clearSidebar())
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setOneId: (state, {payload}) => {state.one_id = payload},
    setCode: (
      state, action
    ) => {
      state.oneIdCode = action.payload
      localStorage.setItem('oneIdCode', action.payload)
    },
    setAccess: (
      state, action
    ) => {
      state.access = action.payload
      localStorage.setItem('access', action.payload)
    },
    setAccessToken: (
      state, action
    ) => {
      state.access_token = action.payload
      localStorage.setItem('access_token', action.payload)
    },
    setRefresh: (
      state, action
    ) => {
      state.refresh_token = action.payload
      localStorage.setItem('refresh_token', action.payload)
    },
    setUser: (
      state, action
    ) => {
      state.user = action.payload?.payload
      localStorage.setItem('user', JSON.stringify(action.payload?.payload))
    },
    setTinOrPin: (
      state, {payload}
    ) => {
      state.tin_or_pin = payload
      localStorage.setItem('tin_or_pin', payload)
    },
    setLogout: (state) => {
      state.user = null
      state.loading = false
      state.error = null
      state.oneIdCode = null
      state.access = null
      state.access_token = null
      state.refresh_token = null
      localStorage.clear()
      // window.location.reload()
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logOut.fulfilled, (state) => {
      state.user = null
      state.loading = false
      state.error = null
      state.oneIdCode = null
      state.access = null
      state.access_token = null
      state.refresh_token = null
      localStorage.clear()
    })
    builder.addCase(logOut.rejected, (state) => {
      state.user = null
      state.loading = false
      state.error = null
      state.oneIdCode = null
      state.access = null
      state.access_token = null
      state.refresh_token = null
      localStorage.clear()
    })
  }
})

export const {
  setCode,
  setAccess,
  setAccessToken,
  setRefresh,
  setLogout,
  setUser,
  setOneId,
  setTinOrPin
} = authSlice.actions

export default authSlice.reducer