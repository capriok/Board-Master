/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-useless-escape: "off"*/
import React, { useState, useEffect, useRef } from 'react'

import '../../styles/chat/chat.scss'

import UsersDropdown from './users-dropdown'
import { Input, Button } from 'godspeed'

const RoomChat = (props) => {
	const { socket, User } = props
	const [inputMessage, setInputMessage] = useState('')
	const [messages, setMessages] = useState([])

	const endRef = useRef()


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

	function messageWrapClass(m) {
		return m.name === User.name
			? "message local-align"
			: "message foreign-align"
	}

	function messageSenderClass(m) {
		return m.name === User.name
			? "sender local-align"
			: "sender foreign-align"
	}

	function messageTextClass(m) {
		return m.name === User.name
			? "body local-align local-color"
			: "body foreign-align foreign-color"
	}

	function isUrl(s) {
		const httpExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
		const wwwExp = /(www).?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
		if (httpExp.test(s) || wwwExp.test(s)) {
			return true
		} else return false
	}

	return (
		<>
			<div className="chat-cont">
				<UsersDropdown {...props} />
				<div className="message-area">
					{messages.map((m, i) => {
						return (
							<div key={i} className={messageWrapClass(m)}>
								{firstOfSender(m, i) &&
									<span className={messageSenderClass(m)}>{m.name}</span>
								}
								{isUrl(m.message)
									? <a className={messageTextClass(m)} href={m.message} target="_blank" rel="noopener noreferrer">{m.message}</a>
									: <span className={messageTextClass(m)}>{m.message}</span>
								}
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
