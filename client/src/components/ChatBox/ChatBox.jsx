// import { useContext } from 'react'

import './ChatBox.css'
// import chatContext from '../../Context/chatContext.js';
import SingleChats from '../../subComponents/SingleChats/SingleChats.jsx';


function ChatBox({ fetchAgain, setFetchAgain }) {

    // const { user, selectedChat, setSelectedChat, chats, setChats } = useContext(chatContext);
    // console.log(selectedChat);

    return (
        <>
            <div className="ChatBox">
                {/* <SingleChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> */}
                <SingleChats />
            </div>
        </>
    )
}

export default ChatBox