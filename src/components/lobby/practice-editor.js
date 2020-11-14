/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React, { useState, useEffect } from "react"

import '../../styles/lobby/lobby-editors.scss'
import '../../styles/lobby/practice-editor.scss'

import { Button, Input } from 'godspeed'
import PracticeOptions from './practice-options'

const randomWords = require('random-words')

const PracticeEditor = (props) => {
	const { User, practiceEditor, setPracticeEditor, practiceOptions, setPracticeOptions } = props

	const RANDOM_WORDS = randomWords({ exactly: practiceOptions.exactly, maxLength: practiceOptions.maxLength })

	const [optionsOpen, toggleOptions] = useState(false)

	const [startTime, setStartTime] = useState(null)
	const [wordSet, setWordSet] = useState(RANDOM_WORDS)
	const [wordInput, setWordInput] = useState('')
	const [currentIndex, setCurrentIndex] = useState(0)
	const [wordClasses, setwordClasses] = useState([])
	const [correctKeys, setCorrectKeys] = useState(0)
	const [wpm, setWPM] = useState(0)
	const [acc, setAcc] = useState(0)

	useEffect(() => {
		setWordSet(RANDOM_WORDS)
	}, [practiceOptions])

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
		evaluation === 'correct' && setCorrectKeys(correctKeys + wordSet[currentIndex].length + 1)
		incrementIndex()
	}

	function checkWord(e) {
		let key = e.key
		let isLastWord = currentIndex === wordSet.length - 1
		let lastWord = wordSet[wordSet.length - 1]
		if (e.key === 'Escape') return resetEditor()
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
		let errors = 0
		let words = (correctKeys / 5)
		let minute = (Date.now() - startTime) / 1000 / 60
		wordClasses.forEach(c => c === 'incorrect' && errors + 5)
		wordSet.forEach(w => totalChars += w.length + 1)
		setWPM(Math.floor((words - errors) / minute))
		setAcc(Math.floor((correctKeys / totalChars) * 100))
	}

	function resetEditor() {
		setStartTime(null)
		setWordSet(RANDOM_WORDS)
		setWordInput('')
		setCurrentIndex(0)
		setwordClasses([])
		setCorrectKeys(0)
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
						? <PracticeOptions practiceOptions={practiceOptions} setPracticeOptions={setPracticeOptions} />
						: <>
							<div className="head">
								<div className="name">
									<p>{User.name}</p>
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
											placeholder={currentIndex === 0 ? 'Scoring starts when you start typing' : ''}
											onChange={(e) => inputChange(e)}
											onKeyDown={(e) => checkWord(e)}
											value={wordInput} />}
								</div>
								<br />
								{wordSet.length === currentIndex &&
									<div className="stats-cont">
										<div className="stats">
											<p><span>{wpm}</span> Words/ Minute</p>
											<p><span>{acc}%</span> Accuracy</p>
										</div>
									</div>}
							</div>
						</>
					}
				</div>
			</div>
		</div>
	);
}

export default PracticeEditor