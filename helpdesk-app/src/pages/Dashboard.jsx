import React, { useContext, useEffect, useState } from 'react'
import Chatbox from '../components/Chatbox'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import TransferDialog from '../components/TransferDialog'
import { AuthContext } from '../context/AuthContext'

const Dashboard = () => {

    const {currentUser} = useContext(AuthContext);

    const [showDialog, setShowDialog] = useState(false)

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