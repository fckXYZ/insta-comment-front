import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {useForm} from "react-hook-form";
import {Button, Form, FormGroup, Label, Row} from "reactstrap";
import {loginUser, submitTwoFA} from "../../helpers/backend_helper";
import {toast} from "react-toastify";
import {loginSuccess} from "../../store/user/actions";
import ModalTwoFA from "../../components/ModalTwoFA";
import {useNavigate} from "react-router";
import {FEED_PATH} from "../../common/routerConstants";

const Login = (props) => {
	const {loginSuccess} = props;

	const navigate = useNavigate()

	const [loading, setLoading] = useState(false);
	const [modalTwoFaShown, setModalTwoFaShown] = useState(false);
	const [twoFaProps, setTwoFaProps] = useState({
		username: '',
		authIdentifier: '',
		isSMS: true,
	});

	useEffect(() => {
		if (localStorage.getItem('username')) {
			navigate(FEED_PATH);
		}
	}, [])

	const {register, handleSubmit} = useForm();

	const toggleModal = () => {
		setModalTwoFaShown(!modalTwoFaShown)
	}

	const onSubmit = (data) => {
		const {username, password} = data;
		onLogin(username, password)
	}

	const onLogin = (username, password) => {
		setLoading(true)

		loginUser({username, password})
			.then((data) => {
				toast.success(data.message);

				localStorage.setItem("username", username);

				loginSuccess({
					username, password,
				})

				setLoading(false);
				navigate(FEED_PATH)
			})
			.catch((error) => {
				if (error.status === 403) {
					toast.warn(error.body.message);
					setTwoFaProps({
						username,
						authIdentifier: error.body.two_factor_identifier,
						isSMS: !error.body.totp_two_factor_on,
					})
					setModalTwoFaShown(true);
					setLoading(false)
					return
				}
				toast.error(error.body.message)
				setLoading(false)
			})
	}

	const onSubmitTwoFa = (code) => {
		const objForSubmit = {
			...twoFaProps,
			code,
		}
		setLoading(true)
		submitTwoFA(objForSubmit)
			.then((data) => {
				toast.success(data.message);
				setModalTwoFaShown(false);
				setLoading(false);
				loginSuccess({
					username: objForSubmit.username,
					password: '123'
				})
			})
			.catch((error) => {
				toast.error(error.body.message);
				setLoading(false)
			})
	}

	return (
		<div className="login-page">
			<Row className="m-3">
				<Form
					className="col-6 m-auto d-flex flex-column align-items-center"
					onSubmit={handleSubmit(onSubmit)}
				>
					<FormGroup className="m-3 d-flex flex-column align-items-start">
						<Label
							for="loginInput"
							className="text-lg-start"
						>
							Login
						</Label>
						<input
							type="text"
							{...register("username")}
							id="loginInput"
							placeholder="Enter Your Instagram Login"
						/>
					</FormGroup>
					<FormGroup className="m-3 d-flex flex-column align-items-start">
						<Label
							for="passwordInput"
							className="text-lg-start"
						>
							Password
						</Label>
						<input
							type="password"
							{...register("password")}
							id="passwordInput"
							placeholder="Enter Your Instagram Password"
						/>
					</FormGroup>
					<Button type="submit" className="m-3 btn-lg btn btn-warning" disabled={loading}>
						{
							loading ?
								"Loading..."
								:
								"Logg In"
						}
					</Button>
				</Form>
			</Row>
			<ModalTwoFA
				isOpened={modalTwoFaShown}
				toggle={toggleModal}
				sendCode={onSubmitTwoFa}
				disabled={loading}
			/>

		</div>
	)
}

const mapDispatchToProps = (dispatch) => ({
	loginSuccess: (username, password) => dispatch(loginSuccess({ username, password })),
})

export default connect(
	null,
	mapDispatchToProps
)(Login);
