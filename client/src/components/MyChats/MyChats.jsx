import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Button, Stack } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

import { getSender } from '../miscellaneous/ChatLogic';
import chatContext from '../../Context/chatContext';
import ChatLoading from '../miscellaneous/chatLoading';
import './MyChats.css';
import GroupChatModal from '../../subComponents/GroupChatModal/GroupChatModal';
 

function MyChats() {

    const [loggedUser, setLoggedUser] = useState();
    const [modalShow, setModalShow] = useState(false);
    const { user, selectedChat, setSelectedChat, chats, setChats, fetchAgain } = useContext(chatContext);
    // console.log(selectedChat);

    const fetchChats = async () => {
        // console.log(user._id);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/chats`, config);
            // console.log(data);
            setChats(data);
        } catch (error) {
            console.log(error);
            toast.error(`MYCHATS : ${error.message}`, {
                position: "top-left",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light",
            });
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
        // console.log(loggedUser);
        // eslint-disable-next-line
    }, [fetchAgain]);

    return (
        <>
            <Stack gap={2} className="col-md-5 mx-auto MyChats" fluid="md" >
                <Container fluid="md">
                    <Row className='Chat_heading'>
                        <Col className='fs-3'>My Chats</Col>
                        <Col className='NewChat_btn'>
                            <Button variant="outline-secondary" onClick={() => (setModalShow(true))}>Add new chat<i className="bi bi-plus-lg"></i></Button>
                        </Col>
                    </Row>
                </Container>

                <Container fluid="md" className='Chat_Container'>
                    {/* // d="flex"
                        // flexDir="column"
                        // p={3}
                        // bg="#F8F8F8"
                        // w="100%"
                        // h="100%"
                        // borderRadius="lg"
                        // overflowY="hidden" */}
                    {chats ? (
                        <Stack gap={2} className='Chat_Row_Container'>
                            {chats.map((chat) => (
                                <Row
                                    className='Chat_Rows'
                                    style={{
                                        backgroundColor: selectedChat === chat ? "#38B2AC" : "#d1d1d1",
                                        color: selectedChat === chat ? "white" : "black",
                                        cursor: "pointer",
                                        padding: "15px",
                                        borderRadius: "2px",
                                        marginBottom: "5px",
                                        textAlign: "left",
                                        fontSize: "17px"
                                    }}
                                    onClick={() => setSelectedChat(chat)}
                                    key={chat._id}
                                >
                                    <h3>
                                        {}
                                        {!chat.isGroupChat
                                            ? getSender(loggedUser, chat.users).toUpperCase()
                                            : chat.chatName.toUpperCase()}
                                    </h3>
                                    {/* {chat.latestMessage && (
                                            <Text fontSize="xs">
                                                <b>{chat.latestMessage.sender.name} : </b>
                                                {chat.latestMessage.content.length > 50
                                                    ? chat.latestMessage.content.substring(0, 51) + "..."
                                                    : chat.latestMessage.content}
                                            </Text>
                                        )} */}
                                </Row>
                            ))}
                        </Stack>
                    ) : (
                        <ChatLoading />
                    )}
                </Container>

                {modalShow && <GroupChatModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    user={user}
                    childern={<h1>Hello Modal</h1>}
                />}
            </ Stack>



            {/* <ToastContainer autoClose={false} /> */}
        </>
    )
}

export default MyChats