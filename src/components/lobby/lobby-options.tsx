/*eslint no-self-assign: "off"*/
import React, { useState, useEffect } from 'react'

import 'styles/lobby/lobby-options.scss'

import { Input } from 'godspeed'

interface Props {
	socket: Socket
	lobby: Lobby
}

const LobbyOptions: React.FC<Props> = ({
	socket,
	lobby
}) => {

	const [options, setOptions] = useState<LobbyOptions>({})

	const informalPlayersReady = lobby.players.length === 2 && lobby.players.every(p => p.ready === true)

	function inputChange(prop: string, val: any, min: number, max: number): void {
		val === '' || val < min ? val = min : val > max ? val = max : val = val
		socket.emit('lobby-options', { ...options, [prop]: parseInt(val) })
	}

	useEffect(() => {
		setOptions({ exactly: lobby.options.exactly, maxLength: lobby.options.maxLength })
	}, [lobby])

	return (
		<div className="options-main">
			<h1>Options</h1>
			<div className="option-labels">
				<label>
					<p>Number of words</p>
					<Input
						className="word-count-input"
						type="number"
						min={10}
						max={100}
						step={5}
						value={options.exactly}
						onChange={(e) => inputChange('exactly', e.target.value, 10, 100)}
						disabled={informalPlayersReady} />
				</label>
				<label>
					<p>Max word length</p>
					<Input
						className="word-length-input"
						type="number"
						min={3}
						max={10}
						value={options.maxLength}
						onChange={(e) => inputChange('maxLength', e.target.value, 3, 10)}
						disabled={informalPlayersReady} />
				</label>
			</div>
		</div>
	)
}

export default LobbyOptions
