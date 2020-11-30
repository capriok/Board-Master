const { uniqBy, remove } = require('lodash')

export namespace BMClasses {
	export class RoomsClass {
		rooms: RoomClass[]
		constructor() {
			this.rooms = [
				new RoomClass('', 'Beginner'),
				new RoomClass('', 'Intermediate'),
				new RoomClass('', 'Advanced')
			]
		}

		getRooms(): RoomClass[] {
			return this.rooms
		}
		getRoom(room: string): RoomClass {
			if (room === undefined) return
			return this.rooms.find(rm => rm.name === room)
		}
		getUsers(room: string): UserClass[] {
			if (room === undefined) return
			return this.getRoom(room).users
		}
		getLobby(room: string): LobbyClass {
			if (room === undefined) return
			return this.getRoom(room).lobby
		}

		addRoom(room: RoomClass): void {
			if (!this.getRoom(room.name)) this.rooms.push(room)
		}
		addUser({ room, user }: { room: string, user: UserClass }): void {
			const emptyRoom = this.getRoom(room).roomId === ''
			if (emptyRoom) this.getRoom(room).roomId = user.userId
			this.getRoom(room).users = uniqBy([...this.getRoom(room).users, user], 'userId')
		}

		removeUser({ room, user }: { room: string, user: UserClass }): void {
			this.getRoom(room).users = remove(this.getUsers(room), u => u.userId !== user.userId)
		}
		removeRoom(room: string): void | string {
			if (room === 'Beginner' || room === 'Intermediate' || room === 'Advanced') {
				return this.getRoom(room).roomId = ''
			}
			this.rooms = remove(this.rooms, r => r.name !== room)
		}
		transferHost({ room, userId }: { room: string, userId: string }): void {
			this.getRoom(room).roomId = userId
		}
	}


	export class RoomClass {
		roomId: string
		name: string
		users: UserClass[]
		lobby: LobbyClass

		constructor(roomId: string, name: string) {
			this.roomId = roomId
			this.name = name
			this.users = []
			this.lobby = new LobbyClass()
		}
		getLobby(): LobbyClass {
			return this.lobby
		}
		resetLobby(): void {
			this.lobby = new LobbyClass()
		}
	}

	export class UserClass {
		userId: string
		name: string

		constructor(userId: string, name: string) {
			this.userId = userId
			this.name = name
		}
	}

	export class LobbyClass {
		players: PlayerClass[]
		playerCount: number
		options: { exactly: number, maxLength: number }
		wordSet: string[]
		playersReady: boolean
		inSession: boolean
		startTime: null | number

		constructor() {
			this.players = []
			this.playerCount = this.players.length
			this.options = { exactly: 25, maxLength: 5 }
			this.wordSet = []
			this.playersReady = false
			this.inSession = false
			this.startTime = null
		}
		getPlayer(player: PlayerClass): PlayerClass {
			if (player === undefined) return
			return this.players.find(p => p.userId === player.userId)
		}
		getPlayers(): PlayerClass[] {
			return this.players
		}
		getPlayerCount(): number {
			return this.playerCount
		}
		getOptions(): { exactly: number, maxLength: number } {
			return this.options
		}
		addPlayer(player: PlayerClass): void {
			if (this.playerCount < 2) {
				if (!this.players.some(p => p.userId === player.userId)) {
					this.players.push(player)
				}
			}
			this.playerCount = this.players.length
		}
		setOptions({ exactly, maxLength }: { exactly: number, maxLength: number }): void {
			this.options = { exactly, maxLength }
		}
		setWordSet(wordSet: string[]): void {
			this.wordSet = wordSet
		}
		setPlayersReady(bool: boolean): void {
			this.playersReady = bool
		}
		setInSession(): void {
			this.inSession = !this.inSession
		}
		setStartTime(): void {
			this.startTime = Date.now()
		}
		removePlayer(player: PlayerClass): void {
			this.players = remove(this.players, p => p.userId !== player.userId)
			this.playerCount = this.players.length
		}
	}

	export class PlayerClass {
		userId: string
		name: string
		ready: boolean
		forfeited: boolean
		finished: boolean
		wordClasses: string[]
		currentIndex: number
		wpm: number
		acc: number

		constructor(userId: string, name: string) {
			this.userId = userId
			this.name = name
			this.ready = false
			this.forfeited = false
			this.finished = false
			this.wordClasses = []
			this.currentIndex = 0
			this.wpm = 0
			this.acc = 0
		}
		setReady(bool: boolean): void {
			this.ready = bool
		}
		setCurrentIndex(currentIndex: number): void {
			this.currentIndex = currentIndex
		}
		setWordClasses(classes: string[]): void {
			this.wordClasses = classes
		}
		setStats({ wpm, acc }: { wpm: number, acc: number }): void {
			this.wpm = wpm
			this.acc = acc
		}
		isForfeited(): void {
			this.forfeited = true
		}
		isFinished(): void {
			this.finished = true
		}
	}
}
