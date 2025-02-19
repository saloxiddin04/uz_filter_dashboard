import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider";
import {Header, Pagination} from "../../components";
import Loader from "../../components/Loader";
import {getAllAssignments} from "../../redux/slices/discountAssignment/discountAssignmentSlice";

const DiscountAssignments = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const {currentColor, currentPage} = useStateContext()
	
	const {loading, discountAssignments} = useSelector(state => state.discountAssignment)
	
	useEffect(() => {
		dispatch(getAllAssignments({page: currentPage, page_size: 10}))
	}, [dispatch])
	
	const handlePageChange = (page) => {
		dispatch(getAllAssignments({page, page_size: 10}))
	}
	
	return (
		<>
			<div className="card">
				<div className={'flex items-start justify-between mb-4'}>
					<Header category="Страница" title="Назначения"/>
					
					<button
						className={'px-4 py-2 rounded text-white'}
						style={{backgroundColor: currentColor}}
						onClick={() => navigate('/discounts_assignments/:id')}
					>
						Создать назначения
					</button>
				</div>
				
				<div className="relative overflow-x-auto shadow-md sm:rounded">
					{
						loading
							?
							<Loader/>
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
								</tbody>
							</table>
					}
				</div>
				
				<Pagination
					totalItems={discountAssignments?.count}
					itemsPerPage={10}
					onPageChange={handlePageChange}
				/>
			</div>
		</>
	);
};

export default DiscountAssignments;