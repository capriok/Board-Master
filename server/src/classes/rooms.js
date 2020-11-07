const { uniqBy, remove, isEmpty, uniq } = require('lodash')

class RoomsClass {
	constructor() {
		this.rooms = []
	}

	getRoom(room) {
		return this.rooms.find(rm => rm.name === room)
	}
	getRooms() {
		return this.rooms
	}
	getUsers(room) {
		return this.getRoom(room).users
	}
	getLobby(room) {
		return this.getRoom(room).lobby
	}

	addRoom(room) {
		if (!this.getRoom(room.name)) this.rooms.push(room)
	}
	addUser({ room, user }) {
		this.getRoom(room).users = uniqBy([...this.getRoom(room).users, user], 'name')
	}
	addPlayer({ room, player }) {
		this.getLobby(room).addPlayer(player)
	}

	removeUser({ room, user }) {
		this.getRoom(room).users = this.getRoom(room).users.filter(u => u.userId !== user.userId)
	}
	removeRoom(room) {
		this.rooms = remove(this.rooms, r => r.name !== room)
	}
	removePlayer({ room, player }) {
		this.getLobby(room).removePlayer(player)
	}

	readyPlayer({ room, player }) {
		this.getLobby(room).readyPlayer(player)
	}
	transferHost({ room, userId }) {
		this.getRoom(room).roomId = userId
	}

}

class RoomClass {
	constructor(roomId, name) {
		this.roomId = roomId
		this.name = name
		this.users = []
		this.lobby = new LobbyClass()
	}
}

class UserClass {
	constructor(userId, name) {
		this.userId = userId
		this.name = name
	}
}

class LobbyClass {
	constructor() {
		this.players = []
		this.lastWinner = {}
		this.playerCount = this.players.length
	}
	getPlayers() {
		return this.players
	}
	addPlayer(player) {
		if (this.playerCount < 2) {
			if (!this.players.some(p => p.userId === player.userId)) {
				this.players.push(player)
			}
		}
		this.playerCount = this.players.length
	}
	removePlayer(player) {
		this.players = remove(this.players, p => p.userId !== player.userId)
		this.playerCount = this.players.length
	}
	readyPlayer(player) {
		this.players.find(p => p.userId === player.userId).setReady()
	}
	setLastWinner(player) {
		this.lastWinner = player
	}
}

class PlayerClass {
	constructor(userId, name) {
		this.userId = userId
		this.name = name
		this.ready = false
		this.accuracy = null
		this.WMP = null
	}
	setReady() {
		this.ready = !this.ready
	}
	setAccuracy(val) {
		this.accuracy = val
	}
	setWPM(val) {
		this.WPM = val
	}
}


module.exports = {
	Rooms: new RoomsClass,
	RoomClass,
	UserClass,
	PlayerClass
}

// class Rooms {
// 	constructor() {
// 		this.rooms = []
// 	}

// 	addRoom(room) {
// 		if (!this.getRoom(room.name)) this.rooms.push(room)
// 	}
// 	addUser({ room, user }) {
// 		let currentRoom = this.getRoom(room)
// 		currentRoom.users = uniqBy([...currentRoom.users, user], 'name')
// 	}
// 	addPlayer({ room, player }) {
// 		let currentRoom = this.getRoom(room)
// 		let isPlayer = currentRoom.lobby.playerOne.userId === player.userId
// 		if (isEmpty(currentRoom.lobby.playerOne)) {
// 			currentRoom.lobby.playerOne = player
// 		} else {
// 			if (!isPlayer) {
// 				currentRoom.lobby.playerTwo = player
// 			}
// 		}
// 	}

// 	getRoom(room) {
// 		return this.rooms.find(rm => rm.name === room)
// 	}
// 	getRooms() {
// 		return this.rooms
// 	}
// 	getUsers(room) {
// 		const currentRoom = this.getRoom(room)
// 		return currentRoom.users
// 	}
// 	getLobbyPlayers(room) {
// 		const currentRoom = this.getRoom(room)
// 		return currentRoom.lobby
// 	}
// 	getPlayerSlot({ room, player }) {
// 		const players = this.getLobbyPlayers(room)
// 		let playerSlot
// 		Object.keys(players).forEach(slot => {
// 			players[slot].userId === player.userId
// 				? playerSlot = slot
// 				: playerSlot
// 		})
// 		return playerSlot
// 	}

// 	removePlayer({ room, player }) {
// 		let players = this.getLobbyPlayers(room)
// 		let playerSlot = this.getPlayerSlot({ room, player })
// 		players[playerSlot] = {}
// 	}
// 	removeUser({ room, user }) {
// 		let currentRoom = this.getRoom(room)
// 		currentRoom.users = currentRoom.users.filter(u => u.userId !== user.userId)
// 	}
// 	removeRoom(room) {
// 		this.rooms = remove(this.rooms, r => r.name !== room)
// 	}

// 	readyPlayer({ room, player }) {
// 		let players = this.getLobbyPlayers(room)
// 		let playerSlot = this.getPlayerSlot({ room, player })
// 		players[playerSlot].ready = !players[playerSlot].ready
// 	}
// 	transferHost({ room, userId }) {
// 		let currentRoom = this.getRoom(room)
// 		currentRoom.roomId = userId
// 	}

// }

// module.exports = new Rooms