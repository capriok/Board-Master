const { uniq } = require('lodash')

class User {
	constructor(name, id) {
		this.name = name
		this.id = id
	}

	getName = () => {
		return this.name
	}
	getId = () => {
		return this.id
	}
}

exports.initialize = (io) => {

	const rooms = []

	io.on("connection", (socket) => {
		console.log(`Socket connected: ${socket.id}`);

		socket.on('join', ({ name, room }) => {
			console.log('Joined', { name: name, room: room });
			let user = new User(name, socket.id)
			io.sockets.rooms.push(room)
			io.sockets.rooms = uniq(io.sockets.rooms)
			console.log(io.sockets.rooms);
		})

		socket.emit('ok', () => {

		})

		socket.on('disconnect', () => {
			console.log('Socket disconnected')
		})

	})
}