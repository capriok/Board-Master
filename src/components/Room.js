/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client';
import Editor from './Editor';

import '../styles/room.scss'
import { Input, Button } from 'godspeed';

const socket = io(process.env.REACT_APP_ENDPOINT)

const Room = ({ params }) => {
	const { name, room } = params

	const endRef = useRef()

	useEffect(() => {
		endRef.current.scrollIntoView()

		// Connect to socket
		socket.on('connect', () => {
			console.log('Socket Connected', socket.connected);
			socket.emit('join', { name, room })
		})


		socket.on('ok', () => {
			console.log(socket);
		})

		// Disconnect socket when Room unmounts
		return () => socket.disconnect()
	}, [])

	return (
		<div className="room-main">
			<h1>Welcome to room {room}</h1>
			<main>
				<div className="editor">
					<Editor />
					<br />
					<Editor />
				</div>
				<div className="chat">
					<div className="message-area">
						<span className="message">message</span>
						<span className="message">message</span>
						<span className="message">message</span>
						<span className="message">message</span>
						<span className="message">message</span>
						<span className="message">message</span>
						<span className="message">message</span>
						<span className="message">message</span>
						<div ref={endRef} />
					</div>
					<div className="input-area">
						<Input palceholder="Message" onClick={() => { }} />
						<Button text="Send" onclick={() => { }} />
					</div>
				</div>
			</main>
		</div>
	)
}

export default Room
