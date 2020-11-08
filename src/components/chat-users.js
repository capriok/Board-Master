import React from 'react'

import '../styles/chat-users.scss'

const Users = (props) => {

	const { users, User, usersDropdown } = props

	return (
		<>
			{usersDropdown &&
				<div className="users">
					{users.map((u, i) => (
						<p key={i}>{u.name}{u.userId === User.userId && " (You)"}</p>
					))}
				</div>
			}
		</>
	)
}

export default Users
