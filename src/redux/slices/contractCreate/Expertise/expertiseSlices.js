import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../../../API";
import {toast} from "react-toastify";

const initialState = {
  tarifsApplication: [],
  calculate: null,
  expertiseContractNumber: null,
  loading: false,
  error: null,
}

export const getTariffsExpertise = createAsyncThunk(
  "expertise/getTariffsExpertise",
  async () => {
    try {
      const response = await instance.get('/expertise/tarifs')
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const getExpertiseContractNumber = createAsyncThunk(
  "expertise/getExpertiseContractNumber",
  async (data) => {
    try {
      const response = await instance.get(`/expertise/get-valid-contract-num/${data?.service_id}`)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const getCalculateExpertise = createAsyncThunk(
  "expertise/getCalculateExpertise",
  async (data) => {
    try {
      const response = await instance.post(`/billing/calculate-expertise`, {projects: data})
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

const createExpertiseSlice = createSlice({
  name: "expertise",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getTariffsExpertise.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getTariffsExpertise.fulfilled, (state, {payload}) => {
      state.loading = false
      state.tarifsApplication = payload
    })
    builder.addCase(getTariffsExpertise.rejected, (state, {payload}) => {
      state.error = payload
      state.loading = false
      state.tarifsApplication = null
    })

    // getExpertiseContractNumber
    builder.addCase(getExpertiseContractNumber.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getExpertiseContractNumber.fulfilled, (state, {payload}) => {
      state.loading = false
      state.expertiseContractNumber = payload
    })
    builder.addCase(getExpertiseContractNumber.rejected, (state, {payload}) => {
      state.error = payload
      state.loading = false
      state.expertiseContractNumber = null
    })

    // getCalculateExpertise
    builder.addCase(getCalculateExpertise.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getCalculateExpertise.fulfilled, (state, {payload}) => {
      state.loading = false
      state.calculate = payload
    })
    builder.addCase(getCalculateExpertise.rejected, (state, {payload}) => {
      state.error = payload
      state.loading = false
      state.calculate = null
    })
  }
})

export default createExpertiseSlice.reducer