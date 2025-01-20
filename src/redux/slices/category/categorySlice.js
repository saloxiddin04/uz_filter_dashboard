import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import instance from "../../../API";

const initialState = {
  loading: false,
  categories: null,
  category: null
}

export const getAllCategories = createAsyncThunk(
  "category/getAllCategory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get('main/create-categories')
      return response.data
    } catch (e) {
      return rejectWithValue(e.message)
    }
  }
)

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await instance.post('main/create-categories', data)
      return response.data
    } catch (e) {
      return rejectWithValue(e.message)
    }
  }
)

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async (params, { rejectWithValue }) => {
    try {
      const response = await instance.patch(`main/create-categories/${params.id}`, params.data)
      return response.data
    } catch (e) {
      return rejectWithValue(e.message)
    }
  }
)

const categorySlice = createSlice({
  name: "category",
  initialState,
  extraReducers: builder => {
    // getAllCategories
    builder
      .addCase(getAllCategories.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllCategories.fulfilled, (state, {payload}) => {
        state.categories = payload
        state.loading = false
      })
      .addCase(getAllCategories.rejected, (state) => {
        state.categories = null
        state.loading = false
      })

    // createCategory
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true
      })
      .addCase(createCategory.fulfilled, (state, {payload}) => {
        state.loading = false
      })
      .addCase(createCategory.rejected, (state) => {
        state.loading = false
      })

    // updateCategory
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading = true
      })
      .addCase(updateCategory.fulfilled, (state, {payload}) => {
        state.loading = false
      })
      .addCase(updateCategory.rejected, (state) => {
        state.loading = false
      })
  }
})

export default categorySlice.reducer