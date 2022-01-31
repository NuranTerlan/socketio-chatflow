import React from "react";

export default function Message({ message }) {
	return (
		<div className="message-item">
			<div>
				<b>{message.senderName}</b>
			</div>
			<span>{message.body}</span>
		</div>
	);
}
