import React, { useState, useEffect } from 'react'

import '../styles/room-lobby.scss'

import { Button } from 'godspeed'

const RoomLobby = (props) => {
	const { socket, localUser } = props

	const [lobby, setLobby] = useState({
		playerOne: {},
		playerTwo: {}
	})

	const isPlayer = Object.keys(lobby).some(slot => lobby[slot].userId === localUser.userId)
	const isFull = Object.keys(lobby).every(slot => lobby[slot].userId !== undefined)

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
			console.log(payload);
			setLobby(payload)
		})
	}, [])

	return (
		<div className="lobby-main">
			<div className="header">
				<h1>Lobby</h1>
			</div>
			<div className="body">
				{isFull &&
					<Button
						className="ready-button"
						text="Ready up"
						onClick={() => readyUp()} />
				}
				<div className="members">
					<div className="member-cont">
						{lobby.playerOne.name
							? <p className="member">{lobby.playerOne.ready && "✓ "}{lobby.playerOne.name}</p>
							: <p className="member-placeholder" />
						}
					</div>
					<p>vs.</p>
					<div className="member-cont">
						{lobby.playerTwo.name
							? <p className="member">{lobby.playerTwo.ready && "✓ "}{lobby.playerTwo.name}</p>
							: <p className="member-placeholder" />
						}
					</div>
				</div>
				<Button
					className="join-button"
					text={isPlayer ? "Leave Lobby" : "Join Lobby"}
					onClick={() => isPlayer ? leaveLobby() : joinLobby()} />
			</div>
		</div>
	)
}

export default RoomLobby
