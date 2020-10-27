/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client';
import PlayingField from './PlayingField';

import '../styles/room.scss'
import { Input, Button } from 'godspeed';

const socket = io(process.env.REACT_APP_ENDPOINT)

const Room = ({ params }) => {
	const { name, room } = params
	const [rSelected, setRSelected] = useState(50);

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


	const props = {
		rSelected, name
	}

	return (
		<div className="room-main">
			<h1>Welcome to room {room}</h1>
			<main>
				<div className="editor">
					<div className="button-cont">
						<Button
							text="25"
							onClick={() => setRSelected(25)}
							disabled={rSelected === 25} />
						<Button
							text="50"
							onClick={() => setRSelected(50)}
							disabled={rSelected === 50} />
						<Button
							text="100"
							onClick={() => setRSelected(100)}
							disabled={rSelected === 100} />
					</div>
					<br />
					<PlayingField {...props} />
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
						<span className="message">message</span>
						<span className="message">message</span>
						<span className="message">message</span>
						<span className="message">message</span>
						<span className="message">message</span>
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
