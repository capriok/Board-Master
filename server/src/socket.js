const router = require('express').Router();
const { Rooms, RoomClass, UserClass, PlayerClass } = require('./classes/rooms')
const { remove } = require('lodash')

function initialize(io) {
	let Room
	let User
	let Player

	io.on("connection", (socket) => {

		// // RECEIVE  SOCKET JOINING
		socket.on('join', ({ name, room }) => {

			User = new UserClass(socket.id, name)
			Room = new RoomClass(socket.id, room)

			socket.join(Room.name)

			Rooms.addRoom(Room)
			Rooms.addUser({ room: Room.name, user: User })

			socket.to(Room.name).emit('new-message', {
				name: User.name,
				message: `${User.name} has joined.`,
				serverMessage: true
			})

			io.to(Room.name).emit('room-users', Rooms.getUsers(Room.name))
			io.to(Room.name).emit('room-host', Rooms.getRoom(Room.name).roomId)
			io.to(Room.name).emit('room-lobby', Rooms.getLobby(Room.name))
			io.to(socket.id).emit('local-user', User)

			console.log('USER ADDED - ROOMS USERS: ', Rooms.getUsers(Room.name))
			console.log('ALL ROOMS', Rooms.getRooms())

		})



		// // RECEIVE MESSAGE FROM CHAT
		socket.on('send-message', (payload) => {
			console.log('MESSAGE INCOMING: ', payload.message);
			io.to(Room.name).emit("new-message", payload)
		})



		// // RECEIVE USER JOINING LOBBY
		socket.on('join-lobby', (payload) => {
			Player = new PlayerClass(payload.userId, payload.name)
			console.log('PLAYER JOINED: ', payload.name);
			Rooms.addPlayer({ room: Room.name, player: Player })
			io.to(Room.name).emit('room-lobby', Rooms.getLobby(Room.name))
			console.log('NEW LOBBY: ', Rooms.getLobby(Room.name));
		})

		// // RECEIVE USER LEAVING LOBBY
		socket.on('leave-lobby', (payload) => {
			console.log('PLAYER LEFT: ', payload.name);
			Rooms.removePlayer({ room: Room.name, player: payload })
			io.to(Room.name).emit('room-lobby', Rooms.getLobby(Room.name))
			console.log('NEW LOBBY: ', Rooms.getLobby(Room.name));
		})

		// // RECEIVE USER READY UP
		socket.on('set-ready', (payload) => {
			console.log('PLAYER IS READY: ', payload.name);
			Rooms.readyPlayer({ room: Room.name, player: payload })
			io.to(Room.name).emit('room-lobby', Rooms.getLobby(Room.name))
		})



		// // RECEIVE LOBBY DEVELOPMENT
		socket.on('lobby-development', (payload) => {
			const isHost = Rooms.getRoom(Room.name).roomId === socket.id
			if (isHost) {
				Rooms.setWordSet({ room: Room.name, wordSet: payload.wordSet });
				console.log('WORDSET', payload.wordSet);
				setTimeout(() => io.to(Room.name).emit('lobby-words', payload.wordSet), 2500)
			} else {
				io.to(Room.name).emit('lobby-words', payload.wordSet)
			}
		})

		// // RECEIVE LOBBY START
		socket.on('lobby-start', () => {
			const isHost = Rooms.getRoom(Room.name).roomId === socket.id
			isHost && console.log('STARTING COUNTDOWN');
			let counter = 5
			let countdown = setInterval(() => {
				io.to(Room.name).emit('lobby-countdown', counter)
				isHost && counter > 0 && console.log(counter)
				counter--
				if (counter < 0) {
					clearInterval(countdown)
					Rooms.getRoom(Room.name).lobby.setInSession()
				}
			}, 1000)
		})



		// // RECEIVE SOCKET DISCONNECTION
		socket.on('disconnect', () => {
			let currentRoom = Rooms.getRoom(Room.name)
			console.log('CURRENT ROOM', currentRoom)
			const disconnectedSocket = currentRoom.users.find(user => user.userId === socket.id)

			Rooms.removeUser({ room: Room.name, user: disconnectedSocket })

			io.to(Room.name).emit("new-message", {
				name: disconnectedSocket.name,
				message: `${disconnectedSocket.name} has left.`,
			})
			console.log('USER REMOVED - ROOMS USERS', Rooms.getUsers(Room.name))

			io.to(Room.name).emit('user-list', Rooms.getUsers(Room.name))

			if (Rooms.getUsers(Room.name).length > 0) {
				if (currentRoom.roomId === socket.id) {
					let nextInLine = Rooms.getUsers(Room.name)[0].userId
					Rooms.transferHost({ room: Room.name, userId: nextInLine })
				}
			}

			if (currentRoom.users.length === 0) {
				Rooms.removeRoom(Room.name)
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