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
		this.getRoom(room).users = uniqBy([...this.getRoom(room).users, user], 'userId')
	}

	removeUser({ room, user }) {
		this.getRoom(room).users = remove(this.getUsers(room), u => u.userId !== user.userId)
	}
	removeRoom(room) {
		this.rooms = remove(this.rooms, r => r.name !== room)
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
		this.startTime = null
	}
	getPlayers() {
		return this.players
	}
	getPlayerCount() {
		return this.playerCount
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
	setWordSet(wordSet) {
		this.wordSet = wordSet
	}
	setPlayersReady() {
		this.playersReady = !this.playersReady
	}
	setInSession() {
		this.inSession = !this.inSession
	}
	setStartTime() {
		this.startTime = Date.now()
	}
}

class PlayerClass {
	constructor(userId, name) {
		this.userId = userId
		this.name = name
		this.ready = false
		this.wordClasses = []
		this.currentIndex = 0
		this.accuracy = 0
		this.wpm = 0
	}
	setReady() {
		this.ready = !this.ready
	}
	setCurrentIndex(index) {
		this.currentIndex = index
	}
	setWordClasses(classes) {
		this.wordClasses = classes
	}
	setAccuracy(val) {
		this.accuracy = val
	}
	setWpm(val) {
		this.WPM = val
	}
}


module.exports = {
	Rooms: new RoomsClass,
	RoomClass,
	UserClass,
	PlayerClass
}