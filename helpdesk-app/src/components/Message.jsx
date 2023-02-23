import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

const Message = ({message}) => {

    const {currentUser} = useContext(AuthContext);
    const {data} = useContext(ChatContext);

    const anonIcon = "https://cdn-icons-png.flaticon.com/512/5595/5595500.png";
    const userIcon = "https://cdn-icons-png.flaticon.com/512/8748/8748111.png";

    console.log(currentUser);

    const otherID = data.user.userID;
    const otherType = data.user.userType;
    const otherFirst = data.user.firstName;
    const otherLast = data.user.lastName;
    const myID = currentUser.uid;
    const myType = currentUser.user
    const senderID = message.senderID;
    const receiverID = message.receiverID;

    return (
        <div className='message'>
            <div className="user-info">
                <img src="https://cdn-icons-png.flaticon.com/512/1177/1177568.png" alt="Icon" width={45} height={45}></img>
                <div className='name'>
                    { 
                        myID == senderID && !currentUser.isAnonymous ? currentUser.displayName : 
                        myID == senderID && currentUser.isAnonymous ? 'Anonymous (' + myID + ')' :
                        otherType == 'anonymous' ? 'Anonymous (' + otherID + ')' : 
                        otherFirst + ' ' + otherLast 
                    }
                </div>
                <div className='timestamp'>1/2/2023 12:30PM</div>
                
            </div>
            <div className="content">
                {message.content}
            </div>
        </div>
    )
}

export default Message
