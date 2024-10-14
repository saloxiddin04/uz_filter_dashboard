import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import TabsWithBack from "../../components/TabsWithBack";
import {useStateContext} from "../../contexts/ContextProvider";
import {Input, Loader} from "../../components";
import {getTechHelpDetail} from "../../redux/slices/dataCenter/dataCenterSlice";
import moment from "moment";

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
	
	const [openTab, setOpenTab] = useState(tabs.findIndex(tab => tab.active));
	
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
		})
	}, [id]);
	
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
									disabled={location.state?.detail}
								/>
							</div>
							<div className="w-[49%]">
								<Input
									value={contract_number || ''}
									onChange={(e) => setContractNumber(e.target.value)}
									type={'text'}
									label={'Shartnoma raqami'}
									disabled={location.state?.detail}
								/>
							</div>
							<div className="w-[49%]">
								<Input
									value={start_date || ''}
									onChange={(e) => setStartDate(e.target.value)}
									type={'date'}
									label={'Shartnoma sanasi'}
									disabled={location.state?.detail}
								/>
							</div>
							<div className="w-[49%]">
								<Input
									value={end_date || ''}
									onChange={(e) => setEndDate(e.target.value)}
									type={'date'}
									label={'Amal qilish sanasi'}
									disabled={location.state?.detail}
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
									disabled={location.state?.detail}
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
									disabled={location.state?.detail}
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
									disabled={location.state?.detail}
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
					</>
				)
			case 1:
				return (
					<></>
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