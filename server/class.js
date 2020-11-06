const { uniqBy, remove, isEmpty } = require('lodash')

class Rooms {
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
		const currentRoom = this.getRoom(room)
		return currentRoom.users
	}
	getLobbyPlayers(room) {
		const currentRoom = this.getRoom(room)
		return currentRoom.lobby
	}
	getPlayerSlot({ room, player }) {
		const players = this.getLobbyPlayers(room)
		let playerSlot
		Object.keys(players).forEach(slot => {
			players[slot].userId === player.userId
				? playerSlot = slot
				: playerSlot
		})
		return playerSlot
	}
	addRoom(room) {
		if (!this.getRoom(room.name)) this.rooms.push(room)
	}
	addUser({ room, user }) {
		let currentRoom = this.getRoom(room)
		currentRoom.users = uniqBy([...currentRoom.users, user], 'name')
	}
	addPlayer({ room, player }) {
		let currentRoom = this.getRoom(room)
		let isPlayer = currentRoom.lobby.playerOne.userId === player.userId
		if (isEmpty(currentRoom.lobby.playerOne)) {
			currentRoom.lobby.playerOne = player
		} else {
			if (!isPlayer) {
				currentRoom.lobby.playerTwo = player
			}
		}
	}
	readyPlayer({ room, player }) {
		let players = this.getLobbyPlayers(room)
		let playerSlot = this.getPlayerSlot({ room, player })
		players[playerSlot].ready = !players[playerSlot].ready
	}
	removePlayer({ room, player }) {
		let players = this.getLobbyPlayers(room)
		let playerSlot = this.getPlayerSlot({ room, player })
		players[playerSlot] = {}
	}
	removeUser({ room, user }) {
		let currentRoom = this.getRoom(room)
		currentRoom.users = currentRoom.users.filter(u => u.userId !== user.userId)
	}
	removeRoom(room) {
		this.rooms = remove(this.rooms, r => r.name !== room)
	}
	transferLeadership({ room, userId }) {
		let currentRoom = this.getRoom(room)
		currentRoom.roomId = userId
	}

}

module.exports = new Rooms