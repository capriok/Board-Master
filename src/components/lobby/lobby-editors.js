/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React, { useState, useEffect, useRef } from "react"

import '../../styles/lobby/lobby-editors.scss'

import { Button, Input } from 'godspeed'

const randomWords = require('random-words')

const LobbyEditors = (props) => {
	const { socket, lobby, User, HostId } = props

	const [loading, setLoading] = useState(true)
	const [count, setCount] = useState(null)
	const [resetCount, setResetCount] = useState(null)
	const [wordSet, setWordSet] = useState([])
	const [wordInput, setWordInput] = useState('')
	const [currentIndex, setCurrentIndex] = useState(0)
	const [wordClasses, setwordClasses] = useState([])
	const [correctKeys, setCorrectKeys] = useState(0)

	const [playerOne, setPlayerOne] = useState({})
	const [playerTwo, setPlayerTwo] = useState({})
	let playerOneRef = useRef(null)
	let playerTwoRef = useRef(null)

	const [winner, setWinner] = useState({})
	const [draw, setDraw] = useState(false)

	const isHost = User.userId === HostId
	const isPlayer = lobby.players.some(p => p.userId === User.userId)
	const matchFinished = playerOne.finished && playerTwo.finished

	useEffect(() => {
		let localPlayer = lobby.players.find(p => p.userId === User.userId)
		let foreignPlayer = lobby.players.find(p => p.userId !== User.userId)
		setPlayerOne(isPlayer ? localPlayer : lobby.players[0])
		setPlayerTwo(isPlayer ? foreignPlayer : lobby.players[1])
	}, [lobby])

	useEffect(() => {
		matchFinished && determineWinner()
	}, [matchFinished])

	useEffect(() => {
		if (!lobby.inSession) {
			let wordSet = []
			if (isHost) wordSet = randomWords({ exactly: lobby.options.exactly, maxLength: lobby.options.maxLength })
			socket.emit('lobby-development', { wordSet })
			socket.on('lobby-words', (wordSet) => setWordSet(wordSet))
			socket.on('lobby-countdown', (count) => setCount(count))
			socket.on('lobby-reset', (count) => setResetCount(count))
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

	useEffect(() => {
		if (wordSet.length > 0) currentIndex === wordSet.length && calculate()
	}, [currentIndex])

	function inputChange(e) {
		if (currentIndex !== wordSet.length) {
			setWordInput(e.target.value.replace(/[^a-z]/ig, '').toLowerCase())
		}
	}

	function incrementIndex() {
		setCurrentIndex(currentIndex + 1)
		socket.emit('player-current-index', { currentIndex: currentIndex + 1 })
		setWordInput('')
	}

	function setCurrentClass(evaluation) {
		setwordClasses([...wordClasses, evaluation])
		socket.emit('player-word-classes', { wordClasses: [...wordClasses, evaluation] })
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
		socket.emit('player-stats', {
			wpm: Math.floor(words / minute),
			acc: Math.floor((correctKeys / totalChars) * 100)
		})
	}

	function determineWinner() {
		if (!lobby.inSession) return
		let playerOneScore = playerOne.wpm + playerOne.accuracy + (playerOne.accuracy / 100)
		let playerTwoScore = playerTwo.wpm + playerTwo.accuracy + (playerTwo.accuracy / 100)
		let playerWinner = playerOneScore > playerTwoScore ? playerOne : playerTwo
		setWinner(playerWinner)
		playerOneScore === playerTwoScore && setDraw(true)
		socket.emit('match-finish', { playerWinner })
	}

	function p1WordClass(i) {
		return i === playerOne.currentIndex
			? 'current'
			: playerOne.wordClasses[i]
	}

	function p2WordClass(i) {
		return i === playerTwo.currentIndex
			? 'current'
			: playerTwo.wordClasses[i]
	}

	return (
		<div className="editors-main">
			<div className="controls">
				{(matchFinished && resetCount !== null) && <p className="status">Reset in {resetCount}</p>}
				{isPlayer
					? <Button
						className="forfeit-button"
						text="Forfeit"
						onClick={() => socket.emit('player-forfeit')}
						disabled={!lobby.inSession || playerOne.forfeited} />
					: <div className="controls-placeholder" />
				}
			</div>
			<div className="editors">
				{/* LOCAL CLIENT */}
				<div className="editor-cont"
					ref={playerOneRef}
					style={playerOne.forfeited ? { minHeight: playerOneRef.current.clientHeight + 4 } : {}}>
					{playerOne.forfeited
						? <p className="player-forfeited"><span>{isPlayer ? 'You' : playerOne.name}</span> forfeited</p>
						: <>
							<div className="head">
								<div className="name">
									<p>{playerOne.name}</p>
								</div>
								<div className="winner">
									{draw
										? <p>Draw!</p>
										: matchFinished && winner.name === playerOne.name && <p>Winner!</p>}
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
								{lobby.playersReady && playerOne.currentIndex !== wordSet.length
									? isPlayer && <div className="input-area">
										<Input
											autoFocus
											onChange={(e) => lobby.inSession && inputChange(e)}
											onKeyDown={(e) => checkWord(e)}
											value={wordInput} />
									</div>
									: lobby.inSession &&
									<div className="stats-cont">
										<div className="stats">
											<p><span>{playerOne.wpm}</span> Words / Minute</p>
											<p><span>{playerOne.accuracy}%</span> Accuracy</p>
										</div>
									</div>
								}
							</div>
						</>
					}
				</div>
				<br />
				{/* FOREIGN CLIENT */}
				<div className="editor-cont"
					ref={playerTwoRef}
					style={playerTwo.forfeited ? { minHeight: playerTwoRef.current.clientHeight + 4 } : {}}>
					{playerTwo.forfeited
						? <p className="player-forfeited"><span>{playerTwo.name}</span> forfeited</p>
						: <>
							<div className="head">
								<div className="name">
									<p>{playerTwo.name}</p>
								</div>
								<div className="winner">
									{draw
										? <p>Draw!</p>
										: matchFinished && winner.name === playerTwo.name && <p>Winner!</p>}
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
								{playerOne.currentIndex === wordSet.length &&
									(wordSet.length > 0 && playerTwo.currentIndex === wordSet.length) &&
									<div className="stats-cont">
										<div className="stats">
											<p><span>{playerTwo.wpm}</span> Words/ Minute</p>
											<p><span>{playerTwo.accuracy}%</span> Accuracy</p>
										</div>
									</div>
								}
							</div>
						</>
					}
				</div>
			</div>
		</div >
	);
}

export default LobbyEditors