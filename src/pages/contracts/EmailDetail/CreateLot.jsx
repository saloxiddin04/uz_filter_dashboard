import React, {useState} from 'react';
import {useStateContext} from "../../../contexts/ContextProvider";
import {useDispatch} from "react-redux";
import {toast} from "react-toastify";
import instance from "../../../API";
import {useParams} from "react-router-dom";
import {getContractDetail} from "../../../redux/slices/contracts/contractsSlice";
import {Loader} from "../../../components";

const CreateLot = () => {
	const {currentColor} = useStateContext();
	const dispatch = useDispatch()
	const {id, slug} = useParams();
	
	const [loader, setLoader] = useState(false)
	
	const [lot_number, setLotNumber] = useState('')
	const [contract_date, setContractDate] = useState('')
	
	const today = new Date();
	const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
	const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
	
	const createLot = async () => {
		try {
			setLoader(true)
			const response = await instance.post(`e-xat/enter-lot-number/${id}`, {lot_number})
			if (response?.data?.id) {
				toast.success("Muvofaqqiyatli qo'shildi")
				dispatch(getContractDetail({id, slug}))
				setLotNumber('')
				setContractDate('')
			}
		} catch (e) {
			setLoader(false)
			return toast.error(e.message)
		}
	}
	
	if (loader) return <Loader/>
	
	return (
		<>
			<div className={'flex flex-col'}>
				<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="lot_number">Lot raqamini
					kiriting</label>
				<input
					value={lot_number}
					onChange={(e) => setLotNumber(e.target.value)}
					name="lot_number"
					id="lot_number"
					type="text"
					className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
				/>
			</div>
			
			{/*<div className={'flex flex-col my-4'}>*/}
			{/*	<label className="block text-gray-700 text-sm font-bold mb-1 ml-3" htmlFor="contract_date">Shartnoma*/}
			{/*		sanasi</label>*/}
			{/*	<input*/}
			{/*		value={contract_date}*/}
			{/*		min={firstDayOfMonth}*/}
			{/*		max={lastDayOfMonth}*/}
			{/*		onChange={(e) => setContractDate(e.target.value)}*/}
			{/*		name="contract_date"*/}
			{/*		id="contract_date"*/}
			{/*		type="date"*/}
			{/*		className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"*/}
			{/*	/>*/}
			{/*</div>*/}
			
			<div className="flex justify-end">
				<button
					className={`px-4 py-2 rounded text-white disabled:opacity-25`}
					style={{backgroundColor: currentColor}}
					disabled={!lot_number}
					onClick={createLot}
				>
					Saqlash
				</button>
			</div>
		</>
	);
};

export default CreateLot;