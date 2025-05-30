import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../../API";

const initialState = {
	loading: false,
	warehouse: null,
	productActions: null,
	addedProductActions: null,
	removedProductActions: null,
	soldProductActions: null
}

export const getWarehouseStatistics = createAsyncThunk(
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

export const getProductActionStatistics = createAsyncThunk(
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

export const getAddedProductActions = createAsyncThunk(
	"dashboard/getAddedProductActions",
	async () => {
		try {
			const response = await instance.post("dashboard/product-action-quantity-statistics", {action_type: 0})
			return response.data
		} catch (e) {
			return e;
		}
	}
)

export const getRemovedProductActions = createAsyncThunk(
	"dashboard/getRemovedProductActions",
	async () => {
		try {
			const response = await instance.post("dashboard/product-action-quantity-statistics", {action_type: 1})
			return response.data
		} catch (e) {
			return e;
		}
	}
)

export const getSolProductActions = createAsyncThunk(
	"dashboard/getSolProductActions",
	async () => {
		try {
			const response = await instance.post("dashboard/product-action-quantity-statistics", {action_type: 2})
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
		
		// getAddedProductActions
		builder
			.addCase(getAddedProductActions.pending, (state) => {
				state.loading = true
			})
			.addCase(getAddedProductActions.fulfilled, (state, {payload}) => {
				state.addedProductActions = payload
				state.loading = false
			})
			.addCase(getAddedProductActions.rejected, (state) => {
				state.addedProductActions = null
				state.loading = false
			})
		
		// getRemovedProductActions
		builder
			.addCase(getRemovedProductActions.pending, (state) => {
				state.loading = true
			})
			.addCase(getRemovedProductActions.fulfilled, (state, {payload}) => {
				state.removedProductActions = payload
				state.loading = false
			})
			.addCase(getRemovedProductActions.rejected, (state) => {
				state.removedProductActions = null
				state.loading = false
			})
		
		// getSolProductActions
		builder
			.addCase(getSolProductActions.pending, (state) => {
				state.loading = true
			})
			.addCase(getSolProductActions.fulfilled, (state, {payload}) => {
				state.soldProductActions = payload
				state.loading = false
			})
			.addCase(getSolProductActions.rejected, (state) => {
				state.soldProductActions = null
				state.loading = false
			})
	}
})

export default dashboardSlice.reducer