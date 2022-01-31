import React, { useState, useEffect, useCallback } from "react";
import socketClient from "socket.io-client";
import ChannelList from "./ChannelList";
import MessagesPanel from "./MessagePanel";
import uuid from "react-uuid";

import "./chat.scss";

const SERVER_URL = "http://127.0.0.1:8080";
let socket;

const Chat = () => {
	const [uploadedChannels, setUploadedChannels] = useState(null);
	const [channels, setChannels] = useState(null);
	const [currentChannel, setCurrentChannel] = useState(null);

	useEffect(() => {
		loadChannelsFromServer();

		return () => socket.on("disconnect");
	}, []);

	useEffect(() => {
		if (uploadedChannels) {
			configureSocket();
		}
	}, [uploadedChannels]);

	const configureSocket = () => {
		socket = socketClient(SERVER_URL);

		socket.on("connection", () => {});

		socket.on("channel", (channel) => {
			if (uploadedChannels) {
				const updatedChannels = [...uploadedChannels];
				updatedChannels.forEach((c) => {
					if (c.id === channel.id) {
						c.participants = channel.participants;
					}
				});
				setChannels(updatedChannels);
			}
		});

		socket.on("message", (message) => {
			if (uploadedChannels) {
				const updatedChannels = [...uploadedChannels];
				updatedChannels.forEach((c) => {
					if (c.id === message.channelId) {
						if (!c.messages) {
							c.messages = [message];
							return;
						}
						c.messages.push(message);
					}
				});
				setChannels(updatedChannels);
			}
		});
	};

	const loadChannelsFromServer = () => {
		fetch(`${SERVER_URL}/channels`)
			.then((response) => response.json())
			.then((data) => {
				setUploadedChannels(data.channels);
				setChannels(data.channels);
			});
	};

	const handleChannelSelect = (id) => {
		let selectedChannel = channels.find((channel) => channel.id === id);
		setCurrentChannel(selectedChannel);

		if (!socket) {
			configureSocket();
		}

		socket.emit("channel-join", id);
	};

	const handleSendMessage = (channelId, text) =>
		socket.emit("send-message", {
			id: uuid(),
			channelId,
			body: text,
			senderName: socket.id,
		});

	return (
		<div className="chat-app">
			<ChannelList
				channels={channels}
				onSelectChannel={handleChannelSelect}
				currentChannel={currentChannel}
			/>
			<MessagesPanel
				channel={currentChannel}
				onSendMessage={handleSendMessage}
			/>
		</div>
	);
};

export default Chat;
