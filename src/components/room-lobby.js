/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React, { useState, useEffect } from 'react'

import '../styles/room-lobby.scss'

import { Button } from 'godspeed'

const randomWords = require('random-words')

const RoomLobby = (props) => {
	const { socket, lobby, setLobby, roomHost, localUser, setInSession } = props

	const isPlayer = Object.keys(lobby).some(slot => lobby[slot].userId === localUser.userId)
	const isPlayerReady = Object.keys(lobby).some(slot => lobby[slot].userId === localUser.userId && lobby[slot].ready === true)
	const isFull = Object.keys(lobby).every(slot => lobby[slot].name !== undefined)

	function joinLobby() {
		socket.emit('join-lobby', localUser)
	}

	function leaveLobby() {
		socket.emit('leave-lobby', localUser)
	}

	function readyUp() {
		socket.emit('ready-up', localUser)
	}

	useEffect(() => {
		socket.on('lobby-list', (payload) => {
			setLobby(payload)
		})
	}, [])

	useEffect(() => {
		const playersReady = Object.keys(lobby).every(slot => lobby[slot].ready === true)
		let generator = setTimeout(() => {
			if (playersReady) {
				let wordSet = []
				if (localUser.userId === roomHost) {
					wordSet = randomWords({ exactly: 25, maxLength: 5 })
				}
				socket.emit('generate-editors', { lobby, wordSet })
				setInSession(true)
			}
		}, 1000)
		return () => clearTimeout(generator)
	}, [lobby])

	return (
		<div className="lobby-main">
			<div className="controls">
				{(!isFull || isPlayer) &&
					<Button
						className="join-button"
						text={isPlayer ? "Leave Lobby" : "Join Lobby"}
						onClick={() => isPlayer ? leaveLobby() : joinLobby()} />}
				{isPlayer &&
					<Button
						className="ready-button"
						text={isPlayerReady ? "Not Ready" : "Ready up"}
						onClick={() => readyUp()} />
				}
				{(!isPlayer && isFull) &&
					<div className="control-placeholder" />
				}
			</div>
			<div className="body">
				<h1 className="header">Lobby</h1>
				<div className="players">
					<div className="player-cont">
						{lobby.playerOne.name
							? <p className="player">{lobby.playerOne.ready && "✓ "}{lobby.playerOne.name}</p>
							: <p className="player-placeholder" />
						}
					</div>
					<p>vs.</p>
					<div className="player-cont">
						{lobby.playerTwo.name
							? <p className="player">{lobby.playerTwo.name}{lobby.playerTwo.ready && " ✓"}</p>
							: <p className="player-placeholder" />
						}
					</div>
				</div>

			</div>
		</div>
	)
}

export default RoomLobby
