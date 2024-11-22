import { useEffect, useRef, useState } from "react";
import {useSelector} from "react-redux";

const useSocket = (roomId) => {
	const { access } = useSelector((state) => state.user);
	const [messages, setMessages] = useState([]);
	const webSocketRef = useRef(null);
	
	useEffect(() => {
		if (roomId) {
			const webSocketUrl = `wss://dcid.unicon.uz/ws/chat/${roomId}/?token=${access}`;
			
			webSocketRef.current = new WebSocket(webSocketUrl);
			
			webSocketRef.current.onmessage = (event) => {
				const data = JSON.parse(event.data);
				setMessages((prevMessages) => [...prevMessages, data.message]);
			};
			
			webSocketRef.current.onerror = (error) => {
				console.error("WebSocket error:", error);
			};
			
			return () => {
				webSocketRef.current?.close();
			};
		}
	}, [roomId]);
	
	const sendMessage = (message) => {
		if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
			webSocketRef.current.send(JSON.stringify({ message }));
		}
	};
	
	return { messages, sendMessage, setMessages };
};

export default useSocket;