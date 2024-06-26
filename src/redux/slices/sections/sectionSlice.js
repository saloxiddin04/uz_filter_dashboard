import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {API_URL} from "../../../config";
import {toast} from "react-toastify";
import instance from "../../../API";

const initialState = {
  sections: null,
  loading: false,
  error: null
}

export const getSections = createAsyncThunk(
  'sections/getSections',
  async () => {
    try {
      const response = await instance.get(`${API_URL}/accounts/permission-list`)
      return response.data
    } catch (e) {
      toast.error(e.message)
    }
  }
)

const sectionSlice = createSlice({
  name: 'sections',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getSections.pending, (state, _) => {
      state.loading = true
    })
    builder.addCase(getSections.fulfilled, (state, {payload}) => {
      state.sections = payload
      state.loading = false
    })
    builder.addCase(getSections.rejected, (state, {payload}) => {
      state.loading = false
      state.error = payload
    })
  }
})

export default sectionSlice.reducer