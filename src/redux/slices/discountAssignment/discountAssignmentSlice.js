import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../../API";

const initialState = {
	loading: false
}

export const createAssignment = createAsyncThunk(
	"discountAssignment/createAssignment",
	async (data) => {
		try {
			const response = await instance.post('product/discounts-assignment/', data)
			return response.data
		} catch (e) {
			return e;
		}
	}
)

export const deleteAssignment = createAsyncThunk(
	"discountAssignment/deleteAssignment",
	async ({id}) => {
		try {
			const response = await instance.delete(`product/discounts-assignment/${id}/`)
			return response.data
		} catch (e) {
			return e;
		}
	}
)

const discountAssignmentSlice = createSlice({
	name: "discountAssignment",
	initialState,
	extraReducers: builder => {
		// createAssignment
		builder
			.addCase(createAssignment.pending, (state) => {
				state.loading = true
			})
			.addCase(createAssignment.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(createAssignment.rejected, (state) => {
				state.loading = false
			})
		
		// deleteAssignment
		builder
			.addCase(deleteAssignment.pending, (state) => {
				state.loading = true
			})
			.addCase(deleteAssignment.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(deleteAssignment.rejected, (state) => {
				state.loading = false
			})
	}
})

export default discountAssignmentSlice.reducer