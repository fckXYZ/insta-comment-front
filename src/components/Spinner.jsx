import React from "react";
import {Spinner} from "reactstrap";

const LoadingSpinner = (props) => {
	return (
		<div className="spinner">
			<Spinner color="info" />
		</div>
	)
}

export default LoadingSpinner;
