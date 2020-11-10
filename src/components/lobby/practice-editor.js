/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React, { useState, useEffect } from "react"

import '../../styles/lobby/lobby-editors.scss'
import '../../styles/lobby/practice-editor.scss'

import { Button, Input } from 'godspeed'
import PracticeOptions from './practice-options'

const randomWords = require('random-words')

const PracticeEditor = (props) => {
	const { User, practiceEditor, setPracticeEditor } = props

	const [options, setOptions] = useState({
		exactly: 25, maxLength: 5
	})

	const RANDOM_WORDS = randomWords({ exactly: options.exactly, maxLength: options.maxLength })

	const [optionsOpen, toggleOptions] = useState(false)

	const [acc, setAcc] = useState(0)
	const [wpm, setWPM] = useState(0)
	const [wordSet, setWordSet] = useState(RANDOM_WORDS)
	const [wordInput, setWordInput] = useState('')
	const [currentIndex, setCurrentIndex] = useState(0)
	const [wordClasses, setwordClasses] = useState([])
	const [startTime, setStartTime] = useState(null)
	const [correctKeys, setCorrectKeys] = useState(0)

	useEffect(() => {
		setWordSet(RANDOM_WORDS)
	}, [options])

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

	function escKey(e) {
		console.log(e);
		if (e) {

		}
	}

	function checkWord(e) {
		if (e.key === 'Escape') return setWordSet(randomWords({ exactly: options.exactly, maxLength: options.maxLength }))
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

	function resetEditor() {
		setWordSet(RANDOM_WORDS)
		setwordClasses([])
		setCurrentIndex(0)
		setCorrectKeys(0)
		setStartTime(null)
		setAcc(0)
		setWPM(0)
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
			<div className="practice-controls">
				<Button
					className="options-button"
					text={optionsOpen ? "Options ●" : "Options ○"}
					onClick={() => toggleOptions(!optionsOpen)} />
				<Button
					className="practice-button"
					text="Practice ●"
					onClick={() => setPracticeEditor(!practiceEditor)} />
			</div>
			<div className="editors">
				<div className="editor-cont">
					{optionsOpen
						? <PracticeOptions options={options} setOptions={setOptions} />
						: <>
							<div className="head">
								<div className="name">
									<p>{User.name}</p>
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
									{wordSet.length === currentIndex
										? <Button text="Go Again" onClick={() => resetEditor()} />
										: <Input
											autoFocus
											onChange={(e) => inputChange(e)}
											onKeyDown={(e) => checkWord(e)}
											onKeyPress={(e) => escKey(e)}
											value={wordInput} />}
								</div>
							</div>
						</>
					}
				</div>
			</div>
		</div>
	);
}

export default PracticeEditor