import React from 'react'
import Chatbox from '../components/Chatbox'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const Dashboard = () => {
    return (
        <div>
            <div className='navbar-container'><Navbar></Navbar></div>
            <div className='main-container'>
                <div className='main-wrapper'>
                    <Sidebar></Sidebar>
                    <Chatbox></Chatbox>
                </div>
            </div>
        </div>
    )
}

export default Dashboard