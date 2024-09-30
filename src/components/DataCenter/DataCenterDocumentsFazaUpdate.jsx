import React, {useEffect, useState} from 'react';
import {TrashIcon} from "@heroicons/react/16/solid";
import {useStateContext} from "../../contexts/ContextProvider";
import {useDispatch, useSelector} from "react-redux";
import {
	createDeviceForAktAndFaza,
	getDocumentDetail,
	getListProvider
} from "../../redux/slices/dataCenter/dataCenterSlice";
import instance from "../../API";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";

const DataCenterDocumentsFazaUpdate = () => {
	const {currentColor} = useStateContext();
	const dispatch = useDispatch()
	const {id} = useParams()
	const navigate = useNavigate()
	
	const location = useLocation()
	
	console.log(location?.state?.detail)
	
	const {listProvider, loading} = useSelector((state) => state.dataCenter)
	
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
	}, [dispatch]);
	
	useEffect(() => {
		if (location?.state?.detail) {
			dispatch(getDocumentDetail(id))
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
	
	const handleChange = (e, i) => {
		const {name, value} = e.target;
		const updateDevice = [...devices]
		if (name === 'device_type') {
			updateDevice[i] = {
				...updateDevice[i],
				[name]: Number(value)
			}
			setDevices(updateDevice)
		} else {
			updateDevice[i] = {
				...updateDevice[i],
				[name]: value
			}
			setDevices(updateDevice)
		}
	}
	
	const handleDelete = (i) => {
		const value = [...devices]
		value.splice(i, 1)
		setDevices(value)
	}
	
	const validateDevices = () => {
		for (const item of devices) {
			if (!item?.device || !item?.device_publisher || !item?.device_number || !item?.device_model || !item?.device_type) {
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
				<div className="w-full flex justify-between flex-wrap">
					<div className={'flex flex-col w-[30%]'}>
						<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="name">
							Nomi
						</label>
						<input
							// value={item?.serial_location}
							// onChange={(e) => handleChange(e, index)}
							name="name"
							id="name"
							type="text"
							className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
						/>
					</div>
					
					<div className={'flex flex-col w-[30%]'}>
						<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="name">
							Shartnoma sanasi
						</label>
						<input
							// value={item?.serial_location}
							// onChange={(e) => handleChange(e, index)}
							name="name"
							id="name"
							type="date"
							className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
						/>
					</div>
					
					<div className={'flex flex-col w-[30%]'}>
						<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="status">Xolati</label>
						<select
							className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
							// value={item?.device_class}
							// onChange={(e) => handleChange(e, index)}
							name="status"
							id="status"
						>
							<option value="0">Tanlang</option>
							<option value="1">Aktiv</option>
							<option value="2">Bekor qilingan</option>
						</select>
					</div>
					
					<div className={'flex flex-col w-full'}>
						<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="data">
							Qo'shimcha ma'lumot
						</label>
						<textarea name="data" id="data" cols="20" rows="10" className="rounded border focus:outline-none px-2"/>
					</div>
				</div>
				
				<div className="w-full flex flex-wrap gap-4 my-2">
					{files && files?.map((item, index) => (
						<div key={index} className="border-dashed border p-2 w-full flex flex-col gap-4">
							{!item?.uploaded && (
								<div className="w-full text-end">
									<button
										onClick={() => deleteFiles(index)}
										disabled={files.length === 1}
									>
										<TrashIcon
											color={currentColor}
											className="size-6 cursor-pointer"
										/>
									</button>
								</div>
							)}
							<div className="w-full flex items-center justify-between gap-4 flex-wrap">
								<div className={'flex flex-col w-[49%]'}>
									<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="name">Hujjat nomi</label>
									<input
										style={{opacity: item.uploaded ? 0.5 : 1}}
										disabled={item?.uploaded}
										value={item?.name}
										onChange={(e) => changeFiles(e, index)}
										name="name"
										id="name"
										type="text"
										className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1 disabled:opacity-25"
									/>
								</div>
								<div className={'flex w-[49%] items-end justify-between'}>
									<div className="w-[85%] flex flex-col">
										<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="file">Fayl</label>
										<input
											style={{opacity: item.uploaded ? 0.5 : 1}}
											disabled={item?.uploaded}
											onChange={(e) => changeFiles(e, index)}
											name="file"
											id="file"
											type="file"
											className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 disabled:opacity-25 border mb-1"
										/>
									</div>
									<button
										className={`px-4 py-2 rounded text-white disabled:opacity-25`}
										style={{backgroundColor: currentColor}}
										disabled={item?.uploaded || !item?.name || !item?.file}
										// disabled={handleValidateSecond()}
										onClick={() => uploadFile(index)}
									>
										Saqlash
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
				
				<div className="w-full py-2 text-center">
					<button
						className={`px-4 py-2 rounded text-white`}
						style={{backgroundColor: currentColor}}
						// disabled={handleValidateSecond()}
						onClick={() => handleAddFiles()}
					>
						Qo'shish
					</button>
				</div>
				
				<div className="w-full flex flex-wrap gap-4 my-2 border rounded p-2">
					{devices && devices?.map((item, index) => (
						<div key={index} className="border-dashed border p-2 w-full flex flex-col gap-4">
							<div className="w-full text-end">
								<button
									onClick={() => handleDelete(index)}
									disabled={devices.length === 1}
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
					
					<div className="w-full py-2 flex justify-between text-end">
						<button
							className={`px-4 py-2 rounded border text-white`}
							style={{color: currentColor, borderColor: currentColor}}
							// disabled={handleValidateSecond()}
							onClick={() => navigate(-1)}
						>
							Bekor qilish
						</button>
						<button
							className={`px-4 py-2 rounded text-white disabled:opacity-25`}
							style={{backgroundColor: currentColor}}
							disabled={validateDevices()}
							onClick={() =>
									dispatch(createDeviceForAktAndFaza({
									id,
									data: devices
								})).then((res) => {
									if(res?.meta?.requestStatus){
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
		</>
	);
};

export default DataCenterDocumentsFazaUpdate;