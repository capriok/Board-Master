interface HomeForm {
	name: string
	nameErr: boolean
	nameUsed: boolean
	room: string
	roomErr: boolean
}

interface Room {
	roomId: string
	name: string
	users: User[]
	lobby: LobbyClass
}

interface User {
	userId?: string
	name?: string
}

interface Lobby {
	players: Player[]
	playerCount: number
	options: LobbyOptions
	wordSet: string[]
	playersReady: boolean
	inSession: boolean
	startTime: number | any
}

interface LobbyOptions {
	exactly?: number | null
	maxLength?: number | null
}

interface Player {
	userId?: string
	name?: string
	ready?: boolean
	forfeited?: boolean
	finished?: boolean
	wordClasses?: string[]
	currentIndex?: number
	wpm?: number
	acc?: number
}

interface Message {
	name: string
	message: string
	serverMessage?: boolean
}


type InputEvent = React.ChangeEvent<HTMLInputElement>
type FormEvent = React.ChangeEvent<HTMLFormElement>

type Socket = SocketIOClient.Socket | any

type SetPracticeEditor = React.Dispatch<practiceEditor>
type SetPracticeOptions = React.Dispatch<practiceOptions>