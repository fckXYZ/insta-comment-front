import React from "react";
import {Button, Col, Row} from "reactstrap";
import {useNavigate} from "react-router";
import {FEED_PATH, LOGIN_PATH} from "../../common/routerConstants";
import {connect} from "react-redux";

const Home = (props) => {
	const {username} = props;
	const navigate = useNavigate();

	const onLoginClick = () => {
		navigate(LOGIN_PATH)
	}

	const onClickFeed = () => {
		navigate(FEED_PATH)
	}

	return (
		<div className="home-page">
			<h1>Home page</h1>
			<Row className="p-5">
				<Col className="col-6 m-auto">
					{
						username ?
							<Button color="info" onClick={onClickFeed}>
								Go To Feed
							</Button>
							:
							<Button color="info" onClick={onLoginClick}>
								Log In
							</Button>

					}
				</Col>
			</Row>
		</div>
	)
}

const mapStateToProps = ({user}) => ({
	username: user.username,
})

export default connect(
	mapStateToProps
)(Home);
