/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React, { useState, useEffect } from "react";
import '../styles/editor.scss'
import { Button, Input } from 'godspeed';
const randomWords = require('random-words')

const PlayingField = (props) => {


	const [accuracy, setAccuracy] = useState("?");
	const [wpm, setWpm] = useState("?");
	const [wordList, setWordList] = useState(randomWords({ exactly: props.rSelected, maxLength: 5 }));


	function setText() {
		console.log(randomWords());
		setWordList(randomWords({ exactly: props.rSelected, maxLength: 5 }))
	}

	useEffect(() => {
		setText();
	}, [props.rSelected]);

	return (
		<>
			<div className="editor-cont">
				<div className="head">
					<div className="name">
						<p>{props.name}</p>
					</div>
					<div className="stats-cont">
						<span>Accuracy: {accuracy} | WPM: {wpm}</span>
					</div>
				</div>
				<div className="main">
					<div className="text-area">
						{wordList.map((w, i) => (
							<span key={i}>{w} </span>
						))}
					</div>
					<div className="input-area">
						<Input placeholder="Good Luck!" onChange={() => { }} />
						<Button text="Reset" onClick={() => { }} />
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
				<div className="main">
					<div className="text-area">
						{wordList.map((w, i) => (
							<span key={i}>{w} </span>
						))}
					</div>
					<div className="input-area">
						<Input placeholder="Good Luck!" onChange={() => { }} />
						<Button text="Reset" onClick={() => { }} />
					</div>
				</div>
			</div>
		</>
	);
}

export default PlayingField