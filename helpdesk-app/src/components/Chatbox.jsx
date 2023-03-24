import React, { useContext, useEffect, useRef, useState } from 'react'
import Message from './Message'
import { db } from "../firebase";
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext';
import { arrayUnion, updateDoc, doc, Timestamp, onSnapshot } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { uuidv4 } from '@firebase/util';
import { LinearProgress, Snackbar, Alert } from '@mui/material';

const Chatbox = () => {
    const [messages, setMessages] = useState([]);
    const [atBottom, setAtBottom] = useState(false);
    const messagesEndRef = useRef();
    
    const [file, setFile] = useState({name: '', url: ''});
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadState, setUploadState] = useState('none');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [alert, setAlert] = useState({type: 'info', message: 'default'});

    const {currentUser} = useContext(AuthContext);
    const {data} = useContext(ChatContext);
    
    const messageText = React.useRef();
    const fileRef = React.useRef();
    const storage = getStorage();
    
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
                link: file.url,
                fileName: file.name,
            })
        })

        messageText.current.value = '';
        setFile({name: '', url: ''})
    }

    const uploadClick = async () => {
        console.log("upload");
        fileRef.current.click();
    }

    const handleUpload = (e) => {
        const selectedFile = e.target.files[0];
        
        if (!selectedFile) {
            console.log("choose a file")
            return;
        }

        const fileSizeMB = ((selectedFile.size / (1024*1024)).toFixed(2));

        if (fileSizeMB > 8) {
            setOpenSnackbar(true);
            setAlert({type: 'warning', message: 'Max file size is 8MB'});
            return;
        }

        setOpenSnackbar(true)
        setUploadState('running');
        setUploadProgress(0);

        const storageRef = ref(storage, data.chatID + '/' + selectedFile.name);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
            switch (snapshot.state) {
                case 'running': 
                    setAlert({type: 'info', message: 'File upload started'});
                    break;
                default: break;
            }
        },
        (error) => {
            console.log(error)
            setUploadState('none');
            setAlert({type: 'error', message: 'File upload failed'});
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                console.log('file at ' + url)
                setUploadState('none');
                setOpenSnackbar(true);
                setAlert({type: 'success', message: 'File upload completed'});
                setUploadProgress(0);
                setFile({name: selectedFile.name, url: url})
            })
            .then(() => {

            })
        })
    }

    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        setAtBottom(bottom);
    }

    const closeSnackbar = () => {
        setOpenSnackbar(false);
    }

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'chats', data.chatID), (doc) => {
            doc.exists() && setMessages(doc.data().messages)
        })

        return () => {
            unsub();
        }
    }, [data.chatID])

    useEffect(() => {
        if (data.chatID !== 'null' && file.name !== '' && file.url !== '') sendMessage();
    }, [file])
    
    useEffect(() => {
        if (atBottom) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

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
                <div className='scroll-wrapper' onScroll={handleScroll}>
                    <div className='message-wrapper'>
                        {messages.map((msg) => (<Message message={msg} key={msg.id} />))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                <div className='upload-bar'>
                    {uploadState === 'running' && <LinearProgress variant="determinate" value={uploadProgress} />}
                </div>
                <div className='chatbox-input'>
                    <input type="text" placeholder='Type a message' ref={messageText} onKeyDown={inputEnter}></input>
                    <button onClick={inputClick} disabled={data.chatID === 'null'}><i className="fi fi-ss-paper-plane"></i></button>
                    <button onClick={uploadClick} disabled={data.chatID === 'null'}><i className="fi fi-sr-add-document"></i></button>
                    <input type="file" ref={fileRef} onChange={handleUpload} onClick={(e) => e.target.value = null} style={{display: 'none'}}/>
                </div>
            </div>
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={closeSnackbar}>
                <Alert onClose={closeSnackbar} severity={alert.type} sx={{ width: '100%' }}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </>
         
    )
}

export default Chatbox
