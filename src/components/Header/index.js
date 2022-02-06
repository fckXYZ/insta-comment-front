import React, {useState} from "react";
import UserMenu from "./UserMenu";
import {connect} from "react-redux";

const Header = (props) => {
	const { username } = props;

	return (
		<div className="header">
			{
				username
					? <UserMenu
						username={username}
					/>
					: <span>Not logged in</span>
			}
		</div>
	)
}

const mapStateToProps = ({ user }) => ({
	username: user.username
})

export default connect(
	mapStateToProps
)(Header);
