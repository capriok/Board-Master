/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React, { useState, useEffect } from "react";
import '../styles/editor.scss'
import { Button, Input } from 'godspeed';
const randomWords = require('random-words')

const PlayingField = (props) => {

	const [rSelected, setRSelected] = useState(50);

	const [accuracy, setAccuracy] = useState("?");
	const [wpm, setWpm] = useState("?");
	const [wordList, setWordList] = useState(randomWords({ exactly: rSelected, maxLength: 5 }));


	function setText() {
		setWordList(randomWords({ exactly: rSelected, maxLength: 5 }))
	}

	useEffect(() => {
		setText();
	}, [rSelected]);

	return (
		<>
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
				<Button text="Randomize" onClick={() => { setText() }} />
			</div>
			<div className="editors">
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
						<div className="input-area">
							<Input placeholder="Good Luck!" onChange={() => { }} />
						</div>
					</div>
				</div>
				<br />
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
		</>
	);
}

export default PlayingField