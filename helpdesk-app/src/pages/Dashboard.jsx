import React, { useState } from 'react'
import Chatbox from '../components/Chatbox'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Transfer from '../components/Transfer'

const Dashboard = () => {

    const [dialog, setDialog] = useState({show: false, data: null});

    return (
        <div>
            <div className='navbar-container'>
                <Navbar/>
            </div>
            <div className='main-container'>
                <div className='main-wrapper'>
                    <Sidebar setDialog={setDialog} />
                    <Chatbox />
                    <Transfer dialog={dialog} setDialog={setDialog} />
                </div>
            </div>
        </div>
    )
}

export default Dashboard