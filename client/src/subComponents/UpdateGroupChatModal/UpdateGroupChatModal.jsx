import React, { useState, useContext } from 'react';
import { Modal, Button, Form, Spinner, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

// import './GroupChatModal.css'
import chatContext from '../../Context/chatContext';
import UserListItem from '../UserListItem/UserListItem';
import UserBadgeIcon from '../UserBadgeItem/UserBadgeItem';

function UpdateGroupChatModal(show, onHide, fetchAgain, setfetchagain) {


    // props : 
    // show = { chatModalShow }
    // onHide = {() => setChatModalShow(false)}
    // fetchAgain = { fetchAgain }
    // setFetchAgain = { setFetchAgain }
    const { user, selectedChat, setSelectedChat } = useContext(chatContext);


    const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
    // const [selectedUsers, setSelectedUsers] = useState([]);
    // const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);


    const handleRemove = () => { };

    const handleRename = async () => {
        if (!groupChatName)
            return;

        setRenameLoading(true);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = axios.put(
                "api/chats/rename",
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            );


            toast.success(`Chatname changed to ${groupChatName}`, {
                position: "top-center",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light",
            });

            setSelectedChat(data);
            // props.setFetchAgain(!(props.fetchAgain));
            // console.log(props.fetchAgain);
            setfetchagain(!fetchAgain);
            setRenameLoading(false);

        } catch (error) {
            console.log(`error for handleRename:\n${error}`);
            toast.error("Failed to change name", {
                position: "top-center",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light",
            });
        }

        setGroupChatName("");
    };

    const handleSearch = () => { };

    return (
        <div>
            <Modal
                show 
                onHide
                fetchAgain
                setFetchAgain
                size="md"
                // aria-labelledby="contained-modal-title-vcenter"
                centered
                className="modal"
            // style={{fontFamily:"Work sans", textAlign:"center"}}
            >
                <Modal.Header closeButton className='modal_header'>
                    <Modal.Title id="contained-modal-title-vcenter" >
                        <strong><h1>Update {selectedChat.chatName}</h1></strong>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="modal_body">
                    <Form className='search_form'>

                        <InputGroup className="mb-3 xs-12 d-flex" >

                            <Form.Control
                                type="text"
                                placeholder="Chat Name"
                                value={groupChatName}
                                autoFocus
                                aria-describedby="basic-addon2"
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="outline-secondary"
                                id="button-addon2"
                                onClick={() => { handleRename() }}
                            >
                                Button
                            </Button>

                        </InputGroup>

                        <InputGroup className="mb-3 xs-12 d-flex" >

                            <Form.Control
                                type="text"
                                placeholder="Add Users eg: John, Piyush, Jane"
                                onChange={(e) => { handleSearch(e.target.value) }}
                            />
                            <Button
                                variant="outline-secondary"
                                id="button-addon2"
                            >
                                Button
                            </Button>

                        </InputGroup>

                        <div className="d-flex flex-wrap my-3 justify-content-center">
                            {selectedChat.users.map((u) => (
                                <UserBadgeIcon
                                    key={u._id}
                                    user={u}
                                    admin={selectedChat.groupAdmin}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
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
                                        // handleFunction={() => handleGroup(user)}
                                        isSelected={false}
                                    />
                                ))
                        )}
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        onClick={() => { handleRemove(user) }}
                        variant="danger"
                    >
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
                            ) : "Leave Group"
                        }
                    </Button>
                </Modal.Footer>

            </Modal>
        </div >
    )
}

export default UpdateGroupChatModal;