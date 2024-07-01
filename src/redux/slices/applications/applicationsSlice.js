import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api_url} from "../../../config";
import {toast} from "react-toastify";
import instance from "../../../API";

const initialState = {
  loading: false,
  applications: null,
  applicationDetail: null,
  error: null
}

export const getApplications = createAsyncThunk(
  'applications/getApplications',
  async (params) => {
    try {
      const response = await instance.get(`${api_url}/main/application/list/`, {params})
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const getApplicationDetail = createAsyncThunk(
  'applications/getApplicationDetail',
  async (id) => {
    try {
      const response = await instance.get(`${api_url}/main/application/detail/${id}/`)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getApplications.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getApplications.fulfilled, (state, {payload}) => {
      state.applications = payload
      state.loading = false
    })
    builder.addCase(getApplications.rejected, (state, {payload}) => {
      state.error = payload
      state.loading = false
      state.applications = null
    })

    // get detail
    builder.addCase(getApplicationDetail.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getApplicationDetail.fulfilled, (state, {payload}) => {
      state.loading = false
      state.applicationDetail = payload
    })
    builder.addCase(getApplicationDetail.rejected, (state, {payload}) => {
      state.error = payload
      state.loading = false
      state.applicationDetail = null
    })
  }
})

export default applicationSlice.reducer