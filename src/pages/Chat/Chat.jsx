import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider";
import {getRooms} from "../../redux/slices/chat/chatSlice";
import Loader from "../../components/Loader";
import moment from "moment";
import {IoIosSend} from "react-icons/io";
import useSocket from "../../components/Chat/useSocket";
import instance from "../../API";

const Chat = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {pathname} = useLocation()
	const {slug, id} = useParams();
	const {currentColor} = useStateContext();
	const {rooms, loading} = useSelector((state) => state.chat);
	const {messages, sendMessage, setMessages} = useSocket(id);
	const [input, setInput] = useState("");
	
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [maxPage, setMaxPage] = useState(null);
	const [loader, setLoader] = useState(false)
	
	const modalBodyRef = useRef(null);
	const messagesEndRef = useRef(null);
	
	useEffect(() => {
		if (!slug) navigate('/chat-messages/1');
	}, [navigate, slug]);
	
	useEffect(() => {
		if (slug) {
			dispatch(getRooms({room_type: slug}));
		}
	}, [dispatch, slug]);
	
	useEffect(() => {
		setMessages([])
	}, [pathname])
	
	useEffect(() => {
		if (id) {
			loadMessages(page);
		}
	}, [id]);
	
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);
	
	const handleScroll = () => {
		if (!modalBodyRef.current || loading || !hasMore) return;
		
		if (modalBodyRef.current.scrollTop === 0 && id) {
			loadMessages(page + 1);
		}
	};
	
	const loadMessages = async (pageNumber) => {
		if (loader || (maxPage && pageNumber > maxPage)) return;
		
		setLoader(true)
		try {
			const res = await instance.get(`/chat/rooms/${id}?page=${pageNumber}`);
			const { result: fetchedMessages, count } = res.data;
			
			if (pageNumber === 1) {
				setMaxPage(Math.ceil(count / 10));
			}
			
			if (fetchedMessages.length > 0) {
				setMessages((prevMessages) => [...fetchedMessages?.reverse(), ...prevMessages]);
			} else {
				setHasMore(false);
			}
			
			setPage(pageNumber);
		} catch (error) {
			console.error("Failed to load messages:", error);
			setHasMore(false);
		} finally {
			setLoader(false)
		}
	};
	
	const handleSendMessage = (e) => {
		e.preventDefault()
		if (input.trim() && id) {
			sendMessage(input)
			setInput("");
		}
	};
	
	return (
		<div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-4 bg-white dark:bg-secondary-dark-bg rounded">
			
			<div className="flex h-[82vh] bg-gray-100 dark:bg-gray-900">
				<div className="w-1/3 bg-white dark:bg-gray-800 shadow-md h-full overflow-y-auto">
					<div className="p-4 text-lg font-bold text-gray-800 dark:text-gray-200">Chats</div>
					<div className="divide-y divide-gray-300 dark:divide-gray-700">
						{loading ? (
							<Loader/>
						) : (
							rooms?.map((room) => (
								<div
									key={room.id}
									onClick={() => navigate(`/chat-messages/${slug}/${room.id}`)}
									className={`p-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 flex justify-between items-center ${
										id === room.id ? "bg-gray-200 dark:bg-gray-700" : ""
									}`}
								>
									<div>
										<p
											className="text-gray-800 dark:text-gray-200">{room?.room_name?.length > 40 ? `${room?.room_name?.slice(0, 40)}...` : room?.room_name} </p>
										<p className="text-sm text-gray-600 dark:text-gray-400">
											{room?.last_message?.message?.length > 50 ? `${room?.last_message?.message?.slice(0, 50)}...` : room?.last_message?.message}
										</p>
									</div>
									<p className="text-sm text-gray-600 dark:text-gray-400">{moment(room?.updated_time).format('DD-MM-YYYY HH:MM')}</p>
								</div>
							))
						)}
					</div>
				</div>
				{id && (
					<div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900">
						<div className="p-4 bg-white dark:bg-gray-800 shadow-md">
							<h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
								{rooms?.find((room) => room?.id === parseInt(id))?.room_name || "Chat"}
							</h2>
						</div>
						
						<div
							onScroll={handleScroll}
							ref={modalBodyRef}
							className="flex-1 overflow-y-auto p-4"
						>
							{loading || loader ? (
								<Loader/>
							) : (
								messages?.map((msg, index) => (
									<div
										key={index}
										className={`mb-4 p-3 rounded-lg max-w-[70%] shadow ${
											!msg?.is_owner_client
												? "ml-auto bg-blue-500 text-white"
												: "mr-auto bg-gray-200 text-black"
										}`}
									>
										<p className="text-sm font-semibold">{msg.user.name}</p>
										<p className="text-base">{msg.message}</p>
										<p className="text-xs mt-2 text-right">
											{moment(msg.updated_time).format("HH:mm")}
										</p>
									</div>
								))
							)}
							<div ref={messagesEndRef}/>
						</div>
						
						<form onSubmit={handleSendMessage}
						      className="p-4 bg-white dark:bg-gray-800 flex items-center gap-4 shadow-md">
							<input
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="Write a message..."
								className="flex-1 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<button
								type="submit"
								disabled={!input.trim()}
								className="p-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 disabled:opacity-50"
							>
								<IoIosSend size={20}/>
							</button>
						</form>
					</div>
				)}
			</div>
		</div>
	);
};

export default Chat;
