import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {toast} from "react-toastify";
import instance from "../../../API";

const initialState = {
  loading: false,
  services: null,
  registries: null,
  register_detail: null,
  employee: null,
  employees: null,
  contracts: null
}

export const getServices = createAsyncThunk(
  "registry/getServices",
  async () => {
    try {
      const response = await instance.get('/contracts/services')
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const getRegistries = createAsyncThunk(
  "registry/getRegistries",
  async (params) => {
    try {
      const response = await instance.get(`/registry-book/registry/${params?.id}`, {params})
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const getRegistryDetail = createAsyncThunk(
  "registry/getRegistryDetail",
  async (id) => {
    try {
      const response = await instance.get(`/registry-book/registry-book/${id}`)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

const RegistrySlice = createSlice({
  name: "registry",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getServices.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getServices.fulfilled, (state, {payload}) => {
      state.services = payload
      state.loading = false
    })
    builder.addCase(getServices.rejected, (state, {payload}) => {
      state.error = payload
      state.loading = false
      state.services = null
    })

    // getRegistries
    builder.addCase(getRegistries.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getRegistries.fulfilled, (state, {payload}) => {
      state.registries = payload
      state.loading = false
    })
    builder.addCase(getRegistries.rejected, (state, {payload}) => {
      state.error = payload
      state.loading = false
      state.registries = null
    })

    // getRegistryDetail
    builder.addCase(getRegistryDetail.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getRegistryDetail.fulfilled, (state, {payload}) => {
      state.register_detail = payload
      state.loading = false
    })
    builder.addCase(getRegistryDetail.rejected, (state, {payload}) => {
      state.error = payload
      state.loading = false
      state.register_detail = null
    })
  }
})

export default RegistrySlice.reducer