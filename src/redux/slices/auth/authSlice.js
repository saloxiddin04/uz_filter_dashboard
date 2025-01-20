import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance, {updateAuthHeader} from "../../../API";

const user = JSON.parse(localStorage.getItem('user') !== 'undefined' ? localStorage.getItem('user') : null);

const initialState = {
  user,
  loading: false,
  access_token: localStorage.getItem('access_token'),
  refresh_token: localStorage.getItem('refresh_token'),
}

export const login = createAsyncThunk(
  "auth/login",
  async (data) => {
    try {
      const response = await instance.post('auth/authenticate', data)
      return response.data
    } catch (e) {
      return e;
    }
  }
)

export const getUserDetail = createAsyncThunk(
  "auth/getUserDetail",
  async () => {
    try {
      const response = await instance.get('user/detail');
      return response.data;
    } catch (error) {
      return error
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (
      state, {payload}
    ) => {
      state.access_token = payload?.access
      localStorage.setItem('access_token', payload?.access)
      updateAuthHeader()
    },
    setRefresh: (
      state, {payload}
    ) => {
      state.refresh_token = payload?.refresh_token
      localStorage.setItem('refresh_token', payload?.refresh_token)
      updateAuthHeader()
    },
    setUser: (
      state, {payload}
    ) => {
      state.user = payload
      localStorage.setItem('user', JSON.stringify(payload))
    },
    setLogout: (state) => {
      state.user = null
      state.loading = false
      state.access_token = null
      state.refresh_token = null
      localStorage.clear()
      // window.location.reload()
    }
  },
  extraReducers: (builder) => {
    // login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(login.rejected, (state) => {
        state.loading = false
      })
  }
})

export const {
  setAccessToken,
  setRefresh,
  setLogout,
  setUser,
} = authSlice.actions

export default authSlice.reducer