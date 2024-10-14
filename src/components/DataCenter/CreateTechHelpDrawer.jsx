import React, {useState} from 'react';
import {useStateContext} from "../../contexts/ContextProvider";
import {useDispatch, useSelector} from "react-redux";
import {Input, Loader} from "../index";
import {clearStatesFirstStep, getUserByTin} from "../../redux/slices/contractCreate/FirstStepSlices";
import {createTechHelp, getTechHelp} from "../../redux/slices/dataCenter/dataCenterSlice";
import {toast} from "react-toastify";

const CreateTechHelpDrawer = ({onclose}) => {
	
	const {currentColor} = useStateContext();
	const dispatch = useDispatch()
	
	const {loading} = useSelector(state => state.dataCenter)
	
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
	
	const searchUserJuridic = () => {
		dispatch(getUserByTin({stir, client: 'yur'})).then((res) => {
			setName(res?.payload?.name === null ? '' : res?.payload?.name)
		})
	}
	
	const clear = () => {
		setStir('');
		setName('')
		setContractNumber('')
		setStartDate('')
		setEndDate('')
		setPayAmount('')
		setPayAmountMonth('')
		setPaymentType('')
		setPaymentStatus('')
		setReminderOnceDate('')
		setReminderType('')
		dispatch(clearStatesFirstStep())
		onclose()
	}
	
	const handleValidate = () => {
		return !stir || !name || !contract_number || !start_date || !end_date || !pay_amount ||
			!pay_amount_month || !payment_status || !payment_type || !reminder_type || !reminder_once_date;
	}
	
	const createTech = () => {
		const data = {
			tin: stir,
			contract_number,
			start_date: new Date(start_date).toISOString(),
			end_date: new Date(end_date).toISOString(),
			payment_type,
			payment_status,
			pay_amount,
			pay_amount_month,
			reminder_type,
			reminder_once_date: new Date(reminder_once_date).toISOString(),
			reminder_monthly_date: new Date(reminder_once_date).toISOString()
		}
		dispatch(createTechHelp(data)).then((res) => {
			if (res?.payload?.id) {
				toast.success('Muvofaqqiyatli yaratildi!')
				clear()
				dispatch(getTechHelp())
			} else {
				return toast.error('Xatolik')
			}
		})
	}
	
	return (
		<div
			className="fixed top-0 right-0 w-full h-screen z-50 bg-[rgba(0,0,0,0.5)]"
			style={{boxShadow: "0 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12)"}}
		>
			<div
				className="bg-white dark:bg-secondary-dark-bg dark:text-white w-2/4 h-full ml-auto overflow-y-scroll py-8 px-16">
				<button
					className="px-4 py-2 rounded border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
					onClick={clear}
				>
					Yopish
				</button>
				
				{loading ? <Loader/> : (
					<>
						<div className="w-full flex items-center flex-wrap justify-between my-4">
							<div className={'w-8/12 flex items-end gap-4'}>
								<div className={'w-full'}>
									<Input
										value={stir}
										onChange={(e) => {
											const re = /^[0-9\b]+$/;
											if (e.target.value === '' || re.test(e.target.value)) {
												setStir(e.target.value.slice(0, 9));
											}
										}}
										label={'Tashkilotning STIR raqami'}
										className={`${stir.length === 9 ? 'border border-green-500' : ''}`}
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
							<div className="w-[49%] my-4">
								<Input
									value={name || ''}
									disabled={true}
									label={'Tashkilot nomi'}
								/>
							</div>
							<div className="w-[49%]">
								<Input
									value={contract_number || ''}
									onChange={(e) => setContractNumber(e.target.value)}
									type={'text'}
									label={'Shartnoma raqami'}
								/>
							</div>
							<div className="w-[49%]">
								<Input
									value={start_date || ''}
									onChange={(e) => setStartDate(e.target.value)}
									type={'date'}
									label={'Shartnoma sanasi'}
								/>
							</div>
							<div className="w-[49%]">
								<Input
									value={end_date || ''}
									onChange={(e) => setEndDate(e.target.value)}
									type={'date'}
									label={'Amal qilish sanasi'}
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
								/>
							</div>
						</div>
						
						<div className="w-full flex justify-between items-center">
							<button
								className={`px-4 py-2 rounded border border-red-500 text-red-500`}
								onClick={clear}
							>
								Bekor qilish
							</button>
							<button
								className={`px-4 py-2 rounded text-white disabled:opacity-25`}
								style={{backgroundColor: currentColor}}
								disabled={handleValidate()}
								onClick={createTech}
							>
								Saqlash
							</button>
						</div>
					</>
				)}
			</div>
		
		</div>
	);
};

export default CreateTechHelpDrawer;