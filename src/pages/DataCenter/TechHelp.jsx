import React, {useEffect, useState} from 'react';
import moment from "moment";
import {EyeIcon, PencilIcon} from "@heroicons/react/16/solid";
import {useDispatch, useSelector} from "react-redux";
import {Loader} from "../../components";
import {getTechHelp} from "../../redux/slices/dataCenter/dataCenterSlice";
import {useNavigate} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider";
import CreateTechHelpDrawer from "../../components/DataCenter/CreateTechHelpDrawer";

const TechHelp = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const {currentColor} = useStateContext()
	
	const {loading, techHelp} = useSelector((state) => state.dataCenter)
	
	const [createHelp, setCreateHelp] = useState(false)
	
	useEffect(() => {
		dispatch(getTechHelp())
	}, []);
	
	if (loading) return <Loader />
	
	return (
		<>
			<div
				className="m-1 md:mx-4 md:my-8 mt-24 p-2 md:px-4 md:py-4 flex items-center justify-between bg-white dark:bg-secondary-dark-bg rounded"
			>
				<button
					className="ml-auto rounded px-4 py-1 text-white"
					style={{border: `1px solid ${currentColor}`, backgroundColor: currentColor}}
					onClick={() => setCreateHelp(!createHelp)}
				>
					Qo'shish
				</button>
			</div>
			<div
				className="m-1 md:mx-4 md:my-8 mt-24 p-2 md:px-4 md:py-4 flex items-center justify-between bg-white dark:bg-secondary-dark-bg rounded"
			>
				<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 my-4">
					<thead
						className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
					>
					<tr>
						<th scope="col" className="px-3 py-3"></th>
						<th scope="col" className="px-6 py-3">Mijoz</th>
						<th scope="col" className="px-8 py-3">STIR</th>
						<th scope="col" className="px-8 py-3">Shartnoma raqami</th>
						<th scope="col" className="px-6 py-3">Shartnoma sanasi</th>
						<th scope="col" className="px-6 py-3">Amal qilish sanasi</th>
						<th scope="col" className="px-6 py-3">To'lov turi</th>
						<th scope="col" className="px-6 py-3">Status</th>
						<th scope="col" className="px-6 py-3">To'lov miqdori</th>
						<th scope="col" className="px-6 py-3">Oylik to'lov miqdori</th>
						<th scope="col" className="px-6 py-3">Boshqaruv</th>
					</tr>
					</thead>
					<tbody>
					{techHelp && techHelp?.map((item, index) => (
						<tr
							className={'hover:bg-gray-100 hover:dark:bg-gray-800 border-b-1'}
							key={item?.id}
						>
							<td scope="row" className="px-6 py-4 font-medium border-b-1">
								{index + 1}
							</td>
							<td className={'px-4 py-2'}>
								{item?.user?.name?.slice(0, 40)}...
							</td>
							<td className={'px-4 py-2'}>
								{item?.user?.tin}
							</td>
							<td className={'px-4 py-2 text-center'}>
								{item?.contract_number}
							</td>
							<td className={'px-4 py-2 text-center'}>
								{moment(item?.start_date).format('DD-MM-YYYY')}
							</td>
							<td className={'px-4 py-2 text-center'}>
								{moment(item?.end_date).format('DD-MM-YYYY')}
							</td>
							<td className={'px-4 py-2 text-center'}>
								{item?.payment_type}
							</td>
							<td className={'px-4 py-2'}>
								{item?.status}
							</td>
							<td className={'px-4 py-2 text-center'}>
								{item?.pay_amount}
							</td>
							<td className={'px-4 py-2 text-center'}>
								{item?.pay_amount_month}
							</td>
							<td className="px-4 py-2 flex gap-2">
								<button style={{border: `1px solid ${currentColor}`}} className="rounded p-1">
									<EyeIcon
										style={{color: currentColor}}
										className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mx-auto rounded`}
										onClick={() => {
											navigate(`techHelp/${item?.id}`, {state: {detail: true}})
										}}
									/>
								</button>
								<button className="rounded border-yellow-500 border p-1">
									<PencilIcon
										className={`size-6 text-yellow-500 hover:underline cursor-pointer mx-auto`}
										onClick={() => {
											navigate(`techHelp/${item?.id}`)
											// setId(item?.id)
											// setDrawer(true)
											// setType('put')
										}}
									/>
								</button>
								{/*<button className="rounded border border-red-500 p-1">*/}
								{/*	<TrashIcon*/}
								{/*		className={`size-6 text-red-500 hover:underline cursor-pointer mx-auto`}*/}
								{/*	/>*/}
								{/*</button>*/}
							</td>
						</tr>
					))}
					</tbody>
				</table>
			</div>
			
			{createHelp && <CreateTechHelpDrawer onclose={() => setCreateHelp(!createHelp)} />}
		</>
	);
};

export default TechHelp;