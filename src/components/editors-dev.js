/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React, { useState, useEffect } from "react"

import '../styles/room-editors.scss'

import { Input } from 'godspeed'
import { waitForDomChange } from '@testing-library/react'

const randomWords = require('random-words')

const EditorsDev = () => {

	const [acc, setAcc] = useState(0)
	const [wpm, setWPM] = useState(0)
	const [wordSet, setWordSet] = useState(randomWords({ exactly: 5, maxLength: 5 }))
	const [wordInput, setWordInput] = useState('')
	const [currentIndex, setCurrentIndex] = useState(0)
	const [wordClasses, setwordClasses] = useState([])
	const [startTime, setStartTime] = useState(null)
	const [correctKeys, setCorrectKeys] = useState(0)

	function inputChange(e) {
		if (currentIndex !== wordSet.length) {
			setWordInput(e.target.value.replace(/[^a-z]/ig, '').toLowerCase())
		}
	}

	function incrementIndex() {
		setCurrentIndex(currentIndex + 1)
		setWordInput('')
	}

	function setCurrentClass(evaluation) {
		setwordClasses([...wordClasses, evaluation])
		evaluation === 'correct' && setCorrectKeys(correctKeys + wordSet[currentIndex].length)
		incrementIndex()
	}

	function checkWord(e) {
		let key = e.key
		let isLastWord = currentIndex === wordSet.length - 1
		let lastWord = wordSet[wordSet.length - 1]
		if (wordInput === '') return
		if (!((key >= 'a' && key <= 'z') || key === ' ')) return
		if (key === ' ') {
			wordInput === wordSet[currentIndex]
				? setCurrentClass('correct')
				: setCurrentClass('incorrect')
		} else if (isLastWord && wordInput.length === lastWord.length - 1) {
			wordInput + key === wordSet[currentIndex]
				? setCurrentClass('correct')
				: setCurrentClass('incorrect')
			incrementIndex()
		}
	}

	function calculate() {
		let totalChars = 0
		let wordsTyped = correctKeys / 5
		let timeTaken = (Date.now() - startTime) / 1000 / 60
		wordSet.forEach(w => totalChars += w.length)
		setAcc(Math.floor((correctKeys / totalChars) * 100))
		setWPM(Math.floor(wordsTyped / timeTaken))
	}

	useEffect(() => {
		wordInput !== '' && currentIndex === 0 && setStartTime(Date.now())
	}, [wordInput])

	useEffect(() => {
		currentIndex === wordSet.length && calculate()
	}, [currentIndex])

	function wordClass(i) {
		return i === currentIndex
			? 'current'
			: wordClasses[i]
	}

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
							<p>dev</p>
						</div>
						<div className="stats-cont">
							<span>
								Accuracy: {acc} | WPM: {wpm}
							</span>
						</div>
					</div>
					<div className="body">
						<div className="text-area">
							{wordSet.map((w, i) => (
								<span className={wordClass(i)} key={i}>{w} </span>
							))
							}
						</div>
						<div className="input-area">
							<Input
								onChange={(e) => inputChange(e)}
								onKeyDown={(e) => checkWord(e)}
								value={wordInput} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default EditorsDev