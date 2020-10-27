/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import { Card, Button, Input } from 'godspeed'

const Join = () => {
	const history = useHistory()

	const [form, setForm] = useState({
		name: 'kyle',
		room: 'one'
	})

	return (
		<>
			<Card>
				<h1>Welcome to Code Efficiency</h1>
				<br />
				<center>
					<Input
						placeholder="Name"
						value={form.name}
						onChange={e => setForm({ ...form, name: e.target.value })}
						underlined />
					<Input
						placeholder="Room"
						value={form.room}
						onChange={e => setForm({ ...form, room: e.target.value })}
						underlined />
				</center>
				<br />
				<center>
					<Button text="Join!" onClick={() => {
						if (!form.name || !form.room) return
						history.push(`/room/name=${form.name}&room=${form.room}`)
					}} />
				</center>
			</Card>
		</>
	)
}

export default Join
