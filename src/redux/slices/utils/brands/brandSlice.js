import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../../../API";

const initialState = {
  brands: null,
  brand: null,
  loading: false
}

export const getAllBrands = createAsyncThunk(
  "brand/getAllBrands",
  async () => {
    try {
      const response = await instance.get('main/create-brands')
      return response.data
    } catch (e) {
      return e
    }
  }
)

export const getBrand = createAsyncThunk(
  "brand/getBrand",
  async (params) => {
    try {
      const response = await instance.get(`main/retrive-update-brands/${params.id}`)
      return response.data
    } catch (e) {
      return e;
    }
  }
)

export const createBrand = createAsyncThunk(
  "brand/createBrand",
  async (data) => {
    try {
      const response = await instance.post('main/create-brands', data)
      return response.data
    } catch (e) {
      return e;
    }
  }
)

export const updateBrand = createAsyncThunk(
  "brand/updateBrand",
  async (data) => {
    try {
      const response  =await instance.patch(`main/retrive-update-brands/${data.id}`, data.data)
      return response.data
    } catch (e) {
      return e;
    }
  }
)

const brandsSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    setLoading: (state, {payload}) => {
      state.loading = payload
    }
  },
  extraReducers: builder => {
    // getAllBrands
    builder
      .addCase(getAllBrands.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllBrands.fulfilled, (state, {payload}) => {
        state.brands = payload
        state.loading = false
      })
      .addCase(getAllBrands.rejected, (state) => {
        state.brands = null
        state.loading = false
      })

    // getBrand
    builder
      .addCase(getBrand.pending, (state) => {
        state.loading = true
      })
      .addCase(getBrand.fulfilled, (state, {payload}) => {
        state.brand = payload
        state.loading = false
      })
      .addCase(getBrand.rejected, (state) => {
        state.brand = null
        state.loading = false
      })

    // createBrand
    builder
      .addCase(createBrand.pending, (state) => {
        state.loading = true
      })
      .addCase(createBrand.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(createBrand.rejected, (state) => {
        state.loading = false
      })

    // updateBrand
    builder
      .addCase(updateBrand.pending, (state) => {
        state.loading = true
      })
      .addCase(updateBrand.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateBrand.rejected, (state) => {
        state.loading = false
      })
  }
})

export const {setLoading} = brandsSlice.actions
export default brandsSlice.reducer