import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useStateContext} from "../../contexts/ContextProvider";
import {Input, Loader} from "../index";
import moment from "moment";
import {BiSearch} from "react-icons/bi";
import {ArrowDownTrayIcon, TrashIcon} from "@heroicons/react/16/solid";
import {getUserByTin} from "../../redux/slices/contractCreate/FirstStepSlices";

const AdmissionDrawer = ({onclose, id, type}) => {
	const dispatch = useDispatch();
	
	const {currentColor} = useStateContext();
	
	const {loading, admissionLetterDetail, dataCenterList} = useSelector(state => state.dataCenter)

	const [letter_number, setLetterNumber] = useState(null)
	const [letter_date, setLetterDate] = useState(null)
	const [file, setFile] = useState(undefined)
	const [employees_count, setEmployeesCount] = useState(null)
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

	useEffect(() => {
		if (type === 'put') {
			const employeeObjects = admissionLetterDetail?.employees?.map((item, index) => ({
				pin: item?.pin,
				pport_no: item.pport_no,
				name: item?.name,
				admission_type: item?.admission_type,
				admission_time: item?.admission_time,
				data_center: item?.data_center,
				admission_status: 0,
				additional_info: item?.additional_info
			}))
			setEmployees(employeeObjects)
			setEmployeesCount(admissionLetterDetail?.employees?.length)
			setLetterDate(admissionLetterDetail?.letter_date?.split("T")[0])
			setLetterNumber(admissionLetterDetail?.letter_number)
		}
	}, [id, type]);

	const handleAddEmployee = () => {
		const employee = [...employees, {
			pin: "",
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

	const handleValidate = () => {
		for (const currentEmployee of employees) {
			if (
				!letter_number || !letter_date || !employees_count ||
				!currentEmployee?.pin || !currentEmployee?.pport_no ||
				!currentEmployee?.name || currentEmployee?.admission_type === null || currentEmployee?.admission_time === null || currentEmployee.data_center.length === 0 ||
				Number(employees_count) !== employees?.length
			) {
				return true
			}
		}

		return false
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

	const clearData = () => {
		onclose()
		setLetterNumber(null)
		setLetterDate(null)
		setFile(undefined)
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
	
	return (
		<div
			className="fixed top-0 right-0 w-full h-screen z-50 bg-[rgba(0,0,0,0.5)]"
			style={{boxShadow: "0 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12)"}}
		>
			<div
				className="bg-white dark:bg-secondary-dark-bg dark:text-white w-2/4 h-full ml-auto overflow-y-scroll py-8 px-16"
			>
				<div className="flex flex-col gap-4">
					<button
						className="px-4 py-2 w-[10%] rounded border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
						onClick={onclose}
					>
						Yopish
					</button>
				</div>

				{loading ? <Loader /> : (
					<>
						{type === 'put' && (
							<>
								<div className="font-bold text-center">Shartnoma maʼlumotlari</div>
								<div className="my-4 flex justify-between">
									<div className="w-[49%] flex flex-wrap gap-4 rounded border p-4">
										<div className="showRack_rackBlock-infoBody-contractInfo_block_title">
											{/*<ContractIcon />*/}
											<span className="font-bold">Shartnoma</span>
										</div>
										<div className={'w-full flex items-end gap-4'}>
											<div className={'w-full'}>
												<Input
													value={admissionLetterDetail?.contract || ''}
													label={'Shartnoma raqami'}
													disabled={true}
													type={'text'}
												/>
											</div>
										</div>
										<div className="w-full">
											<Input
												label={'STIR/JShShIR'}
												value={admissionLetterDetail?.client?.pin_or_tin || ""}
												type={'text'}
												disabled={true}
											/>
										</div>
										<div className="w-full">
											<Input
												label={"Xat bo'yicha xodim soni"}
												value={employees_count || ''}
												onChange={(e) => {
													const re = /^[0-9\b]+$/;
													if (e.target.value === '' || re.test(e.target.value)) {
														setEmployeesCount(e.target.value);
													}
												}}
												type={'text'}
											/>
										</div>
									</div>

									<div className="w-[49%] flex flex-wrap gap-4 rounded border p-4">
										<div>
											<span className="font-bold">Mijoz</span>
										</div>
										<div className="w-full">
											<Input
												label={'F.I.SH'}
												value={admissionLetterDetail?.client?.name || ""}
												type={'text'}
												disabled={true}
											/>
										</div>
										<div className="w-full">
											<Input
												label={'Xat raqami'}
												type={'text'}
												value={letter_number || ''}
												onChange={(e) => setLetterNumber(e.target.value)}
											/>
										</div>
										<div className="w-full">
											<Input
												label={'Xat sanasi'}
												type={'date'}
												value={letter_date || ''}
												onChange={(e) => setLetterDate(e.target.value)}
											/>
										</div>
									</div>
								</div>

								<div className="w-full flex flex-wrap gap-4 rounded border p-4">
									<div>
										<span className="font-bold">Xodim</span>
									</div>
									{employees?.map((item, index) => (
										<div key={index}
												 className="flex justify-between flex-wrap p-4 gap-4 mb-4 rounded border border-dashed"
										>
											<div className="w-full flex items-end gap-4 justify-between">
												<div className={'w-full flex items-end gap-4'}>
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
											<div className={'w-full'}>
												<Input
													label={"Ism"}
													placeholder={"Ism"}
													type={'text'}
													value={item?.name || ''}
													onChange={(e) => changeEmployee({value: e.target.value, name: "name"}, index)}
												/>
											</div>
											<div className={'w-full'}>
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
											<div className={'w-full'}>
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
											<div className={'w-full'}>
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
											<div className={'w-full flex flex-col'}>
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
											<div className={'w-full flex flex-col'}>
												<label
													className="block text-gray-700 text-sm font-bold mb-1 ml-3"
													htmlFor="device_name"
												>
													Ruxsatnoma vaqti
												</label>
												<div className="flex items-center gap-2 py-1.5">
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
											<div className={'w-full flex flex-col'}>
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
									<div className={'w-full'}>
										<Input
											label={"Xat biriktirish"}
											placeholder={"Xat biriktirish"}
											type={'file'}
											onChange={(e) => setFile(e.target.files[0])}
										/>
										<button className="p-1 border rounded mt-4 ml-2" title="Xat yuklab olish">
											<a href={admissionLetterDetail?.file} target="_blank">
												<ArrowDownTrayIcon className="size-7" style={{color: currentColor}}/>
											</a>
										</button>
									</div>
									<div className="flex justify-center w-full">
										<button
											onClick={handleAddEmployee} className="px-4 py-2 text-white rounded disabled:opacity-25"
											style={{background: currentColor}}
											disabled={!employees_count || employees.length === Number(employees_count)}
										>
											Qo'shish
										</button>
									</div>
								</div>
								<div className="w-full flex items-center justify-between my-4">
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
										// onClick={create}
										disabled={handleValidate()}
									>
										Saqlash
									</button>
								</div>
							</>
						)}

						{type === 'get' && (
							<>
								<div className="font-bold text-center">Shartnoma maʼlumotlari</div>
								<div className="my-4 flex justify-between">
									<div className="w-[49%] flex flex-wrap gap-4 rounded border p-4">
										<div className="showRack_rackBlock-infoBody-contractInfo_block_title">
											{/*<ContractIcon />*/}
											<span className="font-bold">Shartnoma</span>
										</div>
										<div className={'w-full flex items-end gap-4'}>
											<div className={'w-full'}>
												<Input
													value={admissionLetterDetail?.contract || ''}
													label={'Shartnoma raqami'}
													disabled={true}
													type={'text'}
												/>
											</div>
										</div>
										<div className="w-full">
											<Input
												label={'STIR/JShShIR'}
												value={admissionLetterDetail?.client?.pin_or_tin || ""}
												type={'text'}
												disabled={true}
											/>
										</div>
										<div className="w-full">
											<Input
												label={"Xat bo'yicha xodim soni"}
												value={admissionLetterDetail?.employee_count || ""}
												type={'text'}
												disabled={true}
											/>
										</div>
									</div>

									<div className="w-[49%] flex flex-wrap gap-4 rounded border p-4">
										<div>
											<span className="font-bold">Mijoz</span>
										</div>
										<div className="w-full">
											<Input
												label={'F.I.SH'}
												value={admissionLetterDetail?.client?.name || ""}
												type={'text'}
												disabled={true}
											/>
										</div>
										<div className="w-full">
											<Input
												label={'Xat raqami'}
												value={admissionLetterDetail?.letter_number || ""}
												type={'text'}
												disabled={true}
											/>
										</div>
										<div className="w-full">
											<Input
												label={'Xat sanasi'}
												value={moment(admissionLetterDetail?.letter_date).format('DD-MM-YYYY') || ""}
												type={'text'}
												disabled={true}
											/>
										</div>
									</div>
								</div>
								<div className="w-full flex flex-wrap gap-4 rounded border p-4">
									<div>
										<span className="font-bold">Xodim</span>
									</div>

									{admissionLetterDetail?.employees?.map((item, index) => (
										<div key={index} className="flex justify-between flex-wrap p-4 gap-4 mb-4 rounded border border-dashed">
											<div className="w-full flex items-end gap-4 justify-between">
												<div className={'w-full flex items-end justify-between gap-4'}>
													<div className={'w-[49%]'}>
														<Input
															label={'Passport malumotlari'}
															placeholder={'Passport seriyasi va raqami'}
															type={'text'}
															value={item.pport_no || ''}
															disabled={true}
														/>
													</div>
													<div className={'w-[49%]'}>
														<Input
															label={''}
															placeholder={'JShIShIR'}
															value={item?.pin || ""}
															disabled={true}
															type={'text'}
														/>
													</div>
												</div>
											</div>
											<div className={'w-full'}>
												<Input
													label={"Ism"}
													placeholder={"Ism"}
													type={'text'}
													value={item?.name || ''}
													disabled={true}
												/>
											</div>
											<div className={'w-full flex flex-col'}>
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
												<div className="flex items-center gap-2 py-1.5">
													<div
														className={`px-4 py-2 border rounded cursor-pointer 
                          ${item?.admission_time === 0 ? `text-white` : 'bg-white text-gray-800 border-gray-300'}
                        `}
														style={{
															background: item?.admission_time === 0 ? currentColor : ''
														}}
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
													disabled={true}
													name="additional_info"
													id="additional_info"
													cols="30"
													rows="10"
													className="w-full rounded outline-none border p-2"
												/>
											</div>
										</div>
									))}
								</div>
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default AdmissionDrawer;