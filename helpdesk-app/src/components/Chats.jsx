import React, { useContext, useEffect, useRef, useState } from "react";
import { onSnapshot, collection, query, where, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

const Chats = (props) => {

    const {currentUser} = useContext(AuthContext);
    const {dispatch} = useContext(ChatContext);

    const [users, setUsers] = useState([]);

    const anonIcon = "https://cdn-icons-png.flaticon.com/512/5595/5595500.png";
    const userIcon = "https://cdn-icons-png.flaticon.com/512/8748/8748111.png";

    useEffect(() => {
        const getUsers = () => {
            const q = query(collection(db, 'users'), where('userStatus', '==', 'online'));
            const unsub = onSnapshot(q, (querySnapshot) => {
                const userArray = [];
                let currentUserData = null;
                querySnapshot.forEach((doc) => {
                    let userData = doc.data();
                    if (userData.userID == currentUser.uid) currentUserData = userData;
                    if (currentUser.isAnonymous && userData.userType == 'agent' && userData.assignedUser == currentUser.uid) {
                        userArray.push(userData);
                    }
                    else if (!currentUser.isAnonymous && userData.userID !== currentUser.uid) {
                        userArray.push(userData);
                    }
                })                

                setUsers(userArray);
            });
            
            return () => {
                unsub();
            };
        };
        currentUser.uid && getUsers();
        
    }, [currentUser.uid]);

    const openChat = async (usr, e) => {
        const chatID = currentUser.uid > usr.userID ? currentUser.uid + usr.userID : usr.userID + currentUser.uid;
        if (e.target.className != 'transfer-button') {
            try {
                const response = await getDoc(doc(db, 'chats', chatID));

                if (!response.exists() && usr.userID != currentUser.uid) {
                    await setDoc(doc(db, 'chats', chatID), {messages: []})
                    .then(() => {
                        console.log("created new convo");
                        dispatch({type: "change_user", payload: usr});
                    })
                }
                else {
                    dispatch({type: "change_user", payload: usr});
                }
            }
            catch (err) {}
        }
    }

    return (
        <>
            <div className="chats">
                <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/uicons-bold-straight/css/uicons-bold-straight.css'></link>
                {Object.entries(users)?.map((user) => (
                    <div className="user-chat" key={user[1].userID} onClick={(e) => {openChat(user[1], e)}}>
                        <div className="picture">
                            <img src={user[1].userType == 'agent' ? userIcon : anonIcon} alt="User" width={45} height={45}></img>
                        </div>
                        <div className="name">
                            <span className="username">
                                {user[1].userType == 'agent' ? user[1].firstName + ' ' + user[1].lastName : 'Anonymous User ' + '(' + user[1].userID + ')' }
                            </span>
                        </div>
                        {
                            user[1].userType == 'anonymous' && 
                            <button className="transfer-button" 
                            onClick={() => {props.setDialog(true); props.setTransferUser(user[1])}}>Transfer</button>
                        }
                    </div>
                ))}
            </div>
        </>
    )
}

export default Chats
