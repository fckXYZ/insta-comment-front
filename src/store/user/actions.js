import {LOGIN_SUCCESS, LOGOUT} from "./actionTypes";

// export const loginSuccess = (data) => ({
// 	type: LOGIN_SUCCESS,
// 	payload: data,
// })
export const loginSuccess = (data) => {
	console.log(data)
	return {
		type: LOGIN_SUCCESS,
		payload: data,
	}

}

export const logout = () => ({
	type: LOGOUT,
})
