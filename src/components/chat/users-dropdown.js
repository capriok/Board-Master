import React from 'react'

import '../../styles/chat/users-dropdown.scss'

const UsersDropdown = (props) => {

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

export default UsersDropdown
