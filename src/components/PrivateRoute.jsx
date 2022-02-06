import React from "react";
import {connect} from "react-redux";
import {LOGIN_PATH} from "../common/routerConstants";
import {Navigate, Route, useLocation} from "react-router";

const PrivateRoute = ({username, children}) => {
	const location = useLocation();

	return username
		? children
		: <Navigate
			to="/"
			replace
			state={{path: location.pathname}}
		/>;
}

const mapStateToProps = ({user}) => ({
	username: user.username,
})

export default connect(
	mapStateToProps,
)(PrivateRoute);
