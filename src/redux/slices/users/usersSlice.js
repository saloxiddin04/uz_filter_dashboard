import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../../API";

const initialState = {
  loading: false,
  users: null
}

export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async (params) => {
    try {
      const response = await instance.get('user/list-employees', {params})
      return response.data
    } catch (e) {
      return e;
    }
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState,
  extraReducers: builder => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllUsers.fulfilled, (state, {payload}) => {
        state.users = payload
        state.loading = false
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.loading = false
        state.users = null
      })
  }
})

export default usersSlice.reducer