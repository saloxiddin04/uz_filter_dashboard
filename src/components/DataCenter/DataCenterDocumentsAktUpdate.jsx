import React, {useEffect, useState} from 'react';
import {Input} from "../index";
import {
	createDeviceForAktAndFaza,
	getDocumentDetail,
	getListProvider,
	patchDocument
} from "../../redux/slices/dataCenter/dataCenterSlice";
import {useStateContext} from "../../contexts/ContextProvider";
import {useDispatch, useSelector} from "react-redux";
import {TrashIcon} from "@heroicons/react/16/solid";
import instance from "../../API";
import {toast} from "react-toastify";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import moment from "moment/moment";
import {AiOutlineCloudDownload} from "react-icons/ai";

const DataCenterDocumentsAktUpdate = () => {
	const {currentColor} = useStateContext();
	const dispatch = useDispatch()
	const {id} = useParams()
	const navigate = useNavigate()
	const location = useLocation()
	
	const {listProvider, loading, documentDetail} = useSelector((state) => state.dataCenter)
	
	const [status, setStatus] = useState(undefined)
	const [description, setDescription] = useState(undefined)
	
	const [contract_number, setContractNumber] = useState(null)
	const [client, setClient] = useState(null)
	const [tin, setTin] = useState(null)
	const [rack_count, setRackCount] = useState(null)
	const [rack_quota, setRackQuota] = useState(null)
	const [unit_count, setUnitCount] = useState(null)
	const [unit_quota, setUnitQuota] = useState(null)
	const [document_number, setDocumentNumber] = useState(null)
	const [created_time, setCreatedDate] = useState(null)
	
	const [devices, setDevices] = useState([
		{
			device: "",
			device_publisher: "",
			device_model: "",
			device_number: "",
			device_type: "",
			serial_location: ''
		}
	])
	
	const [files, setFiles] = useState([{
		name: '',
		file: null,
		uploaded: false
	}])
	
	useEffect(() => {
		dispatch(getListProvider())
		dispatch(getDocumentDetail(id)).then((res) => {
			setDocumentNumber(res?.payload?.document_number)
			setContractNumber(res?.payload?.contract?.contract_number)
			setCreatedDate(moment(res?.payload?.created_time).format('DD-MM-YYYY'))
			setClient(res?.payload?.contract?.client?.full_name)
			setTin(res?.payload?.contract?.client?.pin || res?.payload?.contract?.client?.tin)
			setRackCount(res?.payload?.contract?.rack_count)
			setRackQuota(res?.payload?.contract?.rack_quota)
			setUnitQuota(res?.payload?.contract?.unit_quota)
			setUnitCount(res?.payload?.contract?.unit_count)
			setDescription(res?.payload?.description)
			setStatus(res?.payload?.status === 'Yangi' ? 1 : res?.payload?.status === 'Aktiv' ? 3 : res?.payload?.status === 'Rad etilgan' ? 4 : res?.payload?.status === 'Bekor qilingan' ? 5 : 6)
			setDocumentNumber(res?.payload?.document_number)
		})
	}, [dispatch]);
	
	useEffect(() => {
		if (location?.state?.detail) {
			dispatch(getDocumentDetail(id)).then((res) => {
				setDocumentNumber(res?.payload?.document_number)
				setContractNumber(res?.payload?.contract?.contract_number)
				setCreatedDate(moment(res?.payload?.created_time).format('DD-MM-YYYY'))
				setDescription(res?.payload?.description)
				setStatus(res?.payload?.status === 'Yangi' ? 1 : res?.payload?.status === 'Aktiv' ? 3 : res?.payload?.status === 'Rad etilgan' ? 4 : res?.payload?.status === 'Bekor qilingan' ? 5 : 6)
				
				const devicesObjects = res?.payload?.document_devices?.map((item) => ({
					device: item?.device?.id,
					device_publisher: item?.device_publisher?.id,
					device_model: item?.device_model,
					device_number: item?.device_number,
					device_type: item?.device_type === 'Cloud' ? 1 : item?.device_type === 'Bare metal' ? 2 : 3,
					serial_location: ''
				}))
				setDevices(devicesObjects)
				
				const filesObjects = res?.payload?.document_files?.map((item) => ({
					name: item?.name,
					file: item?.file,
					uploaded: true,
					url: item?.file
				}))
				setFiles(filesObjects)
			})
		}
	}, [id, dispatch, location]);
	
	const handleAdd = () => {
		const value = [...devices, {
			device: "",
			device_publisher: "",
			device_model: "",
			device_number: "",
			device_type: "",
			serial_location: ''
		}]
		setDevices(value)
	}
	
	const handleChange = (e, i) => {
		const {name, value} = e.target;
		const updateDevice = [...devices]
		updateDevice[i] = {
			...updateDevice[i],
			[name]: value
		}
		setDevices(updateDevice)
	}
	
	const handleDelete = (i) => {
		const value = [...devices]
		value.splice(i, 1)
		setDevices(value)
	}
	
	const handleAddFiles = () => {
		const value = [...files, {
			name: '',
			file: null,
			uploaded: false
		}]
		setFiles(value)
	}
	
	const changeFiles = (e, i) => {
		const {name, value} = e.target
		const updateFiles = [...files]
		if (name === 'file') {
			updateFiles[i] = {
				...updateFiles[i],
				[name]: e.target.files[0]
			}
			setFiles(updateFiles)
		} else {
			updateFiles[i] = {
				...updateFiles[i],
				[name]: value
			}
			setFiles(updateFiles)
		}
	}
	
	const uploadFile = async (i) => {
		try {
			const response = await instance.post(`/colocation/documets/list-create/files/${id}`, {
				name: files[i].name,
				file: files[i].file
			}, {
				headers: {
					'Content-type': 'multipart/form-data'
				}
			})
			if (response.data?.id) {
				const updateFiles = [...files]
				updateFiles[i].uploaded = true
				setFiles(updateFiles)
				toast.success('Muvufaqqiyatli yuklandi')
				handleAddFiles()
			}
			return response.data
		} catch (e) {
			toast.error('Xatolik')
			return e;
		}
	}
	
	const deleteFiles = i => {
		const data = [...files]
		data.splice(i, 1)
		setFiles(data)
	}
	
	const patchDocumentFunc = () => {
		dispatch(patchDocument({
			id,
			data: {status, description}
		})).then((res) => {
			if (res?.payload?.id) {
				toast.success('Muvofaqqiyatli saqlandi')
				dispatch(getDocumentDetail(id))
			}
		})
	}
	
	const validateDevices = () => {
		for (const item of devices) {
			if (location?.state?.detail || !item?.device || !item?.device_publisher || !item?.device_number || !item?.device_model || !item?.device_type) {
				return true
			}
		}
		return false
	}
	
	return (
		<>
			<div
				className="m-1 md:mx-4 md:my-8 mt-24 p-2 md:px-4 md:py-4 flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-secondary-dark-bg rounded"
			>
				<div className="w-full my-4 flex flex-wrap gap-4">
					<div className="w-full border rounded p-2 flex flex-wrap">
						<div className="w-full flex items-end gap-4">
							<div className="w-[49%] flex items-end justify-between">
								<div className="w-[80%]">
									<Input
										value={contract_number || ''}
										disabled={true}
										label={'Shartnoma raqami'}
									/>
								</div>
								<button
									className="w-1/6 px-1 py-2 rounded text-white disabled:opacity-25"
									style={{
										backgroundColor: currentColor
									}}
									disabled={true}
									// onClick={() => dispatch(getRackContractInfo({contract_number}))}
								>
									Izlash
								</button>
							</div>
							
							<div className={'flex flex-col w-[49%]'}>
								<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="status">Xolati</label>
								<select
									className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
									value={status || ''}
									onChange={(e) => setStatus(Number(e.target.value))}
									name="status"
									id="status"
								>
									<option value="0">Tanlang</option>
									<option value={1}>Yangi</option>
									<option value={3}>Aktiv</option>
									<option value={4}>Rad etilgan</option>
									<option value={5}>Bekor qilingan</option>
									<option value={6}>Yakunlangan</option>
								</select>
							</div>
						</div>
						<div className="w-full flex flex-wrap justify-between gap-4 mt-4">
							<div className={'w-[49%]'}>
								<Input
									value={client || ''}
									disabled={true}
									label={'Mijoz'}/>
							</div>
							<div className={'w-[49%]'}>
								<Input
									value={tin || ''}
									disabled={true}
									label={'STIR'}/>
							</div>
							<div className={'w-[49%]'}>
								<Input
									value={rack_count || ''}
									disabled={true}
									label={'Rack soni'}
								/>
							</div>
							<div className={'w-[49%]'}>
								<Input
									value={rack_quota || ''}
									disabled={true}
									label={"Rack qoldig'i"}/>
							</div>
							
							<div className={'w-[49%]'}>
								<Input
									value={unit_count || ''}
									disabled={true}
									label={'Unit soni'}
								/>
							</div>
							<div className={'w-[49%]'}>
								<Input
									value={unit_quota || ''}
									disabled={true}
									label={"Unit qoldig'i"}/>
							</div>
							<div className={'w-[49%]'}>
								<Input
									value={document_number || ''}
									disabled={true}
									label={'Akt raqami'}
								/>
							</div>
							<div className={'w-[49%]'}>
								<Input
									value={created_time || ''}
									disabled={true}
									type={'text'}
									label={"Akt sanasi"}
								/>
							</div>
							<div className={'flex flex-col w-full'}>
								<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="data">
									Qo'shimcha ma'lumot
								</label>
								<textarea
									value={description || ''}
									onChange={(e) => setDescription(e.target.value)}
									name="data" id="data" cols="20" rows="10" className="rounded border focus:outline-none px-2"
								/>
							</div>
						</div>
						
						<button
							className={`px-4 py-2 mt-2 rounded ml-auto text-white disabled:opacity-25`}
							style={{backgroundColor: currentColor}}
							onClick={patchDocumentFunc}
							disabled={location?.state?.detail}
							// disabled={item?.uploaded || !item?.name || !item?.file}
							// disabled={handleValidateSecond()}
							// onClick={() => uploadFile(index)}
						>
							Saqlash
						</button>
					</div>
					
					
					<div className="w-full flex flex-wrap gap-4 my-2">
						{files && files?.map((item, index) => (
							<div key={index} className="border-dashed border p-2 w-full flex flex-col gap-4">
								{!item?.uploaded && (
									<div className="w-full text-end">
										<button
											onClick={() => deleteFiles(index)}
											disabled={files.length === 1 || location?.state?.detail}
										>
											<TrashIcon
												color={currentColor}
												className="size-6 cursor-pointer"
											/>
										</button>
									</div>
								)}
								<div className={`w-full flex ${item?.url ? 'items-end' : 'items-center'} justify-between gap-4 flex-wrap`}>
									<div className={'flex flex-col w-[49%]'}>
										<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="name">Hujjat
											nomi</label>
										<input
											style={{opacity: item.uploaded ? 0.5 : 1}}
											disabled={item?.uploaded || location?.state?.detail}
											value={item?.name}
											onChange={(e) => changeFiles(e, index)}
											name="name"
											id="name"
											type="text"
											className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1 disabled:opacity-25"
										/>
									</div>
									<div className={'flex w-[49%] items-end justify-between'}>
										{!item?.url && (
											<div className="w-[85%] flex flex-col">
												<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="file">Fayl</label>
												<input
													style={{opacity: item.uploaded ? 0.5 : 1}}
													disabled={item?.uploaded || location?.state?.detail}
													onChange={(e) => changeFiles(e, index)}
													name="file"
													id="file"
													type="file"
													className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 disabled:opacity-25 border mb-1"
												/>
											</div>
										)}
										<div className="mb-1 flex items-center gap-1 ml-1">
											{item?.url ? (
												<button disabled={location?.state?.detail} className="disabled:opacity-25 rounded border-yellow-500 border p-1">
													<AiOutlineCloudDownload
														className={`size-6 text-yellow-500 hover:underline cursor-pointer mx-auto`}
														onClick={() => {
															window.open(item?.url, '_blank')
														}}
													/>
												</button>
											) : (
												<button
													className={`px-4 py-2 rounded text-white disabled:opacity-25`}
													style={{backgroundColor: currentColor}}
													disabled={item?.uploaded || !item?.name || !item?.file || location?.state?.detail}
													// disabled={handleValidateSecond()}
													onClick={() => uploadFile(index)}
												>
													Saqlash
												</button>
											)}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
					
					<div className="w-full flex flex-wrap gap-4 my-2 border rounded p-2">
						{devices && devices?.map((item, index) => (
							<div key={index} className="border-dashed border p-2 w-full flex flex-col gap-4">
								<div className="w-full text-end">
									<button
										onClick={() => handleDelete(index)}
										disabled={devices.length === 1 || location?.state?.detail}
									>
										<TrashIcon
											color={currentColor}
											className="size-6 cursor-pointer"
										/>
									</button>
								</div>
								<div className="w-full flex items-center justify-between gap-4 flex-wrap">
									<div className={'flex flex-col w-[30%]'}>
										<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="device">Qurilma
											turi</label>
										<select
											className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
											value={item?.device}
											disabled={location?.state?.detail}
											onChange={(e) => handleChange(e, index)}
											name="device"
											id="device"
										>
											<option value="0">Tanlang</option>
											{listProvider && listProvider?.device?.map((item) => (
												<option key={item?.id} value={item?.id}>{item?.name}</option>
											))}
										</select>
									</div>
									<div className={'flex flex-col w-[30%]'}>
										<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="device_publisher">Qurilma
											ishlab
											chiqaruvchisi</label>
										<select
											className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
											value={item?.device_publisher}
											onChange={(e) => handleChange(e, index)}
											name="device_publisher"
											id="device_publisher"
											disabled={location?.state?.detail}
										>
											<option value="0">Tanlang</option>
											{listProvider && listProvider?.device_publisher?.map((item) => (
												<option key={item?.id} value={item?.id}>{item?.name}</option>
											))}
										</select>
									</div>
									<div className={'flex flex-col w-[30%]'}>
										<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="device_type">Qurilma
											klassi</label>
										<select
											className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
											value={item?.device_type}
											onChange={(e) => handleChange(e, index)}
											name="device_type"
											id="device_type"
											disabled={location?.state?.detail}
										>
											<option value="0">Tanlang</option>
											<option value={1}>Cloud</option>
											<option value={2}>Bare metal</option>
											<option value={3}>Infratuzilma</option>
										</select>
									</div>
									
									<div className={'flex flex-col w-[30%]'}>
										<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="device_model">
											Qurilma modeli
										</label>
										<input
											disabled={location?.state?.detail}
											value={item?.device_model}
											onChange={(e) => handleChange(e, index)}
											name="device_model"
											id="device_model"
											type="text"
											className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
										/>
									</div>
									<div className={'flex flex-col w-[30%]'}>
										<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="device_number">
											Qurilma seriya raqami
										</label>
										<input
											disabled={location?.state?.detail}
											value={item?.device_number}
											onChange={(e) => handleChange(e, index)}
											name="device_number"
											id="device_number"
											type="text"
											className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
										/>
									</div>
									
									<div className={'flex flex-col w-[30%]'}>
										<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="serial_location">
											Qurilma joylashuvi
										</label>
										<input
											disabled={true}
											value={item?.serial_location}
											onChange={(e) => handleChange(e, index)}
											name="serial_location"
											id="serial_location"
											type="text"
											className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
										/>
									</div>
								</div>
							</div>
						))}
						
						{!location?.state?.detail && (
							<div className="w-full py-2 text-center">
								<button
									className={`px-4 py-2 rounded text-white disabled:opacity-25`}
									style={{backgroundColor: currentColor}}
									disabled={validateDevices()}
									onClick={() => handleAdd()}
								>
									Qo'shish
								</button>
							</div>
						)}
						
						<div className="w-full py-2 flex justify-between text-end">
							<button
								className={`px-4 py-2 rounded border text-white`}
								style={{color: currentColor, borderColor: currentColor}}
								// disabled={handleValidateSecond()}
								onClick={() => navigate(-1)}
							>
							Ortga
							</button>
							<button
								className={`px-4 py-2 rounded text-white disabled:opacity-25`}
								style={{backgroundColor: currentColor}}
								disabled={validateDevices() || location?.state?.detail}
								onClick={() =>
									dispatch(createDeviceForAktAndFaza({
										id,
										data: devices
									})).then((res) => {
										if (res?.meta?.requestStatus) {
											toast.success("Muvofaqqiyatli yaratildi")
										}
									})
								}
							>
								Saqlash
							</button>
						</div>
					</div>
					
				</div>
			</div>
		</>
	);
};

export default DataCenterDocumentsAktUpdate;