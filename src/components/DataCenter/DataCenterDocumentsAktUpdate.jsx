import React, {useEffect, useState} from 'react';
import {Input} from "../index";
import {getListProvider, getRackContractInfo} from "../../redux/slices/dataCenter/dataCenterSlice";
import {useStateContext} from "../../contexts/ContextProvider";
import {useDispatch, useSelector} from "react-redux";
import {TrashIcon} from "@heroicons/react/16/solid";

const DataCenterDocumentsAktUpdate = () => {
	
	const {currentColor} = useStateContext();
	const dispatch = useDispatch()
	
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
	
	useEffect(() => {
		dispatch(getListProvider())
	}, [dispatch]);
	
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
	
	return (
		<>
			<div
				className="m-1 md:mx-4 md:my-8 mt-24 p-2 md:px-4 md:py-4 flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-secondary-dark-bg rounded"
			>
				<div className="w-full my-4 flex flex-wrap gap-4">
					<div className="w-full flex items-end gap-4">
						<div className="w-[49%] flex items-end justify-between">
							<div className="w-[80%]">
								<Input
									// value={contract_number}
									// onChange={(e) => setContractNumber(e.target.value?.toUpperCase())}
									label={'Shartnoma raqami'}
								/>
							</div>
							<button
								className="w-1/6 px-1 py-2 rounded text-white disabled:opacity-25"
								style={{
									backgroundColor: currentColor
								}}
								// disabled={!contract_number}
								// onClick={() => dispatch(getRackContractInfo({contract_number}))}
							>
								Izlash
							</button>
						</div>
						
						<div className="w-[49%]">
							<Input
								// value={contract_number}
								// onChange={(e) => setContractNumber(e.target.value?.toUpperCase())}
								label={'Xolati'}
							/>
						</div>
					</div>
					<div className="w-full flex flex-wrap justify-between gap-4">
						<div className={'w-[49%]'}>
							<Input label={'Mijoz'}/>
						</div>
						<div className={'w-[49%]'}>
							<Input label={'STIR'}/>
						</div>
						<div className={'w-[49%]'}>
							<Input label={'Rack soni'}/>
						</div>
						<div className={'w-[49%]'}>
							<Input label={"Rack qoldig'i"}/>
						</div>
						<div className={'w-[49%]'}>
							<Input
								// value={akt_document_number}
								// onChange={(e) => setAktDocumentNumber(e.target.value)}
								label={'Akt raqami'}
							/>
						</div>
						<div className={'w-[49%]'}>
							<Input
								// value={akt_document_date}
								// onChange={(e) => setAktDocumentDate(e.target.value)}
								type={'date'}
								label={"Akt sanasi"}
							/>
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
											<option value="1">Cloud</option>
											<option value="2">Bare metal</option>
											<option value="2">Infratuzilma</option>
										</select>
									</div>
									
									<div className={'flex flex-col w-[30%]'}>
										<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="device_model">
											Qurilma modeli
										</label>
										<input
											value={item?.device_model}
											onChange={(e) => handleChange(e, index)}
											name='device_model'
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
											name='device_number'
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
					
					<div className="w-full flex items-center justify-between">
						<button
							className="py-2 px-1 rounded border border-red-500 text-red-500 hover:bg-red-500 hover:text-white duration-500"
						>
							Bekor qilish
						</button>
						<button
							className="py-2 px-1 rounded"
							style={{border: `1px solid ${currentColor}`, color: currentColor}}
						>
							Saqlash
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default DataCenterDocumentsAktUpdate;