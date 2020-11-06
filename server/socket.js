const router = require('express').Router();
const Rooms = require('./class')

class Room {
	constructor(
		roomId,
		name,
		users = [],
		lobby = new Lobby()
	) {
		this.roomId = roomId
		this.name = name
		this.users = users
		this.lobby = lobby
	}
}

class User {
	constructor(userId, name) {
		this.userId = userId
		this.name = name
	}
}

class Lobby {
	constructor(playerOne = {}, playerTwo = {}) {
		this.playerOne = playerOne
		this.playerTwo = playerTwo
	}
}

class Player {
	constructor(userId, name, ready = false) {
		this.userId = userId
		this.name = name
		this.ready = ready
	}
}

function initialize(io) {
	let ROOM
	let NAME

	io.on("connection", (socket) => {

		// // RECEIVE  SOCKET JOINING
		socket.on('join', ({ name, room }) => {
			ROOM = room
			NAME = name
			socket.join(ROOM)

			Rooms.addRoom(new Room(socket.id, ROOM))
			Rooms.addUser({ room: ROOM, user: new User(socket.id, NAME) })

			socket.to(ROOM).emit('new-message', {
				name: NAME,
				message: `${NAME} has joined.`,
				serverMessage: true
			})

			io.to(ROOM).emit('user-list', Rooms.getUsers(ROOM))
			io.to(ROOM).emit('lobby-list', Rooms.getLobbyPlayers(ROOM))
			io.to(ROOM).emit('room-host', Rooms.getRoom(ROOM).roomId)
			io.to(socket.id).emit('local-user', new User(socket.id, NAME))

			console.log('USER ADDED - ROOMS USERS: ', Rooms.getUsers(ROOM))
			console.log('LOBBY', Rooms.getLobbyPlayers(ROOM))
			console.log('ALL ROOMS', Rooms.getRooms())
		})



		// // RECEIVE MESSAGE FROM CHAT
		socket.on('send-message', (payload) => {
			console.log('MESSAGE INCOMING: ', payload.message);
			io.to(ROOM).emit("new-message", payload)
		})



		// // RECEIVE USER JOINING LOBBY
		socket.on('join-lobby', (payload) => {
			console.log('PLAYER JOINED: ', payload.name);
			Rooms.addPlayer({ room: ROOM, player: new Player(payload.userId, payload.name) })
			io.to(ROOM).emit('lobby-list', Rooms.getLobbyPlayers(ROOM))
			console.log('NEW LOBBY: ', Rooms.getLobbyPlayers(ROOM));
		})



		// // RECEIVE USER LEAVING LOBBY
		socket.on('leave-lobby', (payload) => {
			console.log('PLAYER LEFT: ', payload.name);
			Rooms.removePlayer({ room: ROOM, player: payload })
			io.to(ROOM).emit('lobby-list', Rooms.getLobbyPlayers(ROOM))
			console.log('NEW LOBBY: ', Rooms.getLobbyPlayers(ROOM));
		})



		// // RECEIVE USER READY UP
		socket.on('ready-up', (payload) => {
			console.log('PLAYER IS READY: ', payload.name);
			Rooms.readyPlayer({ room: ROOM, player: payload })
			io.to(ROOM).emit('lobby-list', Rooms.getLobbyPlayers(ROOM))
		})



		// // RECEIVE FIELD GENERATION
		socket.on('generate-editors', (payload) => {
			console.log('PLAYERS: ', payload.lobby);
			let hostsSet = []
			Rooms.getRoom(ROOM).roomId === socket.id
				? hostsSet = payload.wordSet
				: hostsSet = []
			setTimeout(() => io.to(ROOM).emit('editor-words', hostsSet), 50);
		})



		// // RECEIVE SOCKET DISCONNECTION
		socket.on('disconnect', () => {
			let currentRoom = Rooms.getRoom(ROOM)
			console.log('CURRENT ROOM', currentRoom)
			const disconnectedSocket = currentRoom.users.find(user => user.userId === socket.id)

			Rooms.removeUser({ room: ROOM, user: disconnectedSocket })

			io.to(ROOM).emit("new-message", {
				name: disconnectedSocket.name,
				message: `${disconnectedSocket.name} has left.`,
			})
			console.log('USER REMOVED - ROOMS USERS', Rooms.getUsers(ROOM))

			io.to(ROOM).emit('user-list', Rooms.getUsers(ROOM))

			if (Rooms.getUsers(ROOM).length > 0) {
				if (currentRoom.roomId === socket.id) {
					let nextInLine = Rooms.getUsers(ROOM)[0].userId
					Rooms.transferLeadership({ room: ROOM, userId: nextInLine })
				}
			}

			if (currentRoom.users.length === 0) {
				Rooms.removeRoom(ROOM)
				console.log('ROOM REMOVED - ALL ROOMS', Rooms.getRooms())
			}

		})

	})
}

// // GET REQUEST FOR ALL ROOMS, FOR BEFORE SOCKETS CONNECT
router.use('/get-rooms', (req, res) => {
	const rooms = Rooms.getRooms()
	res.json(rooms)
})

module.exports = { initialize, router }