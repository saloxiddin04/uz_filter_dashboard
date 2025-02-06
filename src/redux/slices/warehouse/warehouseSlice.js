import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../../API";

const initialState = {
  loading: false,
  warehouses: null,
  warehouse: null,
  productsForWarehouse: null
}

export const getAllWarehouses = createAsyncThunk(
  "warehouse/getAllWarehouses",
  async () => {
    try {
      const response = await instance.get('warehouse/')
      return response.data
    } catch (e) {
      return e;
    }
  }
)

export const getWarehouse = createAsyncThunk(
  "warehouse/getWarehouse",
  async (id) => {
    try {
      const response = await instance.get(`warehouse/${id}`)
      return response.data
    } catch (e) {
      return e;
    }
  }
)

export const createWarehouse = createAsyncThunk(
  "warehouse/createWarehouse",
  async (data) => {
    try {
      const response = await instance.post("warehouse/", data)
      return response.data
    } catch (e) {
      return e;
    }
  }
)

export const updateWarehouse = createAsyncThunk(
  "warehouse/updateWarehouse",
  async (data) => {
    try {
      const response = await instance.patch(`warehouse/${data.id}`, data.data)
      return response.data
    } catch (e) {
      return e;
    }
  },
)

export const getProductsForWarehouse = createAsyncThunk(
  "warehouse/productsForWarehouse",
  async ({ warehouse_id, filters }) => {
    try {
      const response = await instance.get(`warehouse/list-products-warehouse/${warehouse_id}`, {params: filters})
      return response.data
    } catch (e) {
      return e;
    }
  }
)

export const addProductWarehouse = createAsyncThunk(
  "warehouse/addProductWarehouse",
  async (data) => {
    try {
      const response = await instance.post('warehouse/add-products-to-warehouse', data)
      return response.data
    } catch (e) {
      return e;
    }
  }
)

const warehouseSlice = createSlice({
  name: "warehouse",
  initialState,
  extraReducers: builder => {
    // getAllWarehouses
    builder
      .addCase(getAllWarehouses.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllWarehouses.fulfilled, (state, {payload}) => {
        state.warehouses = payload
        state.loading = false
      })
      .addCase(getAllWarehouses.rejected, (state) => {
        state.loading = false
        state.warehouses = null
      })
    
    // getWarehouse
    builder
      .addCase(getWarehouse.pending, state => {
        state.loading = true
      })
      .addCase(getWarehouse.fulfilled, (state, {payload}) => {
        state.warehouse = payload
        state.loading = false
      })
      .addCase(getWarehouse.rejected, (state) => {
        state.loading = false
        state.warehouse = null
      })
    
    // updateWarehouse
    builder
      .addCase(updateWarehouse.pending, (state) => {
        state.loading = true
      })
      .addCase(updateWarehouse.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateWarehouse.rejected, (state) => {
        state.loading = false
      })
    
    // createWarehouse
    builder
      .addCase(createWarehouse.pending, (state) => {
        state.loading = true
      })
      .addCase(createWarehouse.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(createWarehouse.rejected, (state) => {
        state.loading = false
      })
    
    // addProductWarehouse
    builder
      .addCase(addProductWarehouse.pending, (state) => {
        state.loading = true
      })
      .addCase(addProductWarehouse.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(addProductWarehouse.rejected, (state) => {
        state.loading = false
      })
    
    // productsForWarehouse
    builder
      .addCase(getProductsForWarehouse.pending, (state) => {
        state.loading = true
      })
      .addCase(getProductsForWarehouse.fulfilled, (state, {payload}) => {
        state.productsForWarehouse = payload
        state.loading = false
      })
      .addCase(getProductsForWarehouse.rejected, (state) => {
        state.productsForWarehouse = null
        state.loading = false
      })
  }
})

export default warehouseSlice.reducer