/*eslint react-hooks/exhaustive-deps: "off"*/
import React from 'react'

import 'styles/lobby/lobby.scss'

import { Button } from 'godspeed'
import LobbyOptions from './lobby-options'

interface Props {
	socket: Socket
	lobby: Lobby
	User: User
	setPracticeEditor: SetPracticeEditor
}

const Lobby: React.FC<Props> = ({
	socket,
	lobby,
	User,
	setPracticeEditor
}) => {

	const isPlayer = lobby.players.some(player => {
		return player.userId === User.userId
	})

	const isPlayerReady = lobby.players.some(player => {
		return player.userId === User.userId && player.ready === true
	})

	const isFull = lobby.playerCount === 2

	function joinLobby(): void {
		socket.emit('join-lobby', User)
	}

	function leaveLobby(): void {
		socket.emit('leave-lobby', User)
	}

	function setReady(): void {
		socket.emit('set-ready', User)
	}

	return (
		<div className="lobby-main">
			<div className="controls">
				<div>
					{(!isFull || isPlayer) &&
						<Button
							className="join-button"
							text={isPlayer ? "Leave Lobby" : "Join Lobby"}
							onClick={() => isPlayer ? leaveLobby() : joinLobby()} />
					}
					{isPlayer &&
						<Button
							className="ready-button"
							text={isPlayerReady ? "Not Ready" : "Ready up"}
							onClick={() => setReady()} />
					}
				</div>
				<Button
					className="practice-button"
					text="Practice ○"
					onClick={() => setPracticeEditor(true)}
					disabled={isPlayer} />
				{(!isPlayer && isFull) &&
					<div className="control-placeholder" />
				}
			</div>
			<div className="body">
				<h1 className="header">Lobby</h1>
				<div className="players">
					<div className="player-cont">
						{lobby.players.length > 0 && lobby.players[0].name
							? <p className="player">{lobby.players[0].ready && "✓ "}{lobby.players[0].name}</p>
							: <p className="player-placeholder" />
						}
					</div>
					<p>vs.</p>
					<div className="player-cont">
						{lobby.players.length > 1 && lobby.players[1].name
							? <p className="player">{lobby.players[1].name}{lobby.players[1].ready && " ✓"}</p>
							: <p className="player-placeholder" />
						}
					</div>
				</div>
				<LobbyOptions
					lobby={lobby}
					socket={socket} />
			</div>
		</div>
	)
}

export default Lobby