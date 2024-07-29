import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Header, Input} from "../../components";
import {useStateContext} from "../../contexts/ContextProvider";
import {getServices} from "../../redux/slices/registry/registrySlice";
import JoditEditor from "jodit-react";
import {toast} from "react-toastify";
import instance from "../../API";

const Xizmatlar = () => {
	const dispatch = useDispatch()
	const {currentColor} = useStateContext();
	
	const {services} = useSelector(({registry}) => registry)
	
	const [modal, setModal] = useState(false)
	
	const [service, setService] = useState(localStorage.getItem('service') || '')
	const [name_uz, setNameUz] = useState('')
	const [name_ru, setNameRu] = useState('')
	const [name_en, setNameEn] = useState('')
	const [description_uz, setDescriptionUz] = useState('')
	const [description_ru, setDescriptionRu] = useState('')
	const [description_en, setDescriptionEn] = useState('')
	const [icon, setIcon] = useState(null)
	const [file, setFile] = useState(null)
	
	useEffect(() => {
		dispatch(getServices())
	}, []);
	
	const closeModal = () => {
		setModal(!modal)
		setNameUz('')
		setNameRu('')
		setNameEn('')
		setDescriptionUz('')
		setDescriptionRu('')
		setDescriptionEn('')
		setIcon(null)
		setFile(null)
	}
	
	const handleValidate = () => {
		return !name_uz || !description_uz || !icon;
	}
	
	const createContent = async () => {
		const formData = new FormData()
		formData.append('name_uz', name_uz)
		formData.append('name_ru', name_ru)
		formData.append('name_en', name_en)
		formData.append('description_uz', description_uz)
		formData.append('description_ru', description_ru)
		formData.append('description_uz', description_en)
		formData.append('file', file)
		formData.append('icon', icon)
		
		try {
			await instance.post('api', formData, {
				headers: { 'Content-type': 'multipart/form-data' }
			})
		} catch (e) {
			toast.error(e.message)
		}
	}
	
	return (
		<div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-10 bg-white rounded">
			<div className={'flex items-center justify-between'}>
				<Header category="Sahifa" title="Xizmatlar"/>
				<button
					className={'px-4 py-2 rounded text-white mb-10 disabled:opacity-25'}
					style={{backgroundColor: currentColor}}
					onClick={() => setModal(!modal)}
					disabled={!service}
				>
					Qo'shish
				</button>
			</div>
			<div className="relative overflow-x-auto shadow-md sm:rounded px-2 py-4">
				<div className={'w-9/12'}>
					<label
						htmlFor="service"
						className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
					>
						Xizmat turi
					</label>
					<select
						name="client"
						id="service"
						className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
						value={service}
						onChange={(e) => {
							localStorage.setItem('service', e.target.value)
							setService(e.target.value)
						}}
					>
						<option value="" disabled={service}>Tanlang...</option>
						{services && services?.map((item, index) => (
							<option value={item?.id} key={index}>{item?.name}</option>
						))}
					</select>
				</div>
				{modal && (
					<div
						className="fixed top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.25)] z-50 flex items-center justify-center">
						<div className="bg-white w-9/12 max-h-[90%] overflow-x-scroll rounded p-4">
							<div className="w-full text-end">
								<button
									className="bg-red-500 rounded px-4 py-2 text-white text-2xl"
									onClick={closeModal}
								>
									X
								</button>
							</div>
							<div className="w-full flex flex-col gap-4">
								<div>
									<Input
										label={'Sarlavha (uz) *'}
										value={name_uz}
										onChange={(e) => setNameUz(e.target.value)}
										className={'focus:border-blue-400'}
										required={true}
									/>
								</div>
								<div>
									<Input
										label={'Sarlavha (ru)'}
										value={name_ru}
										onChange={(e) => setNameRu(e.target.value)}
										className={'focus:border-blue-400'}
									/>
								</div>
								<div>
									<Input
										label={'Sarlavha (en)'}
										value={name_en}
										onChange={(e) => setNameEn(e.target.value)}
										className={'focus:border-blue-400'}
									/>
								</div>
								<div className={'flex flex-col'}>
									<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="document">
										Icon
									</label>
									<input
										onChange={(e) => setIcon(e.target.files[0])}
										name="document"
										id="document"
										type="file"
										className="rounded shadow w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
									/>
								</div>
								<div className={'flex flex-col'}>
									<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="file">
										Fayl
									</label>
									<input
										onChange={(e) => setFile(e.target.files[0])}
										name="file"
										id="file"
										type="file"
										className="rounded shadow w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
									/>
								</div>
								<div className={'flex flex-col'}>
									<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="description">
										Izoh (uz) *
									</label>
									<JoditEditor value={description_uz} onChange={(e) => setDescriptionUz(e)} />
								</div>
								<div className={'flex flex-col'}>
									<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="description">
										Izoh (ru)
									</label>
									<JoditEditor value={description_ru} onChange={(e) => setDescriptionRu(e)} />
								</div>
								<div className={'flex flex-col'}>
									<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="description">
										Izoh (en)
									</label>
									<JoditEditor value={description_en} onChange={(e) => setDescriptionEn(e)} />
								</div>
								<div className="flex items-center justify-end gap-4">
									<button
										className="px-4 py-2 rounded"
										style={{
											border: `1px solid ${currentColor}`,
											color: currentColor
										}}
										onClick={closeModal}
									>
										Bekor qilish
									</button>
									<button
										className="px-4 py-2 rounded text-white disabled:opacity-25"
										style={{
											backgroundColor: `${currentColor}`,
											border: `1px solid ${currentColor}`
										}}
										disabled={handleValidate()}
										onClick={createContent}
									>
										Saqlash
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Xizmatlar;