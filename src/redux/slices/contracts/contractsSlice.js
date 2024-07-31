import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api_url} from "../../../config";
import {toast} from "react-toastify";
import instance from "../../../API";

const initialState = {
  loading: false,
  contracts: null,
  contractDetail: null,
  contractDetailBalance: null,
  error: null
}

export const getContracts = createAsyncThunk(
  'contracts/getContracts',
  async (data) => {
    try {
      const response = await instance.get(`${api_url}/${data?.slug}/group-contracts?page_size=${data?.page === undefined ? 1 : data?.page}`)
      return response.data
    } catch (e) {
      toast.error(e.message)
    }
  }
)

export const getContractDetail = createAsyncThunk(
  'contracts/getContractDetail',
  async (params) => {
    try {
      const response = await instance(`${api_url}/${params?.slug}/contract-detail/${params?.id}`)
      return response.data
    } catch (e) {
      toast.error(e.message)
    }
  }
)

export const getContractDetailBalance = createAsyncThunk(
  'contracts/getContractDetailBalance',
  async (data) => {
    try {
      const response = await instance.post(`${api_url}/billing/contract-balance-monitor`, data)
      return response.data
    } catch (e) {
      toast.error(e.message)
    }
  }
)

export const savePkcs = createAsyncThunk(
  'contracts/savePkcs',
  async (data) => {
    try {
      const response = await instance.post(`${api_url}/${data.service}/save-pkcs`, data)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

const contractSlice = createSlice({
  name: 'contracts',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getContracts.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getContracts.fulfilled, (state, {payload}) => {
      state.contracts = payload
      state.loading = false
    })
    builder.addCase(getContracts.rejected, (state) => {
      state.loading = false
      state.contracts = null
    })

    // detail
    builder.addCase(getContractDetail.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getContractDetail.fulfilled, (state, {payload}) => {
      state.contractDetail = payload
      state.loading = false
    })
    builder.addCase(getContractDetail.rejected, (state) => {
      state.loading = false
    })

    // balance
    builder.addCase(getContractDetailBalance.pending, (state) => {
      // state.loading = true
    })
    builder.addCase(getContractDetailBalance.fulfilled, (state, {payload}) => {
      state.contractDetailBalance = payload
      state.loading = false
    })
    builder.addCase(getContractDetailBalance.rejected, (state) => {
      state.loading = false
    })

    // save pkcs
    builder.addCase(savePkcs.pending, (state) => {
      state.loading = true
    })
    builder.addCase(savePkcs.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(savePkcs.rejected, (state, {payload}) => {
      state.error = payload
      state.loading = false
    })
  }
})

export default contractSlice.reducer