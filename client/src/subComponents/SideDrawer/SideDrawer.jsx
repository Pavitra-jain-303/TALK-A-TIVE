import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Dropdown, Tooltip, OverlayTrigger, Button, Offcanvas, Form, InputGroup } from 'react-bootstrap';


import chatContext from '../../Context/chatContext.js';
import ProfileModal from '../ProfileModal/ProfileModal.jsx';
import './SideDrawer.css';
import ChatLoading from '../../components/miscellaneous/chatLoading.jsx';
import UserListItem from '../UserListItem/UserListItem.jsx';
import { getSender } from '../../components/miscellaneous/ChatLogic.js';
import { api_Url } from '../../apiLink.js';

function SideDrawer() {

    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChats, setLoadingChats] = useState();
    const [modalShow, setModalShow] = useState(false);

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = useContext(chatContext);
    const navigate = useNavigate();


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false); // used to handle offcanvas
    const handleShow = () => setShow(true); // used to handle offcanvas

    const logOutHandler = () => {
        // console.log('Log Out');
        localStorage.removeItem('userInfo');
        navigate('/');
    }

    const accessChat = async (userId) => {
        // console.log(userId);

        try {
            setLoadingChats(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(`${api_Url}/api/chats`, { userId }, config);
            // console.log(data);
            if (!chats.find((c) => c._id === data._id)) {
                setChats([data, ...chats]);
                // console.log(chats);
                toast.success('chat is set', {
                    position: "top-left",
                    hideProgressBar: true,
                    closeOnClick: true,
                    theme: "light",
                });
            }
            else {
                toast.info('chat already set', {
                    position: "top-left",
                    hideProgressBar: true,
                    closeOnClick: true,
                    theme: "light",
                });
            }
            setSelectedChat(data);
            setLoadingChats(false);
            handleClose();
        } catch (error) {
            // console.log(error);
            toast.error(`${error.message}`, {
                position: "top-left",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light",
            });
        }
    };

    const handleSearch = async () => {
        // console.log(search);
        if (!search) {
            toast.warn('Please enter username', {
                position: "top-left",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light",
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`${api_Url}/api/user?search=${search}`, config);
            // console.log(data);
            if (data.length === 0) {
                toast.error('User not found', {
                    position: "top-left",
                    hideProgressBar: true,
                    closeOnClick: true,
                    theme: "light",
                });
            }
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            setLoading(false);
            // console.log(error);
            toast.error(`${error}`, {
                position: "top-left",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light",
            });
        }
    }

    return (
        <>
            {/* this is Topbar */}
            <div className="container text-center SideDrawer">
                <div className="row align-items-center searchBar">
                    <div className="col-3">
                        <OverlayTrigger
                            key={'bottom'}
                            placement={'bottom'}
                            overlay={
                                <Tooltip id={'tooltip-bottom'}>
                                    {/* Tooltip on <strong>bottom</strong>. */}
                                    Click to search user
                                </Tooltip>
                            }
                        >
                            <Button variant="outline-light" style={{ border: "none", color: "inherit" }} onClick={handleShow}>
                                <i className="bi bi-search" style={{ fontSize: "1.3rem", color: "inherit" }}> Search Users</i>
                            </Button>
                        </OverlayTrigger>

                    </div>

                    {/* THis is logo */}
                    <div className="logo col-6 fs-2 fw-medium">
                        Talk-A-Tive
                    </div>

                    <div className="col-3 notification">
                        <Dropdown className="d-inline mx-0" data-bs-theme="light">
                            <Dropdown.Toggle id="dropdown-autoclose-true" variant="outline-light" style={{ border: "none", color: "inherit" }}>
                                <i className="bi bi-bell-fill" style={{ fontSize: "1.3rem" }}></i>
                                {notification.length > 0 && (
                                    <div className="notification-badge">
                                        <span className="badge">
                                            {notification.length}
                                        </span>
                                    </div>
                                )}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {/* */}
                                {
                                    !notification.length &&
                                    <Dropdown.Item>No New Messages</Dropdown.Item>
                                }
                                {
                                    notification.map((notif) => (
                                        <Dropdown.Item
                                            key={notif._id}
                                            onClick={() => {
                                                setSelectedChat(notif.chat);
                                                setNotification(notification.filter((n) => n !== notif));
                                            }}
                                        >
                                            {notif.chat.isGroupChat
                                                ? `New Message in ${notif.chat.chatName}`
                                                : `New Message from ${getSender(user, notif.chat.users)}`}
                                        </Dropdown.Item>
                                    ))
                                }
                            </Dropdown.Menu>
                        </Dropdown>


                        <Dropdown className="d-inline mx-0" data-bs-theme="light" style={{ cursor: "pointer" }}>
                            <Dropdown.Toggle id="dropdown-autoclose-true" variant="outline-light" style={{ border: "none", color: "inherit" }}>
                                <img src={user.pic} alt={user.name} style={{ borderRadius: "100%", height: "2rem" }} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => { setModalShow(true) }}>Profile</Dropdown.Item>
                                <Dropdown.Item onClick={() => { logOutHandler() }}>Log Out</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>

                {modalShow && <ProfileModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    user={user}
                />}

            </div>

            {/* this is the side drawer that is shown when user clicks on search user */}
            <Offcanvas show={show} onHide={handleClose} backdrop="static">
                <Offcanvas.Header closeButton onClick={() => { setSearch() }}>
                    <Offcanvas.Title>Search User</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Enter username"
                            aria-label="search via username"
                            aria-describedby="basic-addon2"
                            onChange={(e) => { setSearch(e.target.value) }}
                        />
                        <Button variant="outline-secondary" id="button-addon2" onClick={() => { handleSearch() }}>
                            Go
                        </Button>
                    </InputGroup>
                    {
                        loading ? <ChatLoading />
                            :
                            (
                                searchResult?.map(user => (
                                    // <ListGroup as="ul">
                                    //     <ListGroup.Item
                                    //         as="li"
                                    //         className="d-flex justify-content-between align-items-start"
                                    //         key={user._id}
                                    //         onClick={() => accessChat(user._id)}
                                    //     >
                                    //         <img src={user.pic} alt={user.name} style={{ borderRadius: "100%", height: "2rem" }} />
                                    //         <div className="ms-2 me-auto">
                                    //             <div className="fw-bold">{user.name}</div>
                                    //             {user.email}
                                    //         </div>
                                    //     </ListGroup.Item>
                                    // </ListGroup>

                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => accessChat(user._id)}
                                    />
                                ))
                            )
                    }
                    {loadingChats && <div className="spinner-border m-5" role="status">
                        <span className="sr-only"></span>
                    </div>}
                </Offcanvas.Body>
            </Offcanvas>

            <ToastContainer autoClose={false} />
        </>
    )
}


export default SideDrawer;