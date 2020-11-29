import React from 'react'

import 'styles/chat/users-dropdown.scss'

interface Props {
	users: User[]
	User: User
	usersDropdown: Boolean
}

const UsersDropdown: React.FC<Props> = ({
	users,
	User,
	usersDropdown
}) => (
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

export default UsersDropdown
