import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider";
import {Header} from "../../components";
import {getRooms} from "../../redux/slices/chat/chatSlice";
import Loader from "../../components/Loader";
import {EyeIcon} from "@heroicons/react/16/solid";
import moment from "moment";

const Chat = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const {slug} = useParams();
	const {pathname} = useLocation();
	const {currentColor, setPage, currentPage, page_size, setPageSize} = useStateContext();
	
	const {rooms, loading} = useSelector((state) => state.chat)
	
	useEffect(() => {
		if (!slug) {
			navigate('/chat-messages/1')
		}
	}, [dispatch, slug])
	
	useEffect(() => {
		if (slug) dispatch(getRooms({room_type: slug}))
	}, [dispatch, slug]);
	
	return (
		<div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-10 dark:bg-secondary-dark-bg bg-white rounded">
			<div className={'flex items-start justify-between'}>
				<Header
					category="Sahifa"
					title={slug === '1' ? "O'qilmagan xabarlar" : slug === '2' ? "O'qilgan xabarlar" : "Barchasi"}
				/>
			</div>
			
			<div className="relative overflow-x-auto shadow-md sm:rounded mt-4">
				{
					loading
						?
						<Loader/>
						:
						<>
							<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
								<thead
									className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
								>
								<tr>
									<th scope="col" className="px-3 py-3"></th>
									<th scope="col" className="px-4 py-3">Yaratilgan vaqti</th>
									<th scope="col" className="px-4 py-3">Boshqarish</th>
								</tr>
								</thead>
								<tbody>
								{rooms?.map((item, index) => {
									return (
										<tr key={item?.id}>
											<td scope="row"
											    className="px-6 py-5 font-medium whitespace-nowrap border-b-1 flex gap-1 items-center">
												{index + 1}
											</td>
											<td className={'px-6 py-4 border-b-1'}>
												{moment(item?.created_time).format("DD-MM-YYYY HH:MM")}
											</td>
											<td className="px-4 py-4 border-b-1">
												<EyeIcon
													style={{color: currentColor}}
													className={`size-6 dark:text-blue-500 hover:underline cursor-pointer mx-auto`}
													onClick={() => navigate(`/chat-messages/${slug}/${item.id}`)}
												/>
											</td>
										</tr>
									)
								})}
								</tbody>
							</table>
						</>
				}
			</div>
		</div>
	);
};

export default Chat;