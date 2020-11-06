/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'

import '../styles/socket-room.scss'

import RoomLobby from './room-lobby'
import RoomEditors from './room-editors'
import RoomChat from './room-chat'
import { Button } from 'godspeed'

const SocketRoom = ({ params }) => {
	const { name, room } = params

	const [lobby, setLobby] = useState({
		playerOne: {},
		playerTwo: {}
	})
	const [users, setUsers] = useState([])
	const [localUser, setLocalUser] = useState({})
	const [roomHost, setRoomHost] = useState({})
	const [usersDropdown, setUsersDropdown] = useState(false)
	const [gameInSession, setInSession] = useState(false)

	const socketRef = useRef(io(process.env.REACT_APP_ENDPOINT))
	let socket = socketRef.current

	useEffect(() => {

		// Connect to socket
		socket.on('connect', () => {
			console.log('Socket Connected', socket.connected)
			socket.emit('join', { name, room })
			setInSession(false)
		})

		socket.on('user-list', (list) => {
			console.log('User List', list)
			setUsers(list)
		})

		socket.on('room-host', (id) => {
			console.log('Room Host', id)
			setRoomHost(id)
		})

		socket.on('local-user', (user) => {
			console.log('Local User', user)
			setLocalUser(user)
		})

		// Disconnect socket when Room unmounts
		return () => socket.disconnect()
	}, [])

	const props = {
		socket,
		name, room,
		lobby, setLobby,
		users, localUser,
		roomHost,
		usersDropdown,
		setInSession
	}

	return (
		<div className="room-main">
			<h1>Welcome to room {room}</h1>
			<main>
				<div className="session">
					{!gameInSession
						? <RoomLobby {...props} />
						: <RoomEditors {...props} />
					}
				</div>
				<div className="chat">
					<div className="toggle">
						<Button text={`Show Users ${users.length}`} onClick={() => setUsersDropdown(!usersDropdown)} />
					</div>
					<RoomChat {...props} />
				</div>
			</main>
		</div >
	)
}

export default SocketRoom
