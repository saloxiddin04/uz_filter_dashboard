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
  unitContractInfo: null,
  rackContractInfo: null,
  updateRack: null,
  admissionLetter: null,
  admissionEmployee: null,
  admissionLetterDetail: null,
  aktAndFaza: null,
  contractData: null,
  documentDetail: null,
  techHelp: null,
  techHelpDetail: null,
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
      const response = await instance.post(`/colocation/add/${data.data_center_id}/rack/${data.rack_id}`, data.data)
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
      const response = await instance.post(`/colocation/contract-get/unit`, data)
      return response.data?.data
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

export const getRackContractInfo = createAsyncThunk(
  "dataCenter/getRackContractInfo",
  async (params) => {
    try {
      const response = await instance.get('/colocation/contract-get/rack', {params})
      if (response?.data?.success) {
        return response.data?.data
      } else if (!response?.response?.data?.success) {
        toast.error(response?.response?.data?.err_msg)
      }
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

export const getAdmissionLetters = createAsyncThunk(
  "dataCenter/getAdmissionLetters",
  async () => {
    try {
      const response = await instance.get('/dispatcher/admission-employee-letters')
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const getAdmissionSearch = createAsyncThunk(
  "dataCenter/getAdmissionSearch",
  async (params) => {
    try {
      const response = await instance.get('/dispatcher/admission-search', {params})
      return response.data
    } catch (e) {
      return e.message
    }
  }
)

export const createAdmission = createAsyncThunk(
  "dataCenter/createAdmission",
  async (data) => {
    try {
      return await instance.post('/dispatcher/admission-employee-letters', data, {
        headers: { "Content-type": 'multipart/form-data' }
      })
    } catch (e) {
      return e.message
    }
  }
)

export const deleteAdmission = createAsyncThunk(
  "dataCenter/deleteAdmission",
  async (id, {dispatch}) => {
    try {
      toast.success("Muvofaqqiyatli o'chirildi")
      return await instance.delete(`/dispatcher/admission-employee-letters/${id}`)
    } catch (e) {
      return e.message
    }
  }
)

export const getAdmissionDetail = createAsyncThunk(
  "dataCenter/getAdmissionDetail",
  async (id) => {
    try {
      const response = await instance.get(`/dispatcher/admission-employee-letters/${id}`)
      return response.data
    } catch (e) {
      return e
    }
  }
)

export const createAktAndFaza = createAsyncThunk(
  "dataCenter/createAktAndFaza",
  async (data) => {
    try {
      const response = await  instance.post('/colocation/documets/list-create', data)
      return response.data
    } catch (e) {
      return e
    }
  }
)

export const getListAktAndFaza = createAsyncThunk(
  "dataCenter/getListAktAndFaza",
  async (params) => {
    try {
      const response = await instance.get('/colocation/documets/list-create', {params})
      return response.data
    } catch (e) {
      return e
    }
  }
)

export const getContractData = createAsyncThunk(
  "dataCenter/getContractData",
  async (params) => {
    try {
      const response = await instance.get('/colocation/get-contract', {params})
      return response.data
    } catch (e) {
      return e
    }
  }
)

export const createDeviceForAktAndFaza = createAsyncThunk(
  "dataCenter/createDeviceForAktAndFaza",
  async (data) => {
    try {
      const response = await instance.post(`/colocation/documets/list-create/devices/${data?.id}`, data?.data)
      return response.data
    } catch (e) {
      return e
    }
  }
)

export const getDocumentDetail = createAsyncThunk(
  "dataCenter/getDocumentDetail",
  async (id) => {
    try {
      const response = await instance.get(`/colocation/documets/detail/${id}`)
      return response.data
    } catch (e) {
      return e;
    }
  }
)

export const patchDocument = createAsyncThunk(
  "dataCenter/patchDocument",
  async (data) => {
    try {
      const response = await instance.patch(`/colocation/documets/update/${data.id}`, data.data)
      return response.data
    } catch (e) {
      return e;
    }
  }
)

export const getTechHelp = createAsyncThunk(
  "dataCenter/TechHelp",
  async () => {
    try {
      const response = await instance.get('/purchase-note/purchase-note')
      return response.data
    } catch (e) {
      return e;
    }
  }
)

export const createTechHelp = createAsyncThunk(
  "dataCenter/createTechHelp",
  async (data) => {
    try {
      const response = await instance.post('/purchase-note/purchase-note', data)
      return response.data
    } catch (e) {
      return e;
    }
  }
)

export const getTechHelpDetail = createAsyncThunk(
  "dataCenter/getTechHelpDetail",
  async (params) => {
    try {
      const response = await instance.get(`/purchase-note/purchase-note-detail/${params}`)
      return response.data
    } catch (e) {
      return e;
    }
  }
)

export const createTechHelpFile = createAsyncThunk(
  "dataCenter/createTechHelpFile",
  async (data) => {
    try {
      const response = await instance.post('/purchase-note/purchase-note-files', data, {
        headers: { "Content-type": 'multipart/form-data' }
      })
      return response.data
    } catch (e) {
      return e;
    }
  }
)

const dataCenterSlice = createSlice({
  name: "dataCenter",
  initialState,
  reducers: {
    clearDataCenter: () => initialState,
    clearLetterDetail: (state) => {
      state.admissionLetterDetail = null
      state.dataCenterList = null
    },
    clearContractData: (state) => {
      state.contractData = null
    }
  },
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

    // getListProvider
    builder.addCase(getListProvider.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getListProvider.fulfilled, (state, {payload}) => {
      state.loading = false
      state.listProvider = payload
    })
    builder.addCase(getListProvider.rejected, (state, {payload}) => {
      state.loading = false
      state.error = payload
      state.listProvider = null
    })

    // getDeviceDetail
    builder.addCase(getDeviceDetail.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getDeviceDetail.fulfilled, (state, {payload}) => {
      state.loading = false
      state.deviceDetail = payload
    })
    builder.addCase(getDeviceDetail.rejected, (state, {payload}) => {
      state.loading = false
      state.error = payload
      state.deviceDetail = null
    })

    // getRackContractDetail
    builder.addCase(getRackContractDetail.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getRackContractDetail.fulfilled, (state, {payload}) => {
      state.loading = false
      state.rack_contract_detail = payload
    })
    builder.addCase(getRackContractDetail.rejected, (state, {payload}) => {
      state.loading = false
      state.error = payload
      state.rack_contract_detail = null
    })

    // getRackContractInfo
    builder.addCase(getRackContractInfo.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getRackContractInfo.fulfilled, (state, {payload}) => {
      state.loading = false
      state.rackContractInfo = payload
    })
    builder.addCase(getRackContractInfo.rejected, (state, {payload}) => {
      state.loading = false
      state.error = payload
      state.rack_contract_detail = null
    })

    // createUnit
    builder.addCase(createUnit.pending, (state) => {
      state.loading = true
    })
    builder.addCase(createUnit.fulfilled, (state, {payload}) => {
      state.loading = false
      state.updateRack = payload
    })
    builder.addCase(createUnit.rejected, (state, {payload}) => {
      state.loading = false
      state.error = payload
      state.updateRack = null
    })

    // getAdmissionLetters
    builder.addCase(getAdmissionLetters.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getAdmissionLetters.fulfilled, (state, {payload}) => {
      state.loading = false
      state.admissionLetter = payload
    })
    builder.addCase(getAdmissionLetters.rejected, (state, {payload}) => {
      state.loading = false
      state.error = payload
      state.admissionLetter = null
    })

    // createAdmission
    builder.addCase(createAdmission.pending, (state) => {
      state.loading = true
    })
    builder.addCase(createAdmission.fulfilled, (state, {payload}) => {
      state.loading = false
    })
    builder.addCase(createAdmission.rejected, (state, {payload}) => {
      state.loading = false
      state.error = payload
    })

    // getAdmissionSearch
    builder.addCase(getAdmissionSearch.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getAdmissionSearch.fulfilled, (state, {payload}) => {
      state.loading = false
      if (typeof payload !== "string") {
        state.admissionLetter = payload
      } else {
        toast.error("Dopusk topilmadi!")
      }
    })
    builder.addCase(getAdmissionSearch.rejected, (state, {payload}) => {
      state.loading = false
      state.error = payload
      state.admissionLetter = null
    })
    
    // getAdmissionDetail
    builder.addCase(getAdmissionDetail.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getAdmissionDetail.fulfilled, (state, {payload}) => {
      state.loading = false
      state.admissionLetterDetail = payload
    })
    builder.addCase(getAdmissionDetail.rejected, (state, {payload}) => {
      state.loading = false
      state.error = payload
      state.admissionLetterDetail = null
    })

    // createAktAndFaza
    builder.addCase(createAktAndFaza.pending, (state) => {
      state.loading = true
    })
    builder.addCase(createAktAndFaza.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(createAktAndFaza.rejected, (state) => {
      state.loading = false
    })
    
    // getListAktAndFaza
    builder.addCase(getListAktAndFaza.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getListAktAndFaza.fulfilled, (state, {payload}) => {
      state.aktAndFaza = payload
      state.loading = false
    })
    builder.addCase(getListAktAndFaza.rejected, (state) => {
      state.loading = false
      state.aktAndFaza = null
    })
    
    // getContractData
    builder.addCase(getContractData.pending, (state) => {
      // state.loading  = true
    })
    builder.addCase(getContractData.fulfilled, (state, {payload}) => {
      state.contractData = payload
      state.loading = false
    })
    builder.addCase(getContractData.rejected, (state) => {
      state.loading = false
      state.contractData = null
    })
    
    // createDeviceForAktAndFaza
    builder.addCase(createDeviceForAktAndFaza.pending, (state) => { state.loading = true })
    builder.addCase(createDeviceForAktAndFaza.fulfilled, (state) => { state.loading = false })
    builder.addCase(createDeviceForAktAndFaza.rejected, (state) => { state.loading = false })
    
    // getDocumentDetail
    builder.addCase(getDocumentDetail.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getDocumentDetail.fulfilled, (state, {payload}) => {
      state.loading = false
      state.documentDetail = payload
    })
    builder.addCase(getDocumentDetail.rejected, (state) => {
      state.loading = false
      state.documentDetail = null
    })
    
    // patchDocument
    builder.addCase(patchDocument.pending, (state) => {
      state.loading = true
    })
    builder.addCase(patchDocument.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(patchDocument.rejected, (state) => {
      state.loading = false
    })
    
    // getTechHelp
    builder.addCase(getTechHelp.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getTechHelp.fulfilled, (state, {payload}) => {
      state.techHelp = payload
      state.loading = false
    })
    builder.addCase(getTechHelp.rejected, (state) => {
      state.techHelp = null
      state.loading = false
    })
    
    // createTechHelp
    builder.addCase(createTechHelp.pending, (state) => {
      state.loading = true
    })
    builder.addCase(createTechHelp.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(createTechHelp.rejected, (state) => {
      state.loading = false
    })
    
    // getTechHelpDetail
    builder.addCase(getTechHelpDetail.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getTechHelpDetail.fulfilled, (state, {payload}) => {
      state.techHelpDetail = payload
      state.loading = false
    })
    builder.addCase(getTechHelpDetail.rejected, (state, {payload}) => {
      state.loading = false
      state.techHelpDetail = null
    })
    
    // createTechHelpFile
    builder.addCase(createTechHelpFile.pending, (state) => {
      state.loading = true
    })
    builder.addCase(createTechHelpFile.fulfilled, (state, {payload}) => {
      state.loading = false
    })
    builder.addCase(createTechHelpFile.rejected, (state, {payload}) => {
      state.loading = false
    })
  }
})

export const {clearDataCenter, clearLetterDetail, clearContractData} = dataCenterSlice.actions
export default dataCenterSlice.reducer;