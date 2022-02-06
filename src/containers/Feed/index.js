import React, {useEffect, useState} from "react";
import {getFeed} from "../../helpers/backend_helper";
import Post from "../../components/post";
import {useNavigate} from "react-router";
import {toast} from "react-toastify";
import {Col, Row} from "reactstrap";
import {connect} from 'react-redux';
import LoadingSpinner from "../../components/Spinner";

const Feed = (props) => {

	const {storeUsername} = props;
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false);
	const [feed, setFeed] = useState([]);

	useEffect(() => {
		if (storeUsername) {
			onGetFeed(storeUsername)
		}
	}, []);

	const onGetFeed = (username) => {
		setLoading(true)
		getFeed(username)
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

	const renderFeed = () => {

		if (!feed.length) {
			return null
		}

		return (
			<Col className="col-6 p-4 d-flex flex-column align-items-center m-auto">
				<ul className="feed-list">
					{feed.map((postData) => (
						<Post
							url={postData.url}
							index={postData.index + 1}
							id={postData.id}
							onClickPost={() => onStartPosting(postData)}
						/>
					))}
				</ul>
			</Col>
		)
	}

	return (
		<div className="feed-page">
			{loading ? <LoadingSpinner /> : renderFeed()}
		</div>
	)
}

const mapStateToProps = ({ user }) => ({
	storeUsername: user.username,
});

export default connect(
	mapStateToProps,
)(Feed);
