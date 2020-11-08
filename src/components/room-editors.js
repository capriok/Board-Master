/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React, { useState, useEffect } from "react"

import '../styles/room-editors.scss'

import { Input } from 'godspeed'

const randomWords = require('random-words')

const RoomEditors = (props) => {
	const { socket, lobby, User, HostId } = props

	const isHost = User.userId === HostId
	const isPlayer = lobby.players.some(player => player.userId === User.userId)
	let localPlayer = lobby.players.find(p => p.userId === User.userId)
	let foreignPlayer = lobby.players.find(p => p.userId !== User.userId)

	const [accuracy, setAccuracy] = useState("...")
	const [wpm, setWpm] = useState("...")
	const [wordSet, setWordSet] = useState([])
	const [loading, setLoading] = useState(true)
	const [count, setCount] = useState(false)

	// useEffect(() => {
	// 	while (!lobby.inSession && lobby.playersReady) {
	// 		let wordSet = []
	// 		if (isHost) wordSet = randomWords({ exactly: 25, maxLength: 5 })
	// 		socket.emit('lobby-development', { lobby, wordSet })
	// 	}
	// }, [lobby])

	useEffect(() => {
		if (!lobby.inSession) {
			if (lobby.playersReady) {
				let wordSet = []
				if (isHost) wordSet = randomWords({ exactly: 25, maxLength: 5 })
				socket.emit('lobby-development', { lobby, wordSet })
			}
			socket.on('lobby-words', (wordSet) => {
				setWordSet(wordSet)
			})
		} else {
			setLoading(false)
			setWordSet(lobby.wordSet)
		}
		let countdown = setTimeout(() => {
			if (lobby.inSession) return
			socket.emit('lobby-start')
			socket.on('lobby-countdown', (count) => setCount(count))
		}, 2500)

		return () => clearTimeout(countdown)
	}, [])

	useEffect(() => {
		if (count === 0) setLoading(false)
	}, [count])

	return (
		<div className="editors-main">
			<div className="controls">
				<div className="control-placeholder" />
			</div>
			<div className="editors">
				{/* HOME CLIENT */}
				<div className="editor-cont">
					<div className="head">
						<div className="name">
							<p>{isPlayer ? localPlayer.name : lobby.players[0].name}</p>
						</div>
						<div className="stats-cont">
							<span>Accuracy: {accuracy} | WPM: {wpm}</span>
						</div>
					</div>
					<div className="body">
						<div className="text-area">
							{loading
								? <div className="on-load">
									<div className="time">{count}</div>
									<div className="spinner" />
								</div>
								: wordSet.map((w, i) => (
									<span key={i}>{w} </span>
								))
							}
						</div>
						{(loading || wordSet.length > 0) &&
							<div className="input-area">
								<Input placeholder="Good Luck!" onChange={() => { }} />
							</div>
						}
					</div>
				</div>
				<br />
				{/* AWAY CLIENT */}
				<div className="editor-cont">
					<div className="head">
						<div className="name">
							<p>{isPlayer ? foreignPlayer.name : lobby.players[1].name}</p>
						</div>
						<div className="stats-cont">
							<span>Accuracy: {accuracy} | WPM: {wpm}</span>
						</div>
					</div>
					<div className="body">
						<div className="text-area">
							{loading
								? <div className="on-load">
									<div className="time">{count}</div>
									<div className="spinner" />
								</div>
								: wordSet.map((w, i) => (
									<span key={i}>{w} </span>
								))
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default RoomEditors