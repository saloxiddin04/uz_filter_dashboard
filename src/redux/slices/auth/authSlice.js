import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {APIS} from "../../../config";
import axios from "axios";
import {toast} from "react-toastify";

const user = JSON.parse(localStorage.getItem("user") ? localStorage.getItem("user") : null)

const initialState = {
  user,
  loading: false,
  error: null,
  oneIdCode: localStorage.getItem('oneIdCode') || '',
  access: localStorage.getItem('access'),
  access_token: localStorage.getItem('access_token'),
  refresh_token: localStorage.getItem('refresh_token'),
}

export const oneIdRedirect = createAsyncThunk(
  "auth/OneIdRedirect",
  async () => {
    try {
      window.location.replace(
        `${APIS.getOneIdLogin}/api/oauth/oneid-login?path=http://localhost:3000`
      )
    } catch (e) {
      console.log(e)
    }
  }
)

export const oneIdLogin = createAsyncThunk(
  "auth/oneIdLogin",
  async (code) => {
    try {
      return await axios.post(
        APIS.login,
        {},
        {
          headers: {
            "x-path": "http://localhost:3000",
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
        toast('Muvaffaqiyatli avtorizatsiyadan otdingiz. Administrator tomonidan tizimga kirish uchun ruxsat berilishini kutishingizni soraymiz.')
        dispatch(logOut())
      } else if (data.role === null) {
        toast('Muvaffaqiyatli avtorizatsiyadan otdingiz. Administrator tomonidan tizimga kirish uchun ruxsat berilishini kutishingizni soraymiz.')
        dispatch(logOut())
      } else {
        data.navigate('/orders')
      }
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

export const oneIdGetUserDetail = createAsyncThunk(
  "auth/oneIdGetUserDetail",
  async (access) => {
    try {
      return await axios.get(
        APIS.getUserDetail,
        {
          headers: {
            'Authorization': `Bearer ${access}`
          }
        }
      )
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
      const response = await axios.post(
        APIS.logOut,
        {"refresh_token": tokens.refresh_token},
        {
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`,
            'x-authentication': tokens.access
          }
        }
      )
      dispatch(setLogout())
    } catch (e) {
      dispatch(setLogout())
      console.log(e.message)
      localStorage.clear()
    }
  },
  {
    pending: (state, _) => {
      state.loading = true
    },
    fulfilled: (state, _) => {
      localStorage.removeItem('user')
      localStorage.removeItem('oneIdCode')
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      state.user = null
      state.loading = false
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
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
      state.user = action.payload?.payload?.data
      localStorage.setItem('user', JSON.stringify(action.payload?.payload?.data))
    },
    setLogout: (state) => {
      state.user = null
      state.loading = false
      localStorage.clear()
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logOut.rejected, (state, _) => {
      localStorage.clear()
      state.user = null
      state.loading = false
    })
  }
})

export const {
  setCode,
  setAccess,
  setAccessToken,
  setRefresh,
  setLogout,
  setUser
} = authSlice.actions

export default authSlice.reducer