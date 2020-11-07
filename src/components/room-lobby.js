/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React, { useEffect } from 'react'

import '../styles/room-lobby.scss'

import { Button } from 'godspeed'

const randomWords = require('random-words')

const RoomLobby = (props) => {
	const { socket, lobby, setLobby, User, HostId, setInSession } = props

	const isPlayer = lobby.players.some(player => player.userId === User.userId)
	const isPlayerReady = lobby.players.some(player => player.userId === User.userId && player.ready === true)
	const isFull = lobby.playerCount === 2

	function joinLobby() {
		socket.emit('join-lobby', User)
	}

	function leaveLobby() {
		socket.emit('leave-lobby', User)
	}

	function readyUp() {
		socket.emit('ready-up', User)
	}

	useEffect(() => {
		socket.on('room-lobby', (lobby) => {
			console.log('LOBBY', lobby);
			setLobby(lobby)
		})
	}, [])

	useEffect(() => {
		const playersReady = lobby.players.length === 2 && lobby.players.every(p => p.ready === true)
		let generator = setTimeout(() => {
			if (playersReady) {
				let wordSet = []
				if (User.userId === HostId) {
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
				{/* <div div className="controls" >
					<div className="button-cont">
						<Button
							text="25"
							onClick={() => setWordCount(25)}
							disabled={wordCount === 25} />
						<Button
							text="50"
							onClick={() => setWordCount(50)}
							disabled={wordCount === 50} />
						<Button
							text="100"
							onClick={() => setWordCount(100)}
							disabled={wordCount === 100} />

					</div>
					<Button text="Randomize" onClick={() => { setWordSet() }} />
				</div> */}
			</div>
		</div>
	)
}

export default RoomLobby



	// const [wordCount, setWordCount] = useState(50);


	// function setWordSet() {
	// 	socket.emit('randomize-word_set', { wordCount })
	// }

	// useEffect(() => {
	// 	setWordSet();
	// }, [wordCount]);

