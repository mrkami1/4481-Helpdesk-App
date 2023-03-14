import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { Timestamp, toDate } from 'firebase/firestore'

const Message = ({message}) => {

    const {currentUser} = useContext(AuthContext);
    const {data} = useContext(ChatContext);

    const anonIcon = 'https://cdn-icons-png.flaticon.com/512/5595/5595500.png';
    const userIcon = 'https://cdn-icons-png.flaticon.com/512/8748/8748111.png';
    const defaultIcon = 'https://cdn-icons-png.flaticon.com/512/1177/1177568.png';

    console.log(currentUser);
    console.log(message);
    console.log(data);

    const otherID = data.user.userID;
    const otherAnon = data.user.userType === 'anonymous';
    const otherFirst = data.user.firstName;
    const otherLast = data.user.lastName;
    const myID = currentUser.uid;
    const amAnon = currentUser.isAnonymous;
    const senderID = message.senderID;
    const receiverID = message.receiverID;
    const date = message.date.toDate().toDateString() + ' ' + message.date.toDate().toLocaleTimeString();
    console.log(date);

    return (
        <div className='message'>
            <div className="user-info">
                <img src=
                    {
                        myID === senderID && !amAnon ? userIcon : 
                        myID === senderID && amAnon ? anonIcon :
                        otherAnon ? anonIcon : 
                        !otherAnon ? userIcon : defaultIcon 
                    } 
                    alt="Icon" width={45} height={45}>
                </img>
                <div className='name'>
                    { 
                        myID === senderID && !amAnon ? currentUser.displayName : 
                        myID === senderID && amAnon ? 'Anonymous (' + myID + ')' :
                        otherAnon ? 'Anonymous (' + otherID + ')' : 
                        otherFirst + ' ' + otherLast 
                    }
                </div>
                <div className='timestamp'>{date}</div>
                
            </div>
            <div className="content">
                {message.content}
            </div>
        </div>
    )
}

export default Message
