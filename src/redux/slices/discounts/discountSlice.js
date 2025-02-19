import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../../API";

const initialState = {
	discounts: null,
	discount: null,
	loading: false
}

export const getAllDiscounts = createAsyncThunk(
	"discounts/getAllDiscounts",
	async (params) => {
		try {
			const response = await instance.get('product/discounts/', {params})
			return response.data
		} catch (e) {
			return e;
		}
	}
)

export const getDiscount = createAsyncThunk(
	"discounts/getDiscount",
	async ({id}) => {
		try {
			const response = await instance.get(`product/discounts/${id}/`)
			return response.data
		} catch (e) {
			return e;
		}
	}
)

export const createDiscount = createAsyncThunk(
	"discounts/createDiscount",
	async (data) => {
		try {
			const response = await instance.post('product/discounts/', data)
			return response.data
		} catch (e) {
			return e;
		}
	}
)

export const patchDiscount = createAsyncThunk(
	"discounts/patchDiscount",
	async ({data, id}) => {
		try {
			const response = await instance.patch(`product/discounts/${id}`, data)
			return response.data
		} catch (e) {
			return e;
		}
	}
)

export const deleteDiscount = createAsyncThunk(
	"discounts/deleteDiscount",
	async ({id}) => {
		try {
			const response = await instance.delete(`product/discounts/${id}/`)
			return response.data
		} catch (e) {
			return e;
		}
	}
)

const discountSlice = createSlice({
	name: "discounts",
	initialState,
	extraReducers: builder => {
		// createDiscount
		builder
			.addCase(createDiscount.pending, (state) => {
				state.loading = true
			})
			.addCase(createDiscount.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(createDiscount.rejected, (state) => {
				state.loading = false
			})
		
		// deleteDiscount
		builder
			.addCase(deleteDiscount.pending, (state) => {
				state.loading = true
			})
			.addCase(deleteDiscount.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(deleteDiscount.rejected, (state) => {
				state.loading = false
			})
		
		// patchDiscount
		builder
			.addCase(patchDiscount.pending, (state) => {
				state.loading = true
			})
			.addCase(patchDiscount.fulfilled, (state) => {
				state.loading = false
			})
			.addCase(patchDiscount.rejected, (state) => {
				state.loading = false
			})
		
		// getDiscount
		builder
			.addCase(getDiscount.pending, (state) => {
				state.loading = true
			})
			.addCase(getDiscount.fulfilled, (state, {payload}) => {
				state.discount = payload
				state.loading = false
			})
			.addCase(getDiscount.rejected, (state) => {
				state.loading = false
				state.discount = null
			})
		
		// getAllDiscounts
		builder
			.addCase(getAllDiscounts.pending, (state) => {
				state.loading = true
			})
			.addCase(getAllDiscounts.fulfilled, (state, {payload}) => {
				state.discounts = payload
				state.loading = false
			})
			.addCase(getAllDiscounts.rejected, (state) => {
				state.loading = false
				state.discounts = null
			})
	}
})

export default discountSlice.reducer