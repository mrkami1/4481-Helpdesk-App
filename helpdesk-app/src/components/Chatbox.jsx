import React, { useContext, useEffect, useState } from 'react'
import Message from './Message'
import { db } from "../firebase";
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext';
import { arrayUnion, updateDoc, doc, Timestamp, onSnapshot} from 'firebase/firestore';
import { uuidv4 } from '@firebase/util';

const Chatbox = () => {

    const [messages, setMessages] = useState([]); 
    const [showDialog, setShowDialog] = useState(false); 
    const {currentUser} = useContext(AuthContext);
    const {data} = useContext(ChatContext);
    const messageText = React.useRef();

    const inputEnter = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }

    const inputClick = () => {
        sendMessage();
    }

    const sendMessage = async() => {
        const text = messageText.current.value;
        console.log(text);
        
        await updateDoc(doc(db, 'chats', data.chatID), {
            messages: arrayUnion({
                id: uuidv4(),
                content: text,
                senderID: currentUser.uid,
                receiverID: data.user.userID,
                date: Timestamp.now(),
            })
        })
        
        messageText.current.value = '';
    }

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'chats', data.chatID), (doc) => {
            doc.exists() && setMessages(doc.data().messages)
        })

        return () => {
            unsub();
        }
    }, [data.chatID])

    return (
        <>
            <div className='chatbox-container'>
                <div className='chatbox-title'>
                    {
                        data.user.userType == 'agent' ? data.user.firstName + ' ' + data.user.lastName :
                        data.user.userType == 'anonymous' ? 'Anonymous User (' + data.user.userID + ')' :
                        'Messages'
                    }
                </div>
                <div className='message-wrapper'>
                    {messages.map((msg) => (
                        <Message message={msg} key={msg.id} />
                        ))}
                </div>
                <div className='chatbox-input'>
                    <input type="text" placeholder='Type a message' ref={messageText} onKeyDown={inputEnter}></input>
                    <button onClick={inputClick}><i className="fi fi-ss-paper-plane"></i></button>
                </div>
            </div>
        </>
        
    )
}

export default Chatbox
