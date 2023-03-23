import React, { useContext, useState } from "react";
import Chats from './Chats'
import { AuthContext } from '../context/AuthContext'

const Sidebar = ({setDialog}) => {

    const {currentUser} = useContext(AuthContext);

    let sidebarTitle = 'Online Agents';
    let view = 0;

    currentUser.isAnonymous ? sidebarTitle = "Assigned Agent" : sidebarTitle = "Online Users";

    function changeView() {
        //0 = agents only
        //1 = anonymous users only
        //2 = all users
        view = (view + 1) % 3;
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
        </>
    )
}

export default Sidebar
