/*eslint no-self-assign: "off"*/
import React from 'react'

import '../../styles/lobby/lobby-options.scss'

import { Input } from 'godspeed'

const PracticeOptions = ({ practiceOptions, setPracticeOptions }) => {

	function inputChange(prop, val, min, max) {
		val === '' || val < min ? val = min : val > max ? val = max : val = val
		setPracticeOptions({ ...practiceOptions, [prop]: parseInt(val) })
	}

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
						value={practiceOptions.exactly}
						onChange={(e) => inputChange('exactly', e.target.value, 10, 100)} />
				</label>
				<label>
					<p>Max word length</p>
					<Input
						className="word-length-input"
						type="number"
						min={3}
						max={10}
						value={practiceOptions.maxLength}
						onChange={(e) => inputChange('maxLength', e.target.value, 3, 10)} />
				</label>
			</div>
		</div>
	)
}

export default PracticeOptions
