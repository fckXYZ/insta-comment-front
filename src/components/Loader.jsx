import React from "react";
import {Spinner} from "reactstrap";

const Loader = (props) => {
	return (
		<div className="loader-page">
			<Spinner
				className="spinner"
				type="grow"
				color="info"
				children={false}
			/>
		</div>
	)
}

export default Loader;
