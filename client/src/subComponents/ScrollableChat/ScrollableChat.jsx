import React, { useContext } from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Lottie from "react-lottie";

import './ScrollableChat.css'
import chatContext from '../../Context/chatContext';
import { isSameSenderMargin, isSameUser, isSameSender, isLastMessage } from '../../components/miscellaneous/ChatLogic';
import animationData from '../../animations/typing.json';

function ScrollableChat({ messages, typing, istyping }) {
    // console.log("Inside Scrollable Chats");
    // console.log(messages);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const { user } = useContext(chatContext);

    return (
        <ScrollableFeed className='message_container'>
            {
                messages && messages.map((m, i) => (
                    <div style={{ display: "flex" }} key={m._id}>
                        {(isSameSender(messages, m, i, user._id) ||
                            isLastMessage(messages, i, user._id)) && (
                                <OverlayTrigger
                                    key="bottom"
                                    placement="bottom"
                                    overlay={
                                        <Tooltip>
                                            {m.sender.name}
                                        </Tooltip>
                                    }
                                >
                                    <img
                                        name={m.sender.name}
                                        src={m.sender.pic}
                                        alt={m.sender.name}
                                        style={{ borderRadius: "100%", height: "2rem", cursor: "pointer", marginTop: "7px", marginRight: "5px" }}
                                    />
                                </OverlayTrigger>
                            )}
                        <span
                            style={{
                                backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                                    }`,
                                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 15,
                                borderRadius: `${m.sender._id === user._id ? "10px 0px 10px 10px" : "0px 10px 10px 10px"}`,
                                padding: "10px 15px 15px",
                                maxWidth: "55%",
                            }}
                        >
                            {m.content}
                        </span>
                    </div>
                ))
            }

            {(!typing && istyping) ? (
                <div>
                    <Lottie
                        options={defaultOptions}
                        // height={50}
                        width={70}
                        style={{ marginBottom: 15, marginLeft: 0 }}
                    />
                </div>
            ) : (
                <></>
            )}
        </ScrollableFeed>
    )
}

export default ScrollableChat