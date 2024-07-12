import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../../../API";
import {toast} from "react-toastify";

const initialState = {
  dataCenterList: null,
  loading: false,
  error: null,
  calculate: null,
  colocationDocument: null,
  dataCenterTariff: null,
  colocationConfig: null
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

export const createColocation = createAsyncThunk(
  "colocationCreateContract/createColocation",
  async (data) => {
    try {
      const response = await instance.post(`colocation/contract-create`, data)
      if (data.save === 1) {
        toast.success('Shartnoma yuborildi')
      }
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const createAgreementColocation = createAsyncThunk(
  "colocationCreateContract/createAgreementColocation",
  async (data) => {
    try {
      const response = await instance.get(`/colocation/contract-create?pin_or_tin=${data?.user}`)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

const createContractColocationSlice = createSlice({
  name: 'colocationCreateContract',
  initialState,
  reducers: {
    clearStatesColocation: () => initialState
  },
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

    // create
    builder.addCase(createColocation.pending, (state) => {
      state.loading = true
    })
    builder.addCase(createColocation.fulfilled, (state, {payload}) => {
      state.loading = false
      state.colocationDocument = payload
    })
    builder.addCase(createColocation.rejected, (state, {payload}) => {
      state.loading = false
      state.error = payload
      state.colocationDocument = null
    })

    // createAgreementColocation
    builder.addCase(createAgreementColocation.pending, (state, {payload}) => {
      state.loading = true
    })
    builder.addCase(createAgreementColocation.fulfilled, (state, {payload}) => {
      state.loading = false
      state.colocationConfig = payload
    })
    builder.addCase(createAgreementColocation.rejected, (state, {payload}) => {
      state.loading = false
      state.error = payload
      state.colocationConfig = null
    })
  }
})

export const {clearStatesColocation} = createContractColocationSlice.actions
export default createContractColocationSlice.reducer