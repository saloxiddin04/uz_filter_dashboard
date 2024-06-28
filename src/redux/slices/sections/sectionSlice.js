import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {API_URL} from "../../../config";
import {toast} from "react-toastify";
import instance from "../../../API";

const sectionsStorage = localStorage.getItem('sections') ? JSON.parse(localStorage.getItem('sections') || 'null') : null

const initialState = {
  sections: sectionsStorage,
  loading: false,
  error: null
}

export const getSections = createAsyncThunk(
  'sections/getSections',
  async (_, {dispatch}) => {
    try {
      const response = await instance.get(`${API_URL}/accounts/permission-list`)
      dispatch(setSections(response.data))
      return response.data
    } catch (e) {
      toast.error(e.message)
    }
  }
)

const sectionSlice = createSlice({
  name: 'sections',
  initialState,
  reducers: {
    setSections: (
      state, {payload}
    ) => {
      state.sections = payload
      localStorage.setItem('sections', JSON.stringify(payload))
    }
  },
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

export const {setSections} = sectionSlice.actions

export default sectionSlice.reducer