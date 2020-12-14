/*eslint react-hooks/exhaustive-deps: "off"*/
import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import io from 'socket.io-client'

import 'styles/room.scss'

import PracticeEditor from 'components/lobby/practice-editor'
import Lobby from 'components/lobby/lobby'
import LobbyEditors from 'components/lobby/lobby-editors'
import Chat from 'components/chat/chat'
import { Button } from 'godspeed'

interface Props {
	name: string
	room: string
}

const Room: React.FC<Props> = ({
	name,
	room
}) => {

	const [User, setUser] = useState<User>({})
	const [HostId, setHostId] = useState<string>('')

	const [lobby, setLobby] = useState<Lobby>({
		players: [],
		playerCount: 0,
		options: { exactly: null, maxLength: null },
		wordSet: [],
		playersReady: false,
		inSession: false,
		startTime: null
	})
	const [users, setUsers] = useState<User[]>([])
	const [usersDropdown, setUsersDropdown] = useState<boolean>(false)
	const [practiceEditor, setPracticeEditor] = useState<boolean>(false)
	const [practiceOptions, setPracticeOptions] = useState<LobbyOptions>({
		exactly: 10, maxLength: 5
	})

	const history = useHistory()

	const ENDPOINT = process.env.REACT_APP_ENDPOINT || ''

	const socketRef: React.MutableRefObject<Socket> = useRef(io(ENDPOINT, { path: '/socket.io', transports: ['websocket'] }))

	const socket = socketRef.current

	useEffect(() => {

		socket.on('connect', () => {
			console.log('Socket Connected', socket.connected)
			socket.emit('join', { name, room })
		})

		socket.on('duplicate-name', (): void => {
			console.log('hit')
			history.push('/')
		})

		socket.on('room-users', (list: User[]): void => {
			console.log('User List', { list })
			setUsers(list)
		})

		socket.on('room-host', (id: string): void => {
			console.log('Room Host', { id })
			setHostId(id)
		})

		socket.on('room-lobby', (lobby: Lobby): void => {
			console.log('Lobby', { lobby })
			setLobby(lobby)
		})

		socket.on('local-user', (user: User): void => {
			console.log('Local User', { user })
			setUser(user)
		})

		socket.on('user-kicked', () => {
			window.location.href = '/'
		})

		return () => socket.disconnect()
	}, [])

	return (
		<div className="room-main">

			<nav>
				<div className="nav-cont">
					<p className="nav-title">
						<span className="board">Board</span> <span className="master">Master</span>
					</p>
					<p className="nav-room">
						<span className="board">{room}</span>
					</p>
				</div>
				<Button
					className="leave-room"
					text="Leave"
					onClick={() => { socket.disconnect(); history.push('/') }} />
			</nav>
			<main>
				<div className="session">
					{practiceEditor
						? <PracticeEditor
							User={User}
							practiceEditor={practiceEditor}
							setPracticeEditor={setPracticeEditor}
							practiceOptions={practiceOptions}
							setPracticeOptions={setPracticeOptions} />
						: !lobby.playersReady
							? <Lobby
								socket={socket}
								lobby={lobby}
								User={User}
								setPracticeEditor={setPracticeEditor} />
							: <LobbyEditors
								socket={socket}
								lobby={lobby}
								User={User}
								HostId={HostId} />
					}
				</div>
				<div className="chat">
					<div className="toggle">
						<Button
							text={`Show Users ${users.length}`}
							onClick={() => setUsersDropdown(!usersDropdown)} />
					</div>
					<Chat
						socket={socket}
						HostId={HostId}
						name={name}
						User={User}
						users={users}
						usersDropdown={usersDropdown} />
				</div>
			</main>
		</div >
	)
}

export default Room
