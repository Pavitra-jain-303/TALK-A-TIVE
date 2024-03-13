import './ChatBox.css'
import SingleChats from '../../subComponents/SingleChats/SingleChats.jsx';


function ChatBox({ fetchAgain, setFetchAgain }) {

    return (
        <>
            <div className="ChatBox">
                <SingleChats />
            </div>
        </>
    )
}

export default ChatBox