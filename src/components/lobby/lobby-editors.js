/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React, { useState, useEffect } from "react"

import '../../styles/lobby/lobby-editors.scss'

import { Input } from 'godspeed'

const randomWords = require('random-words')

const LobbyEditors = (props) => {
	const { socket, lobby, User, HostId } = props

	const isHost = User.userId === HostId
	const isPlayer = lobby.players.some(p => p.userId === User.userId)
	let localPlayer = lobby.players.find(p => p.userId === User.userId)
	let foreignPlayer = lobby.players.find(p => p.userId !== User.userId)

	const [loading, setLoading] = useState(true)
	const [count, setCount] = useState(null)
	const [wordSet, setWordSet] = useState([])
	const [wordInput, setWordInput] = useState('')
	const [currentIndex, setCurrentIndex] = useState(0)
	const [wordClasses, setwordClasses] = useState([])
	const [correctKeys, setCorrectKeys] = useState(0)

	useEffect(() => {
		if (!lobby.inSession) {
			let wordSet = []
			if (isHost) wordSet = randomWords({ exactly: lobby.options.exactly, maxLength: lobby.options.maxLength })
			socket.emit('lobby-development', { wordSet })
			socket.on('lobby-words', (wordSet) => setWordSet(wordSet))
			socket.on('lobby-countdown', (count) => setCount(count))
		} else {
			setLoading(false)
			setWordSet(lobby.wordSet)
		}
	}, [])

	useEffect(() => {
		if (wordSet.length > 0) {
			if (lobby.inSession) return
			socket.emit('lobby-start')
		}
	}, [wordSet])

	useEffect(() => {
		if (count === 0) {
			setLoading(false)
			socket.emit('lobby-start-time')
		}
	}, [count])

	function inputChange(e) {
		if (currentIndex !== wordSet.length) {
			setWordInput(e.target.value.replace(/[^a-z]/ig, '').toLowerCase())
		}
	}

	function incrementIndex() {
		setCurrentIndex(currentIndex + 1)
		socket.emit('player-current-index', { player: User, currentIndex: currentIndex + 1 })
		setWordInput('')
	}

	function setCurrentClass(evaluation) {
		setwordClasses([...wordClasses, evaluation])
		socket.emit('player-word-classes', { player: User, wordClasses: [...wordClasses, evaluation] })
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
		let words = correctKeys / 5
		let minute = (Date.now() - lobby.startTime) / 1000 / 60
		wordSet.forEach(w => totalChars += w.length)
		socket.emit('player-acc', { player: User, acc: Math.floor((correctKeys / totalChars) * 100) })
		socket.emit('player-wpm', { player: User, wpm: Math.floor(words / minute) })
	}

	useEffect(() => {
		if (wordSet.length > 0) currentIndex === wordSet.length && calculate()
	}, [currentIndex])

	function p1WordClass(i) {
		if (isPlayer) {
			return i === localPlayer.currentIndex
				? 'current'
				: localPlayer.wordClasses[i]
		} else {
			return i === lobby.players[0].currentIndex
				? 'current'
				: lobby.players[0].wordClasses[i]
		}
	}

	function p2WordClass(i) {
		if (isPlayer) {
			return i === foreignPlayer.currentIndex
				? 'current'
				: foreignPlayer.wordClasses[i]
		} else {
			return i === lobby.players[1].currentIndex
				? 'current'
				: lobby.players[1].wordClasses[i]
		}
	}

	return (
		<div className="editors-main">
			<div className="controls">
				<div className="control-placeholder" />
			</div>
			<div className="editors">
				{/* LOCAL CLIENT */}
				<div className="editor-cont">
					<div className="head">
						<div className="name">
							<p>{isPlayer ? localPlayer.name : lobby.players[0].name}</p>
						</div>
						<div className="stats-cont">
							<span>
								Accuracy: {isPlayer ? localPlayer.accuracy : lobby.players[0].accuracy} |
								WPM: {isPlayer ? localPlayer.wpm : lobby.players[0].wpm}</span>
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
									<span className={p1WordClass(i)} key={i}>{w} </span>
								))
							}
						</div>
						{(loading || wordSet.length > 0) && isPlayer &&
							<div className="input-area">
								<Input
									onChange={(e) => inputChange(e)}
									onKeyDown={(e) => checkWord(e)}
									value={wordInput} />
							</div>
						}
					</div>
				</div>
				<br />
				{/* FOREIGN CLIENT */}
				<div className="editor-cont">
					<div className="head">
						<div className="name">
							<p>{isPlayer ? foreignPlayer.name : lobby.players[1].name}</p>
						</div>
						<div className="stats-cont">
							<span>
								Accuracy: {isPlayer ? foreignPlayer.accuracy : lobby.players[1].accuracy} |
								WPM: {isPlayer ? foreignPlayer.wpm : lobby.players[1].wpm}</span>
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
									<span className={p2WordClass(i)} key={i}>{w} </span>
								))
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LobbyEditors