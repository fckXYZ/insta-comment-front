import {Route, Routes} from 'react-router';
import {BrowserRouter} from "react-router-dom";
import {connect} from "react-redux";

import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./containers/Home";
import Feed from "./containers/Feed";
import Posting from "./containers/posting";
import Header from "./components/Header";
import {useEffect, useState} from "react";
import Login from "./containers/login";
import {FEED_PATH, LOGIN_PATH, POSTING_PATH} from "./common/routerConstants";
import {loginUser} from "./helpers/backend_helper";
import {loginSuccess} from "./store/user/actions";
import Loader from "./containers/Loader";
import PrivateRoute from "./components/PrivateRoute";


function App(props) {

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const username = localStorage.getItem("username")
		if (username) {
			const password = ''
			setLoading(true);
			loginUser({username, password})
				.then((data) => {
					toast.success(data.message);
					props.loginSuccess(username, password)
					setLoading(false)
				})
				.catch((error) => {
					localStorage.removeItem('username');
					toast.warn('Need to log in!');
					setLoading(false)
				})

		}
	}, [])

	return (
		<div className="App">
			{
				loading
					? <Loader/>
					: <>
						<Header/>
						<BrowserRouter>
							<Routes>
								<Route
									path={FEED_PATH}
									element={
										<PrivateRoute>
											<Feed />
										</PrivateRoute>
									}
								/>
								<Route
									path={POSTING_PATH}
									element={
										<PrivateRoute>
											<Posting />
										</PrivateRoute>
									}
								/>
								<Route path={LOGIN_PATH} element={<Login />}/>
								<Route path="/" element={<Home />}/>
							</Routes>
						</BrowserRouter>
					</>
			}
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		</div>
	);
}

const mapDispatchToProps = (dispatch) => ({
	loginSuccess: (username, password) => dispatch(loginSuccess({username, password})),
})

export default connect(
	null,
	mapDispatchToProps
)(App);
