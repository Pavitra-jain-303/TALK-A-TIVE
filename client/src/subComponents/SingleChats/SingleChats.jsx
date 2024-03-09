import { useState, useContext } from 'react';
import './SingleChats.css';
import chatContext from '../../Context/chatContext';
import ProfileModal from '../ProfileModal/ProfileModal';
import { Row, Container, Navbar, Col } from 'react-bootstrap';
import { getSenderFull } from '../../components/miscellaneous/ChatLogic';
import UpdateGroupChatModal from '../UpdateGroupChatModal/UpdateGroupChatModal';

// export default function SingleChats(fetchAgain, setFetchAgain) {
export default function SingleChats() {

    const { user, selectedChat } = useContext(chatContext);
    const [profileModalShow, setProfileModalShow] = useState(false);
    const [chatModalShow, setChatModalShow] = useState(false);

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
                            {JSON.stringify(selectedChat)}
                            {"\\n**********************User******************\\n\\n"}
                            <hr />
                            {JSON.stringify(getSenderFull(user, selectedChat.users))}
                        </div>


                        {profileModalShow && <ProfileModal
                            show={profileModalShow}
                            onHide={() => setProfileModalShow(false)}
                            user={getSenderFull(user, selectedChat.users)}
                        />}

                        {chatModalShow && <UpdateGroupChatModal
                            show={chatModalShow}
                            onHide={() => setChatModalShow(false)}
                        // fetchMessages, fetchAgain, setFetchAgain
                        // fetchAgain={fetchAgain} 
                        // setfetchagain={setFetchAgain}
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
