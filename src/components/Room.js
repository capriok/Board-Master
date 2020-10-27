/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React, { useState, useEffect } from 'react'
import io from 'socket.io-client';
import Editor from './Editor/Editor';
const socket = io(process.env.REACT_APP_ENDPOINT)

const Room = ({ params }) => {
	const { name, room } = params

	useEffect(() => {

		// Connect to socket
		socket.on('connect', () => {
			console.log('Socket Connected', socket.connected);
			socket.emit('join', { name, room })
		})

		socket.on('ok', () => {
		})

		// Disconnect socket when Room unmounts
		return () => socket.disconnect()
	}, [])

	return (
		<>
			<h1>Welcome to room {room}</h1>
			<Editor />
		</>
	)
}

export default Room
