import { useState, useContext, useEffect } from 'react';
import { Row, Container, Navbar, Col, Form, Spinner, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { io } from "socket.io-client";

import './SingleChats.css';
import chatContext from '../../Context/chatContext';
import ProfileModal from '../ProfileModal/ProfileModal';
import { getSenderFull } from '../../components/miscellaneous/ChatLogic';
import UpdateGroupChatModal from '../UpdateGroupChatModal/UpdateGroupChatModal';
import ScrollableChat from '../ScrollableChat/ScrollableChat';
 

// const ENDPOINT = "http://localhost:5000"; // ; -> Before deployment
const ENDPOINT = "https://talk-a-tive-1.onrender.com";
let socket, selectedChatCompare;

// export default function SingleChats(fetchAgain, setFetchAgain) {
export default function SingleChats() {


    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);


    const { user, selectedChat, fetchAgain, setFetchAgain, notification, setNotification } = useContext(chatContext); //
    const [profileModalShow, setProfileModalShow] = useState(false);
    const [chatModalShow, setChatModalShow] = useState(false);

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);
            const { data } = await axios.get(
                `/api/message/${selectedChat._id}`,
                config,
            );

            // console.log(data);
            setMessages(data);
            setLoading(false);
            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast.error("Failed to get messages", {
                position: "top-center",
                hideProgressBar: true,
                closeOnClick: true,
                theme: "light",
            });
        }
    }

    const sendMessage = async (event) => {
        if (event.key === 'Enter' && newMessage) {
            // Your logic for handling Enter key press (e.g., submit form, trigger search)
            // console.log('Enter key pressed! Input value:', newMessage);
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                setNewMessage(''); // Clear input after Enter
                const { data } = await axios.post(
                    `/api/message`,
                    {
                        content: newMessage,
                        chatId: selectedChat._id
                    },
                    config
                )
                // console.log('Data:');
                // console.log(data);

                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                console.log(error);
                toast.error("Failed to send messages", {
                    position: "top-center",
                    hideProgressBar: true,
                    closeOnClick: true,
                    theme: "light",
                });
            }
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    }

    useEffect(() => {
        // eslint-disable-next-line
        
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));

    }, []);

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat])

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
                // console.log("notification ----------------- ", notification);
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });

    return (
        <>
            {
                selectedChat
                    ?
                    <Container className='singleChat'>
                        <Navbar className="bg-body-tertiary NavBar_Container">
                            {
                                selectedChat.isGroupChat
                                    ? (
                                        <div className='profile_Container' onClick={() => { setChatModalShow(true) }}>
                                            <Col className='fs-4 senderName'>{selectedChat.chatName}</Col>
                                        </div>
                                    )
                                    : (
                                        <div className='profile_Container' onClick={() => { setProfileModalShow(true) }}>
                                            <img
                                                alt=""
                                                src={getSenderFull(user, selectedChat.users).pic}
                                                width="30"
                                                height="30"
                                                className="d-inline-block align-top"
                                                style={{ borderRadius: "100%" }}
                                            />{' '}
                                            <Col className='fs-4 senderName'>{getSenderFull(user, selectedChat.users).name}</Col>
                                        </div>
                                    )
                            }
                        </Navbar>

                        <div className='Single_Chat_Container'>
                            {
                                loading ? (
                                    <Container className='d-flex justify-content-center align-items-center' style={{ "margin": "auto", "fontSize": "20px" }}>
                                        <Spinner
                                            as="span"
                                            animation="grow"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        Loading...
                                    </Container>
                                ) : (
                                    <>
                                        <Container className='chat_message_container' >
                                            <ScrollableChat
                                                messages={messages}
                                                typing={typing}
                                                istyping={istyping}
                                            />
                                        </Container>
                                    </>

                                )
                            }

                            <InputGroup onKeyDown={sendMessage} className='d-flex mt-2 mb-2 pb-2'>
                                <Form.Control
                                    placeholder='Type a message'
                                    required
                                    value={newMessage}
                                    onChange={typingHandler}
                                    aria-describedby="basic-addon2"
                                />
                                {/* <Button
                                    id="basic-addon2"
                                    variant="outline-secondary"
                                    style={{
                                        border: "none"
                                    }}
                                    onClick={sendMessage}
                                >
                                    <i className="bi bi-send"
                                        style={{
                                            border: "none",
                                            margin: "0px 10px"
                                        }}
                                    ></i>
                                </Button> */}
                            </InputGroup >
                        </div>




                        {profileModalShow && <ProfileModal
                            show={profileModalShow}
                            onHide={() => setProfileModalShow(false)}
                            user={getSenderFull(user, selectedChat.users)}
                        />}

                        {chatModalShow && <UpdateGroupChatModal
                            show={chatModalShow}
                            onHide={() => setChatModalShow(false)}
                            fetch_messages={fetchMessages}// Used underscore for naming because some react error regarding naming and not recognising
                        />}

                    </Container>
                    :
                    <Container className='unSelectedChatBox' fluid="md">
                        <Row>
                            Click on a user to start Chatting
                        </Row>
                    </Container>
            }
        </>
    )
}
