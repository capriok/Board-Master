export const router = require('express').Router()
import { BMClasses } from './classes/rooms'
const Rooms = new BMClasses.RoomsClass()

export function initialize(io: any) {

	io.on("connection", (socket: any) => {
		let Room: BMClasses.RoomClass
		let User: BMClasses.UserClass
		let Player: BMClasses.PlayerClass

		// // SOCKET JOINING
		socket.on('join', (payload: { name: string, room: string }) => {
			if (Rooms.getRoom(payload.room) !== undefined &&
				Rooms.getUsers(payload.room).some((u) => u.name === payload.name)) {
				console.log('DUPLICATE NAME - DISCONNECTED', socket.id);
				return io.to(socket.id).emit('duplicate-name')
			}

			User = new BMClasses.UserClass(socket.id, payload.name)
			Room = new BMClasses.RoomClass(socket.id, payload.room)

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

			console.log(`USER ADDED TO ROOM ${Room.name}: `, Rooms.getUsers(Room.name))
		})


		// // MESSAGE FROM CHAT
		socket.on('send-message', (payload: { name: string, message: string, serverMessage?: boolean }) => {
			console.log('NEW CHAT MESSAGE: ', payload.message)
			io.to(Room.name).emit("new-message", payload)
		})


		// // USER JOINING LOBBY
		socket.on('join-lobby', (payload: typeof User) => {
			if (payload.userId === undefined) return
			Player = new BMClasses.PlayerClass(payload.userId, payload.name)
			console.log('PLAYER JOINED: ', payload.name)
			Rooms.getLobby(Room.name).addPlayer(Player)
			io.to(Room.name).emit('room-lobby', Rooms.getLobby(Room.name))
			console.log('LOBBY PLAYERS: ', Rooms.getLobby(Room.name).getPlayers())
		})

		// // USER LEAVING LOBBY
		socket.on('leave-lobby', (payload: typeof User) => {
			console.log('PLAYER LEFT: ', payload.name)
			Rooms.getLobby(Room.name).removePlayer(Player)
			io.to(Room.name).emit('room-lobby', Rooms.getLobby(Room.name))
			console.log('LOBBY PLAYERS: ', Rooms.getLobby(Room.name).players)
		})

		// // USER READY UP
		socket.on('set-ready', (payload: typeof User) => {
			console.log('PLAYER IS READY: ', payload.name)
			Rooms.getLobby(Room.name).getPlayer(Player).setReady(true)
			io.to(Room.name).emit('room-lobby', Rooms.getLobby(Room.name))
			let lobbyFull = Rooms.getLobby(Room.name).getPlayerCount() === 2
			let lobbyReady = Rooms.getLobby(Room.name).getPlayers().every(p => p.ready === true)
			if (lobbyFull && lobbyReady) {
				Rooms.getLobby(Room.name).setPlayersReady(true)
				let delay = setTimeout(() => {
					io.to(Room.name).emit('room-lobby', Rooms.getLobby(Room.name))
					clearTimeout(delay)
				}, 1000)
			}
		})

		// // LOBBY OPTIONS
		socket.on('lobby-options', (payload: { exactly: number, maxLength: number }) => {
			Rooms.getLobby(Room.name).setOptions(payload)
			Rooms.getLobby(Room.name).setPlayersReady(false)
			Rooms.getLobby(Room.name).getPlayers().forEach(p => p.setReady(false))
			console.log('LOBBY OPTIONS: ', Rooms.getLobby(Room.name).getOptions());
			io.to(Room.name).emit('room-lobby', Rooms.getLobby(Room.name))
		})

		// // LOBBY DEVELOPMENT
		socket.on('lobby-development', (payload: { wordSet: string[] }) => {
			console.log('ALL PLAYERS READY, DEVELOPING LOBBY');
			const isHost = Rooms.getRoom(Room.name).roomId === socket.id
			if (isHost) {
				Rooms.getLobby(Room.name).setWordSet(payload.wordSet)
				console.log('MATCH WORDSET: ', payload.wordSet)
				setTimeout(() => io.to(Room.name).emit('lobby-words', payload.wordSet), 1000)
			} else {
				io.to(Room.name).emit('lobby-words', payload.wordSet)
			}
		})

		// // LOBBY START
		socket.on('lobby-start', () => {
			const isHost = Rooms.getRoom(Room.name).roomId === socket.id
			isHost && console.log('STARTING COUNTDOWN')
			let counter = 5
			let countdown = setInterval(() => {
				io.to(Room.name).emit('lobby-countdown', counter)
				if (isHost) {
					counter > 0 && console.log(`${counter}...`)
					if (counter === 0) {
						Rooms.getLobby(Room.name).setInSession()
						io.to(Room.name).emit('room-lobby', Rooms.getLobby(Room.name))
					}
				}
				counter--
				counter < 0 && clearInterval(countdown)
			}, 1000)
		})

		// // LOBBY START TIME
		socket.on('lobby-start-time', () => {
			Rooms.getLobby(Room.name).setStartTime()
			io.to(Room.name).emit('room-lobby', Rooms.getLobby(Room.name))
		})

		// // PLAYER CURRENT INDEX
		socket.on('player-current-index', (payload: { currentIndex: number }) => {
			Player.setCurrentIndex(payload.currentIndex)
			io.to(Room.name).emit('room-lobby', Rooms.getLobby(Room.name))
		})

		// // PLAYER CURRENT INDEX
		socket.on('player-word-classes', (payload: { wordClasses: string[] }) => {
			Player.setWordClasses(payload.wordClasses)
			io.to(Room.name).emit('room-lobby', Rooms.getLobby(Room.name))
		})

		// // PLAYER STATS
		socket.on('player-stats', (payload: { wpm: number, acc: number }) => {
			console.log('PLAYER STATS:', { wpm: payload.wpm, acc: payload.acc })
			Player.setStats({ wpm: payload.wpm, acc: payload.acc })
			Player.isFinished()
			io.to(Room.name).emit('room-lobby', Rooms.getLobby(Room.name))
		})

		// // PLAYER FORFEIT
		socket.on('player-forfeit', () => {
			console.log('PLAYER FORFEITED:', Player.name)
			Player.isForfeited()
			let lobbyPlayers = Rooms.getLobby(Room.name).getPlayers()
			let playersForfeited = lobbyPlayers.every(p => p.forfeited === true)
			io.to(Room.name).emit('room-lobby', Rooms.getLobby(Room.name))
			if (playersForfeited) {
				Rooms.getRoom(Room.name).resetLobby()
				let delay = setTimeout(() => {
					io.to(Room.name).emit('room-lobby', Rooms.getLobby(Room.name))
					clearTimeout(delay)
				}, 1000);
			}
		})

		// // MATCH FINISH
		socket.on('match-finish', () => {
			const isHost = Rooms.getRoom(Room.name).roomId === socket.id
			isHost && console.log('LOBBY RESETTING')
			let counter = 10
			let countdown = setInterval(() => {
				io.to(Room.name).emit('lobby-reset', counter)
				if (isHost) {
					counter > 0 && console.log(`${counter}...`)
				}
				if (counter === 0) {
					Rooms.getRoom(Room.name).resetLobby()
					io.to(Room.name).emit('room-lobby', Rooms.getLobby(Room.name))
				}
				counter--
				counter < 0 && clearInterval(countdown)
			}, 1000)
		})

		// // MATHC OUTCOME CHAT MESSAGE
		socket.on('match-outcome-message', (payload: { outcome: string, winner?: any, loser?: any }) => {
			socket.to(Room.name).emit('new-message', {
				name: null,
				message: payload.outcome === 'draw'
					? `The match was a draw.`
					: `${payload.winner.name} beat ${payload.loser.name} with a score of ${payload.winner.score}.`,
				serverMessage: true
			})
		})


		// // SOCKET DISCONNECTION
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
			console.log(`USER REMOVED FROM ROOM ${Room.name}`, Rooms.getUsers(Room.name))

			io.to(Room.name).emit('user-list', Rooms.getUsers(Room.name))

			if (Rooms.getLobby(Room.name).getPlayer(Player)) {
				Rooms.getLobby(Room.name).removePlayer(Player)
				console.log('USER REMOVED FROM LOBBY', Player.name)
				console.log('LOBBY', Rooms.getLobby(Room.name))

				io.to(Room.name).emit('room-lobby', Rooms.getLobby(Room.name))
			}

			if (Rooms.getUsers(Room.name).length > 0) {
				if (Rooms.getRoom(Room.name).roomId === socket.id) {
					let nextInLine = Rooms.getUsers(Room.name)[0]
					Rooms.transferHost({ room: Room.name, userId: nextInLine.userId })
					console.log('HOST TRANSFERED TO', nextInLine.name)
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
router.get('/get-users:', (req, res) => {
	const { name, room } = req.query
	let roomExists = Rooms.getRoom(room) !== undefined
	let nameExists = false
	if (roomExists) {
		nameExists = Rooms.getUsers(room).some(u => u.name === name)
	}
	res.json(nameExists)
})

// // GET REQUEST FOR ALL ROOMS, FOR BEFORE SOCKETS CONNECT
router.use('/get-rooms', (req, res) => {
	const rooms = Rooms.getRooms()
	res.json(rooms)
})
