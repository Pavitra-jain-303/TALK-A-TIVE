import react from 'react';
import { CloseButton, ListGroup } from 'react-bootstrap';
import './UserListItem.css'

const UserListItem = ({ user, handleFunction, isSelected = false }) => {

    const selectClass = isSelected ? "selected" : "not_selected";

    return (
        <ListGroup>
            <ListGroup.Item
                as="li"
                className={`d-flex userListContainer ${selectClass}`}
                key={user._id}
                onClick={handleFunction}
            >
                <img src={user.pic} alt={user.name} style={{ borderRadius: "100%", height: "2rem",margin:"0.5rem" }} />
                <div className="ms-2 me-auto UserName">
                    <p className='fw-medium'>{user.name}</p>
                    <p>Email: {user.email}</p>
                </div>
                {isSelected && <CloseButton />}
            </ListGroup.Item>
        </ListGroup>
    );
};


export default UserListItem;