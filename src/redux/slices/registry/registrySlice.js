import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import instance from "../../../API";

const initialState = {
  loading: false,
  services: null,
  registries: null,
  register_detail: null,
  employee: null,
  employees: null,
  contracts: null
}

export const getServices = createAsyncThunk(
  "registry/getServices",
  async () => {
    try {
      const response = await instance.get('/contracts/services')
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const getRegistries = createAsyncThunk(
  "registry/getRegistries",
  async (params) => {
    try {
      const response = await instance.get(`/registry-book/registry/${params?.id}`, {params})
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const getRegistryDetail = createAsyncThunk(
  "registry/getRegistryDetail",
  async (id) => {
    try {
      const response = await instance.get(`/registry-book/registry-book/${id}`)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const getEmployeeUsers = createAsyncThunk(
  "registry/getEmployeeUsers",
  async () => {
    try {
      const response = await instance.get('/accounts/employee-users')
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const getContractsForRegistry = createAsyncThunk(
  "registry/getContractsForRegistry",
  async (data) => {
    try {
      const response = await instance.post('/registry-book/registry', data)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const postEmployees = createAsyncThunk(
  "registry/postEmployees",
  async (data) => {
    try {
      const response = await instance.post('/accounts/employee-users', data)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const postRegistry = createAsyncThunk(
  "registry/postRegistry",
  async (data) => {
    try {
      const response = await instance.post('/registry-book/create-registry', data)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

const RegistrySlice = createSlice({
  name: "registry",
  initialState,
  reducers: {
    clearRegistryStates: () => initialState,
    clearEmployees: (state) => {
      state.employees = null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getServices.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getServices.fulfilled, (state, {payload}) => {
      state.services = payload
      state.loading = false
    })
    builder.addCase(getServices.rejected, (state, {payload}) => {
      state.error = payload
      state.loading = false
      state.services = null
    })

    // getRegistries
    builder.addCase(getRegistries.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getRegistries.fulfilled, (state, {payload}) => {
      state.registries = payload
      state.loading = false
    })
    builder.addCase(getRegistries.rejected, (state, {payload}) => {
      state.error = payload
      state.loading = false
      state.registries = null
    })

    // getRegistryDetail
    builder.addCase(getRegistryDetail.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getRegistryDetail.fulfilled, (state, {payload}) => {
      state.register_detail = payload
      state.loading = false
    })
    builder.addCase(getRegistryDetail.rejected, (state, {payload}) => {
      state.error = payload
      state.loading = false
      state.register_detail = null
    })

    // getEmployeeUsers
    builder.addCase(getEmployeeUsers.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getEmployeeUsers.fulfilled, (state, {payload}) => {
      state.employee = payload
      state.loading = false
    })
    builder.addCase(getEmployeeUsers.rejected, (state, {payload}) => {
      state.error = payload
      state.loading = false
      state.employee = null
    })

    // getContractsForRegistry
    builder.addCase(getContractsForRegistry.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getContractsForRegistry.fulfilled, (state, {payload}) => {
      state.contracts = payload
      state.loading = false
    })
    builder.addCase(getContractsForRegistry.rejected, (state, {payload}) => {
      state.error = payload
      state.loading = false
      state.contracts = null
    })

    // postEmployees
    builder.addCase(postEmployees.pending, (state) => {
      state.loading = true
    })
    builder.addCase(postEmployees.fulfilled, (state, {payload}) => {
      state.employees = payload
      state.loading = false
    })
    builder.addCase(postEmployees.rejected, (state, {payload}) => {
      state.error = payload
      state.loading = false
      state.employees = null
    })

    // postRegistry
    builder.addCase(postRegistry.pending, (state) => {
      state.loading = true
    })
    builder.addCase(postRegistry.fulfilled, (state, {payload}) => {
      state.registries = payload
      state.loading = false
    })
    builder.addCase(postRegistry.rejected, (state, {payload}) => {
      state.error = payload
      state.loading = false
      state.registries = null
    })
  }
})

export const {clearRegistryStates, clearEmployees} = RegistrySlice.actions
export default RegistrySlice.reducer