import React, { useContext, useEffect, useState } from 'react'
import Message from './Message'
import { db } from "../firebase";
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext';
import { arrayUnion, updateDoc, doc, Timestamp, onSnapshot} from 'firebase/firestore';
import { uuidv4 } from '@firebase/util';

const Chatbox = () => {

    const [messages, setMessages] = useState([]); 
    const [file, setFile] = useState();
    const {currentUser} = useContext(AuthContext);
    const {data} = useContext(ChatContext);
    const messageText = React.useRef();
    const fileRef = React.useRef();

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

    const uploadClick = async () => {
        console.log("upload");
        fileRef.current.click();
    }

    const handleUpload = (e) => {
        console.log(e.target.files);
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
                        data.user.userType === 'agent' ? data.user.firstName + ' ' + data.user.lastName :
                        data.user.userType === 'anonymous' ? 'Anonymous User (' + data.user.userID + ')' :
                        'Select a Chat'
                    }
                </div>
                <div className='message-wrapper'>
                    {
                        messages.map((msg) => (<Message message={msg} key={msg.id} />))
                    }
                </div>
                <div className='chatbox-input'>
                    <input type="text" placeholder='Type a message' ref={messageText} onKeyDown={inputEnter}></input>
                    <button onClick={inputClick}><i className="fi fi-ss-paper-plane"></i></button>
                    <button onClick={uploadClick}><i className="fi fi-sr-add-document"></i></button>
                    <input type="file" ref={fileRef} onChange={handleUpload} style={{display: 'none'}}/>
                </div>
            </div>
        </>
        
    )
}

export default Chatbox
