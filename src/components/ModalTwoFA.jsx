import React, {useEffect, useState} from "react";
import {Button, Input, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";

const ModalTwoFA = (props) => {
	const { isOpened, toggle, sendCode, disabled } = props;
	const [inputValue, setInputValue] = useState('');


	const onSendCode = () => {
		if (inputValue.length !== 6) {
			return
		}
		sendCode(inputValue);
	}

	return (
		<Modal
			isOpen={isOpened}
			centered
			fullscreen="md"
			size="sm"
			toggle={() => toggle()}
		>
			<ModalHeader toggle={() => toggle()}>
				Enter 2FA code here!
			</ModalHeader>
			<ModalBody>
				<Input
					disabled={disabled}
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
				/>
			</ModalBody>
			<ModalFooter>
				<Button
					disabled={disabled}
					color="primary"
					onClick={() => onSendCode()}
				>
					Send
				</Button>
			</ModalFooter>
		</Modal>
	)
}

export default ModalTwoFA;
