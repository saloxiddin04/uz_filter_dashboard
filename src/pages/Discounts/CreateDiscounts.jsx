import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider";
import {createDiscount, getDiscount, patchDiscount} from "../../redux/slices/discounts/discountSlice";
import {Button, DetailNav, Input} from "../../components";
import {toast} from "react-toastify";

const CreateDiscounts = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const {currentColor} = useStateContext();
	const {id} = useParams()
	
	const {loading, discount} = useSelector(state => state.discount)
	
	const [name, setName] = useState(null)
	const [active, setActive] = useState(false)
	const [discountState, setDiscount] = useState(null)
	const [deadline, setDeadline] = useState(null)
	
	useEffect(() => {
		if (id !== ":id") {
			dispatch(getDiscount({id})).then(({payload}) => {
				setName(payload?.name)
				setActive(payload?.active)
				setDiscount(payload?.discount)
				setDeadline(payload?.deadline?.split("T")[0])
			})
		}
	}, [id, dispatch])
	
	const onlyNumbersValid = (e, setState) => {
		const value = e.target.value;
		if (/^-?\d*\.?\d*$/.test(value)) {
			setState(value);
		}
	};
	
	const handleValidate = () => {
		if (!name) return toast.error("Требуется название скидка")
		if (!discountState) return toast.error("Требуется скидка")
		if (!deadline) return toast.error("Требуется дата оканчания скидка")
	}
	
	const handlePost = () => {
		if (handleValidate()) return;
		
		if (id === ":id") {
			dispatch(createDiscount(
				{
					name,
					discount: discountState,
					active,
					deadline: new Date(deadline).toISOString()
				}
			)).then(({payload}) => {
				if (payload?.id) {
					toast.success("Успешно")
					navigate('/discounts')
					setName(null)
					setActive(false)
					setDiscount(null)
					setDeadline(null)
				}
			})
		} else {
			const data = {
				name,
				discount: discountState,
				active,
				deadline: new Date(deadline).toISOString()
			}
			dispatch(patchDiscount(
				{id, data}
			)).then(({payload}) => {
				if (payload?.id) {
					toast.success("Успешно")
					dispatch(getDiscount({id})).then(({payload}) => {
						setName(payload?.name)
						setActive(payload?.active)
						setDiscount(payload?.discount)
						setDeadline(payload?.deadline?.split("T")[0])
					})
				}
			})
		}
	}
	
	return (
		<>
			<div className="card">
				<DetailNav
					id={id !== ':id' ? discount?.id : ''}
					name={id !== ':id' ? discount?.name : ''}
					status={''}
				/>
			</div>
			
			<div className="card">
				<div className="mb-6 flex items-center justify-between flex-wrap gap-4">
					<div className="w-[49%]">
						<Input
							type="text"
							placeholder="Название скидка"
							label={'Название скидка'}
							value={name || ""}
							onChange={(e) => setName(e.target.value)}
							className={'w-full'}
						/>
					</div>
					<div className="w-[49%]">
						<Input
							type="text"
							placeholder="Скидка (%)"
							label={'Скидка (%)'}
							value={discountState || ""}
							onChange={(e) => onlyNumbersValid(e, setDiscount)}
							className={'w-full'}
						/>
					</div>
					<div className="w-[49%] flex flex-col">
						<label
							htmlFor="active"
							className="block text-gray-700 text-sm font-bold mb-2 ml-3">Положения Скидка</label>
						<select
							value={active || ""}
							onChange={(e) => setActive(e.target.value === "true")}
							className={`w-full border rounded py-1.5 px-3 shadow focus:border focus:border-[${currentColor}]`}
							id="active"
						>
							<option value={""}>Выбрать...</option>
							<option value={"true"}>Актив</option>
							<option value={"false"}>Не актив</option>
						</select>
					</div>
					<div className="w-[49%]">
						<Input
							type="date"
							placeholder="Дата оканчания скидка"
							label={'Дата оканчания скидка'}
							value={deadline || ""}
							onChange={(e) => setDeadline(e.target.value)}
							className={'w-full'}
						/>
					</div>
				</div>
				
				<div className="w-full flex">
					<Button
						text={loading ? 'Loading...' : (id !== ':id' ? "Обновить скидка" : "Создать скидка")}
						style={{backgroundColor: currentColor}}
						className="text-white rounded flex ml-auto disabled:opacity-25"
						onClick={handlePost}
						disabled={loading}
					/>
				</div>
			</div>
		</>
	);
};

export default CreateDiscounts;