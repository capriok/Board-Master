const { uniqBy, remove } = require('lodash')

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
	addRoom(room) {
		if (!this.getRoom(room.name)) this.rooms.push(room)
	}
	addUser({ room, user }) {
		let currentRoom = this.getRoom(room)
		currentRoom.users = uniqBy([...currentRoom.users, user], 'name')
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