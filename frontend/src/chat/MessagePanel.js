import React, { useState, useEffect, useRef } from "react";
import Message from "./Message";

export default function MessagesPanel({ onSendMessage, channel }) {
	const [input, setInput] = useState("");

	const messagesEndRef = useRef(null);

	useEffect(() => {
		scrollToBottom();
	}, [channel?.messages?.length]);

	const scrollToBottom = () =>
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

	const send = () => {
		if (input) {
			onSendMessage(channel.id, input);
			setInput("");
		}
	};

	const handleInputChange = (e) => setInput(e.target.value);

	const handleInputKeyDown = (e) => {
		if (e.key === "Enter") {
			send();
		}
	};

	let list = (
		<div className="no-content-message">There is no messages to show</div>
	);
	if (channel && channel.messages) {
		list = channel.messages.map((m) => <Message key={m.id} message={m} />);
	}
	return (
		<div className="messages-panel">
			<div className="meesages-list">{list}</div>
			<div ref={messagesEndRef} />
			{channel && (
				<div className="messages-input">
					<input
						type="text"
						onChange={handleInputChange}
						onKeyDown={handleInputKeyDown}
						value={input}
						placeholder="Your message"
					/>
					<button onClick={send}>Send</button>
				</div>
			)}
		</div>
	);
}
