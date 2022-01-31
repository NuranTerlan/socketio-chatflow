const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
	cors: {
		origin: "*",
	},
});

const PORT = 8080;

const STATIC_CHANNELS = [
	{
		id: 1,
		name: "Global Chat",
		participants: 0,
		sockets: [],
	},
	{
		id: 2,
		name: "Funny Chat",
		participants: 0,
		sockets: [],
	},
];

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	next();
});

app.get("/channels", (req, res) => {
	res.json({
		channels: STATIC_CHANNELS,
	});
});

http.listen(PORT, () => {
	console.log(`listening on http://127.0.0.1:${PORT}`);
});

io.on("connection", (socket) => {
	console.log("new client connected ", socket.id);

	socket.emit("connection", null);

	socket.on("channel-join", (id) => {
		console.log("channel-join", id);
		STATIC_CHANNELS.forEach((channel) => {
			if (channel.id === id) {
				if (channel.sockets.indexOf(socket.id) == -1) {
					channel.sockets.push(socket.id);
					channel.participants++;
					io.emit("channel", channel);
				}
				return;
			}

			let index = channel.sockets.indexOf(socket.id);
			if (index != -1) {
				shutdownSocketInChannel(channel, index);
			}
		});

		return id;
	});

	socket.on("send-message", (message) => {
		console.log(message);
		io.emit("message", message);
	});

	socket.on("disconnect", () => {
		STATIC_CHANNELS.forEach((channel) => {
			let index = channel.sockets.indexOf(socket.id);
			if (index != -1) {
				shutdownSocketInChannel(channel, index);
			}
		});
	});
});

const shutdownSocketInChannel = (channel, socketIndex) => {
	channel.sockets.splice(socketIndex, 1);
	channel.participants--;
	io.emit("channel", channel);
};
