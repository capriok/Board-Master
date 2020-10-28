/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React, { useState, useEffect, useRef } from 'react'

import '../styles/chat.scss'

import Users from './Users';
import { Input, Button } from 'godspeed';

const Chat = (props) => {
	const { socket } = props
	const [inputMessage, setInputMessage] = useState('')
	const [messages, setMessages] = useState([])

	const endRef = useRef()

	useEffect(() => {
		endRef.current.scrollIntoView()

		socket.on('new-message', (message) => {
			console.log(message);
			setMessages(msgs => [...msgs, message])
			endRef.current.scrollIntoView()
		})

	}, [])

	function sendMessage() {
		if (!inputMessage) return
		console.log(inputMessage);
		socket.emit('send-message', { name: props.name, message: inputMessage })
		setInputMessage('')
	}

	return (
		<>
			<div className="chat-cont">
				<Users {...props} />
				<div className="message-area">
					{messages.map((m, i) => (
						<span key={i} className="message">{m.message}</span>
					))}
					<div ref={endRef} />
				</div>
				<form id="input-message" className="input-area" onSubmit={e => {
					e.preventDefault()
					sendMessage()
				}}>
					<Input
						placeholder="Message"
						value={inputMessage}
						onChange={e => setInputMessage(e.target.value)} />
					<Button form="input-message" type="submit" text="Send" />
				</form>
			</div>
		</>
	)
}

export default Chat
