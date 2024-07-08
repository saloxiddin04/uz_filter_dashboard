import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {api_url} from "../../../config";
import {toast} from "react-toastify";
import instance from "../../../API";

const sidebarStorage = localStorage.getItem('sidebar') ? JSON.parse(localStorage.getItem('sidebar') || 'null') : null

const initialState = {
  sidebar: sidebarStorage,
  loading: false,
  error: null
}

export const getSidebar = createAsyncThunk(
  'sections/getSidebar',
  async (_, {dispatch}) => {
    try {
      const response = await instance.get(`${api_url}/accounts/sidebar`)
      dispatch(setSidebar(response.data))
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
    setSidebar: (
      state, {payload}
    ) => {
      state.sections = payload
      localStorage.setItem('sidebar', JSON.stringify(payload))
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getSidebar.pending, (state, _) => {
      state.loading = true
    })
    builder.addCase(getSidebar.fulfilled, (state, {payload}) => {
      state.sidebar = payload
      state.loading = false
    })
    builder.addCase(getSidebar.rejected, (state, {payload}) => {
      state.loading = false
      state.error = payload
    })
  }
})

export const {setSidebar} = sectionSlice.actions

export default sectionSlice.reducer