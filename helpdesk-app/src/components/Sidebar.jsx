import React, { useContext, useEffect, useState } from "react";
import Chats from './Chats'
import { onSnapshot, collection, query, where, doc, setDoc, getDocs, updateDoc, FieldValue } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from '../context/AuthContext'


const Sidebar = (props) => {

    const {currentUser} = useContext(AuthContext);
    const [dialog, setDialog] = useState(false);
    const [transferUser, setTransferUser] = useState();
    const [agents, setAgents] = useState([]);

    let sidebarTitle = 'Online Agents';
    let view = 0;

    currentUser.isAnonymous ? sidebarTitle = "Assigned Agent" : sidebarTitle = "Online Users";

    function changeView() {
        //0 = agents only
        //1 = anonymous users only
        //2 = all users
        view = (view + 1) % 3;

        switch(view) {
            case 0: console.log("agents only"); break;
            case 1: console.log("anon only"); break;
            case 2: console.log("all"); break;
        }
    }

    const getAgent = async (e) => {
        e.preventDefault();
        const firstName = e.target[0].value;
        const lastName = e.target[1].value;
        console.log(transferUser);
        setDialog(false);

        const q = query(collection(db, 'users'), 
                    where('userStatus', '==', 'online'), 
                    where('userType', '==', 'agent'), 
                    where('firstName', '==', firstName), 
                    where('lastName', '==', lastName));
        
        const agentArray = [];
        
        await getDocs(q)
        .then((data) => {
            data.forEach((doc) => {
                agentArray.push(doc.data());
                setAgents(agentArray);
                console.log( agents[0] );
            })      
        })
        .then(async () => {
            //assign agent to anonymous user
            await updateDoc(doc(db, 'users', transferUser.userID), {
                assignedAgent: agents[0].userID,
            })
        })
        .then(async () => {
            //assign user to agent
            await updateDoc(doc(db, 'users', agents[0].userID), {
                assignedUser: transferUser.userID,
            })
        })
        
    }
    
    return (
        <>
            <div className='sidebar'>
                <div className='title-container'>
                    <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css' />
                    <span>{sidebarTitle}{!currentUser.isAnonymous && <i className="fi fi-rr-settings-sliders" onClick={changeView}></i>}</span>
                </div>
                <div className='chats-container'>
                    <div className='chats-wrapper'>
                        <Chats setDialog={setDialog} setTransferUser={setTransferUser} />
                    </div>
                </div>
            </div>
            {dialog &&
            <div className="dialog-container">
                <div className="dialog-wrapper">
                    <h2>Transfer User </h2>
                    <h3>Agent Details</h3>
                    <form onSubmit={getAgent}>
                        <input type='text' placeholder='First Name' className='firstName' />
                        <input type='text' placeholder='Last Name' className='lastName' />
                        <input type='submit' className='transfer-button' value='Send Transfer' />
                        <button className='cancel-button' onClick={() => setDialog(false)}>Cancel</button> 
                    </form>
                </div>
            </div>
            }
        </>
    )
}

export default Sidebar
