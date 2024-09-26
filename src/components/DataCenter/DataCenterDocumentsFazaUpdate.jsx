import React, {useEffect, useState} from 'react';
import {TrashIcon} from "@heroicons/react/16/solid";
import {useStateContext} from "../../contexts/ContextProvider";
import {useDispatch, useSelector} from "react-redux";
import {getListProvider} from "../../redux/slices/dataCenter/dataCenterSlice";

const DataCenterDocumentsFazaUpdate = () => {
	const {currentColor} = useStateContext();
	const dispatch = useDispatch()
	
	const {listProvider, loading} = useSelector((state) => state.dataCenter)
	
	const [devices, setDevices] = useState([
		{
			type: '',
			device_publisher: '',
			device_class: '',
			model: '',
			serial_number: '',
			serial_location: ''
		}
	])
	
	useEffect(() => {
		dispatch(getListProvider())
	}, [dispatch]);
	
	const handleAdd = () => {
		const value = [...devices, {
			type: '',
			device_publisher: '',
			device_class: '',
			model: '',
			serial_number: '',
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
									<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="type">Qurilma turi</label>
									<select
										className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
										value={item?.type}
										onChange={(e) => handleChange(e, index)}
										name="type"
										id="type"
									>
										<option value="0">Tanlang</option>
										{listProvider && listProvider?.device?.map((item) => (
											<option key={item?.id} value={item?.id}>{item?.name}</option>
										))}
									</select>
								</div>
								<div className={'flex flex-col w-[30%]'}>
									<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="publisher">Qurilma ishlab
										chiqaruvchisi</label>
									<select
										className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
										value={item?.device_publisher}
										onChange={(e) => handleChange(e, index)}
										name="publisher"
										id="publisher"
									>
										<option value="0">Tanlang</option>
										{listProvider && listProvider?.device_publisher?.map((item) => (
											<option key={item?.id} value={item?.id}>{item?.name}</option>
										))}
									</select>
								</div>
								<div className={'flex flex-col w-[30%]'}>
									<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="device_class">Qurilma
										klassi</label>
									<select
										className={'w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1'}
										value={item?.device_class}
										onChange={(e) => handleChange(e, index)}
										name="device_class"
										id="device_class"
									>
										<option value="0">Tanlang</option>
										<option value="1">Cloud</option>
										<option value="2">Bare metal</option>
									</select>
								</div>
								
								<div className={'flex flex-col w-[30%]'}>
									<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="model">
										Qurilma modeli
									</label>
									<input
										value={item?.model}
										onChange={(e) => handleChange(e, index)}
										name='model'
										id="model"
										type="text"
										className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
									/>
								</div>
								<div className={'flex flex-col w-[30%]'}>
									<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="serial_number">
										Qurilma seriya raqami
									</label>
									<input
										value={item?.serial_number}
										onChange={(e) => handleChange(e, index)}
										name='serial_number'
										id="serial_number"
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
										name='serial_location'
										id="serial_location"
										type="text"
										className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
									/>
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
						onClick={() => handleAdd()}
					>
						Qo'shish
					</button>
				</div>
			</div>
		</>
	);
};

export default DataCenterDocumentsFazaUpdate;