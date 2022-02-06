import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router";
import {connect} from "react-redux";
import {Button, Col, Form, FormGroup, Label, Row, Spinner} from "reactstrap";
import {postHashtags} from "../../helpers/backend_helper";
import {post} from "../../helpers/api_helper";
import {toast} from "react-toastify";
import {getDelay, sleep} from "../../common/delayHelper";

import MD5 from "crypto-js/md5";

const Posting = (props) => {
	const {username} = props;

	const location = useLocation();
	const navigate = useNavigate();
	const {postUrl, postId} = location.state;

	const [loading, setLoading] = useState(false);
	const [commentText, setCommentText] = useState('😍');
	const [hashtags, setHashtags] = useState('');

	const [calculatedPosts, setCalculatedPosts] = useState([]);
	const [commentsToDo, setCommentsToDo] = useState(0);
	const [successComments, setSuccessComments] = useState(0);

	const [postedSuccess, setPostedSuccess] = useState(false);
	const [postedError, setPostedError] = useState(false);

	const [md5, setMd5] = useState('');

	const onPost = async () => {
		if (!calculatedPosts.length) {
			toast.error("No input data!");
			return;
		}
		for await (let post of calculatedPosts) {
			const requestBody = {
				username,
				commentText: post.commentText,
				hashtags: post.hashtags
			};

			console.log(requestBody)

			let needToBreak = false
			setLoading(true)
			let numberOfComment = calculatedPosts.indexOf(post) + 1
			await postHashtags(postId, requestBody)
				.then(async (data) => {
					await sleep(numberOfComment);
					setSuccessComments(numberOfComment);
					console.log(`Posted ${numberOfComment}!`)
					if (calculatedPosts.indexOf(post) + 1 === commentsToDo) {
						setLoading(false);
						setHashtags('');
						setPostedSuccess(true)
					}
				})
				.catch(async (e) => {
					toast.error(e)
					setHashtags('');
					const uncompletedPosts = numberOfComment === 1 ? calculatedPosts : calculatedPosts.splice(numberOfComment - 1);
					let uncompletedHashtags = []
					for await (let post of uncompletedPosts) {
						uncompletedHashtags.push(post.hashtags)
					}
					setHashtags(uncompletedHashtags.join(''))
					setPostedError(true);
					setSuccessComments(0)
					setLoading(false);
					needToBreak = true
				})
			console.log('done')
			if (needToBreak) {
				break
			}
		}
	}

	const onCalculate = (e) => {
		e.preventDefault();
		let commentsArr = [];

		const hashtagRE = /(#[^\s\#,._-]+)/gi;

		const username = localStorage.getItem('username');

		const stringForMd5 = `${username}${Date.now()}`;
		const md5 = '#' + MD5(stringForMd5).toString();
		setMd5(md5.substr(1));

		// const matchedHashtags = hashtags.match(hashtagRE)

		console.log(hashtags.match(hashtagRE))

		// substr to rm first # sign
		let hashtagsArray = hashtags.match(hashtagRE);

		hashtagsArray.unshift(md5);
		console.log(hashtagsArray)

		while (hashtagsArray.length > 0) {
			let hashtagsForReply = hashtagsArray.splice(0, 40).join('');
			// if length of hashtags string 1000 or more, need to make it less for insta limits
			if (hashtagsForReply.length > 999) {
				while (hashtagsForReply.length > 999) {
					let tooLongHashtagsArray = hashtagsForReply.substr(1).split('#');
					hashtagsArray.unshift(tooLongHashtagsArray.pop());
					hashtagsForReply = tooLongHashtagsArray.join('');
				}
			}
			commentsArr.push({
				commentText: commentText,
				hashtags: hashtagsForReply
			})
		}
		setPostedError(false);
		setPostedSuccess(false);
		setCalculatedPosts(commentsArr);
		setCommentsToDo(commentsArr.length)
	}

	const onLogout = () => {
		localStorage.removeItem('username');
		localStorage.removeItem('password');
		navigate('/')
	}

	const renderResultBlock = () => {
		if (postedError) {
			return (
				<>
					<h3>Something went wrong!</h3>
					<p>Looks like we just hit instagram limits</p>
					<p>You can see undone hashtags in hashtags field above</p>
					<p>You can try again in couple minutes. If this error will be appearing too often, come again tomorrow!</p>
					<Row className="d-flex">
						<Button
							className="btn"
							color="warning"
							onClick={() => navigate(('/'))}
						>
							Go to posts feed!
						</Button>
						<Button
							className="btn btn-info"
							onClick={() => {
								setPostedError(false)
								setPostedSuccess(false);
								setCalculatedPosts([]);
								setSuccessComments(0)
							}}
						>
							Go again!
						</Button>
						<Button
							className="btn btn-danger"
							onClick={() => onLogout()}
						>
							Logout
						</Button>
					</Row>
				</>
			)
		}
		if (postedSuccess) {
			return (
				<>
					<h3>Success!</h3>
					<p>Posting finished!</p>
					<p>Now you can find your post by all those hashtags</p>
					<Row className="d-flex">
						<Button
							className="btn"
							color="warning"
							onClick={() => navigate(('/'))}
						>
							Go to posts feed!
						</Button>
						<Button
							className="btn btn-info"
							onClick={() => {
								setPostedSuccess(false);
								setCalculatedPosts([]);
								setSuccessComments(0)
							}}
						>
							Go again!
						</Button>
					</Row>
				</>
			)
		}
	}

	return (
		<Row>
			<Col className="col-6">
				<Row>
					<h2>Post</h2>
					<a href={postUrl}>
						{postUrl}
					</a>
				</Row>
				<Row>
					<Button style={{margin: '10px auto'}} className="btn w-25" color="danger"
					        onClick={() => navigate(-1)}>
						Back
					</Button>
				</Row>
				<Form className="d-flex flex-column align-items-center"
				      onSubmit={(e) => onCalculate(e)}
				>
					<FormGroup
						className="d-flex flex-column align-items-start w-75 mb-3"
					>
						<Label for="topComment">
							Top Level Comment Text
						</Label>
						<input
							className="w-100"
							type="text"
							id="topComment"
							value={commentText}
							onChange={(e) => setCommentText(e.target.value)}
						/>
					</FormGroup>
					<FormGroup
						className="d-flex flex-column align-items-start w-75 mb-3"
					>
						<Label for="hashtags">
							Hashtags
						</Label>
						<textarea
							style={{
								minHeight: '300px'
							}}
							className="w-100"
							id="hashtags"
							value={hashtags}
							onChange={(e) => setHashtags(e.target.value)}
						/>
					</FormGroup>
					{
						!postedSuccess && !postedError ?
							<Button
								className="btn m-5"
								color="primary"
								type="submit"
								disabled={loading || !hashtags.length}
							>
								{loading ? "Posting..." : "Calculate!"}
							</Button>
							:
							renderResultBlock()
					}
				</Form>
			</Col>
			{
				calculatedPosts.length && !postedSuccess && !postedError ?
					<Col className="col-6">
						{
							loading ? <Spinner className="mt-5"/> : null
						}
						<Row className="p-3 mt-5 d-flex flex-column align-items-center">
							<p>
								We will make {commentsToDo} comments with replies with about 30 hashtags in each reply
							</p>
							<p>
								After clicking Post button, do not close or refresh this page until the process will be
								finished.
							</p>
							<p>
								<p className="mb-3">
									Hash to check:
									<b>
										{md5}
									</b>
								</p>
						<span className="fw-bold">
							Progress:
						</span>
								{successComments} of {commentsToDo}
							</p>
							<Button
								className="btn w-auto"
								color="primary"
								disabled={loading || postedSuccess}
								onClick={onPost}
							>
								{loading ? "Posting..." : "Post!"}
							</Button>
						</Row>
					</Col>
					:
					null
			}
		</Row>
	)
}

const mapStateToProps = ({user}) => ({
	username: user.username,
})

export default connect(
	mapStateToProps
)(Posting);
