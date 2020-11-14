/*eslint react-hooks/exhaustive-deps: "off"*/
/*eslint no-unused-vars: "off"*/
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
		room: ''
	})
	const history = useHistory()

	function joinRoom(e) {
		e.preventDefault()
		if (!form.name || !form.room) return
		history.push(`/room/name=${form.name}&room=${form.room.capitalize()}`)
	}

	useEffect(() => {
		(async () => {
			let res = await fetch(process.env.REACT_APP_ENDPOINT + '/io/get-rooms')
			let data = await res.json()
			console.log(data);
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
						<h1 className="info-title">Are you a Board Master?</h1>
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
								<span>Name:</span>
								<Input
									value={form.name}
									onChange={e => setForm({ ...form, name: e.target.value })} />
								<span>Room:</span>
								<Input
									value={form.room}
									onChange={e => setForm({ ...form, room: e.target.value })} />
							</form>
							<div className="rooms-cont">
								{rooms.map((room, i) => (
									<div
										key={i}
										className="room"
										onClick={() => setForm({ ...form, room: room.name })}>
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
			</div>



















			{/* <div className="join-main">
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
			</div> */}
		</>
	)
}

export default Home
