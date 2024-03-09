import React, { useEffect, useState } from 'react';
import chatContext from './chatContext';
// import { redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ChatState = ({ children }) => {

    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [fetchAgain, setFetchAgain] = useState(false);

    const navigate = useNavigate();
    

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if (!userInfo) {
            navigate('/');
        }

    }, [navigate]);

    return (
        <chatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, fetchAgain, setFetchAgain }}>
            {children}
        </chatContext.Provider>
    )
}

export default ChatState;
