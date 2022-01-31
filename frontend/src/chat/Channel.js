import React from "react";

const Channel = ({ onClick, channel, style }) => {
	const handleClick = () => onClick(channel.id);

	return (
		<div className="channel-item" onClick={handleClick} style={style}>
			<div>{channel.name}</div>
			<span>{channel.participants}</span>
		</div>
	);
};

export default Channel;
