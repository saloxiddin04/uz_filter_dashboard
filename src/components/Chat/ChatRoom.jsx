import React, {useState} from 'react';
import {useParams} from "react-router-dom";
import useSocket from "./useSocket";
import {DetailNav} from "../index";
import {IoIosSend} from "react-icons/io";
import {useStateContext} from "../../contexts/ContextProvider";
import moment from "moment";

const ChatRoom = () => {
	const {id} = useParams();
	const {currentColor, setPage, currentPage, page_size, setPageSize} = useStateContext();
	const {messages, sendMessage, setMessages} = useSocket(id);
	const [input, setInput] = useState("");
	
	const handleSendMessage = (e) => {
		e.preventDefault()
		if (input.trim()) {
			sendMessage(input);
			setInput("");
		}
	};
	
	return (
		<>
			<div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-4 bg-white dark:bg-secondary-dark-bg rounded">
				<DetailNav
					id={id}
					name={"name"}
					status={"status"}
				/>
			</div>
			
			<div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-4 bg-white dark:bg-secondary-dark-bg rounded flex flex-col">
				<>
					{messages.length > 0 ? (
						messages.map((msg, index) => {
							const isSent = msg.is_owner_client;
							return (
								<div
									className={`chat-message max-w-[60%] p-3 text-base rounded-lg mb-2 inline-block relative ${
										isSent
											? "self-end text-white bg-blue-500 border border-blue-500"
											: "self-start text-black bg-gray-100 border border-gray-300"
									}`}
									key={index}
								>
									<div
										className={`name font-semibold ${
											isSent ? "pb-1 mb-1 border-b border-white" : "pb-1 mb-1 border-b border-blue-500"
										}`}
									>
										{msg.user.type === 2 ? `${msg.user.name.slice(0, 15)}...` : msg.user.name}
									</div>
									<div>{msg.message}</div>
									<div
										className={`timestamp text-sm mt-1 ${
											isSent ? "text-white text-right" : "text-gray-600 text-right"
										}`}
									>
										{moment(msg.created_time).format("DD-MM-YYYY HH:mm")}
									</div>
								</div>
							);
						})
					) : (
						<>
							<p className="greeting text-lg mb-2">Salom 👋</p>
							<p className="message text-base text-gray-700">Sizga qanday yordam bera olaman?</p>
						</>
					)}
				
				</>
				<div className="flex items-end gap-4">
					<div className={'flex flex-col w-[49%]'}>
						<label
							className="block text-gray-700 text-sm font-bold mb-1 ml-3"
							htmlFor="input"
						>
							Xabar
						</label>
						<input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							name="input"
							id="input"
							type="text"
							className="rounded w-full py-1.5 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow focus:border-blue-500 border mb-1"
						/>
					</div>
					<button disabled={input === ''} style={{border: `1px solid ${currentColor}`}} className="disabled:opacity-25 rounded p-2" onClick={handleSendMessage}>
						<IoIosSend className="size-8" fill={currentColor}/>
					</button>
				</div>
			</div>
		</>
	);
};

export default ChatRoom;