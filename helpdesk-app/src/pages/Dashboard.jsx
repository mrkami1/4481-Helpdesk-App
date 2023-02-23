import React, { useContext, useEffect, useState } from 'react'
import Chatbox from '../components/Chatbox'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { AuthContext } from '../context/AuthContext'

const Dashboard = () => {
    return (
        <div>
            <div className='navbar-container'><Navbar/></div>
            <div className='main-container'>
                <div className='main-wrapper'>
                    <Sidebar />
                    <Chatbox />
                </div>
            </div>
        </div>
    )
}

export default Dashboard