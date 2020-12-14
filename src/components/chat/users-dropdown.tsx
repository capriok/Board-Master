import React from 'react'

import 'styles/chat/users-dropdown.scss'

interface Props {
	socket: Socket
	HostId: string
	users: User[]
	User: User
	usersDropdown: Boolean
}

const UsersDropdown: React.FC<Props> = ({
	socket,
	HostId,
	users,
	User,
	usersDropdown
}) => {

	function kickUser(i: number): void {
		socket.emit('kick-user', users[i])
	}

	return (
		<>
			{usersDropdown &&
				<div className="users">
					{users.map((u, i) => {
						const isHost = User.userId === HostId
						const notLocal = u.userId !== User.userId
						return (
							<div className="user">
								<p key={i}>{u.name}</p>
								{isHost && notLocal &&
									<span onClick={() => kickUser(i)}>Kick</span>
								}
							</div>
						)
					})}
				</div>
			}
		</>
	)
}
export default UsersDropdown
