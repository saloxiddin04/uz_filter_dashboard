import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api_url} from "../../../config";
import instance from "../../../API";

const initialState = {
  loading: false,
  userByTin: null,
  error: null,
}

export const getUserByTin = createAsyncThunk(
  'contractCreate/getUserByTin',
  async (params) => {
    try {
      if (params?.client === 'yur') {
        const response = await instance.get(`${api_url}/accounts/user-info-yur?tin=${params?.stir}`)
        return response.data
      } else {
        const response = await instance.get(`${api_url}/accounts/user-info-fiz?passport_ce=${params?.passport_ce}&pinfl=${params?.pin}`)
        return response.data
      }
    } catch (e) {
      return e.message
    }
  }
)

export const getMfo = createAsyncThunk(
  'contractCreate/getMfo',
  async (params) => {
    try {
      const response = await instance(`${api_url}/accounts/get-bank`, {params})
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

const firstStepSlices = createSlice({
  name: 'contractCreate',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getUserByTin.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getUserByTin.fulfilled, (state, {payload}) => {
      state.userByTin = payload
      state.loading = false
    })
    builder.addCase(getUserByTin.rejected, (state, {payload}) => {
      state.error = payload
      state.loading = false
      state.userByTin = null
    })
    
    // mfo
    builder.addCase(getMfo.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getMfo.fulfilled, (state, {payload}) => {
      state.loading = false
    })
    builder.addCase(getMfo.rejected, (state, {payload}) => {
      state.error = payload
      state.loading = false
    })
  }
})

export default firstStepSlices.reducer;