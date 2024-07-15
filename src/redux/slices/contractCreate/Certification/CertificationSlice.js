import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../../../API";

const initialState = {
  tariff: [],
  category: [],
  count_prices: [],
  calculateCertification: null,
  contractDoc: null,
  loading: false,
  error: null
}

export const getCertificationTariff = createAsyncThunk(
  "certification/getCertificationTariff",
  async (params) => {
    try {
      const response = await instance.get('/tte_certification/tariff/telecomunication', {params})
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const getCertificationCategory = createAsyncThunk(
  "certification/getCertificationCategory",
  async (params) => {
    try {
      const response = await instance.get(`/tte_certification/tariff/telecomunication/prices/${params?.id}`)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const getCertificationCountPrices = createAsyncThunk(
  "certification/getCertificationCountPrices",
  async (data) => {
    try {
      const response = await instance.post('/tte_certification/get-selected-count-price', data)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const getCertificationCalculate = createAsyncThunk(
  "certification/getCertificationCalculate",
  async (data) => {
    try {
      const response = await instance.post('/billing/calculate-tte-certification', data)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const postCertificationContract = createAsyncThunk(
  "certification/postCertificationContract",
  async (data) => {
    try {
      const response = await instance.post('/tte_certification/contract-create', data)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

const createCertificationSlice = createSlice({
  name: "certification",
  initialState,
  reducers: {
    clearStatesCertification: () => initialState,
  },
  extraReducers: (builder) => {
    // getCertificationTariff
    builder.addCase(getCertificationTariff.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getCertificationTariff.fulfilled, (state, {payload}) => {
      const uniquePayload = payload.filter(
        (item) => !state.tariff.some((detail) => detail.id === item.id)
      );
      return {
        ...state,
        tariff: [...state.tariff, ...uniquePayload],
        loading: false
      };
    })
    builder.addCase(getCertificationTariff.rejected, (state, {payload}) => {
      state.loading = false
      state.error = payload
      state.tariff = null
    })
    
    // getCertificationCategory
    builder.addCase(getCertificationCategory.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getCertificationCategory.fulfilled, (state, {payload}) => {
      const uniquePayloadCategory = payload.filter(
        (item) => !state.category.some((detail) => detail.id === item.id)
      );
      return {
        ...state,
        category: [...state.category, ...uniquePayloadCategory],
        loading: false
      }
    })
    builder.addCase(getCertificationCategory.rejected, (state, {payload}) => {
      state.loading = false
      state.error = payload
      state.category = null
    })
    
    // getCertificationCountPrices
    builder.addCase(getCertificationCountPrices.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getCertificationCountPrices.fulfilled, (state, {payload}) => {
      state.loading = false
      state.count_prices = payload
    })
    builder.addCase(getCertificationCountPrices.rejected, (state, {payload}) => {
      state.loading = false
      state.error = payload
      state.count_prices = null
    })
    
    // getCertificationCalculate
    builder.addCase(getCertificationCalculate.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getCertificationCalculate.fulfilled, (state, {payload}) => {
      state.loading = false
      state.calculateCertification = payload
    })
    builder.addCase(getCertificationCalculate.rejected, (state, {payload}) => {
      state.loading = false
      state.error = payload
      state.calculateCertification = null
    })
    
    // postCertificationContract
    builder.addCase(postCertificationContract.pending, (state) => {
      state.loading = true
    })
    builder.addCase(postCertificationContract.fulfilled, (state, {payload}) => {
      state.loading = false
      state.contractDoc = payload
    })
    builder.addCase(postCertificationContract.rejected, (state, {payload}) => {
      state.loading = false
      state.error = payload
      state.contractDoc = null
    })
  }
})

export const {clearStatesCertification} = createCertificationSlice.actions
export default createCertificationSlice.reducer
