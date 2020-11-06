import React from 'react'

import '../styles/chat-users.scss'

const Users = (props) => {

	return (
		<>
			{props.usersOpen &&
				<div className="users">
					{props.users.map((u, i) => (
						<p key={i}>{u.name}</p>
					))}
				</div>
			}
		</>
	)
}

export default Users
