import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {API_URL} from "../../../config";
import {toast} from "react-toastify";
import instance from "../../../API";

const initialState = {
  loading: false,
  contracts: null,
  contractDetail: null,
  error: null
}

export const getContracts = createAsyncThunk(
  'contracts/getContracts',
  async (data) => {
    try {
      const response = await instance.get(`${API_URL}/colocation/group-contracts?filter=all&page_size=1`)
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
      const response = await instance(`${API_URL}/colocation/contract-detail/${params}`)
      return response.data
    } catch (e) {
      toast.error(e.message)
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
  }
})

export default contractSlice.reducer