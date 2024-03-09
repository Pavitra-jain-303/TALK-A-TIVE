import chatContext from "../../Context/chatContext";
import { useContext, useState } from "react";
import SideDrawer from "../../subComponents/SideDrawer/SideDrawer.jsx";
import MyChats from "../../components/MyChats/MyChats.jsx";
import ChatBox from "../../components/ChatBox/ChatBox.jsx";
import "./chatPage.css"

function ChatPage() {

    const { user } = useContext(chatContext);
    // const [fetchAgain, setFetchAgain] = useState(false);
    // console.log(user);
    // const userInfo = JSON.stringify(user._id);
    return (
        <div className="chatPage container">
            {user && <SideDrawer />}
            <div className="row" style={{ zIndex: "0" }}>
                <div className="col-3 p-3">{user && <MyChats  />}</div>
                <div className="col-9 p-3">{user && <ChatBox  />}</div>
            </div>
        </div>
    )
}

export default ChatPage;