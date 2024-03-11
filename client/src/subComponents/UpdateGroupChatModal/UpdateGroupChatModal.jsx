import React, { useState, useContext } from 'react';
import { Modal, Button, Form, Spinner, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

// import './GroupChatModal.css'
import chatContext from '../../Context/chatContext';
import UserListItem from '../UserListItem/UserListItem';
import UserBadgeIcon from '../UserBadgeItem/UserBadgeItem';

function UpdateGroupChatModal(props) {


    // props : 
    // show = { chatModalShow }
    // onHide = {() => setChatModalShow(false)}
    // fetchAgain = { fetchAgain }
    // setFetchAgain = { setFetchAgain }
    const { user, selectedChat, setSelectedChat, fetchAgain, setFetchAgain } = useContext(chatContext);


    const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);


    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            if (search.length > 0) {
                // console.log(search);

                setLoading(true);

                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                const { data } = await axios.get(`/api/user?search=${search}`, config);
                // console.log(data);
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
            setLoading(false);
        }
    };


    const handleRename = async (e) => {
        e.preventDefault();
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
            props.fetch_messages();
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
            // props.show();
        } catch (error) {
            // console.log(`error for handleRename:\n${error}`);
            toast.error("Failed to change name", {
                position: "top-center",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light",
            });
            setRenameLoading(false);
        }

        setGroupChatName("");
    };

    const handleRemove = async (selected_user) => {

        if (selectedChat.groupAdmin._id !== user._id && user._id !== selected_user._id) {
            toast.error("Only admins can remove someone", {
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

            const { data } = await axios.put(
                "/api/chats/remove",
                {
                    chatId: selectedChat._id,
                    userId: selected_user._id,
                },
                config,
            );

            toast.info(`${selected_user.name} removed`, {
                position: "bottom-center",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light",
            });

            selected_user._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            console.log(`Removing user error\n${error}`);
            toast.error("Error Removing user from group", {
                position: "bottom-center",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light",
            });
            setLoading(false);
        }
    };

    const handleAddUser = async (selected_user) => {
        if (selectedChat.users.find((u) => u._id === selected_user._id)) {
            toast.error(`${selected_user.name} is already in the group`, {
                position: "bottom-center",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light",
            });
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast.error("Only admins can add user to group", {
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

            const { data } = await axios.put(
                "/api/chats/add",
                {
                    chatId: selectedChat._id,
                    userId: selected_user._id,
                },
                config
            );

            toast.success(`${selected_user.name} added to ${selectedChat.chatName}`, {
                position: "top-center",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light",
            });

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            console.log(`Adding user error\n${error}`);
            toast.error("Error adding new user to group", {
                position: "bottom-center",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light",
            });
            setLoading(false);
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
                        <strong><h1>Update {selectedChat.chatName} by {selectedChat.groupAdmin.name}</h1></strong>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="modal_body">
                    <Form className="search_form">

                        <InputGroup className="mb-3 xs-12 d-flex" >

                            <Form.Control
                                type="text"
                                placeholder="Chat Name"
                                value={groupChatName}
                                aria-describedby="basic-addon2"
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="outline-secondary"
                                id="button-addon2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleRename(e);
                                }}
                            >
                                {
                                    renameLoading ? (
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
                                    ) : "Rename"
                                }
                            </Button>

                        </InputGroup>

                        <InputGroup className="mb-3 xs-12 d-flex" >

                            <Form.Control
                                type="text"
                                placeholder="Add Users eg: John, Piyush, Jane"
                                onChange={(e) => { handleSearch(e.target.value) }}
                            />

                        </InputGroup>

                        <div className="d-flex flex-wrap my-3 justify-content-center">
                            {selectedChat.users.map((u) => (
                                <UserBadgeIcon
                                    key={u._id}
                                    user={u}
                                    admin={selectedChat.groupAdmin}
                                    handleDelete={() => { handleRemove(u) }}
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
                                        handleFunction={() => handleAddUser(user)}
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