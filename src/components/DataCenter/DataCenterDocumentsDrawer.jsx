import React, {useState} from 'react';
import {Input, Loader} from "../index";
import {useStateContext} from "../../contexts/ContextProvider";
import {useDispatch, useSelector} from "react-redux";
import {createAktAndFaza, getRackContractInfo} from "../../redux/slices/dataCenter/dataCenterSlice";
import {toast} from "react-toastify";

const DataCenterDocumentsDrawer = ({onclose, step}) => {
	const {currentColor} = useStateContext();
	const dispatch = useDispatch()
	const {loading} = useSelector((state) => state.dataCenter)
	
	// faza state
	const [document_number, setDocumentNumber] = useState('')
	const [document_date, setDocumentDate] = useState('')
	
	const createFaza = () => {
		dispatch(createAktAndFaza({
			document_date: new Date(document_date),
			document_number,
			type_of_document: 1
		})).then((res) => {
			if (res?.payload?.id) {
				toast.success("Muvofaqqiyatli yaratildi!")
				onclose()
				setDocumentNumber('')
				setDocumentDate('')
			} else {
				return toast.error('Xatolik')
			}
		})
	}
	
	// akt state
	const [contract_number, setContractNumber] = useState('')
	const [akt_document_number, setAktDocumentNumber] = useState('')
	const [akt_document_date, setAktDocumentDate] = useState('')
	
	const createAkt = () => {
		dispatch(createAktAndFaza({
			document_date: new Date(akt_document_date),
			document_number: akt_document_number,
			type_of_document: 2
		})).then((res) => {
			if (res?.payload?.id) {
				toast.success("Muvofaqqiyatli yaratildi!")
				onclose()
				setContractNumber('')
				setAktDocumentNumber('')
				setAktDocumentDate('')
			} else {
				return toast.error('Xatolik')
			}
		})
	}
	
	const displayStep = () => {
		switch (step) {
			case 0:
				return (
					<>
						<div className="w-full my-4 flex flex-wrap gap-4">
							<div className="w-full">
								<Input
									label={'Nomlanishi'}
									value={document_number}
									onChange={(e) => setDocumentNumber(e.target.value)}
									type={'text'}
								/>
							</div>
							<div className="w-full">
								<Input
									label={'Shartnoma sanasi'}
									value={document_date || ''}
									onChange={(e) => setDocumentDate(e.target.value)}
									type={'date'}
								/>
							</div>
							
							<div className="w-full flex items-center justify-between">
								<button
									className="py-2 px-1 rounded disabled:opacity-25"
									style={{border: `1px solid ${currentColor}`, color: currentColor}}
									onClick={createFaza}
									disabled={!document_date || !document_number}
								>
									Saqlash
								</button>
								<button
									className="py-2 px-1 rounded border border-red-500 text-red-500 hover:bg-red-500 hover:text-white duration-500">Bekor
									qilish
								</button>
							</div>
						</div>
					</>
				)
			case 1:
				return (
					<>
						<div className="w-full my-4 flex flex-wrap gap-4">
							<div className="w-full flex items-end gap-2">
								<div className="w-3/4">
									<Input
										value={contract_number}
										onChange={(e) => setContractNumber(e.target.value?.toUpperCase())}
										label={'Shartnoma raqami'}
									/>
								</div>
								<button
									className="w-1/4 px-1 py-2 rounded text-white disabled:opacity-25"
									style={{
										backgroundColor: currentColor
									}}
									disabled={!contract_number}
									onClick={() => dispatch(getRackContractInfo({contract_number}))}
								>
									Izlash
								</button>
							</div>
							<div className="w-full flex flex-wrap justify-between gap-2">
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
										value={akt_document_number}
										onChange={(e) => setAktDocumentNumber(e.target.value)}
										label={'Akt raqami'}
									/>
								</div>
								<div className={'w-[49%]'}>
									<Input
										value={akt_document_date}
										onChange={(e) => setAktDocumentDate(e.target.value)}
										type={'date'}
										label={"Akt sanasi"}
									/>
								</div>
							</div>
							
							<div className="w-full flex items-center justify-between">
								<button className="py-2 px-1 rounded"
								        style={{border: `1px solid ${currentColor}`, color: currentColor}}>Saqlash
								</button>
								<button
									className="py-2 px-1 rounded border border-red-500 text-red-500 hover:bg-red-500 hover:text-white duration-500">Bekor
									qilish
								</button>
							</div>
						</div>
					</>
				)
			default:
				return null
		}
	}
	
	if (loading) return <Loader />
	
	return (
		<div
			className="fixed top-0 right-0 w-full h-screen z-50 bg-[rgba(0,0,0,0.5)]"
			style={{boxShadow: "0 8px 10px -5px rgba(0, 0, 0, 0.2), 0px 16px 24px 2px rgba(0, 0, 0, 0.14), 0px 6px 30px 5px rgba(0, 0, 0, 0.12)"}}
		>
			<div
				className="bg-white dark:bg-secondary-dark-bg dark:text-white w-2/4 h-full ml-auto overflow-y-scroll py-8 px-16">
				<button
					className="px-4 py-2 rounded border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
					onClick={onclose}
				>
					Yopish
				</button>
				
				{displayStep()}
			</div>
		
		</div>
	);
};

export default DataCenterDocumentsDrawer;