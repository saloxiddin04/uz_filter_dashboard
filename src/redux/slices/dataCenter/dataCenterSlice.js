import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {toast} from "react-toastify";
import instance from "../../../API";

const initialState = {
  loading: false,
  get_info: null,
  dataCenterList: null,
  dataCenterListDetail: null,
  rack_detail: null,
  listProvider: null,
  rack_contract_detail: null,
  deviceDetail: null,
  contractInfo: null,
  unitContractInfo: null
}

export const getDataCenterList = createAsyncThunk(
  "dataCenter/getDataCenterList",
  async () => {
    try {
      const response = await instance.get('/colocation/list/data-center')
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const getDataCenterListDetail = createAsyncThunk(
  "dataCenter/getDataCenterListDetail",
  async (id) => {
    try {
      const response = await instance.get(`/colocation/detail/data-center/${id}`)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const getServiceInfo = createAsyncThunk(
  "dataCenter/getServiceInfo",
  async () => {
    try {
      const response = await instance.get('/services/get-info')
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const getRackDetail = createAsyncThunk(
  "dataCenter/getRackDetail",
  async (id) => {
    try {
      const response = await instance.get(`/colocation/detail/rack/${id}`)
      return response.data?.data
    } catch (e) {
      return e.message
    }
  }
)

export const getListProvider = createAsyncThunk(
  "dataCenter/getListProvider",
  async () => {
    try {
      const response = await instance.get('/colocation/list/data-center-utils')
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const createDevice = createAsyncThunk(
  "dataCenter/createDevice",
  async (data) => {
    try {
      const response = await instance.post('/colocation/add/unit/device', data)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const getDeviceDetail = createAsyncThunk(
  "dataCenter/getDeviceDetail",
  async (id) => {
    try {
      const response = await instance.get(`/colocation/contract-get/unit/${id}`)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const createUnit = createAsyncThunk(
  "dataCenter/createUnit",
  async (data) => {
    try {
      const response = await instance.post('/colocation/add/unit', data)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const addRack = createAsyncThunk(
  "dataCenter/addRack",
  async (data) => {
    try {
      const response = await instance.post(`/colocation/add/${data.data_center_id}/rack/${data.rack_id}`, data)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const getRackContractDetail = createAsyncThunk(
  "dataCenter/getRackContractDetail",
  async (id) => {
    try {
      const response = await instance.get(`/colocation/contract-get/rack/${id}`)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const getUnitContractInfo = createAsyncThunk(
  "dataCenter/getUnitContractInfo",
  async (data) => {
    try {
      const response = await instance.post(`/colocation/contract-get/unit`, {data})
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const getContractInfo = createAsyncThunk(
  "dataCenter/getContractInfo",
  async (data) => {
    try {
      const response = await instance.get(`/contracts/rack-contract-with-number?contract_number=${data.contract_number}&rack_id=${data.rack_id}`)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const deleteDevice = createAsyncThunk(
  "dataCenter/deleteDevice",
  async (data) => {
    try {
      const response = await instance.delete(`/colocation/remove/${data.slug}/${data.id}`)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const patchDeviceGeneral = createAsyncThunk(
  "dataCenter/patchDeviceGeneral",
  async (params) => {
    try {
      const response = await instance.patch(`/colocation/update/device/general/config/${params.id}`, params.data)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const patchDeviceConfig = createAsyncThunk(
  "dataCenter/patchDeviceConfig",
  async (params) => {
    try {
      const response = await instance.patch(`/colocation/update/device/config/${params.id}`, params.data)
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

const dataCenterSlice = createSlice({
  name: "dataCenter",
  initialState,
  extraReducers: (builder) => {
    // getDataCenterList
    builder.addCase(getDataCenterList.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getDataCenterList.fulfilled, (state, {payload}) => {
      state.loading = false
      state.dataCenterList = payload
    })
    builder.addCase(getDataCenterList.rejected, (state, {payload}) => {
      state.loading = false
      state.dataCenterList = null
      state.error = payload
    })

    // getDataCenterListDetail
    builder.addCase(getDataCenterListDetail.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getDataCenterListDetail.fulfilled, (state, {payload}) => {
      state.loading = false
      state.dataCenterListDetail = payload
    })
    builder.addCase(getDataCenterListDetail.rejected, (state, {payload}) => {
      state.loading = false
      state.dataCenterListDetail = null
      state.error = payload
    })

    // getRackDetail
    builder.addCase(getRackDetail.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getRackDetail.fulfilled, (state, {payload}) => {
      state.loading = false
      state.rack_detail = payload
    })
    builder.addCase(getRackDetail.rejected, (state, {payload}) => {
      state.loading = false
      state.rack_detail = null
      state.error = payload
    })

    // getUnitContractInfo
    builder.addCase(getUnitContractInfo.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getUnitContractInfo.fulfilled, (state, {payload}) => {
      state.loading = false
      state.unitContractInfo = payload
    })
    builder.addCase(getUnitContractInfo.rejected, (state, {payload}) => {
      state.loading = false
      state.error = payload
      state.unitContractInfo = null
    })

    // getContractInfo
    builder.addCase(getContractInfo.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getContractInfo.fulfilled, (state, {payload}) => {
      state.loading = false
      state.contractInfo = payload
    })
    builder.addCase(getContractInfo.rejected, (state, {payload}) => {
      state.loading = false
      state.error = payload
      state.contractInfo = null
    })

  }
})

export default dataCenterSlice.reducer;