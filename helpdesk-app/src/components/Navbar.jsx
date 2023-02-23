import React, { useContext } from 'react'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import { AuthContext } from '../context/AuthContext'
import { doc, updateDoc } from 'firebase/firestore';

const Navbar = () => {
    const {currentUser} = useContext(AuthContext);
    
    let username = "none";

    if (currentUser.isAnonymous) {
        username = 'Anonymous ' + '(' + currentUser.uid + ')';
    }
    else username = currentUser.displayName;

    async function logOut() {
        await updateDoc(doc(db, 'users', currentUser.uid), {
            userStatus: 'offline',
        }).then(() => {
            signOut(auth);
        });
    }

    return (
        <div className='navbar'>
            <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/uicons-solid-rounded/css/uicons-solid-rounded.css' />
            <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/uicons-solid-straight/css/uicons-solid-straight.css' />
            <span className='logo'>Help Desk<i className="fi fi-ss-bolt"></i></span>
            <button className='logout' onClick={logOut}>Log out</button>
            <span className='user'>{username}</span>
        </div>
    )
}

export default Navbar
