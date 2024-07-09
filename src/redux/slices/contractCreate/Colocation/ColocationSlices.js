import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../../../API";

const initialState = {
  dataCenterList: null,
  loading: false,
  error: null,
  calculate: null,
  colocationDocument: null,
  dataCenterTariff: null
}

export const getDataCenterList = createAsyncThunk(
  'colocationCreateContract/getDataCenterList',
  async () => {
    try {
      const response = await instance.get(`colocation/list/data-center`)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const getDataCenterTariff = createAsyncThunk(
  'colocationCreateContract/getDataCenterTariff',
  async () => {
    try {
      const response = await instance.get(`colocation/list/tariff`)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const calculateColocation = createAsyncThunk(
  "colocationCreateContract/calculateColocation",
  async (data) => {
    try {
      const response = await instance.post(`billing/calculate-colocation`, data.data)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

const createContractColocationSlice = createSlice({
  name: 'colocationCreateContract',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getDataCenterList.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getDataCenterList.fulfilled, (state, {payload}) => {
      state.loading = false
      state.dataCenterList = payload
    })
    builder.addCase(getDataCenterList.rejected, (state, {payload}) => {
      state.error = payload
      state.loading = false
      state.dataCenterList = null
    })

    // tariff
    builder.addCase(getDataCenterTariff.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getDataCenterTariff.fulfilled, (state, {payload}) => {
      state.loading = false
      state.dataCenterTariff = payload
    })
    builder.addCase(getDataCenterTariff.rejected, (state, {payload}) => {
      state.error = payload
      state.loading = false
      state.dataCenterTariff = null
    })

    // calculate
    builder.addCase(calculateColocation.fulfilled, (state, {payload}) => {
      state.loading = false
      state.calculate = payload
    })
    builder.addCase(calculateColocation.rejected, (state, {payload}) => {
      state.loading = false
      state.calculate = null
      state.error = payload
    })
  }
})

export default createContractColocationSlice.reducer