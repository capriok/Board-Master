/*eslint react-hooks/exhaustive-deps: "off"*/
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import '../../styles/common/home.scss'

import speed from '../../assets/speed.png'
import versus from '../../assets/versus.png'
import chat from '../../assets/chat.png'

import { Button, Input } from 'godspeed'

const Home = () => {
	const [rooms, setRooms] = useState([])
	const [form, setForm] = useState({
		name: '',
		nameErr: false,
		nameUsed: false,
		room: '',
		roomErr: false
	})
	const history = useHistory()

	const cap = s => s[0].toUpperCase() + s.slice(1)

	async function joinRoom(e) {
		e.preventDefault()
		if (!form.name || !form.room) {
			return setForm({
				...form,
				nameErr: !form.name ? true : false,
				roomErr: !form.room ? true : false
			})
		}

		let url = new URL(process.env.REACT_APP_ENDPOINT + '/io/get-users:')
		url.search = new URLSearchParams({ name: cap(form.name), room: cap(form.room) })
		let res = await fetch(url)
		let userExists = await res.json()

		if (userExists) {
			setForm({ ...form, nameUsed: true })
		} else {
			history.push(`/room/name=${cap(form.name)}&room=${cap(form.room)}`)
		}

	}

	useEffect(() => {
		(async () => {
			let res = await fetch(process.env.REACT_APP_ENDPOINT + '/io/get-rooms')
			let data = await res.json()
			setRooms(data)
		})()
	}, [])

	return (
		<>
			<div className="home-main">
				<nav>
					<p className="nav-title">
						<span className="board">Board</span> <span className="master">Master</span>
					</p>
				</nav>
				<main>
					<div className="info">
						<div className="card-cont">
							<div className="card">
								<img src={speed} alt="" />
								<p>Train to become faster and more accurate.</p>
							</div>
							<div className="card">
								<img src={versus} alt="" />
								<p>Challenge opponents in head to head matches.</p>
							</div>
							<div className="card">
								<img src={chat} alt="" />
								<p>Chat while you watch others compete.</p>
							</div>
						</div>
					</div>
					<div className="join">
						<div className="join-cont">
							<h1 className="join-title">Join a room</h1>
							<form id="join-form" className="inputs" onSubmit={e => joinRoom(e)}>
								<p>Name:{form.nameUsed && <span>Already in use</span>}</p>
								<Input
									value={form.name}
									style={form.nameErr ? { borderColor: 'red' } : {}}
									onChange={e => setForm({ ...form, name: e.target.value, nameErr: false, nameUsed: false })} />
								<p>Room:</p>
								<Input
									value={form.room}
									style={form.roomErr ? { borderColor: 'red' } : {}}
									onChange={e => setForm({ ...form, room: e.target.value, roomErr: false })} />
							</form>
							<p>Available Rooms:</p>
							<div className="rooms">
								{rooms.map((room, i) => (
									<div
										key={i}
										className="room"
										onClick={() => setForm({ ...form, room: room.name, roomErr: false })}>
										{room.name}
									</div>
								))}
							</div>
							<div className="actions">
								<Button form="join-form" type="submit" text="Join Room" />
							</div>
						</div>
					</div>
				</main>
				<footer>
					<p>© 2020 BoardMaster | All rights reserved.</p>
				</footer>
			</div>
		</>
	)
}

export default Home
