import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../../API";

const initialState = {
  loading: false,
  transfers: null,
  transfer: null
}

export const getAllTransfers = createAsyncThunk(
  "transfers/getAllTransfers",
  async (params) => {
    try {
      const response = await instance.get('warehouse/transfers-warehouse', {params})
      return response.data
    } catch (e) {
      return e;
    }
  }
)

export const getTransfer = createAsyncThunk(
  "transfers/getTransfer",
  async ({id}) => {
    try {
      const response = await instance.get(`warehouse/transfers-warehouse/${id}`)
      return response.data
    } catch (e) {
      return e;
    }
  }
)

export const createTransfer = createAsyncThunk(
  "transfer/createTransfer",
  async (data) => {
    try {
      const response = await instance.post('warehouse/transfers-warehouse', data)
      return response.data
    } catch (e) {
      return e;
    }
  }
)

const transferSlice = createSlice({
  name: "transfer",
  initialState,
  extraReducers: (builder) => {
    // getAllTransfers
    builder
      .addCase(getAllTransfers.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllTransfers.fulfilled, (state, {payload}) => {
        state.transfers = payload
        state.loading = false
      })
      .addCase(getAllTransfers.rejected, (state) => {
        state.loading = false
        state.transfers = null
      })
    
    // getTransfer
    builder
      .addCase(getTransfer.pending, (state) => {
        state.loading = true
      })
      .addCase(getTransfer.fulfilled, (state, {payload}) => {
        state.transfer = payload
        state.loading = false
      })
      .addCase(getTransfer.rejected, (state) => {
        state.loading = false
        state.transfer = null
      })
    
    // createTransfer
    builder
      .addCase(createTransfer.pending, (state) => {
        state.loading = true
      })
      .addCase(createTransfer.fulfilled, (state, {payload}) => {
        state.loading = false
      })
      .addCase(createTransfer.rejected, (state) => {
        state.loading = false
      })
  }
})

export default transferSlice.reducer