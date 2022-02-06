import {LOGIN_SUCCESS, LOGOUT} from "./actionTypes";

const INIT_STATE = {
	username: '',
	password: ''
}

const user = (state = INIT_STATE, action) => {
	const { payload } = action;
	switch (action.type) {
		case LOGIN_SUCCESS:
			console.log(payload)
			return {
				...state,
				username: payload.username,
				password: payload.password,
			}

		case LOGOUT:
			return INIT_STATE

		default:
			return state
	}
};

export default user;
