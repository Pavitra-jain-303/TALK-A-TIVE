import React from 'react';
import { CloseButton } from 'react-bootstrap';
import './UserBadgeItem.css';

const UserBadgeIcon = ({ user, handleDelete }) => {
    return (
        <div className="user-badge-icon d-inline-flex align-items-center mx-1 my-1">
            <span className="ms-2">{user.name}</span>
            <CloseButton
                className="ms-auto p-2"
                onClick={handleDelete}
                variant="white"
            />
        </div>
    );
};

export default UserBadgeIcon;

