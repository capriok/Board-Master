/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React, { useState, useEffect } from "react"

import '../styles/room-editors.scss'

import { Button, Input } from 'godspeed'

const randomWords = require('random-words')

const RoomGame = (props) => {
	const { socket } = props

	const [rSelected, setRSelected] = useState(50);

	const WORD_SET = randomWords({ exactly: rSelected, maxLength: 5 })

	const [accuracy, setAccuracy] = useState("?")
	const [wpm, setWpm] = useState("?")
	const [wordList, setWordList] = useState([])


	function setWordSet() {
		// socket.emit('word-set', {WORD_SET})
		// setWordList(WORD_SET)
	}

	useEffect(() => {

		setWordSet();

	}, [rSelected]);

	return (
		<div className="editors-main">
			<div className="controls">
				<div className="button-cont">
					<Button
						text="25"
						onClick={() => setRSelected(25)}
						disabled={rSelected === 25} />
					<Button
						text="50"
						onClick={() => setRSelected(50)}
						disabled={rSelected === 50} />
					<Button
						text="100"
						onClick={() => setRSelected(100)}
						disabled={rSelected === 100} />

				</div>
				<Button text="Randomize" onClick={() => { setWordSet() }} />
			</div>
			<div className="editors">
				{/* HOME CLIENT */}
				<div className="editor-cont">
					<div className="head">
						<div className="name">
							<p>{props.name}</p>
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
							<p>Opponent</p>
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