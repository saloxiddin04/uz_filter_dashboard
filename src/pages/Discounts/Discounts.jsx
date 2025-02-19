import React, {useEffect} from 'react';
import {Header, Pagination} from "../../components";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider";
import Loader from "../../components/Loader";
import {getAllDiscounts} from "../../redux/slices/discounts/discountSlice";

const Discounts = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const {currentColor, currentPage} = useStateContext()
	
	const {loading, discounts} = useSelector(state => state.discount)
	
	useEffect(() => {
		dispatch(getAllDiscounts({page: currentPage, page_size: 10}))
	}, [])
	
	const handlePageChange = (page) => {
		dispatch(getAllDiscounts({page, page_size: 10}))
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
									<th scope="col" className="px-4 py-3">Название продукта</th>
									<th scope="col" className="px-4 py-3">Категория</th>
									<th scope="col" className="px-4 py-3">Изображения</th>
									<th scope="col" className="px-4 py-3">Время создания</th>
									<th scope="col" className="px-4 py-3">Действие</th>
								</tr>
								</thead>
								<tbody>
								</tbody>
							</table>
					}
				</div>
				
				<Pagination
					totalItems={discounts?.count}
					itemsPerPage={10}
					onPageChange={handlePageChange}
				/>
			</div>
		</>
	);
};

export default Discounts;