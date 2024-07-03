import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api_url} from "../../../config";
import instance from "../../../API";

const initialState = {
  dashboard: null,
  loading: false,
  error: null,
}

export const getDashboard = createAsyncThunk(
  'dashboard/getDashboard',
  async () => {
    try {
      const response = await instance.get(`${api_url}/accounts/dashboard`)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getDashboard.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getDashboard.fulfilled, (state, {payload}) => {
      state.dashboard = payload
      state.loading = false
    })
    builder.addCase(getDashboard.rejected, (state, {payload}) => {
      state.error = payload
      state.loading = false
      state.dashboard = null
    })
  }
})

export default dashboardSlice.reducer