import { useContext } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import chatContext from '../../Context/chatContext';

import './ProfileModal.css'

function ProfileModal(props) {
    const navigate = useNavigate();
    const { user } = useContext(chatContext);

    const logOutHandler = () => {
        // console.log('Log Out');
        localStorage.removeItem('userInfo');
        navigate('/');
    }

    return (
        <div>
            <Modal
                {...props}
                size="md"
                // aria-labelledby="contained-modal-title-vcenter"
                centered
                className="modal"
            // style={{fontFamily:"Work sans", textAlign:"center"}}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="modal_header">
                        <strong><h1 style={{ textAlign: "center" }}> {props.user.name.toUpperCase()}</h1></strong>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal_body">
                    <img src={props.user.pic} alt={props.user.name} className="avatar" />

                    <h4 className="lead body_message" >Email: {props.user.email}</h4>
                </Modal.Body>
                <Modal.Footer>
                    {(user._id === props.user._id) && <Button onClick={() => { logOutHandler() }}>Log Out</Button>}
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>

            </Modal>
        </div >
    )
}

export default ProfileModal;