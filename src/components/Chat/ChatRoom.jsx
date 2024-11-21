import React, {useState} from 'react';
import {useParams} from "react-router-dom";
import useSocket from "./useSocket";
import {DetailNav} from "../index";
import {IoIosSend} from "react-icons/io";
import {useStateContext} from "../../contexts/ContextProvider";

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
			
			<div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-4 bg-white dark:bg-secondary-dark-bg rounded">
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