const router = require('express').Router();
const { transferLeadership } = require('./class');
const Rooms = require('./class')

class Room {
	constructor(roomId, name, users = []) {
		this.roomId = roomId
		this.name = name
		this.users = users
	}
}
class User {
	constructor(userId, name) {
		this.userId = userId
		this.name = name
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

			// Join user to chat
			socket.join(ROOM)

			// Add room if no room, and add user to room 
			Rooms.addRoom(new Room(socket.id, ROOM))
			Rooms.addUser({ room: ROOM, user: new User(socket.id, name) })

			// Message the rooms chat, user has joined
			socket.to(ROOM).emit('new-message', {
				name: name,
				message: `${name} has joined.`,
			})

			// Send user list to room
			io.to(ROOM).emit('user-list', Rooms.getUsers(ROOM))

			console.log('USER ADDED - ROOMS USERS: ', Rooms.getUsers(ROOM))
			console.log('ALL ROOMS', Rooms.getRooms())
		})

		// // RECEIVE MESSAGE FROM CHAT

		socket.on('send-message', (payload) => {
			console.log('MESSAGE INCOMING: ', payload.message);
			io.to(ROOM).emit("new-message", payload)
		})

		// // RECEIVE SOCKET DISCONNECTION

		socket.on('disconnect', () => {
			let currentRoom = Rooms.getRoom(ROOM)
			console.log('CURRENT ROOM', currentRoom)
			const disconnectedSocket = currentRoom.users.find(user => user.userId === socket.id)

			// Remove the user from room
			Rooms.removeUser({ room: ROOM, user: disconnectedSocket })

			// Message the rooms chat, user has left
			io.to(ROOM).emit("new-message", {
				name: disconnectedSocket.name,
				message: `${disconnectedSocket.name} has left.`,
			})
			console.log('USER REMOVED - ROOMS USERS', Rooms.getUsers(ROOM))

			// Send user list to room
			io.to(ROOM).emit('user-list', Rooms.getUsers(ROOM))

			// Transfer leadership is host is leaving
			if (Rooms.getUsers(ROOM).length > 0) {
				if (currentRoom.roomId === socket.id) {
					let nextInLine = Rooms.getUsers(ROOM)[0].userId
					Rooms.transferLeadership({ room: ROOM, userId: nextInLine })
				}
			}

			// Remove room if empty
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