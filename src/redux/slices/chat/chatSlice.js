import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../../API";

const initialState = {
	loading: false,
	rooms: null,
	room_detail: null
}

export const getRooms = createAsyncThunk(
	'chat/getRooms',
	async (params) => {
		try {
			const response = await instance.get(`/chat/rooms`, {params})
			return response.data
		} catch (e) {
			return e
		}
	}
)

const chatSlice = createSlice({
	name: 'chat',
	initialState,
	extraReducers: (builder) => {
		builder.addCase(getRooms.pending, (state) => {
			state.loading = true
		})
		builder.addCase(getRooms.fulfilled, (state, {payload}) => {
			state.rooms = payload
			state.loading = false
		})
		builder.addCase(getRooms.rejected, (state) => {
			state.loading = false
			state.rooms = null
		})
	}
})

export default chatSlice.reducer