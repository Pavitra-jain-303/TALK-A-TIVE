import React, { useState, useContext } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

import './GroupChatModal.css'
import chatContext from '../../Context/chatContext';
import UserListItem from '../UserListItem/UserListItem';
import UserBadgeIcon from '../UserBadgeItem/UserBadgeItem';

function GroupChatModal(props) {
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, selectedChat, setSelectedChat, chats, setChats } = useContext(chatContext);

    const handleSubmit = async () => {
        
        if (!groupChatName) {
            toast.warn("Please enter a group chat name", {
                position: "bottom-center",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light",
            });
            return;
        }

        if (!selectedUsers || selectedUsers.length === 0) { // Check for both undefined and empty array
            toast.warn("Please select users for the group chat", {
                position: "bottom-center",
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

            const { data } = await axios.post(
                "/api/chats/group",
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                config
            );
            console.log(data);

            setChats([data,...chats]);
            setLoading(false);
            
            toast.success("Chat created success fully", {
                position: "top-center",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light",
            });
            
            props.onHide();

        } catch (error) {
            toast.warn(`submit error ${error}`, {
                position: "bottom-center",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light",
            });
        }
    }

    const handleDelete = (delUser) => {
        setSelectedUsers(
            selectedUsers.filter((sel) => sel._id !== delUser._id)
        );
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast.warn("User already added", {
                position: "bottom-center",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light",
            });
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            if (search.length > 0) {
                console.log(search);

                setLoading(true);

                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                const { data } = await axios.get(`/api/user?search=${search}`, config);
                console.log(data);
                // console.log(`${search} : ${data}`);

                setLoading(false);
                setSearchResult(data);

            }
        } catch (error) {
            toast.warn("Search Error : Error Occured! Failed to Load the Search Results", {
                position: "bottom-center",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light",
            });
        }
    };


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
                <Modal.Header closeButton className='modal_header'>
                    <Modal.Title id="contained-modal-title-vcenter" >
                        <strong><h1>Create Group Chat</h1></strong>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="modal_body">
                    <Form className='search_form'>
                        <Form.Group className="mb-3 xs-12" >
                            <Form.Control
                                type="text"
                                placeholder="Chat Name"
                                autoFocus
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Control
                                type="text"
                                placeholder="Add Users eg: John, Piyush, Jane"
                                onChange={(e) => {
                                    e.persist();
                                    const query = e.target.value;
                                    handleSearch(query)
                                }
                                }
                            />
                        </Form.Group>

                        <div className="d-flex flex-wrap my-3">
                            {selectedUsers &&
                                selectedUsers.map((user) => (
                                    // <ListGroup.Item
                                    //     key={u._id}
                                    //     // user={u}
                                    //     // handleFunction={() => handleDelete(u)}
                                    //     onClick={(e) => (e.preventDefault())}
                                    //     style={{
                                    //         // backgroundColor: "#d1d1d1", //"#38B2AC" 
                                    //         // color: "black", //"white" :
                                    //         cursor: "pointer",
                                    //         padding: "10px",
                                    //         borderRadius: "2px",
                                    //         marginBottom: "5px",
                                    //         textAlign: "left",
                                    //         fontSize: "15px"
                                    //     }}
                                    //     action variant="dark"
                                    //     as="li"
                                    //     className="d-flex justify-content-between align-items-start"
                                    // >
                                    //     <div className="ms-2 me-auto fw-bold">
                                    //         {u.name}
                                    //     </div>
                                    //     <CloseButton/>

                                    // </ ListGroup.Item>
                                    // <UserListItem
                                    //     key={user._id}
                                    //     user={user}
                                    //     handleFunction={() => (console.log("exit"))}
                                    //     isSelected={true}
                                    // />

                                    <UserBadgeIcon
                                        key={user._id}
                                        user={user}
                                        handleDelete={() => handleDelete(user)}
                                    />
                                ))
                            }
                        </div>

                        {loading ? (
                            // <ChatLoading />
                            <div>Loading...</div>
                        ) : (
                            searchResult
                                ?.slice(0, 4)
                                .map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleGroup(user)}
                                        isSelected={false}
                                    />
                                ))
                        )}
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={() => (handleSubmit())}>
                        {
                            loading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    Loading...
                                </>
                            ) : "Submit"
                        }
                    </Button>
                </Modal.Footer>

            </Modal>
        </div >
    )
}

export default GroupChatModal