import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import TabsWithBack from "../../components/TabsWithBack";
import {useStateContext} from "../../contexts/ContextProvider";
import {Input, Loader} from "../../components";
import {createTechHelpFile, getTechHelpDetail, updateTechHelp} from "../../redux/slices/dataCenter/dataCenterSlice";
import moment from "moment";
import {TrashIcon} from "@heroicons/react/16/solid";
import {AiOutlineCloudDownload} from "react-icons/ai";
import {toast} from "react-toastify";

const tabs = [
	{
		title: "Shartnoma ma'lumotlari",
		active: true
	},
	{
		title: "Fayl",
		active: false
	}
]

const TechHelpDetail = () => {
	const {currentColor} = useStateContext();
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const location = useLocation()
	const {id} = useParams()
	
	const {loading, techHelpDetail} = useSelector(state => state.dataCenter)
	
	const [stir, setStir] = useState('');
	const [name, setName] = useState('')
	const [contract_number, setContractNumber] = useState('')
	const [start_date, setStartDate] = useState('')
	const [end_date, setEndDate] = useState('')
	const [pay_amount, setPayAmount] = useState('')
	const [pay_amount_month, setPayAmountMonth] = useState('')
	const [payment_type, setPaymentType] = useState('')
	const [payment_status, setPaymentStatus] = useState('')
	const [reminder_type, setReminderType] = useState('')
	const [reminder_once_date, setReminderOnceDate] = useState('')
	
	const [openTab, setOpenTab] = useState(tabs.findIndex(tab => tab.active));
	
	const [files, setFiles] = useState([{
		filename: '',
		file: null,
		uploaded: false,
		type: ''
	}])
	
	useEffect(() => {
		dispatch(getTechHelpDetail(id)).then(({payload}) => {
			setStir(payload?.user?.tin)
			setName(payload?.user?.name)
			setContractNumber(payload?.contract_number)
			setStartDate(moment(payload?.start_date).format('YYYY-MM-DD'))
			setEndDate(moment(payload?.end_date).format('YYYY-MM-DD'))
			setPayAmount(payload?.pay_amount)
			setPayAmountMonth(payload?.pay_amount_month)
			setPaymentType(payload?.payment_type)
			setPaymentStatus(payload?.payment_status)
			setReminderType(payload?.reminder_type)
			setReminderOnceDate(moment(payload?.reminder_once_date).format('YYYY-MM-DD'))
			
			if (location.state?.detail) {
				const filesObjects = payload?.files?.map((item) => ({
					filename: item?.filename,
					file: null,
					uploaded: true,
					type: item?.type,
					get_file: item?.get_file
				}))
				setFiles(filesObjects)
			}
		})
	}, [id, dispatch]);
	
	// useEffect(() => {
	// 	if (location.state?.detail) {
	// 		dispatch(getTechHelpDetail(id)).then(({payload}) => {
	// 			setStir(payload?.user?.tin)
	// 			setName(payload?.user?.name)
	// 			setContractNumber(payload?.contract_number)
	// 			setStartDate(moment(payload?.start_date).format('YYYY-MM-DD'))
	// 			setEndDate(moment(payload?.end_date).format('YYYY-MM-DD'))
	// 			setPayAmount(payload?.pay_amount)
	// 			setPayAmountMonth(payload?.pay_amount_month)
	// 			setPaymentType(payload?.payment_type)
	// 			setPaymentStatus(payload?.payment_status)
	// 			setReminderType(payload?.reminder_type)
	// 			setReminderOnceDate(moment(payload?.reminder_once_date).format('YYYY-MM-DD'))
	// 		})
	// 	}
	// }, [id, location, dispatch]);
	
	const handleAddFiles = () => {
		const value = [...files, {
			filename: '',
			file: null,
			uploaded: false,
			type: ''
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
	
	const deleteFiles = i => {
		const data = [...files]
		data.splice(i, 1)
		setFiles(data)
	}
	
	const uploadFile = (i) => {
		const data = {
			purchase_note: id,
			contract_number,
			filename: files[i].filename,
			file: files[i].file,
			type: Number(files[i].type)
		}
		dispatch(createTechHelpFile(data)).then(({payload}) => {
			if (payload?.id) {
				const updateFiles = [...files]
				updateFiles[i].uploaded = true
				setFiles(updateFiles)
				toast.success("Muvofaqqiyatli qo'shildi")
				handleAddFiles()
			} else {
				return toast.error("Xatolik")
			}
		}).catch(() => {
			return toast.error('Xatolik')
		})
	}
	
	const updateTech = () => {
		const data = {
			payment_status,
			reminder_type,
			reminder_once_date: new Date(reminder_once_date).toISOString()
		}
		dispatch(updateTechHelp({id, data})).then(({payload}) => {
			if (payload?.ok) {
				toast.success("Muvofaqqiyatli o'zgartirildi")
				dispatch(getTechHelpDetail(id))
			} else {
				return toast.error("Xatolik")
			}
		}).catch(() => {
			return toast.error("Xatolik")
		})
	}
	
	const displayStep = () => {
		switch (openTab) {
			case 0:
				return (
					<>
						<div className="w-full flex items-center flex-wrap justify-between my-4">
							<div className={'w-full'}>
								<Input
									value={name || ''}
									disabled={true}
									label={'Tashkilot nomi'}
								/>
							</div>
							<div className="w-[49%] my-4">
								<Input
									value={stir}
									onChange={(e) => {
										const re = /^[0-9\b]+$/;
										if (e.target.value === '' || re.test(e.target.value)) {
											setStir(e.target.value.slice(0, 9));
										}
									}}
									label={'Tashkilotning STIR raqami'}
									disabled={true}
								/>
							</div>
							<div className="w-[49%]">
								<Input
									value={contract_number || ''}
									onChange={(e) => setContractNumber(e.target.value)}
									type={'text'}
									label={'Shartnoma raqami'}
									disabled={true}
								/>
							</div>
							<div className="w-[49%]">
								<Input
									value={start_date || ''}
									onChange={(e) => setStartDate(e.target.value)}
									type={'date'}
									label={'Shartnoma sanasi'}
									disabled={true}
								/>
							</div>
							<div className="w-[49%]">
								<Input
									value={end_date || ''}
									onChange={(e) => setEndDate(e.target.value)}
									type={'date'}
									label={'Amal qilish sanasi'}
									disabled={true}
								/>
							</div>
							<div className="w-[49%] my-4">
								<Input
									value={pay_amount || ''}
									onChange={(e) => {
										const re = /^[0-9\b]+$/;
										if (e.target.value === '' || re.test(e.target.value)) {
											Number(setPayAmount(e.target.value))
										}
									}}
									type={'text'}
									label={"To'lov miqdori"}
									disabled={true}
								/>
							</div>
							<div className="w-[49%] my-4">
								<Input
									value={pay_amount_month || ''}
									onChange={(e) => {
										const re = /^[0-9\b]+$/;
										if (e.target.value === '' || re.test(e.target.value)) {
											Number(setPayAmountMonth(e.target.value))
										}
									}}
									type={'text'}
									label={"Oylik to'lov miqdori"}
									disabled={true}
								/>
							</div>
							<div className="w-full">
								<label
									htmlFor="payment_type"
									className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
								>
									To'lov turi
								</label>
								<select
									name="payment_type"
									id="payment_type"
									className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
									value={payment_type}
									onChange={(e) => setPaymentType(Number(e.target.value))}
									disabled={true}
								>
									<option value="" disabled={payment_type}>Tanlang...</option>
									<option value="1">1 martalik</option>
									<option value="2">Har oylik</option>
								</select>
							</div>
							<div className="w-full my-4">
								<label
									htmlFor="payment_type"
									className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
								>
									To'lov statusi
								</label>
								<select
									name="payment_type"
									id="payment_type"
									className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
									value={payment_status}
									onChange={(e) => setPaymentStatus(Number(e.target.value))}
									disabled={location.state?.detail}
								>
									<option value="" disabled={payment_status}>Tanlang...</option>
									<option value="1">Aktiv</option>
									<option value="2">Yakunlangan</option>
									<option value="3">Bekor qilingan</option>
									<option value="4">Muddati o'tgan</option>
								</select>
							</div>
							
							<div className="w-full">
								<label
									htmlFor="payment_type"
									className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
								>
									Eslatma turi
								</label>
								<select
									name="reminder_type"
									id="reminder_type"
									className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1`}
									value={reminder_type}
									onChange={(e) => setReminderType(Number(e.target.value))}
									disabled={location.state?.detail}
								>
									<option value="" disabled={reminder_type}>Tanlang...</option>
									<option value="1">1 martalik</option>
									<option value="2">Har oylik</option>
								</select>
							</div>
							<div className="w-full my-4">
								<Input
									value={reminder_once_date || ''}
									onChange={(e) => setReminderOnceDate(e.target.value)}
									type={'date'}
									label={'Eslatma sanasi'}
									disabled={location.state?.detail}
								/>
							</div>
						</div>
						
						<button
							className={`px-4 py-2 rounded text-white disabled:opacity-25 ml-auto`}
							style={{backgroundColor: currentColor}}
							// disabled={handleValidate()}
							onClick={updateTech}
						>
							Saqlash
						</button>
					</>
				)
			case 1:
				return (
					<>
						{techHelpDetail && location.state?.detail && techHelpDetail?.files?.length === 0 ?
							<h1 className="dark:text-white text-center w-full">Fayllar mavjud emas!</h1> : (
								<>
								<div className="w-full flex flex-wrap gap-4 my-2">
										{files && files?.map((item, index) => (
											<div key={index} className="border-dashed border p-2 w-full flex flex-col gap-4">
												{/*{!item?.uploaded && (*/}
												{/*	<div className="w-full text-end">*/}
												{/*		<button*/}
												{/*			onClick={() => deleteFiles(index)}*/}
												{/*			disabled={files.length === 1}*/}
												{/*		>*/}
												{/*			<TrashIcon*/}
												{/*				color={currentColor}*/}
												{/*				className="size-6 cursor-pointer"*/}
												{/*			/>*/}
												{/*		</button>*/}
												{/*	</div>*/}
												{/*)}*/}
												<div className="w-full flex items-center justify-between gap-4 flex-wrap">
													<div className="w-[49%] flex justify-between">
														<div className="w-[49%]">
															<label
																htmlFor="type"
																className={'block text-gray-700 text-sm font-bold mb-1 ml-3'}
															>
																Hujjat turi
															</label>
															<select
																disabled={item.uploaded}
																name="type"
																id="type"
																className={`w-full px-1 py-1 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1 disabled:opacity-25`}
																value={item?.type}
																onChange={(e) => changeFiles(e, index)}
															>
																<option value="" disabled={item?.type}>Tanlang...</option>
																<option value="1">Bildirgi</option>
																<option value="2">Hisob faktura</option>
																<option value="3">Shartnoma</option>
																<option value="4">Ish bajarildi</option>
															</select>
														</div>
														<div className={'flex flex-col w-[49%]'}>
															<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="filename">Hujjat
																nomi</label>
															<input
																style={{opacity: item.uploaded ? 0.5 : 1}}
																disabled={item?.uploaded || location.state?.detail}
																value={item?.filename}
																onChange={(e) => changeFiles(e, index)}
																name="filename"
																id="filename"
																type="text"
																className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1 disabled:opacity-25"
															/>
														</div>
													</div>
													<div className={'flex w-[49%] items-end justify-between'}>
														{!item?.uploaded && <div className="w-[85%] flex flex-col">
															<label className="block text-gray-700 text-sm font-bold mb-1 ml-3"
															       htmlFor="file">Fayl</label>
															<input
																style={{opacity: item.uploaded ? 0.5 : 1}}
																disabled={item?.uploaded || location.state?.detail}
																onChange={(e) => changeFiles(e, index)}
																name="file"
																id="file"
																type="file"
																className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 disabled:opacity-25 border mb-1"
															/>
														</div>}
														<div className="mb-1 flex items-center gap-1 ml-1">
															{item?.get_file ? (
																<button className="rounded border-yellow-500 mt-5 border p-1 disabled:opacity-25">
																	<AiOutlineCloudDownload
																		className={`size-6 text-yellow-500 hover:underline cursor-pointer mx-auto`}
																		onClick={() => {
																			window.open(item?.get_file, '_blank')
																		}}
																	/>
																</button>
															) : (
																<>
																	<button
																		className={`px-4 py-2 rounded text-white disabled:opacity-25`}
																		style={{backgroundColor: currentColor}}
																		disabled={item?.uploaded || !item?.filename || !item?.file || !item?.type || location.state?.detail}
																		// disabled={handleValidateSecond()}
																		onClick={() => uploadFile(index)}
																	>
																		Saqlash
																	</button>
																</>
															)}
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								</>
							)}
					</>
				)
			default:
				return null
		}
	}
	
	return (
		<>
			<div
				className="m-1 md:mx-4 md:my-8 mt-24 p-2 md:px-4 md:py-4 flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-secondary-dark-bg rounded"
			>
				<TabsWithBack
					tabs={tabs}
					color={currentColor}
					openTab={openTab}
					setOpenTab={setOpenTab}
				/>
			</div>
			<div
				className="m-1 md:mx-4 md:my-8 mt-24 p-2 md:px-4 md:py-4 flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-secondary-dark-bg rounded"
			>
				{loading ? <Loader/> : displayStep()}
			</div>
		</>
	);
};

export default TechHelpDetail;