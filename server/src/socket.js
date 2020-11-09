const router = require('express').Router()
const { Rooms, RoomClass, UserClass, PlayerClass } = require('./classes/rooms')
const { remove } = require('lodash')

function initialize(io) {
	io.on("connection", (socket) => {
		let Room
		let User
		let Player

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
		})



		// // RECEIVE MESSAGE FROM CHAT
		socket.on('send-message', (payload) => {
			console.log('MESSAGE INCOMING: ', payload.message)
			io.to(Room.name).emit("new-message", payload)
		})



		// // RECEIVE USER JOINING LOBBY
		socket.on('join-lobby', (payload) => {
			Player = new PlayerClass(payload.userId, payload.name)
			console.log('PLAYER JOINED: ', payload.name)
			Rooms.getLobby(Room.name).addPlayer(Player)
			io.to(Room.name).emit('room-lobby', Rooms.getLobby(Room.name))
			console.log('LOBBY PLAYERS: ', Rooms.getLobby(Room.name).getPlayers())
		})

		// // RECEIVE USER LEAVING LOBBY
		socket.on('leave-lobby', (payload) => {
			console.log('PLAYER LEFT: ', payload.name)
			Rooms.getLobby(Room.name).removePlayer(Player)
			io.to(Room.name).emit('room-lobby', Rooms.getLobby(Room.name))
			console.log('LOBBY PLAYERS: ', Rooms.getLobby(Room.name).players)
		})

		// // RECEIVE USER READY UP
		socket.on('set-ready', (payload) => {
			let currentLobby = Rooms.getLobby(Room.name)
			console.log('PLAYER IS READY: ', payload.name)
			Rooms.getLobby(Room.name).readyPlayer(Player)
			io.to(Room.name).emit('room-lobby', Rooms.getLobby(Room.name))
			let lobbyFull = currentLobby.getPlayerCount() === 2
			let lobbyReady = currentLobby.getPlayers().every(p => p.ready === true)
			if (lobbyFull && lobbyReady) {
				Rooms.getLobby(Room.name).setPlayersReady()
				let delay = setTimeout(() => {
					io.to(Room.name).emit('room-lobby', Rooms.getLobby(Room.name))
					clearTimeout(delay)
				}, 1000)
			}
		})



		// // RECEIVE LOBBY DEVELOPMENT
		socket.on('lobby-development', (payload) => {
			console.log('ALL PLAYERS READY, DEVELOPING LOBBY');
			const isHost = Rooms.getRoom(Room.name).roomId === socket.id
			if (isHost) {
				Rooms.getLobby(Room.name).setWordSet(payload.wordSet)
				console.log('WORDSET', payload.wordSet)
				setTimeout(() => io.to(Room.name).emit('lobby-words', payload.wordSet), 1000)
			} else {
				io.to(Room.name).emit('lobby-words', payload.wordSet)
			}
		})

		// // RECEIVE LOBBY START
		socket.on('lobby-start', () => {
			const isHost = Rooms.getRoom(Room.name).roomId === socket.id
			isHost && console.log('STARTING COUNTDOWN')
			let counter = 5
			let countdown = setInterval(() => {
				io.to(Room.name).emit('lobby-countdown', counter)
				if (isHost) {
					counter > 0 && console.log(counter)
					if (counter === 0) {
						Rooms.getRoom(Room.name).lobby.setInSession()
						io.to(Room.name).emit('room-lobby', Rooms.getLobby(Room.name))
					}
				}
				counter--
				if (counter < 0) {
					clearInterval(countdown)
				}
			}, 1000)
		})



		// // RECEIVE SOCKET DISCONNECTION
		socket.on('disconnect', () => {
			if (Room === undefined) return
			const leavingSocket = Rooms.getUsers(Room.name).find(u => u.userId === socket.id)
			if (leavingSocket === undefined) return

			Rooms.removeUser({ room: Room.name, user: leavingSocket })

			io.to(Room.name).emit("new-message", {
				name: leavingSocket.name,
				message: `${leavingSocket.name} has left.`,
				serverMessage: true
			})
			console.log('USER REMOVED - ROOMS USERS', Rooms.getUsers(Room.name))

			io.to(Room.name).emit('user-list', Rooms.getUsers(Room.name))

			if (Rooms.getUsers(Room.name).length > 0) {
				if (Rooms.getRoom(Room.name).roomId === socket.id) {
					let nextInLine = Rooms.getUsers(Room.name)[0]
					Rooms.transferHost({ room: Room.name, userId: nextInLine.userId })
					console.log('HOST TRANSFERED TO', nextInLine.name);
				}
			}

			if (Rooms.getUsers(Room.name).length === 0) {
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