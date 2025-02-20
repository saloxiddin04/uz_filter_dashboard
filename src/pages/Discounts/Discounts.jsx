import React, {useEffect, useState} from 'react';
import {Header, Pagination} from "../../components";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider";
import Loader from "../../components/Loader";
import {deleteDiscount, getAllDiscounts} from "../../redux/slices/discounts/discountSlice";
import moment from "moment";
import {EyeIcon, PencilIcon, PlusIcon, TrashIcon} from "@heroicons/react/16/solid";
import {toast} from "react-toastify";
import AssignmentsDrawer from "./AssignmentsDrawer";

const Discounts = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const {currentColor, currentPage} = useStateContext()
	
	const {loading, discounts} = useSelector(state => state.discount)
	
	const [drawer, setDrawer] = useState(false)
	const [id, setId] = useState(null)
	
	useEffect(() => {
		dispatch(getAllDiscounts({page: currentPage, page_size: 10}))
	}, [dispatch])
	
	const handlePageChange = (page) => {
		dispatch(getAllDiscounts({page, page_size: 10}))
	}
	
	const handleDeleteDiscount = async (id) => {
		try {
			await dispatch(deleteDiscount({id}))
			dispatch(getAllDiscounts({page: currentPage, page_size: 10}))
			toast.success("Успешно")
		} catch (e) {
			toast.success("Ошибка")
		}
	}
	
	return (
		<>
			<div className="card">
				<div className={'flex items-start justify-between mb-4'}>
					<Header category="Страница" title="Скидки"/>
					
					<button
						className={'px-4 py-2 rounded text-white'}
						style={{backgroundColor: currentColor}}
						onClick={() => navigate('/discounts/:id')}
					>
						Создать скидки
					</button>
				</div>
				
				<div className="relative overflow-x-auto shadow-md sm:rounded">
					{
						loading
							?
							<Loader />
							:
							<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
								<thead
									className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
								>
								<tr>
									<th scope="col" className="px-3 py-3"></th>
									<th scope="col" className="px-4 py-3">Название скидка</th>
									<th scope="col" className="px-4 py-3">Скидка (%)</th>
									<th scope="col" className="px-4 py-3">Статус</th>
									<th scope="col" className="px-4 py-3">Дата оканчания скидка</th>
									<th scope="col" className="px-4 py-3">Время создания</th>
									<th scope="col" className="px-4 py-3">Действие</th>
								</tr>
								</thead>
								<tbody>
								{discounts?.result?.map((item, index) => (
									<tr key={item?.id} className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'}>
										<td className={'px-4 py-1'}>
											{index + 1}
										</td>
										<td className={'px-3 py-1'}>
											{item?.name}
										</td>
										<td className={'px-3 py-1'}>
											{item?.discount}
										</td>
										<td className={'px-3 py-1'}>
											{item?.active ? "Актив" : "Не актив"}
										</td>
										<td className={'px-3 py-1'}>
											{moment(item?.deadline).format("DD-MM-YYYY")}
										</td>
										<td className={'px-3 py-1'}>
											{moment(item?.created_time).format("DD-MM-YYYY")}
										</td>
										<td className="px-4 py-4 flex">
											<EyeIcon
												style={{color: currentColor}}
												className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mr-auto`}
												onClick={() => navigate(`/discounts/${item.id}`)}
											/>
											<PencilIcon
												style={{color: currentColor}}
												className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mr-auto`}
												onClick={() => navigate(`/discounts/${item.id}`)}
											/>
											<PlusIcon
												style={{color: currentColor}}
												className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mr-auto`}
												onClick={() => {
													setId(item?.id)
													setDrawer(true)
												}}
											/>
											<TrashIcon
												className={`size-6 text-red-500 dark:text-blue-500 hover:underline cursor-pointer mr-auto`}
												onClick={() => handleDeleteDiscount(item?.id)}
											/>
										</td>
									</tr>
								))}
								</tbody>
							</table>
					}
				</div>
				
				<Pagination
					totalItems={discounts?.count}
					itemsPerPage={10}
					onPageChange={handlePageChange}
				/>
				
				{drawer && (
					<AssignmentsDrawer
						id={id}
						onclose={() => {
							setDrawer(false)
							setId(null)
						}}
					/>
				)}
			</div>
		</>
	);
};

export default Discounts;