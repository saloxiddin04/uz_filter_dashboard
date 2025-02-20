import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider";
import {createDiscount, getDiscount, patchDiscount} from "../../redux/slices/discounts/discountSlice";
import {Button, DetailNav, Input} from "../../components";
import {toast} from "react-toastify";
import moment from "moment/moment";
import {EyeIcon, TrashIcon} from "@heroicons/react/16/solid";
import {deleteAssignment} from "../../redux/slices/discountAssignment/discountAssignmentSlice";

const CreateDiscounts = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const {currentColor} = useStateContext();
	const {id} = useParams()
	
	const {loading, discount} = useSelector(state => state.discount)
	
	const [name, setName] = useState(null)
	const [active, setActive] = useState(true)
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
	
	const handleDeleteAssignment = async (idParams) => {
		try {
			await dispatch(deleteAssignment({id: idParams})).then(() => {
				toast.success("Успешно")
			})
			dispatch(getDiscount({id})).then(({payload}) => {
				setName(payload?.name)
				setActive(payload?.active)
				setDiscount(payload?.discount)
				setDeadline(payload?.deadline?.split("T")[0])
			})
		} catch (e) {
			return e;
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
				
				{id !== ":id" && (
					<div className="relative overflow-x-auto mt-6">
						<h2 className="text-lg font-semibold mb-3 w-full">Список скидочные товары</h2>
						<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
							<thead
								className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
							>
							<tr>
								<th scope="col" className="px-3 py-3"></th>
								<th scope="col" className="px-4 py-3">Название продукта</th>
								<th scope="col" className="px-4 py-3">Категория</th>
								<th scope="col" className="px-4 py-3">Изображения</th>
								<th scope="col" className="px-4 py-3">Время создания</th>
								<th scope="col" className="px-4 py-3">Действие</th>
							</tr>
							</thead>
							<tbody>
							{discount?.assignments?.map((item, index) => (
								<tr key={item?.id} className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'}>
									<td className={'px-4 py-1'}>
										{index + 1}
									</td>
									<td className={'px-3 py-1'}>
										{item?.product?.name}
									</td>
									<td className={'px-3 py-1'}>
										{item?.product?.category?.name}
									</td>
									<td className={'px-3 py-1'}>
										{item?.product?.product_files[0]?.image?.file && (
											<img className="w-16 aspect-auto" loading="lazy" src={item?.product?.product_files[0]?.image?.file}
											     alt={item?.product?.product_files[0]?.image?.file}/>
										)}
									</td>
									<td className={'px-3 py-1'}>
										{moment(item?.created_time).format('DD-MM-YYYY')}
									</td>
									<td className="px-4 py-6 flex">
										<EyeIcon
											style={{color: currentColor}}
											className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mr-auto`}
											onClick={() => navigate(`/products/${item?.product?.id}`)}
										/>
										<TrashIcon
											className={`size-6 text-red-500 dark:text-blue-500 hover:underline cursor-pointer mr-auto`}
											onClick={() => handleDeleteAssignment(item?.id)}
										/>
									</td>
								</tr>
							))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</>
	);
};

export default CreateDiscounts;