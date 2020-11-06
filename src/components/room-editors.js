/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React, { useState, useEffect } from "react"

import '../styles/room-editors.scss'

import { Button, Input } from 'godspeed'
import RoomLobby from './room-lobby'


const RoomGame = (props) => {
	const { socket, lobby } = props

	const [wordCount, setWordCount] = useState(50);

	const [accuracy, setAccuracy] = useState("?")
	const [wpm, setWpm] = useState("?")
	const [wordList, setWordList] = useState([])

	useEffect(() => {
		socket.on('editor-words', (payload) => {
			console.log(payload)
			setWordList(payload)
		})
	}, [])

	function setWordSet() {
		socket.emit('randomize-word_set', { wordCount })
	}

	useEffect(() => {
		setWordSet();
	}, [wordCount]);

	return (
		<div className="editors-main">
			<div className="controls">
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
			</div>
			<div className="editors">
				{/* HOME CLIENT */}
				<div className="editor-cont">
					<div className="head">
						<div className="name">
							<p>{lobby.playerOne.name}</p>
						</div>
						<div className="stats-cont">
							<span>Accuracy: {accuracy} | WPM: {wpm}</span>
						</div>
					</div>
					<div className="body">
						<div className="text-area">
							{wordList.map((w, i) => (
								<span key={i}>{w} </span>
							))}
						</div>
						{wordList.length > 0 &&
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
							<p>{lobby.playerTwo.name}</p>
						</div>
						<div className="stats-cont">
							<span>Accuracy: {accuracy} | WPM: {wpm}</span>
						</div>
					</div>
					<div className="body">
						<div className="text-area">
							{wordList.map((w, i) => (
								<span key={i}>{w} </span>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default RoomGame