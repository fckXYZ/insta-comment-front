import React from "react";
import {Button, Form, FormGroup, Label, Row} from "reactstrap";
import {useForm} from "react-hook-form";

const InstaLogin = (props) => {

	const { onLogin, formDisabled } = props;
	const { register, handleSubmit } = useForm();

	const onSubmit = (d) => {
		onLogin(d)
	}

	return (
		<Row className="m-3">
			<Form
				className="col-6 m-5 d-flex flex-column align-items-start"
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
						{...register("login")}
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
				<Button type="submit" className="m-3 btn-lg btn btn-warning" disabled={formDisabled}>
					{
						formDisabled ?
							"Loading..."
						:
						"Get Feed"
					}
				</Button>
			</Form>
		</Row>

	)
}

export default InstaLogin;
