import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../../../API";
import {toast} from "react-toastify";

const initialState = {
  loading: false,
  operationSystems: null,
  operationSystemsDetail: null,
  vpsTariffs: null,
  vpsCalculate: null,
  vpsDocument: null,
  vpsConfig: null,
  error: null,
}

export const getVpsTariff = createAsyncThunk(
  "vps/getVpsTariff",
  async () => {
    try {
      const response = await instance.get('/vps/tariff-list/')
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const getOperationSystems = createAsyncThunk(
  "vps/getOperationSystems",
  async () => {
    try {
      const response = await instance.get('/billing/vps-billing/cloud-images')
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const getOperationSystemsDetail = createAsyncThunk(
  "vps/getOperationSystemsDetail",
  async (params) => {
    try {
      const response = await instance.get(`/billing/vps-billing/cloud-images/${params?.id}`)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const createVps = createAsyncThunk(
  "vps/createVps",
  async (data) => {
    try {
      const response = await instance.post('/vps/contract-create', data)
      if (data.save === 1) {
        toast.success('Shartnoma yuborildi')
      }
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const postVpsCalculate = createAsyncThunk(
  "vps/postVpsCalculate",
  async (data) => {
    try {
      const response = await instance.post(`/billing/calculate-vps`, data)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

const createVpsSlice = createSlice({
  name: 'vps',
  initialState,
  reducers: {
    clearStatesVps: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getVpsTariff.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getVpsTariff.fulfilled, (state, {payload}) => {
      state.loading = false
      state.vpsTariffs = payload
    })
    builder.addCase(getVpsTariff.rejected, (state, {payload}) => {
      state.loading = false
      state.vpsTariffs = null
      state.error = payload
    })

    // getOperationSystems
    builder.addCase(getOperationSystems.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getOperationSystems.fulfilled, (state, {payload}) => {
      state.loading = false
      state.operationSystems = payload
    })
    builder.addCase(getOperationSystems.rejected, (state, {payload}) => {
      state.loading = false
      state.error = payload
      state.operationSystems = null
    })

    // getOperationSystemsDetail
    builder.addCase(getOperationSystemsDetail.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getOperationSystemsDetail.fulfilled, (state, {payload}) => {
      state.loading = false
      state.operationSystemsDetail = payload
    })
    builder.addCase(getOperationSystemsDetail.rejected, (state, {payload}) => {
      state.loading = false
      state.error = payload
      state.operationSystemsDetail = null
    })

    // postVpsCalculate
    builder.addCase(postVpsCalculate.pending, (state) => {
      state.loading = true
    })
    builder.addCase(postVpsCalculate.fulfilled, (state, {payload}) => {
      state.loading = false
      state.vpsCalculate = payload
    })
    builder.addCase(postVpsCalculate.rejected, (state, {payload}) => {
      state.loading = false
      state.error = payload
      state.vpsCalculate = null
    })

    // createVps
    builder.addCase(createVps.pending, (state) => {
      state.loading = true
    })
    builder.addCase(createVps.fulfilled, (state, {payload}) => {
      state.loading = false
      state.vpsDocument = payload
    })
    builder.addCase(createVps.rejected, (state, {payload}) => {
      state.loading = false
      state.error = payload
      state.vpsDocument = null
    })
  }
})

export const {clearStatesVps} = createVpsSlice.actions

export default createVpsSlice.reducer