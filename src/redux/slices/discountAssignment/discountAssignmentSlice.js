import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../../API";

const initialState = {
	discountAssignments: null,
	discountAssignment: null,
	loading: false
}

export const getAllAssignments = createAsyncThunk(
	"discountAssignment/getAllAssignments",
	async (params) => {
		try {
			const response = await instance.get('product/discounts-assignment/', {params})
			return response.data
		} catch (e) {
			return e;
		}
	}
)

export const getAssignment = createAsyncThunk(
	"discountAssignment/getAssignment",
	async ({id}) => {
		try {
			const response = await instance.get(`product/discounts-assignment/${id}/`)
			return response.data
		} catch (e) {
			return e;
		}
	}
)

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

export const patchAssignment = createAsyncThunk(
	"discountAssignment/patchAssignment",
	async ({id, data}) => {
		try {
			const response = await instance.patch(`product/discounts-assignment/${id}/`, data)
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
		// getAllAssignments
		builder
			.addCase(getAllAssignments.pending, (state) => {
				state.loading = true
			})
			.addCase(getAllAssignments.fulfilled, (state, {payload}) => {
				state.discountAssignments = payload
				state.loading = false
			})
			.addCase(getAllAssignments.rejected, (state) => {
				state.loading = false
				state.discountAssignments = null
			})
		
		// getAssignment
		builder
			.addCase(getAssignment.pending, (state) => {
				state.loading = true
			})
			.addCase(getAssignment.fulfilled, (state, {payload}) => {
				state.discountAssignment = payload
				state.loading = false
			})
			.addCase(getAssignment.rejected, (state) => {
				state.loading = false
				state.discountAssignment = null
			})
		
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
		
		// patchAssignment
		builder
			.addCase(patchAssignment.pending, (state) => {
				state.loading = true
			})
			.addCase(patchAssignment.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(patchAssignment.rejected, (state) => {
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