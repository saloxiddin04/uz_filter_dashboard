import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../../API";

const initialState = {
	loading: false,
	warehouse: null,
	productActions: null
}

export const getWarehouseStatistics = createAsyncThunk("" +
	"dashboard/getWarehouseStatistics",
	async () => {
		try {
			const response = await instance.post("dashboard/warehouse-count-statistics")
			return response.data
		} catch (e) {
			return e;
		}
	}
)

export const getProductActionStatistics = createAsyncThunk("" +
	"dashboard/getProductActionStatistics",
	async () => {
		try {
			const response = await instance.post("dashboard/product-action-statistics")
			return response.data
		} catch (e) {
			return e;
		}
	}
)

const dashboardSlice = createSlice({
	name: "dashboard",
	initialState,
	extraReducers: (builder) => {
		// getWarehouseStatistics
		builder
			.addCase(getWarehouseStatistics.pending, (state) => {
				state.loading = true
			})
			.addCase(getWarehouseStatistics.fulfilled, (state, {payload}) => {
				state.warehouse = payload
				state.loading = false
			})
			.addCase(getWarehouseStatistics.rejected, (state) => {
				state.warehouse = null
				state.loading = false
			})
		
		// getProductActionStatistics
		builder
			.addCase(getProductActionStatistics.pending, (state) => {
				state.loading = true
			})
			.addCase(getProductActionStatistics.fulfilled, (state, {payload}) => {
				state.productActions = payload
				state.loading = false
			})
			.addCase(getProductActionStatistics.rejected, (state) => {
				state.productActions = null
				state.loading = false
			})
	}
})

export default dashboardSlice.reducer