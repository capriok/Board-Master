const { uniqBy, remove, isEmpty, uniq } = require('lodash')
const { wordList } = require('random-words')

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
		if (user === undefined) return
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
	setWordSet({ room, wordSet }) {
		this.getRoom(room).lobby.setWordSet(wordSet)
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
		this.playerCount = this.players.length
		this.wordSet = []
		this.playersReady = false
		this.inSession = false
		// this.lastWinner = {}
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
		if (this.playerCount === 2 && this.players.every(p => p.ready === true)) {
			this.playersReady = true
			console.log('ALL PLAYERS READY, DEVELOPING LOBBY');
		}
	}
	setInSession() {
		this.inSession = !this.inSession
	}
	setWordSet(wordSet) {
		this.wordSet = wordSet
	}
	// setLastWinner(player) {
	// 	this.lastWinner = player
	// }
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