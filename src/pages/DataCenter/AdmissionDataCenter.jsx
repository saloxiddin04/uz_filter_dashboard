import React, {useEffect, useState} from 'react';
import {Header, Input, Loader, Pagination, TabsRender} from "../../components";
import {useStateContext} from "../../contexts/ContextProvider";
import {useDispatch, useSelector} from "react-redux";
import {
	ArrowDownTrayIcon,
	ArrowPathIcon,
	ChevronRightIcon,
	EyeIcon,
	FunnelIcon,
	TrashIcon
} from "@heroicons/react/16/solid";
import {BiSearch} from "react-icons/bi";
import {
	createAdmission, getAdmissionDetail,
	getAdmissionLetters,
	getDataCenterList
} from "../../redux/slices/dataCenter/dataCenterSlice";
import instance from "../../API";
import {toast} from "react-toastify";
import {getUserByTin} from "../../redux/slices/contractCreate/FirstStepSlices";
import moment from "moment";

const tabs = [
	{
		title: "Xatlar",
		active: true
	},
	{
		title: "Batafsil",
		active: false
	},
	{
		title: "Ruxsatnoma yaratish",
		active: false
	}
]

const AdmissionDataCenter = () => {
	const dispatch = useDispatch()
	
	const {currentColor} = useStateContext();
	const {
		admissionLetter,
		admissionLetterDetail,
		loading,
		dataCenterList,
	} = useSelector((state) => state.dataCenter)
	
	const [openTab, setOpenTab] = useState(tabs.findIndex(tab => tab.active));
	
	const [handleFilter, setFilter] = useState(true)
	
	const [detailFilter, setDetailFilter] = useState(true)
	const [filterLetterNumber, setFilterLetterNumber] = useState(undefined)
	const [employee_passport_number, setEmployeePassportNumber] = useState(undefined)
	const [employee_name, setEmployeeName] = useState(undefined)
	
	const [contract_number, setContractNumber] = useState(null)
	const [contract, setContract] = useState([])
	const [letter_number, setLetterNumber] = useState(null)
	const [letter_date, setLetterDate] = useState(null)
	const [file, setFile] = useState(null)
	const [employees_count, setEmployeesCount] = useState(null)
	const [completed_date, setCompletedDate] = useState(null)
	const [employees, setEmployees] = useState([
		{
			pin: '',
			pport_no: '',
			per_adr: '',
			mid_name: '',
			sur_name: '',
			name: '',
			admission_type: null,
			admission_time: null,
			data_center: [],
			admission_status: 0,
			additional_info: ''
		}
	])
	
	const [client, setClient] = useState('');
	const [stir, setStir] = useState('');
	const [tenant_type, setTenantType] = useState(null)
	const [sub_tenant_user, setSubTenantUser] = useState(null)
	const [name, setName] = useState(null)
	
	const [tenant_serial, setTenantSerial] = useState(undefined)
	const [tenant_pin, setTenantPin] = useState(undefined)
	const [tenant_name, setTenantName] = useState(undefined)
	
	const [filterContractNumber, setFilterContractNumber] = useState(undefined)
	const [client_tin_or_pin, setClientTinOrPin] = useState(undefined)
	const [sub_tenant_tin_or_pin, setSubTenantTinOrPin] = useState(undefined)
	
	const [id, setId] = useState(null)
	
	const [accordionSelected, setAccordionSelected] = useState(null)
	const [accordionDetail, setAccordionDetail] = useState(null)
	
	useEffect(() => {
		if (openTab === 0) {
			dispatch(getAdmissionLetters())
		}
	}, [openTab]);
	
	const searchUserJuridic = () => {
		dispatch(getUserByTin({stir, client})).then((res) => {
			setName(res?.payload?.name === null ? '' : res?.payload?.name)
			setSubTenantUser(res?.payload?.userdata?.id)
		})
	}
	
	const searchTenantFiz = () => {
		dispatch(getUserByTin({
			pin: tenant_pin,
			client,
			passport_ce: tenant_serial
		})).then((res) => {
			setTenantName(`${res?.payload?.first_name}` + ` ${res?.payload?.mid_name} ` + `${res?.payload?.sur_name}`)
			setSubTenantUser(res?.payload?.userdata?.id)
		});
	}
	
	const handleAddEmployee = () => {
		const employee = [...employees, {
			pin: '',
			pport_no: '',
			per_adr: '',
			mid_name: '',
			sur_name: '',
			name: '',
			admission_type: null,
			admission_time: null,
			data_center: [],
			admission_status: 0,
			additional_info: ''
		}]
		if (employees.length !== Number(employees_count)) {
			setEmployees(employee)
		}
	}
	
	const handleDeleteEmployee = (i) => {
		const value = [...employees]
		value.splice(i, 1)
		setEmployees(value)
	}
	
	const changeEmployee = (e, i) => {
		const {name, value} = e;
		const updatedEmployee = [...employees];
		if (name === 'data_center') {
			const dataCenter = updatedEmployee[i]?.data_center || [];
			
			if (dataCenter.includes(value)) {
				updatedEmployee[i].data_center = dataCenter.filter((selected) => selected !== value);
				setEmployees(updatedEmployee)
			} else {
				updatedEmployee[i].data_center = [...dataCenter, value];
				setEmployees(updatedEmployee)
			}
		} else {
			updatedEmployee[i] = {
				...updatedEmployee[i],
				[name]: value,
			};
			setEmployees(updatedEmployee)
		}
	}
	
	const searchContract = async () => {
		try {
			const response = await instance.get(`dispatcher/admission-search-letters?contract_number=${contract_number}`)
			setContract(response.data)
			setSubTenantUser(response.data[0]?.client?.id)
		} catch (e) {
			return e
		}
	}
	
	const searchLetters = () => {
		const data = {
			contract_number: filterContractNumber,
			sub_tenant_tin_or_pin,
			client_tin_or_pin
		}
		dispatch(getAdmissionLetters(data))
	}
	
	const searchDetail = () => {
		const params = {
			letter_number: filterLetterNumber,
			employee_passport_number,
			employee_name
		}
		dispatch(getAdmissionDetail({
			id,
			params
		}))
	}
	
	const searchUserPhysics = (index) => {
		dispatch(getUserByTin({
			pin: employees[index].pin,
			client: 'fiz',
			passport_ce: employees[index].pport_no
		})).then((res) => {
			setEmployees((prevState) => {
				const updatedEmployees = [...prevState];
				const updatedEmployee = {...updatedEmployees[index]};
				
				updatedEmployee.name = res?.payload?.first_name ?? '';
				updatedEmployee.per_adr = res?.payload?.per_adr ?? '';
				updatedEmployee.mid_name = res?.payload?.mid_name ?? '';
				updatedEmployee.sur_name = res?.payload?.sur_name ?? '';
				
				updatedEmployees[index] = updatedEmployee;
				return updatedEmployees;
			});
		});
	}
	
	const handleValidate = () => {
		for (const currentEmployee of employees) {
			if (
				!contract || !contract_number || !letter_number || !letter_date || !file || !employees_count ||
				!currentEmployee?.pport_no || !currentEmployee?.sur_name ||
				!currentEmployee?.name || currentEmployee?.admission_type === null || currentEmployee?.admission_time === null || currentEmployee.data_center.length === 0 ||
				!tenant_type || (tenant_type === '2' && (client === 'fiz' ? !tenant_name : !name))
			) {
				return true
			}
		}
		
		return false
	}
	
	const clearData = () => {
		setContractNumber(null)
		setContract([])
		setLetterNumber(null)
		setLetterDate(null)
		setFile(null)
		setEmployeesCount(null)
		setEmployees([
			{
				pin: '',
				pport_no: '',
				per_adr: '',
				mid_name: '',
				sur_name: '',
				name: '',
				admission_type: null,
				admission_time: null,
				data_center: [],
				admission_status: 0,
				additional_info: ''
			}
		])
	}
	
	const create = async () => {
		const data = {
			contract: contract[0]?.id,
			letter_number,
			letter_date: new Date(letter_date)?.toISOString(),
			completed_date: new Date(completed_date)?.toISOString(),
			admission_status: 0,
			file,
			sub_tenant_user: sub_tenant_user,
			employee_count: employees_count,
			employees: JSON.stringify(employees)
		}
		await dispatch(createAdmission(data)).then((res) => {
			if (res?.payload?.status === 201) {
				toast.success("Muvofaqqiyatli yaratildi")
				setOpenTab(0)
				clearData()
			} else {
				return toast.error("Xatolik")
			}
		})
	}
	
	const toggle = (i) => {
		if (accordionSelected === i) {
			return setAccordionSelected(null)
		}
		setAccordionSelected(i)
	}
	
	const toggleDetail = (i) => {
		if (accordionDetail === i) {
			return setAccordionDetail(null)
		}
		setAccordionDetail(i)
	}
	
	const handlePageChange = (page) => {
		dispatch(getAdmissionLetters({page_size: page}))
	}
	
	const displayStep = (step) => {
		switch (step) {
			case 0:
				return (
					<>
						<div className={`flex justify-between ${handleFilter ? 'items-start' : 'items-center'}`}>
							<Header category={'Sahifa'} title={'Dopusk'}/>
							{handleFilter && (
								<>
									<div className="flex gap-4 items-center justify-center w-[90%]">
										<div className={'flex flex-col w-[35%]'}>
											<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="amount">
												Shartnoma raqami
											</label>
											<input
												value={filterContractNumber || ""}
												onChange={(e) => setFilterContractNumber(e.target.value?.toUpperCase())}
												onKeyPress={(e) => {
													if (e.key === "Enter") {
														if (!filterContractNumber) {
															toast.error('Shartnoma raqam kiriting')
														} else {
															searchLetters()
														}
													}
												}}
												name="amount"
												id="amount"
												type="text"
												className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
											/>
										</div>
										
										
										<div className={'flex flex-col w-[35%]'}>
											<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="amount">
												Mijoz STIR/JShShIR
											</label>
											<input
												value={client_tin_or_pin || ""}
												onChange={(e) => setClientTinOrPin(e.target.value)}
												onKeyPress={(e) => {
													if (e.key === "Enter") {
														if (!client_tin_or_pin) {
															toast.error('Mijoz STIR/JShShIR kiriting')
														} else {
															searchLetters()
														}
													}
												}}
												name="amount"
												id="amount"
												type="text"
												className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
											/>
										</div>
										<div className={'flex flex-col w-[35%]'}>
											<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="amount">
												Sub Tenant STIR/JShShIR
											</label>
											<input
												value={sub_tenant_tin_or_pin || ""}
												onChange={(e) => setSubTenantTinOrPin(e.target.value)}
												onKeyPress={(e) => {
													if (e.key === "Enter") {
														if (!sub_tenant_tin_or_pin) {
															toast.error('Sub Tenant STIR/JShShIR kiriting')
														} else {
															searchLetters()
														}
													}
												}}
												name="amount"
												id="amount"
												type="text"
												className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
											/>
										</div>
										<button
											className="rounded px-4 py-1 mt-5 disabled:opacity-25"
											style={{border: `1px solid ${currentColor}`}}
											onClick={searchLetters}
											disabled={!filterContractNumber && !client_tin_or_pin && !sub_tenant_tin_or_pin}
										>
											<BiSearch className="size-6" color={currentColor}/>
										</button>
										<button
											className={`rounded px-4 py-1 mt-5 border text-center`}
											style={{borderColor: currentColor}}
											onClick={() => {
												dispatch(getAdmissionLetters())
												setFilterContractNumber(undefined)
												setSubTenantTinOrPin(undefined)
												setClientTinOrPin(undefined)
											}}
										>
											<ArrowPathIcon className="size-6" fill={currentColor}/>
										</button>
									</div>
								</>
							)}
						</div>
						<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 my-4">
							<thead
								className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
							>
							<tr>
								<th scope="col" className="px-3 py-3"></th>
								<th scope="col" className="px-4 py-3">Tashkilot</th>
								<th scope="col" className="px-6 py-3">STIR/JSHSHIR</th>
								<th scope="col" className="px-8 py-3">Shartnoma raqami</th>
								<th scope="col" className="px-8 py-3">Shartnoma sanasi</th>
								<th scope="col" className="px-6 py-3">Xat soni</th>
							</tr>
							</thead>
							<tbody>
							{admissionLetter && admissionLetter?.result?.map((item, index) => {
								return (
									<React.Fragment key={index}>
										<tr
											className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'}
											key={item?.id}
										>
											<td scope="row"
											    className="px-6 py-4 font-medium flex gap-1 items-center">
												{item?.sub_tenant?.length > 0 && (
													<div className={`cursor-pointer ${accordionSelected === index ? 'rotate-90' : ''}`}>
														<ChevronRightIcon onClick={() => toggle(index)} className="size-6"/>
													</div>
												)}
												{index + 1}
											</td>
											<td className={'px-4 py-2'}>
												{item?.client?.name}
											</td>
											<td className={'px-4 py-2'}>
												{item?.client?.pin_or_tin}
											</td>
											<td className={'px-4 py-2'}>
												{item?.contract?.contract_number}
											</td>
											<td className={'px-4 py-2'}>
												{moment(item?.contract?.contract_date).format('DD-MM-YYYY')}
											</td>
											<td className={'px-4 py-2'}>
												{item?.count_admission_letters}
											</td>
										</tr>
										
										{accordionSelected === index && (
											<>
												<tr>
													<td colSpan={7} className="px-6 py-4">
														<table
															className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 my-4">
															<thead
																className="bg-gray-100 dark:bg-gray-700 text-xs uppercase text-gray-700 dark:text-gray-400">
															<tr>
																<th className="px-4 py-2">#</th>
																<th className="px-4 py-2">Sub tenant</th>
																<th className="px-4 py-2">Stir/JShShIR</th>
																<th className="px-4 py-2">Sub tenant bo'yicha xat soni</th>
																<th className="px-4 py-2">Boshqarish</th>
															</tr>
															</thead>
															<tbody>
															{item?.sub_tenant?.map((el, i) => (
																<tr key={el?.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b-1">
																	<td className="px-4 py-2">{`${index + 1}.${i + 1}`}</td>
																	<td className="px-4 py-2">{el?.sub_tenant_user?.name}</td>
																	<td className="px-4 py-2">{el?.sub_tenant_user?.pin_or_tin}</td>
																	<td className="px-4 py-2">{el?.count_admission_letters}</td>
																	<td className="px-4 py-2">
																		<button style={{border: `1px solid ${currentColor}`}} className="rounded p-1">
																			<EyeIcon
																				style={{color: currentColor}}
																				className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mx-auto rounded`}
																				onClick={() => {
																					dispatch(getAdmissionDetail({id: el?.id})).then(() => {
																						setId(el?.id)
																						setOpenTab(1)
																					})
																					dispatch(getDataCenterList())
																				}}
																			/>
																		</button>
																	</td>
																</tr>
															))}
															</tbody>
														</table>
													</td>
												</tr>
											</>
										)}
									</React.Fragment>
								)
							})}
							</tbody>
						</table>
						
						<div className="w-full flex justify-end">
							<Pagination
								totalItems={admissionLetter?.count}
								itemsPerPage={10}
								onPageChange={handlePageChange}
							/>
						</div>
					</>
				)
			case 1:
				return (
					<>
						<Header category={admissionLetterDetail?.sub_tenant_user?.pin_or_tin}
						        title={admissionLetterDetail?.sub_tenant_user?.name}/>
						<div className="flex justify-center my-4">
							{detailFilter && (
								<>
									<div className="flex gap-4 items-center justify-center w-[90%]">
										<div className={'flex flex-col w-[35%]'}>
											<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="amount">
												Xat raqami
											</label>
											<input
												value={filterLetterNumber || ""}
												onChange={(e) => setFilterLetterNumber(e.target.value)}
												onKeyPress={(e) => {
													if (e.key === "Enter") {
														if (!filterLetterNumber) {
															toast.error('Xat raqam kiriting')
														} else {
															searchDetail()
														}
													}
												}}
												name="amount"
												id="amount"
												type="text"
												className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
											/>
										</div>
										
										
										<div className={'flex flex-col w-[35%]'}>
											<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="amount">
												Xodim passport seriyasi
											</label>
											<input
												value={employee_passport_number || ""}
												onChange={(e) => setEmployeePassportNumber(e.target.value)}
												onKeyPress={(e) => {
													if (e.key === "Enter") {
														if (!employee_passport_number) {
															toast.error('Xodim passport seriyasi kiriting')
														} else {
															searchDetail()
														}
													}
												}}
												name="amount"
												id="amount"
												type="text"
												className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
											/>
										</div>
										<div className={'flex flex-col w-[35%]'}>
											<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="amount">
												Xodim ismi
											</label>
											<input
												value={employee_name || ""}
												onChange={(e) => setEmployeeName(e.target.value)}
												onKeyPress={(e) => {
													if (e.key === "Enter") {
														if (!employee_name) {
															toast.error('Xodim ismi kiriting')
														} else {
															searchDetail()
														}
													}
												}}
												name="amount"
												id="amount"
												type="text"
												className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
											/>
										</div>
										<button
											className="rounded px-4 py-1 mt-5 disabled:opacity-25"
											style={{border: `1px solid ${currentColor}`}}
											onClick={searchDetail}
											disabled={!filterLetterNumber && !employee_passport_number && !employee_name}
										>
											<BiSearch className="size-6" color={currentColor}/>
										</button>
										<button
											className={`rounded px-4 py-1 mt-5 border text-center`}
											style={{borderColor: currentColor}}
											onClick={() => {
												dispatch(getAdmissionDetail({id}))
												setFilterLetterNumber(undefined)
												setEmployeePassportNumber(undefined)
												setEmployeeName(undefined)
											}}
										>
											<ArrowPathIcon className="size-6" fill={currentColor}/>
										</button>
									</div>
								</>
							)}
						</div>
						{
							admissionLetterDetail
								?
								<>
									<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 my-4">
										<thead
											className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
										>
										<tr>
											<th scope="col" className="px-3 py-3"></th>
											<th scope="col" className="px-4 py-3">Tashkilot</th>
											<th scope="col" className="px-6 py-3">STIR/JSHSHIR</th>
											<th scope="col" className="px-6 py-3">Shartnoma raqami</th>
											<th scope="col" className="px-6 py-3">Shartnoma sanasi</th>
											<th scope="col" className="px-8 py-3">Xat raqami</th>
											<th scope="col" className="px-8 py-3">Xat sanasi</th>
											<th scope="col" className="px-6 py-3">Xodim soni</th>
											<th scope="col" className="px-6 py-3"></th>
										</tr>
										</thead>
										<tbody>
										{admissionLetterDetail && admissionLetterDetail?.employee_letters?.map((item, index) => {
											return (
												<React.Fragment key={index}>
													<tr className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'} key={item?.id}>
														<td scope="row"
														    className="px-6 py-4 font-medium flex gap-1 items-center">
															{item?.employees?.length > 0 && (
																<div className={`cursor-pointer ${accordionDetail === index ? 'rotate-90' : ''}`}>
																	<ChevronRightIcon onClick={() => toggleDetail(index)} className="size-6"/>
																</div>
															)}
															{index + 1}
														</td>
														<td className={'px-4 py-2'}>
															{item?.admission?.client?.name}
														</td>
														<td className={'px-4 py-2'}>
															{item?.admission?.client?.pin_or_tin}
														</td>
														<td className={'px-4 py-2'}>
															{item?.admission?.contract?.contract_number}
														</td>
														<td className={'px-4 py-2'}>
															{moment(item?.admission?.contract?.contract_date).format('DD-MM-YYYY')}
														</td>
														<td className={'px-4 py-2'}>
															{item?.letter_number}
														</td>
														<td className={'px-4 py-2'}>
															{moment(item?.letter_date).format('DD-MM-YYYY')}
														</td>
														<td className={'px-4 py-2'}>
															{item?.employee_count}
														</td>
														<td className="px-4 py-2 flex gap-2">
															<button className="p-1 border-yellow-500 border rounded" title="Xat yuklab olish">
																<a href={`${item?.file}`} target="_blank">
																	<ArrowDownTrayIcon
																		className="size-6 text-yellow-500 hover:underline cursor-pointer mx-auto"/>
																</a>
															</button>
														</td>
													</tr>
													
													{accordionDetail === index && (
														<tr>
															<td colSpan={10} className="px-6 py-4">
																<table
																	className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 my-4">
																	<thead
																		className="bg-gray-100 dark:bg-gray-700 text-xs uppercase text-gray-700 dark:text-gray-400">
																	<tr>
																		<th className="px-4 py-2">#</th>
																		<th className="px-4 py-2">Xodim</th>
																		<th className="px-4 py-2">Pasport raqami</th>
																		<th className="px-4 py-2">Pinfl</th>
																		<th className="px-4 py-2">Ruxsatnoma turi</th>
																		<th className="px-4 py-2">Ruxsatnoma vaqti</th>
																		<th className="px-4 py-2">Data markaz</th>
																	</tr>
																	</thead>
																	<tbody>
																	{item?.employees?.map((el, i) => (
																		<tr key={el?.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b-1">
																			<td className="px-4 py-2">{`${index + 1}.${i + 1}`}</td>
																			<td className="px-4 py-2">{el?.name}</td>
																			<td className="px-4 py-2">{el?.pport_no}</td>
																			<td className="px-4 py-2">{el?.pin}</td>
																			<td className="px-4 py-2">
																				{(() => {
																					switch (el?.admission_type) {
																						case 2:
																							return 'Qurilmalarni olib kirish/chiqish';
																						case 1:
																							return 'Faqat kirish';
																						case 0:
																							return 'Ekskursiya';
																						default:
																							return '';
																					}
																				})()}
																			</td>
																			<td className="px-4 py-2">
																				{(() => {
																					switch (el?.admission_time) {
																						case 1:
																							return 'Kecha-kunduz';
																						case 0:
																							return '9:00 - 18:00';
																						default:
																							return '';
																					}
																				})()}
																			</td>
																			<td className="px-4 py-2">
																				{dataCenterList?.length > 0 ? (
																					dataCenterList.map((option) => {
																						const isSelected = el?.data_center?.includes(option?.id);
																						
																						return (
																							<div
																								key={option?.id}
																								className={`px-4 py-2 border rounded cursor-pointer
                                                  ${isSelected ? 'text-white' : 'bg-white text-gray-800 border-gray-300'}`}
																								style={{
																									background: isSelected ? currentColor : ''
																								}}
																							>
																								{option?.name}
																							</div>
																						);
																					})
																				) : (
																					<span className="text-gray-500 italic">No data centers available</span>
																				)}
																			</td>
																		</tr>
																	))}
																	</tbody>
																</table>
															</td>
														</tr>
													)}
												</React.Fragment>
											)
										})}
										</tbody>
									</table>
								</>
								:
								<h1 className="text-center dark:bg-white">Batafsil ma'lumot yo'q</h1>
						}
					</>
				)
			case 2:
				return (
					<>
						<div className="flex items-end gap-4">
							<div className={'w-2/5'}>
								<Input
									label={'Shartnoma raqami'}
									placeholder={'Shartnoma raqami'}
									type={'text'}
									value={contract_number || ''}
									onChange={(e) => setContractNumber(e.target.value.toUpperCase())}
								/>
							</div>
							<button
								className="rounded px-4 py-1.5 mt-5 disabled:opacity-25"
								style={{border: `1px solid ${currentColor}`}}
								disabled={!contract_number}
								onClick={searchContract}
							>
								<BiSearch className="size-6" color={currentColor}/>
							</button>
						</div>
						<div className="flex justify-between flex-wrap gap-4 my-4">
							<div className={'w-[49%]'}>
								<Input
									label={'Tashkilot nomi'}
									placeholder={'Tashkilot nomi'}
									type={'text'}
									disabled={true}
									value={contract[0]?.client?.name || ''}
								/>
							</div>
							<div className={'w-[49%]'}>
								<Input
									label={'STIR/JShShIR'}
									placeholder={'STIR/JShShIR'}
									type={'text'}
									disabled={true}
									value={contract[0]?.client?.pin_or_tin || ''}
								/>
							</div>
							<div className={'w-[49%]'}>
								<label
									htmlFor="client"
									className={'block text-gray-700 text-sm font-bold mb-2 ml-3'}
								>
									Tenant turi
								</label>
								<select
									name="client"
									id="client"
									className={`w-full py-2 px-3 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1 shadow`}
									value={tenant_type || ''}
									onChange={(e) => setTenantType(e.target.value)}
								>
									<option value="" disabled={tenant_type}>Tanlang...</option>
									<option value="1">O'z o'ziga xizmat</option>
									<option value="2">Tenant</option>
								</select>
							</div>
							{tenant_type === '2' && (
								<div className={'w-[49%]'}>
									<label
										htmlFor="client"
										className={'block text-gray-700 text-sm font-bold mb-2 ml-3'}
									>
										Mijoz turi
									</label>
									<select
										name="client"
										id="client"
										className={`w-full px-3 py-2 rounded focus:outline-none focus:shadow focus:border-blue-500 border mb-1 shadow`}
										value={client}
										onChange={(e) => setClient(e.target.value)}
									>
										<option value="" disabled={client}>Tanlang...</option>
										<option value="fiz">Jismoniy</option>
										<option value="yur">Yuridik</option>
									</select>
								</div>
							)}
							{client === 'yur' && (
								<>
									<div className={'w-[49%] flex items-end gap-4'}>
										<div className={'w-full'}>
											<Input
												value={stir}
												onChange={(e) => {
													const re = /^[0-9\b]+$/;
													if (e.target.value === '' || re.test(e.target.value)) {
														setStir(e.target.value.slice(0, 9));
													}
												}}
												label={'Tenantning STIR raqami'}
											/>
										</div>
										<button
											className={`px-4 py-2 rounded text-white ${stir.length === 9 ? 'opacity-1' : 'opacity-50'}`}
											style={{backgroundColor: currentColor}}
											onClick={searchUserJuridic}
											disabled={stir.length !== 9}
										>
											Izlash
										</button>
									</div>
									<div className={'w-[49%]'}>
										<Input
											label={'Tenant nomi'}
											placeholder={'Tenant nomi'}
											type={'text'}
											value={name || ''}
											disabled={true}
										/>
									</div>
								</>
							)}
							{client === 'fiz' && (
								<>
									<div className={'w-[49%] flex items-end gap-4'}>
										<div className={'w-full flex items-end gap-4'}>
											<div className={'w-2/5'}>
												<Input
													label={'Passport malumotlari'}
													placeholder={'Passport seriyasi va raqami'}
													value={tenant_serial || ''}
													onChange={(e) => setTenantSerial(e.target.value.toUpperCase().slice(0, 9))}
													type={'text'}
												/>
											</div>
											<div className={'w-3/5'}>
												<Input
													label={''}
													placeholder={'JShIShIR'}
													onChange={(e) => {
														const re = /^[0-9\b]+$/;
														if (e.target.value === '' || re.test(e.target.value)) {
															setTenantPin(e.target.value.slice(0, 14));
														}
													}}
													value={tenant_pin || ''}
													type={'text'}
												/>
											</div>
										</div>
										<button
											className={'px-4 py-2 rounded text-white disabled:opacity-25'}
											style={{backgroundColor: currentColor}}
											onClick={searchTenantFiz}
											disabled={!tenant_serial || !tenant_pin}
										>
											Izlash
										</button>
									</div>
									<div className={'w-[49%]'}>
										<Input
											label={'Tenant ismi'}
											placeholder={'Tenant ismi'}
											type={'text'}
											value={tenant_name || ''}
											disabled={true}
										/>
									</div>
								</>
							)}
							<div className={'w-[49%]'}>
								<Input
									label={'Xat raqami'}
									placeholder={'Xat raqami'}
									type={'text'}
									value={letter_number || ''}
									onChange={(e) => setLetterNumber(e.target.value)}
								/>
							</div>
							<div className={'w-[49%]'}>
								<Input
									label={'Xat sanasi'}
									placeholder={'Xat sanasi'}
									type={'date'}
									value={letter_date || ''}
									onChange={(e) => setLetterDate(e.target.value)}
								/>
							</div>
							<div className={'w-[49%]'}>
								<Input
									label={'Ruxsatnoma amal qilish sanasi'}
									placeholder={'Ruxsatnoma amal qilish sanasi'}
									type={'date'}
									value={completed_date || ''}
									onChange={(e) => setCompletedDate(e.target.value)}
								/>
							</div>
							<div className={'w-[49%]'}>
								<Input
									label={"Xat bo'yicha mutahassislar soni"}
									placeholder={"Xat bo'yicha mutahassislar soni"}
									type={'text'}
									value={employees_count || ''}
									onChange={(e) => {
										const re = /^[0-9\b]+$/;
										if (e.target.value === '' || re.test(e.target.value)) {
											setEmployeesCount(e.target.value);
										}
									}}
								/>
							</div>
							<div className={'w-[49%]'}>
								<Input
									label={"Xat biriktirish"}
									placeholder={"Xat biriktirish"}
									type={'file'}
									onChange={(e) => setFile(e.target.files[0])}
								/>
							</div>
						</div>
						
						{employees?.map((item, index) => (
							<div key={index} className="flex justify-between flex-wrap p-4 gap-4 mb-4 rounded border border-dashed">
								<div className="w-full flex items-end gap-4 justify-between">
									<div className={'w-8/12 flex items-end gap-4'}>
										<div className={'w-9/12'}>
											<Input
												label={'Passport malumotlari'}
												placeholder={'Passport seriyasi va raqami'}
												type={'text'}
												value={item.pport_no || ''}
												onChange={(e) => changeEmployee({
													value: e.target.value?.toString()?.toUpperCase(),
													name: "pport_no"
												}, index)}
											/>
										</div>
										<div className={'w-10/12'}>
											<Input
												label={''}
												placeholder={'JShIShIR'}
												value={item?.pin || ""}
												onChange={(e) => {
													const re = /^[0-9\b]+$/;
													if (e.target.value === '' || re.test(e.target.value)) {
														changeEmployee({value: e.target.value.slice(0, 14), name: "pin"}, index)
													}
												}}
												type={'text'}
											/>
										</div>
										<button
											className="rounded px-4 py-1.5 mt-5 disabled:opacity-25"
											style={{border: `1px solid ${currentColor}`}}
											disabled={!item?.pin || !item?.pport_no}
											onClick={() => searchUserPhysics(index)}
										>
											<BiSearch className="size-6" color={currentColor}/>
										</button>
									</div>
									<button
										disabled={employees.length === 1} onClick={() => handleDeleteEmployee(index)}
										className="rounded px-4 py-1.5 mt-5 border border-red-500 disabled:opacity-25"
									>
										<TrashIcon className="size-6" color={'rgb(239 68 68)'}/>
									</button>
								</div>
								<div className={'w-[49%]'}>
									<Input
										label={"Ism"}
										placeholder={"Ism"}
										type={'text'}
										value={item?.name || ''}
										onChange={(e) => changeEmployee({value: e.target.value, name: "name"}, index)}
									/>
								</div>
								<div className={'w-[49%]'}>
									<Input
										label={"Familiya"}
										placeholder={"Familiya"}
										type={'text'}
										value={item?.sur_name || ''}
										onChange={(e) => changeEmployee({
											value: e.target.value?.toString()?.toUpperCase(),
											name: "sur_name"
										}, index)}
									/>
								</div>
								<div className={'w-[49%]'}>
									<Input
										label={"Otasining ismi"}
										placeholder={"Otasining ismi"}
										type={'text'}
										value={item?.mid_name || ''}
										onChange={(e) => changeEmployee({
											value: e.target.value?.toString()?.toUpperCase(),
											name: "mid_name"
										}, index)}
									/>
								</div>
								<div className={'w-[49%]'}>
									<Input
										label={"Yashash joyi"}
										placeholder={"Yashash joyi"}
										type={'text'}
										value={item?.per_adr || ""}
										onChange={(e) => changeEmployee({
											value: e.target.value?.toString()?.toUpperCase(),
											name: "per_adr"
										}, index)}
									/>
								</div>
								<div className={'w-[49%] flex flex-col'}>
									<label
										className="block text-gray-700 text-sm font-bold mb-1 ml-3"
										htmlFor="device_name"
									>
										Ruxsatnoma turi
									</label>
									<div className="flex items-center gap-2">
										<div
											className={`px-4 py-2 border rounded cursor-pointer
                          ${item?.admission_type === 2 ? `text-white` : 'bg-white text-gray-800 border-gray-300'}
                        `}
											style={{
												background: item?.admission_type === 2 ? currentColor : ''
											}}
											onClick={() => changeEmployee({value: 2, name: 'admission_type'}, index)}
										>
											Qurilmalarni olib kirish/chiqish
										</div>
										<div
											className={`px-4 py-2 border rounded cursor-pointer
                          ${item?.admission_type === 1 ? `text-white` : 'bg-white text-gray-800 border-gray-300'}
                        `}
											style={{
												background: item?.admission_type === 1 ? currentColor : ''
											}}
											onClick={() => changeEmployee({value: 1, name: 'admission_type'}, index)}
										>
											Faqat kirish
										</div>
										<div
											className={`px-4 py-2 border rounded cursor-pointer
                          ${item?.admission_type === 0 ? `text-white` : 'bg-white text-gray-800 border-gray-300'}
                        `}
											style={{
												background: item?.admission_type === 0 ? currentColor : ''
											}}
											onClick={() => changeEmployee({value: 0, name: 'admission_type'}, index)}
										>
											Ekskursiya
										</div>
									</div>
								</div>
								<div className={'w-[49%] flex flex-col'}>
									<label
										className="block text-gray-700 text-sm font-bold mb-1 ml-3"
										htmlFor="device_name"
									>
										Ruxsatnoma vaqti
									</label>
									<div className="flex items-center gap-2 py-1.5 px-2">
										<div
											className={`px-4 py-2 border rounded cursor-pointer
                          ${item?.admission_time === 0 ? `text-white` : 'bg-white text-gray-800 border-gray-300'}
                        `}
											style={{
												background: item?.admission_time === 0 ? currentColor : ''
											}}
											onClick={() => changeEmployee({value: 0, name: 'admission_time'}, index)}
										>
											9:00 - 18:00
										</div>
										<div
											className={`px-4 py-2 border rounded cursor-pointer
                          ${item?.admission_time === 1 ? `text-white` : 'bg-white text-gray-800 border-gray-300'}
                        `}
											style={{
												background: item?.admission_time === 1 ? currentColor : ''
											}}
											onClick={() => changeEmployee({value: 1, name: 'admission_time'}, index)}
										>
											Kecha-kunduz
										</div>
									</div>
								</div>
								<div className={'w-[49%] flex flex-col'}>
									<label
										className="block text-gray-700 text-sm font-bold mb-1 ml-3"
										htmlFor="device_name"
									>
										Data markaz
									</label>
									<div className="flex flex-wrap gap-2">
										{dataCenterList && dataCenterList?.map((option) => (
											<div
												key={option?.id}
												className={`px-4 py-2 border rounded cursor-pointer
                        ${item?.data_center.includes(option?.id) ? `text-white` : 'bg-white text-gray-800 border-gray-300'}
                      `}
												style={{
													background: item?.data_center.includes(option?.id) ? currentColor : ''
												}}
												onClick={() => changeEmployee({value: option?.id, name: "data_center"}, index)}
											>
												{option?.name}
											</div>
										))}
									</div>
								</div>
								<div className="w-full">
									<label
										className="block text-gray-700 text-sm font-bold mb-1 ml-3"
										htmlFor="device_name"
									>
										Izoh
									</label>
									<textarea
										value={item?.additional_info || ''}
										onChange={(e) => changeEmployee({value: e.target.value, name: "additional_info"}, index)}
										name="additional_info"
										id="additional_info"
										cols="30"
										rows="10"
										className="w-full rounded outline-none border p-2"
									/>
								</div>
							</div>
						))}
						<div className="flex justify-center">
							<button
								onClick={handleAddEmployee} className="px-4 py-2 text-white rounded disabled:opacity-25"
								style={{background: currentColor}}
								disabled={!employees_count || employees.length === Number(employees_count)}
							>
								Qo'shish
							</button>
						</div>
						<div className="w-full flex items-center justify-between">
							<div>
								<button
									className={'px-4 py-2 rounded'}
									style={{
										color: currentColor,
										border: `1px solid ${currentColor}`
									}}
									onClick={clearData}
								>
									Bekor qilish
								</button>
							</div>
							<button
								className={`px-4 py-2 rounded text-white disabled:opacity-25`}
								style={{backgroundColor: currentColor}}
								onClick={create}
								disabled={handleValidate()}
							>
								Saqlash
							</button>
						</div>
					</>
				)
			default:
				return null
		}
	}
	
	if (loading) return <Loader/>
	
	return (
		<>
			<div className="m-1 md:mx-4 md:my-8 mt-24 p-2 md:px-4 md:py-4 bg-white dark:bg-secondary-dark-bg rounded">
				<TabsRender
					tabs={tabs}
					color={currentColor}
					openTab={openTab}
					setOpenTab={setOpenTab}
				/>
			</div>
			<div className="m-1 md:mx-4 md:my-8 mt-24 p-2 md:px-4 md:py-4 bg-white dark:bg-secondary-dark-bg rounded">
				{displayStep(openTab)}
			</div>
		</>
	);
};

export default AdmissionDataCenter;