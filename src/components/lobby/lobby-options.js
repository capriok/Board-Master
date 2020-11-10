/*eslint no-self-assign: "off"*/
import React, { useState, useEffect } from 'react'

import '../../styles/lobby/lobby-options.scss'

import { Input } from 'godspeed'

const LobbyOptions = (props) => {
	const { socket, lobby } = props

	const [options, setOptions] = useState({})

	function inputChange(prop, val, min, max) {
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
						max={200}
						step={5}
						value={options.exactly}
						onChange={(e) => inputChange('exactly', e.target.value, 10, 200)} />
				</label>
				<label>
					<p>Max word length</p>
					<Input
						className="word-length-input"
						type="number"
						min={3}
						max={10}
						value={options.maxLength}
						onChange={(e) => inputChange('maxLength', e.target.value, 3, 10)} />
				</label>
			</div>
		</div>
	)
}

export default LobbyOptions
