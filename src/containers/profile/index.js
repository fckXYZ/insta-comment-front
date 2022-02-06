import React, {useEffect, useState} from "react";
import {getFeed} from "../../helpers/backend_helper";
import Post from "../../components/post";
import {useNavigate} from "react-router";
import {toast} from "react-toastify";
import {Button} from "reactstrap";
import {loginSuccess, logout} from "../../store/user/actions";
import {connect} from 'react-redux';

const Profile = (props) => {

	const {storeUsername} = props;
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false);
	const [feed, setFeed] = useState([]);

	useEffect(() => {
		// if (storeUsername) {
		// 	onGetFeed(storeUsername)
		// }
	}, [storeUsername]);

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
			{renderFeed()}
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
