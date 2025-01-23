import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import instance from "../../../../API";

const initialState = {
  loading: false,
  categories: null,
  category: null
}

export const getAllCategories = createAsyncThunk(
  "category/getAllCategory",
  async () => {
    try {
      const response = await instance.get('main/create-categories')
      return response.data
    } catch (e) {
      return e
    }
  }
)

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (data) => {
    try {
      const response = await instance.post('main/create-categories', data)
      return response.data
    } catch (e) {
      return e
    }
  }
)

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async (params) => {
    try {
      const response = await instance.patch(`main/retrive-update-categories/${params.id}`, params.data)
      return response.data
    } catch (e) {
      return e;
    }
  }
)

export const getCategory = createAsyncThunk(
  "category/getCategory",
  async (id) => {
    try {
      const response = await instance.get(`main/retrive-update-categories/${id}`)
      return response.data
    } catch (e) {
      return e;
    }
  }
)

export const fileUpload = createAsyncThunk(
  "category/fileUpload",
  async (data) => {
    try {
      const response = await instance.post(`main/file-upload`, data, {headers: { "Content-type": "multipart/form-data" }})
      return response.data
    } catch (e) {
      return e;
    }
  }
)

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setLoading: (state, {payload}) => {
      state.loading = payload
    }
  },
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

    // getCategory
    builder
      .addCase(getCategory.pending, (state) => {
        state.loading = true
      })
      .addCase(getCategory.fulfilled, (state, {payload}) => {
        state.category = payload
        state.loading = false
      })
      .addCase(getCategory.rejected, (state) => {
        state.category = null
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

export const {setLoading} = categorySlice.actions
export default categorySlice.reducer