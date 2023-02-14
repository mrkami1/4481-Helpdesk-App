import React from 'react'

const Navbar = () => {
    return (
        
        <div className='navbar'>
            <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/uicons-solid-rounded/css/uicons-solid-rounded.css'></link>
            <link rel='stylesheet' href='https://cdn-uicons.flaticon.com/uicons-solid-straight/css/uicons-solid-straight.css'></link>
            <span className='logo'>Bolt<i class="fi fi-ss-bolt"></i></span>
            <span className='menu'><i class="fi fi-sr-menu-burger"></i></span>
            <span className='user'>Username goes here</span>
        </div>
    )
}

export default Navbar
