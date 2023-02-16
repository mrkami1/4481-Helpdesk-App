import React from "react";

const Chats = () => {
    return (
        <div className="chats">
            <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/uicons-bold-straight/css/uicons-bold-straight.css'></link>
            <div className="user-chat">
                <div className="picture">
                    <img src="https://cdn-icons-png.flaticon.com/512/1177/1177568.png" alt="User" width={45} height={45}></img>
                </div>
                <div className="name">
                    <span className="username">Help-desk Agent</span>
                </div>
                <div className="status">
                    <span className="userStatus"><span className="statusCircle"></span> Online</span>
                </div>
                <div className="unread"></div>
            </div>
        </div>
    )
}

export default Chats
