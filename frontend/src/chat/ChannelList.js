import React from "react";
import Channel from "./Channel";

const ChannelList = ({ onSelectChannel, channels, currentChannel }) => {
	const handleSelect = (id) => onSelectChannel(id);

	return (
		<div className="channel-list">
			{channels ? (
				channels.map((channel) => (
					<Channel
						key={channel.id}
						channel={channel}
						onClick={handleSelect}
						style={{
							backgroundColor:
								currentChannel?.id === channel.id ? "lightgreen" : "",
						}}
					/>
				))
			) : (
				<div className="no-content-message">There is no channels to show</div>
			)}
		</div>
	);
};

export default ChannelList;
