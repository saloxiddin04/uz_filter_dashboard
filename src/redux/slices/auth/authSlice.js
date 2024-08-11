import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {APIS} from "../../../config";
import axios from "axios";
import {toast} from "react-toastify";
import {clearSidebar} from "../sections/sectionSlice";

const user = JSON.parse(localStorage.getItem("user") ? localStorage.getItem("user") : null)

const initialState = {
  user,
  loading: false,
  one_id: false,
  error: null,
  oneIdCode: localStorage.getItem('oneIdCode') || '',
  access: localStorage.getItem('access'),
  access_token: localStorage.getItem('access_token'),
  refresh_token: localStorage.getItem('refresh_token'),
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
        toast.success('Muvaffaqiyatli avtorizatsiyadan otdingiz. Administrator tomonidan tizimga kirish uchun ruxsat berilishini kutishingizni soraymiz.')
        dispatch(logOut({refresh_token: data.refresh, access: data.access, access_token: data.access}))
      } else if (data.role === null) {
        toast.success('Muvaffaqiyatli avtorizatsiyadan otdingiz. Administrator tomonidan tizimga kirish uchun ruxsat berilishini kutishingizni soraymiz.')
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

export const oneIdGetUserDetail = createAsyncThunk("auth/oneIdGetUserDetail", async (access) => {
    try {
      const response = await axios.get(
        APIS.getUserDetail,
        {
          headers: {
            'Authorization': `Bearer ${access}`
          }
        }
      )
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
      console.log(action)
      localStorage.setItem('user', JSON.stringify(action.payload?.payload))
    },
    setLogout: (state) => {
      // state.user = null
      // state.loading = false
      // state.error = null
      // state.oneIdCode = null
      // state.access = null
      // state.access_token = null
      // state.refresh_token = null
      // localStorage.clear()
    }
  },
  // extraReducers: (builder) => {
  //   builder.addCase(logOut.pending, (state, _) => {
  //     state.loading = true
  //   })
  //   builder.addCase(logOut.fulfilled, (state, _) => {
  //     state.user = null
  //     state.loading = false
  //     state.error = null
  //     state.oneIdCode = null
  //     state.access = null
  //     state.access_token = null
  //     state.refresh_token = null
  //   })
  //   builder.addCase(logOut.rejected, (state, _) => {
  //     state.user = null
  //     state.loading = false
  //     state.error = null
  //     state.oneIdCode = null
  //     state.access = null
  //     state.access_token = null
  //     state.refresh_token = null
  //   })
  // }
})

export const {
  setCode,
  setAccess,
  setAccessToken,
  setRefresh,
  setLogout,
  setUser,
  setOneId
} = authSlice.actions

export default authSlice.reducer