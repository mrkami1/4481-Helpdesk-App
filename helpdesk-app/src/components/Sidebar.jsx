import React, { useContext, useEffect, useState } from "react";
import Chats from './Chats'
import { AuthContext } from '../context/AuthContext'


const Sidebar = () => {

    const {currentUser} = useContext(AuthContext);
    const [dialog, setDialog] = useState(false);

    let sidebarTitle = 'Online Agents';
    let view = 0;

    currentUser.isAnonymous ? sidebarTitle = "Online Agents" : sidebarTitle = "Online Users";

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

    const transfer = async (e) => {
        e.preventDefault();
        const firstName = e.target[0].value;
        const lastName = e.target[1].value;

        console.log(firstName);
        console.log(lastName);
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
                        <Chats setDialog={setDialog} />
                    </div>
                </div>
            </div>
            {dialog &&
            <div className="dialog-container">
                <div className="dialog-wrapper">
                    <h2>Transfer User </h2>
                    <h3>Agent Details</h3>
                    <form onSubmit={transfer}>
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
