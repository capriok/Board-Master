/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client';

import '../styles/room.scss'

import PlayingField from './PlayingField';
import Chat from './Chat';
import { Button } from 'godspeed';

const Room = ({ params }) => {
	const { name, room } = params

	const [users, setUsers] = useState([])
	const [usersOpen, setUsersOpen] = useState(false)

	const socketRef = useRef(io(process.env.REACT_APP_ENDPOINT))
	let socket = socketRef.current

	useEffect(() => {

		// Connect to socket
		socket.on('connect', () => {
			console.log('Socket Connected', socket.connected);
			socket.emit('join', { name, room })
		})

		socket.on('user-list', (list) => {
			console.log(list);
			setUsers(list)
		})

		// Disconnect socket when Room unmounts
		return () => socket.disconnect()
	}, [])

	const props = { socket, name, room, users, usersOpen }

	return (
		<div className="room-main">
			<h1>Welcome to room {room}</h1>
			<main>
				<div className="editor">
					<PlayingField {...props} />
				</div>
				<div className="chat">
					<div className="toggle">
						<Button text={`Show Users ${users.length}`} onClick={() => setUsersOpen(!usersOpen)} />
					</div>
					<Chat {...props} />
				</div>
			</main>
		</div >
	)
}

export default Room
