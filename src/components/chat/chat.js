/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React, { useState, useEffect, useRef } from 'react'

import '../../styles/chat/chat.scss'

import UsersDropdown from './users-dropdown'
import { Input, Button } from 'godspeed'

const RoomChat = (props) => {
	const { socket, User } = props
	const [inputMessage, setInputMessage] = useState('')
	const [messages, setMessages] = useState([])

	const endRef = useRef()

	const firstOfSender = (m, i) => {
		let first = true
		if (m.serverMessage) return
		if (i > 0) {
			if (messages[i - 1].name === m.name) {
				messages[i - 1].serverMessage
					? first = true
					: first = false
			}
		}
		return first
	}

	useEffect(() => {
		endRef.current.scrollIntoView()
		socket.on('new-message', (message) => {
			console.log('New Message', { message });
			setMessages(msgs => [...msgs, message])
			endRef.current.scrollIntoView()
		})
	}, [])

	function sendMessage() {
		if (!inputMessage) return
		socket.emit('send-message', { name: props.name, message: inputMessage })
		setInputMessage('')
	}

	return (
		<>
			<div className="chat-cont">
				<UsersDropdown {...props} />
				<div className="message-area">
					{messages.map((m, i) => {
						const isLocalUser = m.name === User.name
						return (
							<div key={i} className={isLocalUser ? "message" : "message other"}>
								{firstOfSender(m, i) &&
									<span className={isLocalUser ? "sender" : "sender other"}>
										{m.name}
									</span>}
								<span className={m.serverMessage ? "body server-message" : isLocalUser ? "body" : "body other"}>
									{m.message}
								</span>
							</div>
						)
					})}
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

export default RoomChat
