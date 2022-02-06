import React, {useEffect, useState} from "react";
import {Dropdown, DropdownToggle, DropdownItem, DropdownMenu} from "reactstrap";

const UserMenu = (props) => {
	const userLogged = localStorage.getItem('username')
	const [username, setUsername] = useState('');
	const [menuOpened, setMenuOpened] = useState(false);

	useEffect(() => {
		if (userLogged) {
			setUsername(userLogged)
		}
	}, [userLogged])

	const toggleMenu = () => {
		setMenuOpened(!menuOpened)
	}

	const onLogout = () => {
		localStorage.removeItem('username');
		localStorage.removeItem('password');
		window.location.replace('/')
	}

	return (
		<div className="user-menu">
			<Dropdown isOpen={menuOpened} toggle={toggleMenu}>
				<DropdownToggle caret>
					{username}
				</DropdownToggle>
				<DropdownMenu>
					<DropdownItem
						onClick={onLogout}
					>Logout</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</div>
	)
}

export default UserMenu;
