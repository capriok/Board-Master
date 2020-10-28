/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import '../styles/join.scss'

import { Button, Input } from 'godspeed'

const Join = () => {
	const [rooms, setRooms] = useState([])
	const [form, setForm] = useState({
		name: '',
		room: 'one'
	})

	useEffect(() => {
		(async () => {
			let res = await fetch(process.env.REACT_APP_ENDPOINT + '/io/get-rooms')
			let data = await res.json()
			setRooms(data)
		})()
	}, [])

	const history = useHistory()

	return (
		<>
			<div className="join-main">
				<h1>Welcome to NoEmmet</h1>
				<form id="join-form" className="input-area" onSubmit={e => {
					e.preventDefault()
					if (!form.name || !form.room) return
					history.push(`/room/name=${form.name}&room=${form.room}`)
				}}>
					<Input
						placeholder="Name"
						value={form.name}
						onChange={e => setForm({ ...form, name: e.target.value })} />
					<Input
						placeholder="Room"
						value={form.room}
						onChange={e => setForm({ ...form, room: e.target.value })} />
				</form>
				<br />
				<div className="button-area">
					{rooms.length > 0 &&
						<span>Available Rooms: <select
							value={form.room}
							onChange={e => setForm({ ...form, room: e.target.value })}>
							<option value="" disabled hidden>{rooms.length}</option>
							{rooms.map((room, i) => (
								<option key={i} value={room.name}>{room.name}</option>
							))}
						</select>
						</span>
					}
					<Button form="join-form" type="submit" text="Join Room" />
				</div>
			</div>
		</>
	)
}

export default Join
