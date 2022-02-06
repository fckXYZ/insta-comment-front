import React, {useEffect, useState} from "react";
import {getFeed, loginUser, submitTwoFA} from "../../helpers/backend_helper";
import Post from "../../components/post";
import InstaLogin from "../../components/instaLogin";
import {useNavigate} from "react-router";
import {toast} from "react-toastify";
import {Button} from "reactstrap";
import {loginSuccess, logout} from "../../store/user/actions";
import {connect} from 'react-redux';
import ModalTwoFA from "../../components/ModalTwoFA";

const Profile = (props) => {

	const {storeUsername} = props;
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false);
	const [feed, setFeed] = useState([]);
	const [modalTwoFaShown, setModalTwoFaShown] = useState(false);
	const [twoFaProps, setTwoFaProps] = useState({
		username: '',
		authIdentifier: '',
		isSMS: true,
	})

	const toggleModal = () => {
		setModalTwoFaShown(!modalTwoFaShown)
	}

	useEffect(() => {
		if (storeUsername) {
			onGetFeed(storeUsername)
		}
	}, [storeUsername]);

	const onLogin = (data) => {
		const { login, password } = data;
		setLoading(true)
		loginUser({ username: login, password })
			.then((data) => {
				toast.success(data.message);
				loginSuccess({
					username: login, password,
				})
				onGetFeed(login)
				setLoading(false)
			})
			.catch((error) => {
				if (error.status === 403) {
					toast.warn(error.body.message);
					setTwoFaProps({
						username: login,
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
				onGetFeed(objForSubmit.username);
			})
			.catch((error) => {
				toast.error(error.body.message);
				setLoading(false)
			})
	}

	const onGetFeed = (login) => {
		setLoading(true)
		getFeed(login)
			.then((data) => {
				let postsForFeed = [];
				data.map((postData) => {
					postsForFeed.push({
						url: `https://instagram.com/p/${postData.code}`,
						id: postData.id,
						index: data.indexOf(postData)
					})
				})
				setFeed(postsForFeed);
				setLoading(false)
			})
			.catch((e) => {
				toast.error(e)
				setLoading(false)
			})
	}

	const onStartPosting = (post) => {
		navigate(`/posting/${post.id}`,
			{
				state: {
				postUrl: post.url,
					postId: post.id,
			}})
	}

	const onLogout = () => {
		setFeed([]);
		props.logout()
	}

	const renderFeed = () => {
		if (!feed.length) {
			return null
		}

		return (
			<>
				<Button color="danger" style={{ margin: '10px', width: '150px' }} onClick={() => onLogout()}>
					End Session
				</Button>
				<ul>
					{feed.map((postData) => (
						<Post
							url={postData.url}
							index={postData.index + 1}
							id={postData.id}
							onClickPost={() => onStartPosting(postData)}
						/>
					))}
				</ul>
			</>
		)
	}

	return (
		<div className="row">
			{
				feed.length ?
					renderFeed()
					:
					<InstaLogin
						onLogin={(d) => onLogin(d)}
						formDisabled={loading}
					/>

			}
			<ModalTwoFA
				isOpened={modalTwoFaShown}
				toggle={toggleModal}
				sendCode={onSubmitTwoFa}
				disabled={loading}
			/>
		</div>
	)
}

const mapStateToProps = ({ user }) => ({
	username: user.username,
	password: user.password,
});

const mapDispatchToProps = (dispatch) => ({
	saveUserState: (username, password) => dispatch(loginSuccess({username, password})),
	logout: () => dispatch(logout()),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Profile);
