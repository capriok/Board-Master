/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React, { useState, useEffect } from "react";
import '../styles/editor.scss'
import { Card, Button, Input } from 'godspeed';
const randomWords = require('random-words')

const Editor = () => {


	const [rSelected, setRSelected] = useState(50);
	const [accuracy, setAccuracy] = useState("XX");
	const [wpm, setWpm] = useState("XX");
	const [wordList, setWordList] = useState(randomWords({ exactly: rSelected, maxLength: 5 }));
	const [currentWord, setCurrentWord] = useState(0);
	const [wordCount, setWordCount] = useState("");
	const [correctKeys, setCorrectKeys] = useState(0);
	const [timerActive, setTimerActive] = useState(false);

	function setText() {
		console.log(randomWords());
		setWordList(randomWords({ exactly: rSelected, maxLength: 5 }))
	}

	useEffect(() => {
		setText();
	}, [rSelected]);

	const handleRedo = () => {
		setText();
	};

	return (
		<div className="editor-cont">
			<div className="head">
				<div className="button-cont">
					<Button
						text="25"
						onClick={() => setRSelected(25)}
						disabled={rSelected === 25 ? true : false} />
					<Button
						text="50"
						onClick={() => setRSelected(50)}
						disabled={rSelected === 50 ? true : false} />
					<Button
						text="100"
						onClick={() => setRSelected(100)}
						disabled={rSelected === 100 ? true : false} />
					<Button
						text="150"
						onClick={() => setRSelected(150)}
						disabled={rSelected === 150 ? true : false} />
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
	);
}

export default Editor