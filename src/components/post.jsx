import React from "react";
import {Button, Row} from "reactstrap";

const Post = (props) => {
	const { index, url, id, onClickPost } = props;

	return (
		<Row className="m-3 p-3 border-3 w-25">
			<p>
				Post {index}
			</p>
			<a href={url}>
				{url}
			</a>
			<Button className="btn-info m-3" onClick={() => onClickPost()}>
				Go Posting!
			</Button>
		</Row>
	)
}

export default Post;
