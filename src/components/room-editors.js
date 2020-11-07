/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React, { useState, useEffect } from "react"

import '../styles/room-editors.scss'

import { Input } from 'godspeed'

const RoomEditors = (props) => {
	const { socket, lobby, User } = props

	let localPlayer = lobby.players.find(p => p.userId === User.userId)
	let foreignPlayer = lobby.players.find(p => p.userId !== User.userId)

	const [accuracy, setAccuracy] = useState("...")
	const [wpm, setWpm] = useState("...")
	const [wordList, setWordList] = useState([])
	const [init, setInit] = useState({
		loading: true,
		time: 5
	})

	useEffect(() => {
		socket.on('editor-words', (payload) => {
			console.log(payload)
			setWordList(payload)
		})
	}, [])

	useEffect(() => {
		const countdown = setTimeout(() => {
			setInit({ ...init, time: init.time - 1 })
		}, 1000)
		if (init.time < 0) {
			clearTimeout(countdown)
			setInit({ loading: false, time: 0 })
		}
	}, [init.time])

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
							<p>{localPlayer.name}</p>
						</div>
						<div className="stats-cont">
							<span>Accuracy: {accuracy} | WPM: {wpm}</span>
						</div>
					</div>
					<div className="body">
						<div className="text-area">
							{init.loading
								? <div className="on-load">
									<div className="time">{init.time}</div>
									<div className="spinner" />
								</div>
								: wordList.map((w, i) => (
									<span key={i}>{w} </span>
								))
							}
						</div>
						{(init.loading || wordList.length > 0) &&
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
							<p>{foreignPlayer.name}</p>
						</div>
						<div className="stats-cont">
							<span>Accuracy: {accuracy} | WPM: {wpm}</span>
						</div>
					</div>
					<div className="body">
						<div className="text-area">
							{init.loading
								? <div className="on-load">
									<div className="time">{init.time}</div>
									<div className="spinner" />
								</div>
								: wordList.map((w, i) => (
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