import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {API_URL} from "../../../config";
import {toast} from "react-toastify";
import instance from "../../../API";

const initialState = {
  loading: false,
  contracts: null,
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
  }
})

export default contractSlice.reducer