import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import instance from "../../../../API";

const initialState = {
  loading: false,
  attributes: null,
  attribute: null
}

export const getAllAttributes = createAsyncThunk(
  "attribute/getAllAttributes",
  async () => {
    try {
      const response = await instance.get('main/create-attributes')
      return response.data
    } catch (e) {
      return e
    }
  }
)

export const getAttribute = createAsyncThunk(
  "attribute/getAttribute",
  async (params) => {
    try {
      const response = await instance.get(`main/retrive-update-attributes/${params}`)
      return response.data
    } catch (e) {
      return e;
    }
  }
)

export const createAttribute = createAsyncThunk(
  "attribute/createAttribute",
  async (data) => {
    try {
      const response = await instance.post('main/create-attributes', data)
      return response.data
    } catch (e) {
      return e;
    }
  }
)

export const updateAttribute = createAsyncThunk(
  "attribute/updateAttribute",
  async (data) => {
    try {
      const response = await instance.patch(`main/retrive-update-attributes/${data.id}`, data.data)
      return response.data
    } catch (e) {
      return e;
    }
  }
)

const attributeSlice = createSlice({
  name: "attribute",
  initialState,
  extraReducers: builder => {
    // getAllAttributes
    builder
      .addCase(getAllAttributes.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllAttributes.fulfilled, (state, {payload}) => {
        state.attributes = payload
        state.loading = false
      })
      .addCase(getAllAttributes.rejected, (state) => {
        state.attributes = null
        state.loading = false
      })

    // getAttribute
    builder
      .addCase(getAttribute.pending, (state) => {
        state.loading = true
      })
      .addCase(getAttribute.fulfilled, (state, {payload}) => {
        state.attribute = payload
        state.loading = false
      })
      .addCase(getAttribute.rejected, (state) => {
        state.attribute = null
        state.loading = false
      })

    // createAttribute
    builder
      .addCase(createAttribute.pending, (state) => {
        state.loading = true
      })
      .addCase(createAttribute.fulfilled, (state, {payload}) => {
        state.loading = false
      })
      .addCase(createAttribute.rejected, (state) => {
        state.loading = false
      })

    // updateAttribute
    builder
      .addCase(updateAttribute.pending, (state) => {
        state.loading = true
      })
      .addCase(updateAttribute.fulfilled, (state, {payload}) => {
        state.loading = false
      })
      .addCase(updateAttribute.rejected, (state) => {
        state.loading = false
      })
  }
})

export default attributeSlice.reducer