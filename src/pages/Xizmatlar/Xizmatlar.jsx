import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Header, Input, TabsRender} from "../../components";
import {useStateContext} from "../../contexts/ContextProvider";
import {getServices} from "../../redux/slices/registry/registrySlice";
import JoditEditor from "jodit-react";
import {toast} from "react-toastify";
import instance from "../../API";
import Loader from "../../components/Loader";
import {AiOutlineCloudDownload} from "react-icons/ai";
import {PencilIcon, TrashIcon} from "@heroicons/react/16/solid";
import {Link} from "react-router-dom";

const tabs = [
	{
		title: "Ma'lumotlar",
		active: true
	},
	{
		title: "Video qo'llanma",
		active: false
	}
];

const Xizmatlar = () => {
	const dispatch = useDispatch()
	const {currentColor} = useStateContext();
	
	const {services} = useSelector(({registry}) => registry)

	const [openTab, setOpenTab] = useState(tabs.findIndex(tab => tab.active));
	const [modal, setModal] = useState(false)

	const [loading, setLoading] = useState(false)

	const [id, setId] = useState(null)

	const [list, setList] = useState(null)
	const [listDetail, setListDetail] = useState(null)

	const [service, setService] = useState(localStorage.getItem('service') || '')
	const [name_uz, setNameUz] = useState('')
	const [name_ru, setNameRu] = useState('')
	const [name_en, setNameEn] = useState('')
	const [description_uz, setDescriptionUz] = useState('')
	const [description_ru, setDescriptionRu] = useState('')
	const [description_en, setDescriptionEn] = useState('')
	const [icon, setIcon] = useState(null)
	const [file, setFile] = useState(null)

	const [fileName, setFileName] = useState('')
	const [iconName, setIconName] = useState('')

	useEffect(() => {
		dispatch(getServices())
	}, []);

	useEffect(() => {
		if (service) {
			fetchList().then((res) => setList(res))
		}
	}, [service])

	useEffect(() => {
		if (id) {
			const filter = list?.find(el => el?.id === id)
			setListDetail(filter)
			setNameUz(filter?.name_uz)
			setNameRu(filter?.name_ru)
			setNameEn(filter?.name_en)
			setDescriptionUz(filter?.description_uz)
			setDescriptionRu(filter?.description_ru)
			setDescriptionEn(filter?.description_en)
			setIconName(filter?.icon)
			setFileName(filter?.file)
			setModal(true)
		}
	}, [id]);

	const fetchList = async () => {
		setLoading(true)
		try {
			const response = await instance.get(`/service/${service}/add-list`)
			setList(response.data)
			setLoading(false)
			return response.data
		} catch (e) {
			setLoading(false)
			return e.message
		}
	}

	const deleteItem = async (id) => {
		setLoading(true)
		try {
			await instance.delete(`/service/delete/${id}/add-info`).then((res) => {
				if (res.status === 204) {
					setLoading(false)
					toast.success('Muvofaqqiyatli o\'chirildi')
					fetchList()
				}
			})
		} catch (e) {
			setLoading(false)
			return e.message
		}
	}
	
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
		setId(null)
		setListDetail(null)
	}
	
	const handleValidate = () => {
		return !name_uz || !name_ru || !name_en || !description_uz || !description_ru || !description_en || !icon;
	}
	
	const createContent = async () => {
		setLoading(true)
		const formData = new FormData()
		formData.append('name_uz', name_uz)
		formData.append('name_ru', name_ru)
		formData.append('name_en', name_en)
		formData.append('description_uz', description_uz)
		formData.append('description_ru', description_ru)
		formData.append('description_en', description_en)
		if (file) {
			formData.append('file', file)
		}
		formData.append('icon', icon)
		
		try {
			await instance.post(`/service/${service}/add-list-create`, formData, {
				headers: { 'Content-type': 'multipart/form-data' }
			}).then((res) => {
				if (res.status === 201) {
					setLoading(false)
					toast.success('Muvofaqqiyatli yaratildi')
					closeModal()
					fetchList()
				}
			})
		} catch (e) {
			setLoading(false)
			toast.error(e.message)
		}
	}

	const updateContent = async () => {
		setLoading(true)
		const formData = new FormData()
		if (listDetail?.name_uz !== name_uz) {
			formData.append('name_uz', name_uz)
		}
		if (listDetail?.name_ru !== name_ru) {
			formData.append('name_ru', name_ru)
		}
		if (listDetail?.name_en !== name_en) {
			formData.append('name_en', name_en)
		}
		if (listDetail?.description_uz !== description_uz) {
			formData.append('description_uz', description_uz)
		}
		if (listDetail?.description_ru !== description_ru) {
			formData.append('description_ru', description_ru)
		}
		if (listDetail?.description_en !== description_en) {
			formData.append('description_en', description_en)
		}
		if (file) {
			formData.append('file', file)
		}
		if (icon) {
			formData.append('icon', icon)
		}

		try {
			await instance.patch(`/service/update/${listDetail?.id}/add-info`, formData, {
				headers: { 'Content-type': 'multipart/form-data' }
			}).then((res) => {
				if (res.status === 200) {
					setLoading(false)
					toast.success('Muvofaqqiyatli yangilandi')
					closeModal()
					fetchList()
				}
			})
		} catch (e) {
			setLoading(false)
			toast.error(e.message)
		}
	}

	const displayStep = (step) => {
		switch (step) {
			case 0:
				return (
					<>
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
									label={'Sarlavha (ru) *'}
									value={name_ru}
									onChange={(e) => setNameRu(e.target.value)}
									className={'focus:border-blue-400'}
								/>
							</div>
							<div>
								<Input
									label={'Sarlavha (en) *'}
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
									accept="image/png"
									className="rounded shadow w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
								/>
								<Link to={iconName} target="_blank" className="block underline text-blue-400 text-sm font-bold mb-1 ml-3">{id && iconName}</Link>
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
								<Link to={fileName} target="_blank" className="block underline text-blue-400 text-sm font-bold mb-1 ml-3">{id && fileName}</Link>
							</div>
							<div className={'flex flex-col'}>
								<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="description">
									Izoh (uz) *
								</label>
								<JoditEditor value={description_uz} onChange={(e) => setDescriptionUz(e)}/>
							</div>
							<div className={'flex flex-col'}>
								<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="description">
									Izoh (ru) *
								</label>
								<JoditEditor value={description_ru} onChange={(e) => setDescriptionRu(e)}/>
							</div>
							<div className={'flex flex-col'}>
								<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="description">
									Izoh (en) *
								</label>
								<JoditEditor value={description_en} onChange={(e) => setDescriptionEn(e)}/>
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
									onClick={id ? updateContent : createContent}
								>
									{loading ? 'Yuklanmoqda...' : 'Saqlash'}
								</button>
							</div>
						</div>
					</>
				)
			case 1:
				return (
					<>
						<div className={'flex flex-col'}>
							<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="file">
								Video
							</label>
							<input
								onChange={(e) => setFile(e.target.files)}
								name="file"
								id="file"
								type="file"
								multiple={true}
								className="rounded shadow w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
							/>
						</div>
						<div className="flex items-center justify-end gap-4 mt-4">
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
								{loading ? 'Yuklanmoqda...' : 'Saqlash'}
							</button>
						</div>
					</>
				)
			default:
				return null
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
				<div className="w-full">
					{
						loading
							?
							<Loader/>
							:
							<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-4">
								<thead
									className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
								>
								<tr>
									<th scope="col" className="px-3 py-3"></th>
									<th scope="col" className="px-4 py-3">Sarlavha (uz)</th>
									<th scope="col" className="px-4 py-3">Sarlavha (ru)</th>
									<th scope="col" className="px-4 py-3">Sarlavha (en)</th>
									<th scope="col" className="px-4 py-3">Boshqarish</th>
								</tr>
								</thead>
								<tbody>
								{list && list?.map((item, index) => (
									<tr
										key={item?.id}
										className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'}
									>
										<td scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
											{index + 1}
										</td>
										<td scope="row" className="px-6 py-4">
											{item?.name_uz?.length >= 30 ? `${item?.name_uz?.slice(0, 30)}...` : item?.name_uz}
										</td>
										<td scope="row" className="px-6 py-4">
											{item?.name_ru?.length >= 30 ? `${item?.name_ru?.slice(0, 30)}...` : item?.name_ru}
										</td>
										<td scope="row" className="px-6 py-4">
											{item?.name_en?.length >= 30 ? `${item?.name_en?.slice(0, 30)}...` : item?.name_en}
										</td>
										<td scope="row" className="px-6 py-2 flex items-center justify-center">
											<button
												className={`px-2 py-1 rounded border border-yellow-400 text-center mr-4 mb-1`}
												onClick={() => setId(item?.id)}
											>
												<PencilIcon className="size-5" fill={'rgb(250 204 21)'}/>
											</button>
											<Link
												to={item?.file}
												download={true}
												target="_blank"
												className={`px-2 py-1 rounded border text-center mr-4 mb-1`}
												style={{background: currentColor, borderColor: currentColor}}
											>
												<AiOutlineCloudDownload className="size-5" fill={'#fff'}/>
											</Link>
											<button
												className={`px-2 py-1 rounded border text-center mb-1 bg-red-400`}
												onClick={() => deleteItem(item?.id)}
											>
												<TrashIcon
													className={`size-5 dark:text-blue-500 hover:underline cursor-pointer mx-auto`}
													fill="#fff"
												/>
											</button>
										</td>
									</tr>
								))}
								</tbody>
							</table>
					}
				</div>
				{modal && (
					<div
						className="fixed top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.25)] z-50 flex items-center justify-center"
					>
						<div className="bg-white w-9/12 max-h-[90%] overflow-x-scroll rounded p-4">
							<div className="w-full flex justify-between items-center mb-4">
								<TabsRender
									tabs={tabs}
									color={currentColor}
									openTab={openTab}
									setOpenTab={setOpenTab}
								/>
								<button
									className="bg-red-500 rounded px-3 py-1 text-white text-xl"
									onClick={closeModal}
								>
									X
								</button>
							</div>
							{displayStep(openTab)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Xizmatlar;